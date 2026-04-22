"use client";

import { useEffect, useRef } from "react";

interface Star {
  mass: number;
  color: string;
  glowColor: string;
  radius: number;
  label: string;
}

const STARS: Star[] = [
  { mass: 2.0, color: "#FFD080", glowColor: "rgba(255, 200, 80, 0.4)",  radius: 14, label: "Star A" },
  { mass: 1.4, color: "#A0C8FF", glowColor: "rgba(140, 180, 255, 0.35)", radius: 10, label: "Star B" },
  { mass: 1.0, color: "#FF8060", glowColor: "rgba(255, 100, 60, 0.3)",   radius: 8,  label: "Star C" },
];

const BINARY_SEPARATION = 120;
const BINARY_SPEED      = 0.02;
const OUTER_RADIUS      = 260;
const OUTER_SPEED       = 0.005;

const TOTAL_MASS  = STARS[0].mass + STARS[1].mass + STARS[2].mass;
const BINARY_MASS = STARS[0].mass + STARS[1].mass;

export default function TripleStarSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const angleRef  = useRef({ inner: 0, outer: 0 });

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

    const drawGlow = (x: number, y: number, r: number, color: string, glowColor: string) => {
      const grad = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 4);
      grad.addColorStop(0,   glowColor);
      grad.addColorStop(0.4, glowColor.replace(/[\d.]+\)$/, "0.15)"));
      grad.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(x, y, r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur  = r * 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawOrbitRing = (cx: number, cy: number, r: number, color: string) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth   = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawLabel = (x: number, y: number, r: number, text: string, color: string) => {
      ctx.font      = "10px 'Jura', monospace";
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(text.toUpperCase(), x, y + r + 16);
    };

    const drawDot = (x: number, y: number, color: string) => {
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const tick = () => {
      const w  = canvas.width;
      const h  = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      angleRef.current.inner += BINARY_SPEED;
      angleRef.current.outer += OUTER_SPEED;

      const { inner, outer } = angleRef.current;

      // ── Binary barycenter (wobbles due to C's gravity) ──────────────────
      const barycentricOffset = STARS[2].mass / TOTAL_MASS;
      const binaryBaryX = cx + Math.cos(outer + Math.PI) * OUTER_RADIUS * (STARS[2].mass / TOTAL_MASS) * 1.2;
      const binaryBaryY = cy + Math.sin(outer + Math.PI) * OUTER_RADIUS * (STARS[2].mass / TOTAL_MASS) * 1.2;

      // ── Binary star positions ────────────────────────────────────────────
      const fracA = STARS[1].mass / BINARY_MASS;
      const fracB = STARS[0].mass / BINARY_MASS;
      const ax = binaryBaryX + Math.cos(inner)           * BINARY_SEPARATION * fracA;
      const ay = binaryBaryY + Math.sin(inner)           * BINARY_SEPARATION * fracA;
      const bx = binaryBaryX + Math.cos(inner + Math.PI) * BINARY_SEPARATION * fracB;
      const by = binaryBaryY + Math.sin(inner + Math.PI) * BINARY_SEPARATION * fracB;

      // ── Star C (outer orbiter) ───────────────────────────────────────────
      const cFrac = BINARY_MASS / TOTAL_MASS;
      const cxPos = cx + Math.cos(outer) * OUTER_RADIUS * cFrac;
      const cyPos = cy + Math.sin(outer) * OUTER_RADIUS * cFrac;

      // ── Draw orbit guides ────────────────────────────────────────────────
      drawOrbitRing(binaryBaryX, binaryBaryY, BINARY_SEPARATION * fracA, "rgba(255,220,100,0.15)");
      drawOrbitRing(binaryBaryX, binaryBaryY, BINARY_SEPARATION * fracB, "rgba(160,200,255,0.15)");
      drawOrbitRing(cx, cy, OUTER_RADIUS * cFrac, "rgba(255,130,80,0.12)");

      // ── Binary connector line ────────────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = "rgba(200,200,200,0.06)";
      ctx.lineWidth   = 1;
      ctx.stroke();

      // ── System barycenter dot ────────────────────────────────────────────
      drawDot(cx, cy, "rgba(100,180,255,0.4)");

      // ── Binary barycenter dot ────────────────────────────────────────────
      drawDot(binaryBaryX, binaryBaryY, "rgba(200,200,100,0.35)");

      // ── Stars ────────────────────────────────────────────────────────────
      drawGlow(ax, ay, STARS[0].radius, STARS[0].color, STARS[0].glowColor);
      drawGlow(bx, by, STARS[1].radius, STARS[1].color, STARS[1].glowColor);
      drawGlow(cxPos, cyPos, STARS[2].radius, STARS[2].color, STARS[2].glowColor);

      // ── Labels ───────────────────────────────────────────────────────────
      drawLabel(ax, ay, STARS[0].radius, STARS[0].label, "rgba(255,210,100,0.7)");
      drawLabel(bx, by, STARS[1].radius, STARS[1].label, "rgba(160,200,255,0.7)");
      drawLabel(cxPos, cyPos, STARS[2].radius, STARS[2].label, "rgba(255,130,80,0.7)");

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
