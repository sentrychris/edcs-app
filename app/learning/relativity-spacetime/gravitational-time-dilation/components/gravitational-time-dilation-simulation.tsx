"use client";

import { useEffect, useRef } from "react";

// ── Schwarzschild geometry ──────────────────────────────────────────────────
// dτ/dt = √(1 − rₛ / r). Tick rate of a stationary clock at radius r,
// as seen by a far-away observer.
const tickRate = (rOverRs: number) => Math.sqrt(1 - 1 / rOverRs);

// Clocks placed at fixed Schwarzschild radii (in units of rₛ)
const CLOCK_DEFS = [
  { r: 1.5,  label: "1.5 rₛ", note: "PHOTON SPHERE" },
  { r: 2.5,  label: "2.5 rₛ", note: "ISCO REGION"   },
  { r: 5,    label: "5 rₛ",   note: "CLOSE ORBIT"   },
  { r: 12,   label: "12 rₛ",  note: "WIDE ORBIT"    },
  { r: 1e6,  label: "≈ ∞",    note: "LAB / FAR AWAY" },
] as const;

// Hand sweep speed: lab clock completes one revolution per FRAMES_PER_REV frames
const FRAMES_PER_REV = 240;
const TWO_PI         = Math.PI * 2;

// Visual radii
const BH_R           = 26;     // Event horizon disc, pixels
const PHOTON_RING_R  = 39;     // 1.5 × BH_R = photon sphere
const CLOCK_R        = 16;

