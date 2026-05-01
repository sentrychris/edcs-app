"use client";

import { useEffect, useRef } from "react";

// ── System constants ──────────────────────────────────────────────────────────
// Binary pair
const MA           = 1.0;            // Star A mass (solar)
const MB           = 0.8;            // Star B mass (solar)
const BINARY_MASS  = MA + MB;
const BINARY_SEP   = 80;             // display units
const BINARY_SPEED = 0.022;

// Each star's distance from the binary barycenter
const RA = BINARY_SEP * (MB / BINARY_MASS);   // ~35.6
const RB = BINARY_SEP * (MA / BINARY_MASS);   // ~44.4

// Circumbinary planet — must orbit beyond the critical stability radius.
// For this mass ratio, the critical radius ≈ 2.8× binary separation.
// We use 3.5× to keep it clearly stable.
const PLANET_ORBIT  = BINARY_SEP * 3.5;       // 280
const PLANET_SPEED  = BINARY_SPEED * Math.pow(BINARY_SEP / PLANET_ORBIT, 1.5); // Kepler 3rd law

// Critical stability limit (approx) — shown as forbidden zone outer edge
const STABILITY_LIMIT = BINARY_SEP * 2.8;     // ~224

export default function CircumbinarySimulation() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const frameRef     = useRef<number>(0);
  const binaryAngle  = useRef(0);
  const planetAngle  = useRef(Math.PI * 0.7);  // start offset so it's not aligned

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

    const drawGlow = (
      x: number, y: number, r: number,
      color: string, glowColor: string,
    ) => {
      const grad = ctx.createRadialGradient(x, y, r * 0.4, x, y, r * 4);
      grad.addColorStop(0,   glowColor);
      grad.addColorStop(0.4, glowColor.replace(/[\d.]+\)$/, "0.1)"));
      grad.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(x, y, r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur  = r * 2.5;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawOrbitRing = (
      cx: number, cy: number, r: number,
      color: string, dash: number[] = [3, 7],
    ) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth   = 1;
      ctx.setLineDash(dash);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawLabel = (
      x: number, y: number, r: number,
      text: string, color: string, above = false,
    ) => {
      ctx.font      = "10px 'Jura', monospace";
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(text.toUpperCase(), x, above ? y - r - 8 : y + r + 15);
    };

    // Forbidden zone — annulus between binary separation and stability limit
    const drawForbiddenZone = (cx: number, cy: number, scale: number) => {
      const inner = BINARY_SEP * scale;
      const outer = STABILITY_LIMIT * scale;
      const grad  = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
      grad.addColorStop(0,   "rgba(255,60,40,0.06)");
      grad.addColorStop(0.5, "rgba(255,60,40,0.04)");
      grad.addColorStop(1,   "rgba(255,60,40,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, outer, 0, Math.PI * 2);
      ctx.arc(cx, cy, inner, 0, Math.PI * 2, true);
      ctx.fillStyle = grad;
      ctx.fill("evenodd");
    };

    // Light line from planet to each star — dual illumination hint
    const drawIlluminationLine = (
      px: number, py: number,
      sx: number, sy: number,
      color: string,
    ) => {
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = color;
      ctx.lineWidth   = 0.5;
      ctx.setLineDash([2, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const tick = () => {
      const w  = canvas.width;
      const h  = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      const maxExtent = PLANET_ORBIT + 40;
      const scale     = Math.min(w, h) / 2 / maxExtent;

      ctx.clearRect(0, 0, w, h);

      binaryAngle.current  += BINARY_SPEED;
      planetAngle.current  += PLANET_SPEED;

      const ba = binaryAngle.current;
      const pa = planetAngle.current;

      // Star positions
      const ax = cx + Math.cos(ba)           * RA * scale;
      const ay = cy + Math.sin(ba)           * RA * scale;
      const bx = cx + Math.cos(ba + Math.PI) * RB * scale;
      const by = cy + Math.sin(ba + Math.PI) * RB * scale;

      // Planet position
      const px = cx + Math.cos(pa) * PLANET_ORBIT * scale;
      const py = cy + Math.sin(pa) * PLANET_ORBIT * scale;

      // ── Forbidden zone ──────────────────────────────────────────────────
      drawForbiddenZone(cx, cy, scale);

      // ── Orbit rings ─────────────────────────────────────────────────────
      drawOrbitRing(cx, cy, RA * scale,          "rgba(255,210,100,0.12)");
      drawOrbitRing(cx, cy, RB * scale,          "rgba(255,160,80,0.12)");
      drawOrbitRing(cx, cy, PLANET_ORBIT * scale, "rgba(100,180,255,0.10)", [4, 8]);

      // Stability limit ring
      ctx.beginPath();
      ctx.arc(cx, cy, STABILITY_LIMIT * scale, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,80,60,0.2)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([2, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Illumination lines ──────────────────────────────────────────────
      drawIlluminationLine(px, py, ax, ay, "rgba(255,210,100,0.12)");
      drawIlluminationLine(px, py, bx, by, "rgba(255,160,80,0.12)");

      // ── Barycenter dot ──────────────────────────────────────────────────
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(100,180,255,0.4)";
      ctx.fill();

      // ── Stars ───────────────────────────────────────────────────────────
      drawGlow(ax, ay, 11, "#FFD080", "rgba(255,200,80,0.4)");
      drawGlow(bx, by,  9, "#FFB060", "rgba(255,160,60,0.35)");

      // ── Planet ──────────────────────────────────────────────────────────
      drawGlow(px, py,  5, "#80C8FF", "rgba(100,180,255,0.3)");

      // ── Labels ──────────────────────────────────────────────────────────
      drawLabel(ax, ay, 11, "Star A", "rgba(255,210,100,0.65)");
      drawLabel(bx, by,  9, "Star B", "rgba(255,160,80,0.65)", true);
      drawLabel(px, py,  5, "Planet", "rgba(128,200,255,0.65)");

      // Stability limit label — fixed position relative to ring
      ctx.font      = "9px 'Jura', monospace";
      ctx.fillStyle = "rgba(255,80,60,0.35)";
      ctx.textAlign = "left";
      ctx.fillText("STABILITY LIMIT", cx + STABILITY_LIMIT * scale + 4, cy - 4);

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
