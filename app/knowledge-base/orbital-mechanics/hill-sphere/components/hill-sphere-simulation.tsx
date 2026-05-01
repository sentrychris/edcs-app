"use client";

import { useEffect, useRef } from "react";

// Simulation: Star — Planet (with its Hill sphere) — Moon (with its own tiny
// Hill sphere). A test particle illustrates what happens when something drifts
// across the planet's Hill-sphere boundary.

const drawStar = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
) => {
  const halo = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 5);
  halo.addColorStop(0,   "rgba(255, 213, 128, 0.55)");
  halo.addColorStop(0.5, "rgba(255, 213, 128, 0.10)");
  halo.addColorStop(1,   "transparent");
  ctx.beginPath();
  ctx.arc(cx, cy, r * 5, 0, Math.PI * 2);
  ctx.fillStyle = halo;
  ctx.fill();

  const body = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
  body.addColorStop(0,   "#FFFFFF");
  body.addColorStop(0.4, "#FFD580");
  body.addColorStop(1,   "#FFAF50");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle    = body;
  ctx.shadowColor  = "#FFD580";
  ctx.shadowBlur   = r * 2;
  ctx.fill();
  ctx.shadowBlur   = 0;
};

const drawPlanet = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
) => {
  const halo = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.6);
  halo.addColorStop(0, "rgba(120, 180, 255, 0.45)");
  halo.addColorStop(1, "transparent");
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.6, 0, Math.PI * 2);
  ctx.fillStyle = halo;
  ctx.fill();

  const body = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
  body.addColorStop(0,   "#A0D0FF");
  body.addColorStop(0.5, "#3478B8");
  body.addColorStop(1,   "#0E2C5C");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = body;
  ctx.fill();
};

const drawMoon = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
) => {
  const body = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
  body.addColorStop(0,   "#E0E8F0");
  body.addColorStop(0.5, "#A0A8B0");
  body.addColorStop(1,   "#404850");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = body;
  ctx.fill();
};

