"use client";

import { useEffect, useRef } from "react";

const STAR_A = { mass: 1.8, color: "#FFD080", glowColor: "rgba(255,200,80,0.4)",  radius: 13, label: "Star A" };
const STAR_B = { mass: 1.0, color: "#A0C8FF", glowColor: "rgba(140,180,255,0.35)", radius: 9,  label: "Star B" };

const TOTAL_MASS  = STAR_A.mass + STAR_B.mass;
const SEPARATION  = 180;
const SPEED       = 0.012;

export default function BinaryStarSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const angleRef  = useRef(0);

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
      const grad = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 4.5);
      grad.addColorStop(0,   glowColor);
      grad.addColorStop(0.4, glowColor.replace(/[\d.]+\)$/, "0.12)"));
      grad.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(x, y, r * 4.5, 0, Math.PI * 2);
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

    const drawDot = (x: number, y: number, size: number, color: string) => {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const tick = () => {
      const w  = canvas.width;
      const h  = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);
      angleRef.current += SPEED;
      const angle = angleRef.current;

      // Barycenter distances
      const rA = SEPARATION * (STAR_B.mass / TOTAL_MASS);
      const rB = SEPARATION * (STAR_A.mass / TOTAL_MASS);

      const ax = cx + Math.cos(angle)           * rA;
      const ay = cy + Math.sin(angle)           * rA;
      const bx = cx + Math.cos(angle + Math.PI) * rB;
      const by = cy + Math.sin(angle + Math.PI) * rB;

      // Orbit guide rings
      drawOrbitRing(cx, cy, rA, "rgba(255,220,100,0.15)");
      drawOrbitRing(cx, cy, rB, "rgba(160,200,255,0.15)");

      // Connector line
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = "rgba(200,200,200,0.07)";
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Barycenter
      drawDot(cx, cy, 3, "rgba(100,180,255,0.45)");

      // Stars
      drawGlow(ax, ay, STAR_A.radius, STAR_A.color, STAR_A.glowColor);
      drawGlow(bx, by, STAR_B.radius, STAR_B.color, STAR_B.glowColor);

      // Labels
      drawLabel(ax, ay, STAR_A.radius, STAR_A.label, "rgba(255,210,100,0.7)");
      drawLabel(bx, by, STAR_B.radius, STAR_B.label, "rgba(160,200,255,0.7)");

      // Barycenter label
      ctx.font      = "9px 'Jura', monospace";
      ctx.fillStyle = "rgba(100,180,255,0.4)";
      ctx.textAlign = "center";
      ctx.fillText("BARYCENTER", cx, cy - 10);

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
