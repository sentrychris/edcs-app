"use client";

import { useEffect, useRef } from "react";

// Saturn-like ring system visualisation: gas giant with multiple ring bands,
// shepherd moons at gap edges, and larger moons orbiting outside the rings.

interface RingBand {
  innerR:      number;     // fraction of outer ring radius
  outerR:      number;
  density:     number;     // 0..1 — particle density / opacity
  color:       string;
  particles:   number;     // number of orbiting particles to render
}

interface ShepherdMoon {
  ringR:       number;     // orbital radius (fraction of outer ring)
  speed:       number;     // animation speed
  angleOffset: number;
  size:        number;
  color:       string;
  label:       string;
}

interface OuterMoon {
  orbitR:      number;     // fraction of outer ring radius (larger than 1)
  speed:       number;
  angleOffset: number;
  size:        number;
  color:       string;
  label:       string;
}

const RINGS: RingBand[] = [
  // C Ring (innermost, sparse)
  { innerR: 0.40, outerR: 0.55, density: 0.35, color: "#A09078", particles: 200 },
  // B Ring (densest)
  { innerR: 0.55, outerR: 0.78, density: 0.95, color: "#E0D0A8", particles: 600 },
  // Cassini Division — gap (no band)
  // A Ring
  { innerR: 0.83, outerR: 1.00, density: 0.65, color: "#D8C898", particles: 400 },
];

const SHEPHERDS: ShepherdMoon[] = [
  { ringR: 0.78, speed: 0.012, angleOffset: 0.5,           size: 1.5, color: "#C8C8D0", label: "shepherd"        },
  { ringR: 0.83, speed: 0.011, angleOffset: 1.7,           size: 1.5, color: "#C8C8D0", label: "shepherd"        },
  { ringR: 0.95, speed: 0.010, angleOffset: Math.PI + 0.2, size: 1.7, color: "#D0D0D8", label: "ring-edge moon"  },
];

const OUTER_MOONS: OuterMoon[] = [
  { orbitR: 1.30, speed: 0.0050, angleOffset: 0.0,            size: 4, color: "#A0A8B0", label: "Mimas"   },
  { orbitR: 1.55, speed: 0.0035, angleOffset: 1.2,            size: 5, color: "#C8B898", label: "Tethys"  },
  { orbitR: 1.80, speed: 0.0028, angleOffset: 2.7,            size: 6, color: "#FFD080", label: "Titan"   },
];

