"use client";

import { useEffect, useRef } from "react";

interface Shell {
  name:       string;
  burning:    string;
  temp:       string;
  inColor:    string;  // hot inner-edge colour
  outColor:   string;  // cooler outer-edge colour
  outer:      number;  // outer radius fraction
  inner:      number;  // inner radius fraction
  labelAngle: number;  // radians, math convention (0 = right, π/2 = down)
}

const SHELLS: Shell[] = [
  { name: "H ENVELOPE", burning: "H → He",     temp: "~6 MK",   inColor: "#B0C8FF", outColor: "#1F3470", outer: 1.00, inner: 0.82, labelAngle: -Math.PI / 2          },
  { name: "He SHELL",   burning: "He → C, O",  temp: "~200 MK", inColor: "#A0F0DC", outColor: "#205C58", outer: 0.82, inner: 0.65, labelAngle: -Math.PI / 4          },
  { name: "C SHELL",    burning: "C → Ne, Mg", temp: "~900 MK", inColor: "#FFD080", outColor: "#8C3210", outer: 0.65, inner: 0.50, labelAngle: 0                     },
  { name: "Ne SHELL",   burning: "Ne → O, Mg", temp: "~1.7 GK", inColor: "#FFA060", outColor: "#80200E", outer: 0.50, inner: 0.38, labelAngle: Math.PI / 4           },
  { name: "O SHELL",    burning: "O → Si, S",  temp: "~2.3 GK", inColor: "#FF7050", outColor: "#701414", outer: 0.38, inner: 0.27, labelAngle: Math.PI / 2           },
  { name: "Si SHELL",   burning: "Si → Fe",    temp: "~3.5 GK", inColor: "#FF6080", outColor: "#600C28", outer: 0.27, inner: 0.16, labelAngle: Math.PI - Math.PI / 4 },
  { name: "Fe CORE",    burning: "INERT",      temp: "~5 GK",   inColor: "#FFFFE8", outColor: "#E89030", outer: 0.16, inner: 0.00, labelAngle: Math.PI               },
];

interface Particle {
  shellIdx: number;
  rFrac:    number;  // 0..1 within shell annulus
  angle:    number;
  speed:    number;
  size:     number;
}