export default function GravitationalTimeDilationSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);

  // Accumulated proper time for each clock, in "lab-frame frames"
  const tau = useRef<number[]>(CLOCK_DEFS.map(() => 0));

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

    // ── Drawing helpers ───────────────────────────────────────────────────────

    const drawBlackHole = (cx: number, cy: number) => {
      // Outer accretion glow
      const outer = ctx.createRadialGradient(cx, cy, BH_R, cx, cy, PHOTON_RING_R + 18);
      outer.addColorStop(0, "rgba(255,160,80,0.30)");
      outer.addColorStop(0.4, "rgba(255,120,60,0.18)");
      outer.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, PHOTON_RING_R + 18, 0, TWO_PI);
      ctx.fillStyle = outer;
      ctx.fill();

      // Photon ring
      ctx.beginPath();
      ctx.arc(cx, cy, PHOTON_RING_R, 0, TWO_PI);
      ctx.strokeStyle = "rgba(255,200,120,0.55)";
      ctx.lineWidth   = 1.4;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, PHOTON_RING_R, 0, TWO_PI);
      ctx.strokeStyle = "rgba(255,180,90,0.18)";
      ctx.lineWidth   = 4;
      ctx.stroke();

      // Event horizon — pure black disc with rim glow
      const rim = ctx.createRadialGradient(cx, cy, BH_R - 4, cx, cy, BH_R);
      rim.addColorStop(0, "#000");
      rim.addColorStop(1, "rgba(20,5,0,1)");
      ctx.beginPath();
      ctx.arc(cx, cy, BH_R, 0, TWO_PI);
      ctx.fillStyle = rim;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,180,90,0.40)";
      ctx.lineWidth   = 1;
      ctx.stroke();
    };

    const drawRadialAxis = (sx: number, sy: number, ex: number, ey: number) => {
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = "rgba(100,140,200,0.10)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([3, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrow head perpendicular to direction
      const dxA = ex - sx;
      const dyA = ey - sy;
      const len = Math.max(1, Math.hypot(dxA, dyA));
      const ux  = dxA / len;
      const uy  = dyA / len;
      const px  = -uy;
      const py  =  ux;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - 8 * ux + 4 * px, ey - 8 * uy + 4 * py);
      ctx.lineTo(ex - 8 * ux - 4 * px, ey - 8 * uy - 4 * py);
      ctx.closePath();
      ctx.fillStyle = "rgba(100,140,200,0.30)";
      ctx.fill();
    };

    const drawClock = (cx: number, cy: number, hand: number) => {
      // Body
      ctx.beginPath();
      ctx.arc(cx, cy, CLOCK_R, 0, TWO_PI);
      ctx.fillStyle   = "rgba(15,25,45,0.85)";
      ctx.fill();
      ctx.strokeStyle = "rgba(140,180,220,0.60)";
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Tick marks (12)
      for (let i = 0; i < 12; i++) {
        const a   = (i / 12) * TWO_PI - Math.PI / 2;
        const r1  = CLOCK_R - 3;
        const r2  = CLOCK_R - 1;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
        ctx.strokeStyle = "rgba(140,180,220,0.40)";
        ctx.stroke();
      }

      // Sweeping hand
      const hx = cx + Math.cos(hand - Math.PI / 2) * (CLOCK_R - 4);
      const hy = cy + Math.sin(hand - Math.PI / 2) * (CLOCK_R - 4);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(hx, hy);
      ctx.strokeStyle = "rgba(255,210,140,0.95)";
      ctx.lineWidth   = 1.4;
      ctx.stroke();

      // Centre cap
      ctx.beginPath();
      ctx.arc(cx, cy, 1.6, 0, TWO_PI);
      ctx.fillStyle = "rgba(255,210,140,0.95)";
      ctx.fill();
    };

    const drawClockLabels = (
      cx: number, cy: number, label: string, note: string,
      factor: number, ticks: number, stacked: boolean,
    ) => {
      const tStr = (ticks / FRAMES_PER_REV).toFixed(2);

      if (!stacked) {
        ctx.textAlign = "center";

        ctx.font      = "10px 'Jura', monospace";
        ctx.fillStyle = "rgba(180,210,240,0.80)";
        ctx.fillText(label, cx, cy - CLOCK_R - 18);

        ctx.font      = "8px 'Jura', monospace";
        ctx.fillStyle = "rgba(140,140,140,0.50)";
        ctx.fillText(note, cx, cy - CLOCK_R - 6);

        ctx.font      = "9px 'Jura', monospace";
        ctx.fillStyle = "rgba(220,170,90,0.70)";
        ctx.fillText(`dτ/dt = ${factor.toFixed(3)}`, cx, cy + CLOCK_R + 14);

        ctx.fillStyle = "rgba(180,210,240,0.65)";
        ctx.fillText(`τ = ${tStr}`, cx, cy + CLOCK_R + 26);
        return;
      }

      // Stacked layout — labels flank the clock
      const lx = cx - CLOCK_R - 8;
      const rx = cx + CLOCK_R + 8;

      ctx.font      = "10px 'Jura', monospace";
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(180,210,240,0.80)";
      ctx.fillText(label, lx, cy - 1);

      ctx.font      = "8px 'Jura', monospace";
      ctx.fillStyle = "rgba(140,140,140,0.50)";
      ctx.fillText(note, lx, cy + 11);

      ctx.font      = "9px 'Jura', monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(220,170,90,0.70)";
      ctx.fillText(`dτ/dt = ${factor.toFixed(3)}`, rx, cy - 1);

      ctx.fillStyle = "rgba(180,210,240,0.65)";
      ctx.fillText(`τ = ${tStr}`, rx, cy + 11);
    };

    // ── Main loop ─────────────────────────────────────────────────────────────

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      const isStacked = w < 520;

      ctx.clearRect(0, 0, w, h);

      // Layout: BH → clocks fan horizontally on wide; vertically on stacked
      let bhX: number, bhY: number;
      let axisStart: { x: number; y: number };
      let axisEnd:   { x: number; y: number };
      let axisLabel: { x: number; y: number; align: CanvasTextAlign };
      let bhLabelPos: { x: number; y: number; align: CanvasTextAlign };
      const positions: { x: number; y: number }[] = [];

      if (isStacked) {
        bhX = w * 0.5;
        bhY = 60;
        const labY = h - 60;

        // Inner 4 clocks distributed vertically between BH and lab
        const spreadStart = bhY + PHOTON_RING_R + 32;
        const spreadEnd   = labY - 56;
        for (let i = 0; i < 4; i++) {
          const tNorm = i / 3;
          positions.push({ x: bhX, y: spreadStart + (spreadEnd - spreadStart) * tNorm });
        }
        positions.push({ x: bhX, y: labY });

        axisStart = { x: bhX, y: bhY + PHOTON_RING_R + 6 };
        axisEnd   = { x: bhX, y: labY - CLOCK_R - 22 };
        axisLabel = { x: bhX + 8, y: bhY + PHOTON_RING_R + 22, align: "left" };
        bhLabelPos = { x: bhX + PHOTON_RING_R + 8, y: bhY + 4, align: "left" };
      } else {
        bhY = h * 0.55;
        bhX = 78;
        const labX = w - 60;

        const spreadStart = bhX + PHOTON_RING_R + 28;
        const spreadEnd   = labX - 90;
        for (let i = 0; i < 4; i++) {
          const tNorm = i / 3;
          positions.push({ x: spreadStart + (spreadEnd - spreadStart) * tNorm, y: bhY });
        }
        positions.push({ x: labX, y: bhY });

        axisStart = { x: bhX + PHOTON_RING_R + 4, y: bhY };
        axisEnd   = { x: w - 30, y: bhY };
        axisLabel = { x: w - 30, y: bhY - 8, align: "right" };
        bhLabelPos = { x: bhX, y: bhY + PHOTON_RING_R + 22, align: "center" };
      }

      // Radial axis + label
      drawRadialAxis(axisStart.x, axisStart.y, axisEnd.x, axisEnd.y);
      ctx.font      = "9px 'Jura', monospace";
      ctx.textAlign = axisLabel.align;
      ctx.fillStyle = "rgba(140,140,140,0.45)";
      ctx.fillText(
        isStacked ? "RADIAL DISTANCE  ↓" : "RADIAL DISTANCE FROM SINGULARITY  →",
        axisLabel.x, axisLabel.y,
      );

      // Embedding-funnel hint bands (perpendicular to the radial axis)
      for (let i = 0; i < 12; i++) {
        const t = i / 12;
        const a = 0.04 + (1 - t) * 0.10;
        ctx.strokeStyle = `rgba(100,140,200,${a.toFixed(3)})`;
        ctx.lineWidth   = 1;
        ctx.beginPath();
        if (isStacked) {
          const y = axisStart.y + (axisEnd.y - axisStart.y) * t;
          ctx.moveTo(bhX - 70, y);
          ctx.lineTo(bhX + 70, y);
        } else {
          const x = axisStart.x + (axisEnd.x - axisStart.x) * t;
          ctx.moveTo(x, bhY - 80);
          ctx.lineTo(x, bhY + 80);
        }
        ctx.stroke();
      }

      // Black hole
      drawBlackHole(bhX, bhY);
      ctx.font      = "9px 'Jura', monospace";
      ctx.textAlign = bhLabelPos.align;
      ctx.fillStyle = "rgba(255,180,90,0.65)";
      ctx.fillText("EVENT HORIZON", bhLabelPos.x, bhLabelPos.y);
      ctx.fillStyle = "rgba(140,140,140,0.45)";
      ctx.fillText("rₛ = 2GM/c²", bhLabelPos.x, bhLabelPos.y + 12);

      // Step clocks
      for (let i = 0; i < CLOCK_DEFS.length; i++) {
        const rate = tickRate(CLOCK_DEFS[i].r);
        tau.current[i] += (TWO_PI / FRAMES_PER_REV) * rate;
      }

      // Draw clocks + labels
      for (let i = 0; i < CLOCK_DEFS.length; i++) {
        const c      = CLOCK_DEFS[i];
        const { x, y } = positions[i];
        const hand   = tau.current[i] % TWO_PI;
        const factor = tickRate(c.r);
        const ticks  = tau.current[i];

        drawClock(x, y, hand);
        drawClockLabels(x, y, c.label, c.note, factor, ticks, isStacked);
      }

      // ── Top header (shortened on narrow viewports) ──────────────────────────
      ctx.font      = "10px 'Jura', monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(80,200,140,0.55)";
      ctx.fillText(
        isStacked ? "STATIC OBSERVERS" : "STATIC OBSERVERS HOVERING AT FIXED RADII",
        14, 18,
      );
      ctx.fillStyle = "rgba(140,140,140,0.40)";
      ctx.fillText(
        isStacked ? "COMPARISON DRIFTS" : "EACH CLOCK IS LOCALLY NORMAL — IT IS THE COMPARISON THAT DRIFTS",
        14, 32,
      );

      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(220,170,90,0.55)";
      ctx.fillText("dτ/dt = √(1 − rₛ / r)", w - 14, 18);
      ctx.fillStyle = "rgba(140,140,140,0.40)";
      ctx.fillText(
        isStacked ? "DEEPER = SLOWER" : "CLOCKS DEEPER IN THE WELL TICK SLOWER",
        w - 14, 32,
      );

      // ── Lag readout ─────────────────────────────────────────────────────────
      const labTau   = tau.current[CLOCK_DEFS.length - 1];
      const innerTau = tau.current[0];
      const lag      = Math.max(0, labTau - innerTau);
      ctx.font      = "9px 'Jura', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,140,100,0.55)";
      ctx.fillText(
        isStacked
          ? `INNER LAGS LAB BY ${(lag / FRAMES_PER_REV).toFixed(2)} REVS`
          : `INNER CLOCK LAGS LAB BY  ${(lag / FRAMES_PER_REV).toFixed(2)}  REVOLUTIONS`,
        w * 0.5, h - 8,
      );

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
