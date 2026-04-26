"use client";

import { useEffect, useRef } from "react";

// ── Geometry (in pixels, with M_PX = mass scale) ─────────────────────────────
const M_PX        = 16;
const A_OVER_M    = 0.9;
const A_PX        = A_OVER_M * M_PX;
const TWO_PI      = Math.PI * 2;

// Schwarzschild canonical radii (a = 0)
const SCHW_RS     = 2 * M_PX;          // event horizon, r_s = 2M
const SCHW_PHOT   = 3 * M_PX;          // photon sphere, 1.5 r_s
const SCHW_ISCO   = 6 * M_PX;          // ISCO, 3 r_s

// Kerr canonical radii (equatorial slice, a/M = 0.9)
const RT_DISCR    = Math.sqrt(M_PX * M_PX - A_PX * A_PX);
const KERR_RPLUS  = M_PX + RT_DISCR;   // outer event horizon
const KERR_RMINUS = M_PX - RT_DISCR;   // inner (Cauchy) horizon
const KERR_ERGO   = 2 * M_PX;          // static limit on equator (where g_tt = 0)
const KERR_ISCO_P = 2.32 * M_PX;       // prograde ISCO for a/M = 0.9

// Animation tempo
const ORBIT_SPEED = 5.0;

type ParticleDef = {
  r:      number;
  tint:   string;
  size:   number;
  label?: string;
};

const SCHW_PARTICLES: ParticleDef[] = [
  { r: SCHW_ISCO, tint: "#FFB098", size: 3.0, label: "ISCO" },
  { r: 4 * M_PX,  tint: "#C8E0FF", size: 2.6 },
  { r: 8 * M_PX,  tint: "#FFE8B0", size: 2.6 },
];

const KERR_PARTICLES: ParticleDef[] = [
  { r: 5 * M_PX,    tint: "#FFE8B0", size: 2.6 },
  { r: KERR_ISCO_P, tint: "#FFB098", size: 3.0, label: "ISCO+" },
  { r: 2.6 * M_PX,  tint: "#C8E0FF", size: 2.6 },
  { r: 1.85 * M_PX, tint: "#FF9090", size: 2.6, label: "INSIDE ERGO" },
];

// Schwarzschild Kepler-like ω ∝ √(M/r³)
const schwOmega = (r: number) =>
  ORBIT_SPEED * Math.sqrt(M_PX / (r * r * r));

// Kerr equatorial prograde Ω = √M / (r^(3/2) + a)  — frame-drag-boosted
const kerrOmega = (r: number) =>
  ORBIT_SPEED * Math.sqrt(M_PX) / (Math.pow(r, 1.5) + A_PX);

export default function BlackHoleSpacetimeSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);

  const schwTheta = useRef<number[]>(SCHW_PARTICLES.map((_, i) => i * 2.0));
  const kerrTheta = useRef<number[]>(KERR_PARTICLES.map((_, i) => i * 1.4));

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

    const ring = (
      cx: number, cy: number, r: number,
      stroke: string, lw = 1, dash: number[] | null = null,
    ) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TWO_PI);
      ctx.strokeStyle = stroke;
      ctx.lineWidth   = lw;
      if (dash) ctx.setLineDash(dash);
      ctx.stroke();
      if (dash) ctx.setLineDash([]);
    };

    const horizonDisc = (cx: number, cy: number, r: number) => {
      // Outer accretion glow
      const halo = ctx.createRadialGradient(cx, cy, r, cx, cy, r + 14);
      halo.addColorStop(0, "rgba(255,160,80,0.32)");
      halo.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, r + 14, 0, TWO_PI);
      ctx.fillStyle = halo;
      ctx.fill();

      // Disc
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TWO_PI);
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,180,90,0.45)";
      ctx.lineWidth   = 1;
      ctx.stroke();
    };

    const ergoFill = (cx: number, cy: number, rOuter: number, rInner: number) => {
      // Annulus between r_+ and 2M — the equatorial ergosphere
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter, 0, TWO_PI);
      ctx.arc(cx, cy, rInner, 0, TWO_PI, true);
      ctx.closePath();
      const grad = ctx.createRadialGradient(cx, cy, rInner, cx, cy, rOuter);
      grad.addColorStop(0, "rgba(180,80,200,0.32)");
      grad.addColorStop(1, "rgba(120,60,180,0.10)");
      ctx.fillStyle = grad;
      ctx.fill();
    };

    const particle = (cx: number, cy: number, p: ParticleDef, ang: number) => {
      const px = cx + p.r * Math.cos(ang);
      const py = cy + p.r * Math.sin(ang);

      // Trailing arc (last ~0.5 rad of motion)
      ctx.beginPath();
      ctx.arc(cx, cy, p.r, ang - 0.55, ang);
      ctx.strokeStyle = "rgba(255,220,160,0.30)";
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Glow
      const glow = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3);
      glow.addColorStop(0, "rgba(255,220,160,0.55)");
      glow.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(px, py, p.size * 3, 0, TWO_PI);
      ctx.fillStyle = glow;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, TWO_PI);
      ctx.fillStyle = p.tint;
      ctx.fill();

      if (p.label) {
        ctx.font      = "8px 'Jura', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(255,200,140,0.55)";
        ctx.fillText(p.label, px + 5, py - 4);
      }
    };

    const spinArrow = (cx: number, cy: number) => {
      const r       = Math.max(64, KERR_ERGO + 30);
      const startA  = -Math.PI * 0.88;
      const endA    = -Math.PI * 0.12;

      ctx.beginPath();
      ctx.arc(cx, cy, r, startA, endA);
      ctx.strokeStyle = "rgba(180,220,255,0.45)";
      ctx.lineWidth   = 1.2;
      ctx.stroke();

      // Arrow head — triangle pointing along the tangent at endA
      const tipX = cx + r * Math.cos(endA);
      const tipY = cy + r * Math.sin(endA);
      const tx   = -Math.sin(endA);
      const ty   =  Math.cos(endA);
      const nx   = -Math.cos(endA);
      const ny   = -Math.sin(endA);
      const headLen = 8, headW = 4;
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(tipX - tx * headLen + nx * headW, tipY - ty * headLen + ny * headW);
      ctx.lineTo(tipX - tx * headLen - nx * headW, tipY - ty * headLen - ny * headW);
      ctx.closePath();
      ctx.fillStyle = "rgba(180,220,255,0.55)";
      ctx.fill();

      ctx.font      = "9px 'Jura', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(180,220,255,0.55)";
      ctx.fillText("SPIN  a/M = 0.9", cx, cy - r - 8);
    };

    // ── Main loop ─────────────────────────────────────────────────────────────

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      const isStacked = w < 520;

      ctx.clearRect(0, 0, w, h);

      // Layout: side-by-side on wide; stacked top/bottom on narrow
      let lcx: number, lcy: number, rcx: number, rcy: number;
      let leftHeader: { x: number; y: number };
      let rightHeader: { x: number; y: number };

      if (isStacked) {
        lcx = w * 0.5;
        lcy = h * 0.27;
        rcx = w * 0.5;
        rcy = h * 0.74;
        leftHeader  = { x: lcx, y: 18 };
        rightHeader = { x: rcx, y: h * 0.5 + 14 };
      } else {
        lcx = w * 0.27;
        rcx = w * 0.73;
        lcy = h * 0.5;
        rcy = h * 0.5;
        leftHeader  = { x: lcx, y: h * 0.10 };
        rightHeader = { x: rcx, y: h * 0.10 };
      }

      // Divider
      ctx.beginPath();
      if (isStacked) {
        ctx.moveTo(w * 0.06, h * 0.5);
        ctx.lineTo(w * 0.94, h * 0.5);
      } else {
        ctx.moveTo(w * 0.5, h * 0.08);
        ctx.lineTo(w * 0.5, h * 0.92);
      }
      ctx.strokeStyle = "rgba(100,140,200,0.10)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Headers
      ctx.font      = "10px 'Jura', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(140,200,160,0.65)";
      ctx.fillText("SCHWARZSCHILD  (a = 0)", leftHeader.x, leftHeader.y);
      ctx.fillStyle = "rgba(220,170,90,0.65)";
      ctx.fillText("KERR  (a/M = 0.9)", rightHeader.x, rightHeader.y);

      ctx.font      = "8px 'Jura', monospace";
      ctx.fillStyle = "rgba(140,140,140,0.45)";
      ctx.fillText("STATIC, NON-ROTATING", leftHeader.x, leftHeader.y + 12);
      ctx.fillText(
        isStacked ? "ROTATING — FRAME DRAGGING" : "ROTATING — ERGOSPHERE + FRAME DRAGGING",
        rightHeader.x, rightHeader.y + 12,
      );

      // ── SCHWARZSCHILD ──────────────────────────────────────────────────────
      ring(lcx, lcy, SCHW_ISCO, "rgba(255,140,80,0.40)", 1, [3, 5]);
      ring(lcx, lcy, SCHW_PHOT, "rgba(255,200,120,0.32)", 1, [2, 4]);
      horizonDisc(lcx, lcy, SCHW_RS);

      SCHW_PARTICLES.forEach((p, i) => {
        schwTheta.current[i] += schwOmega(p.r);
        particle(lcx, lcy, p, schwTheta.current[i]);
      });

      ctx.font      = "8px 'Jura', monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255,140,80,0.60)";
      ctx.fillText("ISCO  6M", lcx + SCHW_ISCO + 5, lcy - 4);
      ctx.fillStyle = "rgba(255,200,120,0.55)";
      ctx.fillText("PHOTON  1.5 rₛ", lcx + SCHW_PHOT + 5, lcy + 12);
      ctx.fillStyle = "rgba(255,180,90,0.70)";
      ctx.fillText("rₛ", lcx + SCHW_RS + 5, lcy + 26);

      // ── KERR ────────────────────────────────────────────────────────────────
      ergoFill(rcx, rcy, KERR_ERGO, KERR_RPLUS);
      ring(rcx, rcy, KERR_ERGO, "rgba(220,150,255,0.55)", 1.2);
      ring(rcx, rcy, KERR_ISCO_P, "rgba(255,140,80,0.40)", 1, [3, 5]);
      horizonDisc(rcx, rcy, KERR_RPLUS);
      ring(rcx, rcy, KERR_RMINUS, "rgba(255,180,90,0.45)", 1, [1, 3]);

      KERR_PARTICLES.forEach((p, i) => {
        kerrTheta.current[i] += kerrOmega(p.r);
        particle(rcx, rcy, p, kerrTheta.current[i]);
      });

      spinArrow(rcx, rcy);

      ctx.font      = "8px 'Jura', monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(220,150,255,0.65)";
      ctx.fillText("STATIC LIMIT  2M",   rcx + KERR_ERGO   + 5, rcy - 4);
      ctx.fillStyle = "rgba(255,140,80,0.60)";
      ctx.fillText("ISCO+  ~2.32M",      rcx + KERR_ISCO_P + 5, rcy + 12);
      ctx.fillStyle = "rgba(255,180,90,0.70)";
      ctx.fillText("r₊  EVENT HORIZON",  rcx + KERR_RPLUS  + 5, rcy + 26);
      ctx.fillStyle = "rgba(255,180,90,0.45)";
      ctx.fillText("r₋  CAUCHY",         rcx + KERR_RMINUS + 5, rcy - 18);

      // Frame-dragging note (skip on narrow — too cramped beneath the BH)
      if (!isStacked) {
        ctx.font      = "8px 'Jura', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(220,150,255,0.55)";
        ctx.fillText(
          "INSIDE STATIC LIMIT — NO REST FRAME, FORCED COROTATION",
          rcx, rcy + Math.max(110, KERR_ERGO + 60),
        );
      }

      // Bottom note
      ctx.font      = "9px 'Jura', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(100,160,220,0.45)";
      ctx.fillText(
        isStacked ? "EQUATORIAL SLICE" : "EQUATORIAL SLICE — VIEW DOWN THE SPIN AXIS",
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