export default function HillSphereSimulation() {
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

      // ── Geometry ──────────────────────────────────────────────────────────
      // Centre the system in the canvas so the planet's full orbit + Hill sphere
      // fit with margin on every side.
      const margin   = 40;
      const maxBound = Math.min(w, h) / 2 - margin;

      const starX = w / 2;
      const starY = h / 2;
      const starR = Math.min(w, h) * 0.045;

      // Planet orbit + Hill sphere + outside particle must all fit inside maxBound.
      // Outside particle sits at orbitR + 1.6 * hillR; with hillR = 0.22 * orbitR
      // → total reach ≈ 1.35 × orbitR, so orbitR ≈ 0.74 × maxBound.
      const planetOrbitR = maxBound * 0.74;
      const planetAngle  = t * 0.0025;
      const planetX = starX + Math.cos(planetAngle) * planetOrbitR;
      const planetY = starY + Math.sin(planetAngle) * planetOrbitR;
      const planetR = Math.min(w, h) * 0.030;

      // Planet's Hill sphere — large enough to comfortably hold the moon's orbit
      const hillR = planetOrbitR * 0.22;

      // Moon orbiting the planet inside the Hill sphere
      const moonOrbitR = hillR * 0.50;
      const moonAngle  = t * 0.022;
      const moonX = planetX + Math.cos(moonAngle) * moonOrbitR;
      const moonY = planetY + Math.sin(moonAngle) * moonOrbitR;
      const moonR = planetR * 0.30;

      // Moon's own (tiny) Hill sphere
      const moonHillR = moonOrbitR * 0.20;

      // ── Faint background gradient ────────────────────────────────────────
      const bg = ctx.createRadialGradient(starX, starY, 0, starX, starY, planetOrbitR * 1.3);
      bg.addColorStop(0,   "rgba(255, 213, 128, 0.04)");
      bg.addColorStop(1,   "transparent");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // ── Planet's orbit guide (faint) ──────────────────────────────────────
      ctx.beginPath();
      ctx.arc(starX, starY, planetOrbitR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(180, 200, 220, 0.10)";
      ctx.setLineDash([3, 6]);
      ctx.lineWidth   = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Planet's Hill sphere ──────────────────────────────────────────────
      // Filled shading for the dominance region
      const hillGrad = ctx.createRadialGradient(planetX, planetY, planetR * 1.5, planetX, planetY, hillR);
      hillGrad.addColorStop(0, "rgba(120, 220, 180, 0.10)");
      hillGrad.addColorStop(1, "rgba(120, 220, 180, 0.02)");
      ctx.beginPath();
      ctx.arc(planetX, planetY, hillR, 0, Math.PI * 2);
      ctx.fillStyle = hillGrad;
      ctx.fill();

      // Boundary
      ctx.beginPath();
      ctx.arc(planetX, planetY, hillR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(120, 220, 180, 0.55)";
      ctx.setLineDash([4, 5]);
      ctx.lineWidth   = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Moon's orbit guide ────────────────────────────────────────────────
      ctx.beginPath();
      ctx.arc(planetX, planetY, moonOrbitR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(200, 220, 240, 0.20)";
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Moon's Hill sphere ────────────────────────────────────────────────
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonHillR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(180, 220, 200, 0.40)";
      ctx.setLineDash([2, 3]);
      ctx.lineWidth   = 0.8;
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Test particles to show boundary behaviour ─────────────────────────
      // Two particles: one inside the Hill sphere (captured), one outside (free)
      const insideParticleAngle = t * 0.040;
      const insideR             = hillR * 0.78;   // just inside boundary
      const ipx = planetX + Math.cos(insideParticleAngle) * insideR;
      const ipy = planetY + Math.sin(insideParticleAngle) * insideR;
      ctx.beginPath();
      ctx.arc(ipx, ipy, 2, 0, Math.PI * 2);
      ctx.fillStyle   = "rgba(120, 240, 180, 0.85)";
      ctx.shadowColor = "rgba(120, 240, 180, 0.6)";
      ctx.shadowBlur  = 4;
      ctx.fill();
      ctx.shadowBlur  = 0;

      // Outside particle drifts with the star (orbits star, not planet)
      const outsideAngle = planetAngle + 0.18 + Math.sin(t * 0.005) * 0.05;
      const outsideR     = planetOrbitR + hillR * 1.6;
      const opx = starX + Math.cos(outsideAngle) * outsideR;
      const opy = starY + Math.sin(outsideAngle) * outsideR;
      ctx.beginPath();
      ctx.arc(opx, opy, 2, 0, Math.PI * 2);
      ctx.fillStyle   = "rgba(255, 200, 130, 0.85)";
      ctx.shadowColor = "rgba(255, 200, 130, 0.6)";
      ctx.shadowBlur  = 4;
      ctx.fill();
      ctx.shadowBlur  = 0;

      // ── Bodies ────────────────────────────────────────────────────────────
      drawStar(ctx, starX, starY, starR);
      drawPlanet(ctx, planetX, planetY, planetR);
      drawMoon(ctx, moonX, moonY, moonR);

      // ── Labels ────────────────────────────────────────────────────────────
      ctx.font      = "8px 'Jura', monospace";
      ctx.textAlign = "center";

      // Planet's Hill sphere label
      ctx.fillStyle = "rgba(120, 220, 180, 0.70)";
      ctx.fillText("HILL SPHERE", planetX, planetY - hillR - 6);
      ctx.font      = "7px 'Jura', monospace";
      ctx.fillStyle = "rgba(120, 220, 180, 0.45)";
      ctx.fillText("(planet's domain)", planetX, planetY + hillR + 12);

      // Moon's Hill sphere
      ctx.font      = "7px 'Jura', monospace";
      ctx.fillStyle = "rgba(180, 220, 200, 0.55)";
      ctx.fillText("moon's", moonX + moonHillR + 6, moonY - 2);
      ctx.fillText("hill sphere", moonX + moonHillR + 6, moonY + 7);

      // Body labels
      ctx.font      = "bold 9px 'Jura', monospace";
      ctx.fillStyle = "#FFD580";
      ctx.fillText("STAR", starX, starY - starR - 8);
      ctx.fillStyle = "#80B0FF";
      ctx.fillText("PLANET", planetX, planetY - planetR - 6);

      // Test particle annotations
      ctx.font      = "7px 'Jura', monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(120, 240, 180, 0.65)";
      ctx.fillText("captured", ipx + 5, ipy - 5);
      ctx.fillStyle = "rgba(255, 200, 130, 0.65)";
      ctx.fillText("escaped", opx + 5, opy - 5);

      // Top-left header
      if (w > 500) {
        ctx.font      = "8px 'Jura', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(120, 160, 200, 0.40)";
        ctx.fillText("⟳ HILL SPHERE — REGION OF GRAVITATIONAL DOMINANCE", 10, 16);
      }

      // Formula in lower-right
      if (w > 500) {
        ctx.font      = "8px 'Jura', monospace";
        ctx.textAlign = "right";
        ctx.fillStyle = "rgba(160, 200, 220, 0.45)";
        ctx.fillText("r_H ≈ a · (m / 3M)^(1/3)", w - 10, h - 8);
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
