"use client";

import { useEffect, useRef } from "react";

const REMNANTS = [
  {
    name:    "WHITE DWARF",
    label:   "≤ 8 M☉ progenitor",
    color:   "#A0BFFF",
    coreSize: 14,
  },
  {
    name:    "NEUTRON STAR",
    label:   "8 – 25 M☉ progenitor",
    color:   "#E8F0FF",
    coreSize: 7,
  },
  {
    name:    "BLACK HOLE",
    label:   "≥ 25 M☉ progenitor",
    color:   "#FFB060",
    coreSize: 22,
  },
];

export default function StellarRemnantsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const timeRef   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) {
        return;
      }
      canvas.width  = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    /* ── White dwarf — bright core with a subtle thermal halo ───────────── */
    const drawWhiteDwarf = (cx: number, cy: number, r: number, t: number) => {
      const pulse = 1 + Math.sin(t * 0.04) * 0.08;
      const haloR = r * 4 * pulse;

      const halo = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, haloR);
      halo.addColorStop(0,   "rgba(190,215,255,0.55)");
      halo.addColorStop(0.4, "rgba(150,180,240,0.18)");
      halo.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      const core = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
      core.addColorStop(0,   "#FFFFFF");
      core.addColorStop(0.4, "#E8F0FF");
      core.addColorStop(1,   "#A0BFFF");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.shadowColor = "rgba(180,210,255,0.8)";
      ctx.shadowBlur  = r * 3;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    /* ── Neutron star — tight core with two sweeping pulsar beams ────────── */
    const drawNeutronStar = (cx: number, cy: number, r: number, t: number) => {
      const angle    = t * 0.05;
      const beamLen  = r * 8;
      const baseHalf = r * 0.55;
      const tipHalf  = r * 1.4;

      for (let i = 0; i < 2; i++) {
        const a = angle + i * Math.PI;
        const dx = Math.cos(a);
        const dy = Math.sin(a);
        const px = -dy;
        const py = dx;

        const baseX = cx + dx * r * 0.3;
        const baseY = cy + dy * r * 0.3;
        const tipX  = cx + dx * beamLen;
        const tipY  = cy + dy * beamLen;

        ctx.beginPath();
        ctx.moveTo(baseX + px * baseHalf, baseY + py * baseHalf);
        ctx.lineTo(tipX  + px * tipHalf,  tipY  + py * tipHalf);
        ctx.lineTo(tipX  - px * tipHalf,  tipY  - py * tipHalf);
        ctx.lineTo(baseX - px * baseHalf, baseY - py * baseHalf);
        ctx.closePath();

        const grad = ctx.createLinearGradient(baseX, baseY, tipX, tipY);
        grad.addColorStop(0,   "rgba(190,225,255,0.7)");
        grad.addColorStop(0.5, "rgba(140,200,255,0.22)");
        grad.addColorStop(1,   "transparent");
        ctx.fillStyle = grad;
        ctx.fill();
      }

      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 5);
      halo.addColorStop(0,   "rgba(255,255,255,0.7)");
      halo.addColorStop(0.5, "rgba(180,220,255,0.18)");
      halo.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, r * 5, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "rgba(255,255,255,1)";
      ctx.shadowBlur  = r * 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    /* ── Black hole — tilted accretion disk + event horizon ──────────────── */
    const drawBlackHole = (cx: number, cy: number, r: number, t: number) => {
      const diskOuter = r * 2.6;
      const diskInner = r * 1.15;
      const tilt      = 0.32;
      const angle     = t * 0.015;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, tilt);

      const ringGrad = ctx.createRadialGradient(0, 0, diskInner, 0, 0, diskOuter);
      ringGrad.addColorStop(0,   "rgba(255,210,120,0.85)");
      ringGrad.addColorStop(0.5, "rgba(255,140,60,0.55)");
      ringGrad.addColorStop(1,   "rgba(180,80,40,0)");
      ctx.beginPath();
      ctx.arc(0, 0, diskOuter, 0, Math.PI * 2);
      ctx.fillStyle = ringGrad;
      ctx.fill();

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(0, 0, diskInner, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      // Bright orbiting hot spots in the disk
      for (let i = 0; i < 18; i++) {
        const phase = (i / 18) * Math.PI * 2 + angle * (1 + (i % 3) * 0.15);
        const offset = ((i * 17) % 10) / 10;
        const ringR  = diskInner + (diskOuter - diskInner) * (0.15 + 0.7 * offset);
        const px     = Math.cos(phase) * ringR;
        const py     = Math.sin(phase) * ringR;
        ctx.beginPath();
        ctx.arc(px, py, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,235,190,0.95)";
        ctx.fill();
      }

      ctx.restore();

      // Event horizon — opaque core
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "#020308";
      ctx.fill();

      // Photon sphere — thin glowing ring around event horizon
      const photon = ctx.createRadialGradient(cx, cy, r * 0.95, cx, cy, r * 1.28);
      photon.addColorStop(0,   "transparent");
      photon.addColorStop(0.4, "rgba(255,200,120,0.4)");
      photon.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = photon;
      ctx.fill();
    };

    const drawByType = (i: number, cx: number, cy: number, scale: number, t: number) => {
      const r = REMNANTS[i].coreSize * scale;
      switch (i) {
        case 0: drawWhiteDwarf(cx, cy, r, t); break;
        case 1: drawNeutronStar(cx, cy, r, t); break;
        case 2: drawBlackHole(cx, cy, r, t); break;
      }
    };

    /* ── Main loop ───────────────────────────────────────────────────────── */
    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 1;
      const t = timeRef.current;

      // Below ~480 the horizontal trio crowds into each other; switch to a
      // stacked layout that keeps each remnant readable on phones.
      const compact = w < 480;
      const n       = REMNANTS.length;
      const maxCore = Math.max(...REMNANTS.map((rem) => rem.coreSize));

      // Mass-progression backdrop: cool blue (low mass) → warm orange (high mass)
      const bgGrad = compact
        ? ctx.createLinearGradient(0, 0, 0, h)
        : ctx.createLinearGradient(0, 0, w, 0);
      bgGrad.addColorStop(0,   "rgba(120,160,255,0.05)");
      bgGrad.addColorStop(0.5, "rgba(255,255,240,0.02)");
      bgGrad.addColorStop(1,   "rgba(255,140,80,0.06)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      if (compact) {
        const cellW       = w;
        const cellH       = h / n;
        const TOP_BAND    = 22;
        const BOTTOM_BAND = 28;
        const innerH      = Math.max(0, cellH - TOP_BAND - BOTTOM_BAND);
        // The largest visible footprint per remnant is roughly coreSize * 5.5
        // (neutron star halo + beams). Scale to fit that vertically and stay
        // within ~one third of the cell width on the horizontal axis.
        const scale = Math.min((innerH / 2) / (maxCore * 5.5), (cellW * 0.32) / (maxCore * 3));

        REMNANTS.forEach((rem, i) => {
          const cellTop = i * cellH;
          const cx = cellW / 2;
          const cy = cellTop + TOP_BAND + innerH / 2;

          drawByType(i, cx, cy, scale, t);

          ctx.font      = "bold 12px 'Jura', monospace";
          ctx.fillStyle = rem.color;
          ctx.textAlign = "center";
          ctx.fillText(rem.name, cx, cellTop + 14);

          ctx.font      = "9px 'Jura', monospace";
          ctx.fillStyle = "rgba(180,180,180,0.55)";
          ctx.fillText(rem.label, cx, cellTop + cellH - 10);
        });

        // Vertical mass-progression labels
        ctx.font      = "9px 'Jura', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(120,160,220,0.4)";
        ctx.fillText("LOW MASS", 6, 12);
        ctx.fillStyle = "rgba(220,140,80,0.4)";
        ctx.fillText("HIGH MASS", 6, h - 4);
      } else {
        const cellW       = w / n;
        const TOP_BAND    = 28;
        const BOTTOM_BAND = 50;
        const innerH      = Math.max(0, h - TOP_BAND - BOTTOM_BAND);
        const scale = Math.min((innerH / 2) / (maxCore * 5.5), (cellW * 0.32) / (maxCore * 3));

        // Mass-progression axis (top)
        ctx.font      = "9px 'Jura', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(120,160,220,0.45)";
        ctx.fillText("LOW MASS", 8, 14);
        ctx.textAlign = "right";
        ctx.fillStyle = "rgba(220,140,80,0.45)";
        ctx.fillText("HIGH MASS", w - 8, 14);

        ctx.beginPath();
        ctx.moveTo(70, 10);
        ctx.lineTo(w - 80, 10);
        const axisGrad = ctx.createLinearGradient(70, 0, w - 80, 0);
        axisGrad.addColorStop(0, "rgba(120,160,220,0.3)");
        axisGrad.addColorStop(1, "rgba(220,140,80,0.3)");
        ctx.strokeStyle = axisGrad;
        ctx.lineWidth   = 1;
        ctx.stroke();

        REMNANTS.forEach((rem, i) => {
          const cx = cellW * (i + 0.5);
          const cy = TOP_BAND + innerH / 2;

          drawByType(i, cx, cy, scale, t);

          ctx.font      = "bold 13px 'Jura', monospace";
          ctx.fillStyle = rem.color;
          ctx.textAlign = "center";
          ctx.fillText(rem.name, cx, TOP_BAND + innerH + 22);

          ctx.font      = "9px 'Jura', monospace";
          ctx.fillStyle = "rgba(180,180,180,0.55)";
          ctx.fillText(rem.label, cx, TOP_BAND + innerH + 40);
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
    <canvas ref={canvasRef} className="block h-full w-full" style={{ background: "transparent" }} />
  );
}