export default function StellarNucleosynthesisSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const timeRef   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width  = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    // ── Convection particles, generated once per mount ──────────────────────
    const particles: Particle[] = [];
    SHELLS.forEach((_, i) => {
      if (i === SHELLS.length - 1) return; // no orbital particles in Fe core
      const count = 7 + Math.floor((SHELLS.length - i) * 0.6);
      for (let j = 0; j < count; j++) {
        particles.push({
          shellIdx: i,
          rFrac:    Math.random(),
          angle:    Math.random() * Math.PI * 2,
          speed:    ((i + 1) * 0.00035 + (Math.random() - 0.5) * 0.0004) * (Math.random() > 0.5 ? 1 : -1),
          size:     0.7 + Math.random() * 1.2,
        });
      }
    });

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 1;
      const t = timeRef.current;

      const compact = w < 560;

      // ── Layout ────────────────────────────────────────────────────────────
      const labelRoom = compact ? 16 : 110;
      const cx = w / 2;
      const cy = compact ? Math.min(h, w) / 2 + 4 : h / 2;
      const R  = Math.max(40, Math.min(w, h) / 2 - labelRoom);

      // ── Faint outer glow ──────────────────────────────────────────────────
      const bg = ctx.createRadialGradient(cx, cy, R * 0.95, cx, cy, R * 1.6);
      bg.addColorStop(0,   "rgba(180, 220, 255, 0.10)");
      bg.addColorStop(0.5, "rgba(80, 140, 220, 0.04)");
      bg.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = bg;
      ctx.fill();

      // ── Shells (drawn outer→inner; each disk covers the inner part of the
      //          previous, leaving a clean annular band visible) ─────────────
      for (let i = 0; i < SHELLS.length; i++) {
        const shell = SHELLS[i];
        const Rout  = shell.outer * R;
        const Rin   = shell.inner * R;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Rout);
        if (shell.inner === 0) {
          // Iron core: bright centre with pulsing intensity (electron-degeneracy hint)
          const pulse = 0.92 + Math.sin(t * 0.04) * 0.08;
          grad.addColorStop(0,    shell.inColor);
          grad.addColorStop(0.55, shell.inColor);
          grad.addColorStop(1,    shell.outColor);
          ctx.globalAlpha = pulse;
        } else {
          const innerFrac = Rin / Rout;
          grad.addColorStop(0,                                shell.outColor);
          grad.addColorStop(Math.max(0, innerFrac - 0.04),    shell.inColor);
          grad.addColorStop(Math.min(1, innerFrac + 0.02),    shell.inColor);
          grad.addColorStop(1,                                shell.outColor);
        }

        ctx.beginPath();
        ctx.arc(cx, cy, Rout, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Subtle separator ring at the outer boundary
        ctx.beginPath();
        ctx.arc(cx, cy, Rout, 0, Math.PI * 2);
        ctx.strokeStyle = `${shell.outColor}88`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      }

      // ── Convection particles ──────────────────────────────────────────────
      particles.forEach(p => {
        p.angle += p.speed;
        const shell = SHELLS[p.shellIdx];
        const r = (shell.inner + (shell.outer - shell.inner) * p.rFrac) * R;
        const px = cx + Math.cos(p.angle) * r;
        const py = cy + Math.sin(p.angle) * r;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle   = `${shell.inColor}AA`;
        ctx.shadowColor = shell.inColor;
        ctx.shadowBlur  = 4;
        ctx.fill();
        ctx.shadowBlur  = 0;
      });

      // ── Iron-core shimmer (4 rotating hot-spots) ──────────────────────────
      {
        const core    = SHELLS[SHELLS.length - 1];
        const coreR   = core.outer * R;
        const phase   = t * 0.012;
        for (let k = 0; k < 4; k++) {
          const a   = phase + (k / 4) * Math.PI * 2;
          const rr  = coreR * 0.55;
          const px  = cx + Math.cos(a) * rr;
          const py  = cy + Math.sin(a) * rr;
          const sz  = 1.4 + Math.sin(t * 0.05 + k) * 0.4;
          ctx.beginPath();
          ctx.arc(px, py, sz, 0, Math.PI * 2);
          ctx.fillStyle   = "rgba(255,255,255,0.75)";
          ctx.shadowColor = "#FFFFE0";
          ctx.shadowBlur  = 6;
          ctx.fill();
          ctx.shadowBlur  = 0;
        }
      }

      // ── Labels with leader lines ──────────────────────────────────────────
      if (!compact) {
        SHELLS.forEach(shell => {
          const a   = shell.labelAngle;
          const cosA = Math.cos(a);
          const sinA = Math.sin(a);

          const midR   = ((shell.inner + shell.outer) / 2) * R;
          const elbowR = R * 1.05;
          const labelR = R + 22;

          ctx.beginPath();
          ctx.moveTo(cx + cosA * midR,   cy + sinA * midR);
          ctx.lineTo(cx + cosA * elbowR, cy + sinA * elbowR);
          ctx.lineTo(cx + cosA * labelR, cy + sinA * labelR);
          ctx.strokeStyle = `${shell.inColor}55`;
          ctx.lineWidth   = 1;
          ctx.stroke();

          // Leader endpoint dot
          ctx.beginPath();
          ctx.arc(cx + cosA * midR, cy + sinA * midR, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = shell.inColor;
          ctx.fill();

          // Text alignment by angle
          let align: CanvasTextAlign = "center";
          if (cosA > 0.25) align = "left";
          else if (cosA < -0.25) align = "right";

          const padX = align === "left" ? 4 : align === "right" ? -4 : 0;
          const lx   = cx + cosA * labelR + padX;
          const ly   = cy + sinA * labelR;

          ctx.textAlign = align;

          ctx.font      = "bold 10px 'Jura', monospace";
          ctx.fillStyle = shell.inColor;
          ctx.fillText(shell.name, lx, ly - 4);

          ctx.font      = "9px 'Jura', monospace";
          ctx.fillStyle = "rgba(220,220,220,0.65)";
          ctx.fillText(shell.burning, lx, ly + 7);

          ctx.font      = "8px 'Jura', monospace";
          ctx.fillStyle = "rgba(170,170,170,0.50)";
          ctx.fillText(shell.temp, lx, ly + 18);
        });
      } else {
        // ── Compact: 2-column legend below the diagram ─────────────────────
        const startY = cy + R + 22;
        const colW   = w / 2;
        SHELLS.forEach((shell, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const lx  = colW * col + 12;
          const ly  = startY + row * 18;
          if (ly > h - 4) return;

          ctx.beginPath();
          ctx.arc(lx, ly - 3, 3, 0, Math.PI * 2);
          ctx.fillStyle = shell.inColor;
          ctx.fill();

          ctx.font      = "bold 8px 'Jura', monospace";
          ctx.fillStyle = shell.inColor;
          ctx.textAlign = "left";
          ctx.fillText(shell.name, lx + 7, ly);

          ctx.font      = "8px 'Jura', monospace";
          ctx.fillStyle = "rgba(180,180,180,0.55)";
          ctx.fillText(shell.burning, lx + 7, ly + 9);
        });
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      style={{ background: "transparent" }}
    />
  );
}