export default function RingsMoonsSimulation() {
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

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 1;
      const t = timeRef.current;

      const cx = w / 2;
      const cy = h / 2;
      const planetR = Math.min(w, h) * 0.10;
      const ringOuterR = Math.min(w, h) * 0.42;
      const tilt    = 0.32;

      // ── Background subtle gradient ───────────────────────────────────────
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6);
      bg.addColorStop(0,   "rgba(255, 200, 100, 0.04)");
      bg.addColorStop(1,   "transparent");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // ── Far-side ring arc (drawn behind planet) ──────────────────────────
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, tilt);

      // Particles in the far-side half
      RINGS.forEach((ring) => {
        const inner = ring.innerR * ringOuterR;
        const outer = ring.outerR * ringOuterR;
        // Far-side is the upper half (negative y after squash)
        for (let i = 0; i < ring.particles / 2; i++) {
          const angularVel = 0.005 / Math.sqrt(ring.innerR + (ring.outerR - ring.innerR) * 0.5);
          const baseAngle  = (i / (ring.particles / 2)) * Math.PI;  // 0..π (top half in canvas)
          const angle      = baseAngle + Math.PI + t * angularVel;
          const localOff   = ((i * 17) % 100) / 100;
          const r          = inner + (outer - inner) * (0.05 + 0.9 * localOff);
          const px         = Math.cos(angle) * r;
          const py         = Math.sin(angle) * r;
          // Only draw far-side (y < 0 in scaled space)
          if (py > 0) continue;
          ctx.beginPath();
          ctx.arc(px, py, 0.6 + (ring.density * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ring.color === "#A09078" ? "200, 180, 140" : ring.color === "#E0D0A8" ? "240, 220, 180" : "230, 210, 160"}, ${0.40 * ring.density})`;
          ctx.fill();
        }
      });

      ctx.restore();

      // ── Planet ────────────────────────────────────────────────────────────
      // Atmosphere halo
      const halo = ctx.createRadialGradient(cx, cy, planetR * 0.95, cx, cy, planetR * 1.18);
      halo.addColorStop(0, "rgba(255, 220, 160, 0.40)");
      halo.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, planetR * 1.18, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // Body
      const body = ctx.createRadialGradient(cx - planetR * 0.4, cy - planetR * 0.4, 0, cx, cy, planetR * 1.1);
      body.addColorStop(0,    "#FFE8B0");
      body.addColorStop(0.45, "#D8B870");
      body.addColorStop(1,    "#8C6840");
      ctx.beginPath();
      ctx.arc(cx, cy, planetR, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();

      // Banded surface
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, planetR, 0, Math.PI * 2);
      ctx.clip();
      const phase = t * 0.0010;
      const numBands = 7;
      for (let i = 0; i < numBands; i++) {
        const yPos = cy - planetR + (i + 0.5) * (2 * planetR / numBands);
        const half = planetR / numBands;
        const flow = 0.5 + 0.5 * Math.sin(phase * 1.3 + i * 0.7);
        const color = i % 2 === 0 ? "rgba(120, 90, 50, 0.30)" : "rgba(220, 200, 150, 0.25)";
        ctx.fillStyle = color;
        void flow;
        ctx.fillRect(cx - planetR, yPos - half, planetR * 2, half * 2);
      }
      ctx.restore();

      // Limb darkening
      const limb = ctx.createRadialGradient(cx - planetR * 0.4, cy - planetR * 0.4, planetR * 0.5, cx, cy, planetR);
      limb.addColorStop(0,   "rgba(0,0,0,0)");
      limb.addColorStop(0.7, "rgba(0,0,0,0)");
      limb.addColorStop(1,   "rgba(0,0,0,0.45)");
      ctx.beginPath();
      ctx.arc(cx, cy, planetR, 0, Math.PI * 2);
      ctx.fillStyle = limb;
      ctx.fill();

      // ── Near-side ring arc (drawn in front of planet) ────────────────────
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, tilt);

      RINGS.forEach((ring) => {
        const inner = ring.innerR * ringOuterR;
        const outer = ring.outerR * ringOuterR;
        // Near-side: lower half (positive y in scaled space)
        for (let i = 0; i < ring.particles / 2; i++) {
          const angularVel = 0.005 / Math.sqrt(ring.innerR + (ring.outerR - ring.innerR) * 0.5);
          const baseAngle  = (i / (ring.particles / 2)) * Math.PI;
          const angle      = baseAngle + t * angularVel;
          const localOff   = ((i * 17) % 100) / 100;
          const r          = inner + (outer - inner) * (0.05 + 0.9 * localOff);
          const px         = Math.cos(angle) * r;
          const py         = Math.sin(angle) * r;
          if (py < 0) continue;
          ctx.beginPath();
          ctx.arc(px, py, 0.6 + (ring.density * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ring.color === "#A09078" ? "200, 180, 140" : ring.color === "#E0D0A8" ? "240, 220, 180" : "230, 210, 160"}, ${0.40 * ring.density})`;
          ctx.fill();
        }
      });

      ctx.restore();

      // ── Shepherd moons (at ring edges) ────────────────────────────────────
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, tilt);
      SHEPHERDS.forEach((m) => {
        const angle = m.angleOffset + t * m.speed;
        const r     = m.ringR * ringOuterR;
        const px    = Math.cos(angle) * r;
        const py    = Math.sin(angle) * r;
        ctx.beginPath();
        ctx.arc(px, py, m.size, 0, Math.PI * 2);
        ctx.fillStyle   = m.color;
        ctx.shadowColor = m.color;
        ctx.shadowBlur  = 4;
        ctx.fill();
        ctx.shadowBlur  = 0;
      });
      ctx.restore();

      // ── Outer moons (orbit visible, particles drawn properly) ─────────────
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, tilt);

      // Orbit guides
      OUTER_MOONS.forEach((m) => {
        ctx.beginPath();
        ctx.arc(0, 0, m.orbitR * ringOuterR, 0, Math.PI * 2);
        ctx.strokeStyle = `${m.color}30`;
        ctx.setLineDash([2, 6]);
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Moons themselves (drawn with halo & body — but in scaled space the
      // circle becomes ellipse; we want round moons. Restore for moons.)
      ctx.restore();

      OUTER_MOONS.forEach((m) => {
        const angle = m.angleOffset + t * m.speed;
        const r     = m.orbitR * ringOuterR;
        const px    = cx + Math.cos(angle) * r;
        const py    = cy + Math.sin(angle) * r * tilt;

        // Moon halo
        const halo = ctx.createRadialGradient(px, py, m.size * 0.7, px, py, m.size * 1.8);
        halo.addColorStop(0, `${m.color}80`);
        halo.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(px, py, m.size * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        const body = ctx.createRadialGradient(px - m.size * 0.3, py - m.size * 0.3, 0, px, py, m.size);
        body.addColorStop(0, "#FFFFFF");
        body.addColorStop(0.4, m.color);
        body.addColorStop(1, "#202830");
        ctx.beginPath();
        ctx.arc(px, py, m.size, 0, Math.PI * 2);
        ctx.fillStyle = body;
        ctx.fill();

        // Label
        ctx.font      = "8px 'Jura', monospace";
        ctx.fillStyle = `${m.color}AA`;
        ctx.textAlign = "left";
        ctx.fillText(m.label, px + m.size + 4, py + 3);
      });

      // ── Ring zone labels ──────────────────────────────────────────────────
      const labelY = cy + ringOuterR * tilt + 14;
      const aLabelX = cx + ringOuterR * 0.92;
      const cassiniX = cx + ringOuterR * 0.80;
      const bLabelX = cx + ringOuterR * 0.66;
      const cLabelX = cx + ringOuterR * 0.46;

      ctx.font      = "7px 'Jura', monospace";
      ctx.textAlign = "center";

      ctx.fillStyle = "rgba(220, 200, 160, 0.65)";
      ctx.fillText("A", aLabelX, labelY);
      ctx.fillStyle = "rgba(180, 180, 180, 0.55)";
      ctx.fillText("CASSINI", cassiniX, labelY);
      ctx.fillStyle = "rgba(240, 220, 180, 0.65)";
      ctx.fillText("B", bLabelX, labelY);
      ctx.fillStyle = "rgba(200, 180, 140, 0.55)";
      ctx.fillText("C", cLabelX, labelY);

      // Title
      if (w > 460) {
        ctx.font      = "8px 'Jura', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(120, 160, 200, 0.40)";
        ctx.fillText("⟳ RING SYSTEM — A · CASSINI · B · C  +  SHEPHERD MOONS", 10, 16);
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
