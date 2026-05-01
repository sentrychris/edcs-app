"use client";

import { useEffect, useRef } from "react";

interface Planet {
  radius:  number;   // orbit radius
  speed:   number;   // radians per frame
  size:    number;   // visual radius
  color:   string;
  label:   string;
}

const STAR_RADIUS     = 22;
const STAR_COLOR      = "#FFD080";
const STAR_GLOW       = "rgba(255,200,80,0.45)";

// Habitable zone inner/outer edge (orbit radii)
const HZ_INNER = 140;
const HZ_OUTER = 220;
// Snow line
const SNOW_LINE = 290;

const PLANETS: Planet[] = [
  { radius:  80, speed: 0.025, size: 4,  color: "#FF7050", label: "Rocky I"  },
  { radius: 120, speed: 0.016, size: 5,  color: "#FFA060", label: "Rocky II" },
  { radius: 175, speed: 0.010, size: 6,  color: "#60C880", label: "Terran"   },
  { radius: 340, speed: 0.005, size: 9,  color: "#A0C8FF", label: "Gas Giant"},
  { radius: 430, speed: 0.003, size: 7,  color: "#C0D8FF", label: "Ice Giant"},
];

export default function SingleStarSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const anglesRef = useRef<number[]>(PLANETS.map((_, i) => (i * Math.PI * 2) / PLANETS.length));

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

    const drawZoneRing = (cx: number, cy: number, inner: number, outer: number, color: string, scale: number) => {
      const grad = ctx.createRadialGradient(cx, cy, inner * scale, cx, cy, outer * scale);
      grad.addColorStop(0,   color.replace(/[\d.]+\)$/, "0)"));
      grad.addColorStop(0.2, color);
      grad.addColorStop(0.8, color);
      grad.addColorStop(1,   color.replace(/[\d.]+\)$/, "0)"));
      ctx.beginPath();
      ctx.arc(cx, cy, outer * scale, 0, Math.PI * 2);
      ctx.arc(cx, cy, inner * scale, 0, Math.PI * 2, true);
      ctx.fillStyle = grad;
      ctx.fill("evenodd");
    };

    const drawOrbitRing = (cx: number, cy: number, r: number, color: string) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth   = 1;
      ctx.setLineDash([3, 7]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawSnowLine = (cx: number, cy: number, r: number, scale: number) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r * scale, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(140,200,255,0.2)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([2, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawStar = (x: number, y: number) => {
      const grad = ctx.createRadialGradient(x, y, STAR_RADIUS * 0.5, x, y, STAR_RADIUS * 5);
      grad.addColorStop(0,   STAR_GLOW);
      grad.addColorStop(0.4, STAR_GLOW.replace(/[\d.]+\)$/, "0.15)"));
      grad.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(x, y, STAR_RADIUS * 5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, STAR_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = STAR_COLOR;
      ctx.shadowColor = STAR_COLOR;
      ctx.shadowBlur  = STAR_RADIUS * 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawPlanet = (x: number, y: number, r: number, color: string) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur  = r * 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawLabel = (x: number, y: number, r: number, text: string, color: string) => {
      ctx.font      = "9px 'Jura', monospace";
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(text.toUpperCase(), x, y + r + 13);
    };

    const tick = () => {
      const w  = canvas.width;
      const h  = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Scale so the outermost orbit fits with some padding
      const maxRadius = PLANETS[PLANETS.length - 1].radius;
      const scale = Math.min(w, h) / 2 / (maxRadius + 60);

      ctx.clearRect(0, 0, w, h);

      // Habitable zone
      drawZoneRing(cx, cy, HZ_INNER, HZ_OUTER, "rgba(80,200,100,0.08)", scale);

      // Snow line
      drawSnowLine(cx, cy, SNOW_LINE, scale);

      // Orbit rings
      for (const planet of PLANETS) {
        drawOrbitRing(cx, cy, planet.radius * scale, "rgba(100,150,200,0.12)");
      }

      // Star
      drawStar(cx, cy);

      // Advance and draw planets
      for (let i = 0; i < PLANETS.length; i++) {
        anglesRef.current[i] += PLANETS[i].speed;
        const angle = anglesRef.current[i];
        const px = cx + Math.cos(angle) * PLANETS[i].radius * scale;
        const py = cy + Math.sin(angle) * PLANETS[i].radius * scale;
        drawPlanet(px, py, PLANETS[i].size, PLANETS[i].color);
        drawLabel(px, py, PLANETS[i].size, PLANETS[i].label, `${PLANETS[i].color}99`);
      }

      // Zone label
      ctx.font      = "9px 'Jura', monospace";
      ctx.fillStyle = "rgba(80,200,100,0.45)";
      ctx.textAlign = "left";
      ctx.fillText("HABITABLE ZONE", cx + HZ_INNER * scale + 4, cy - 4);

      ctx.fillStyle = "rgba(140,200,255,0.3)";
      ctx.fillText("SNOW LINE", cx + SNOW_LINE * scale + 4, cy - 4);

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
