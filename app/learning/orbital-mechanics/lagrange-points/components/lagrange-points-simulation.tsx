"use client";

import { useEffect, useRef } from "react";

// ── System constants ──────────────────────────────────────────────────────────
// Mass ratio 50:1 keeps the star nearly centered while making the Hill sphere
// compact enough that L1/L2 sit visibly close to the planet.
const M1        = 50;   // star (primary)
const M2        = 1;    // planet (secondary)
const MTOT      = M1 + M2;
const MU        = M2 / MTOT;          // ~0.0196
const SEP       = 170;                 // display separation (unscaled)
const R_HILL    = SEP * Math.cbrt(MU / 3);  // Hill sphere radius ~18.5

// Positions in the co-rotating frame (barycenter at origin, planet on +x)
const STAR_X    = -MU * SEP;          // ~-3.3
const PLANET_X  = (1 - MU) * SEP;    // ~166.7

const L_POINTS = {
  L1: { x: PLANET_X - R_HILL,                    y: 0,                          stable: false },
  L2: { x: PLANET_X + R_HILL,                    y: 0,                          stable: false },
  L3: { x: -(1 + 5 * MU / 12) * SEP,             y: 0,                          stable: false },
  L4: { x: (0.5 - MU) * SEP,                     y:  (Math.sqrt(3) / 2) * SEP,  stable: true  },
  L5: { x: (0.5 - MU) * SEP,                     y: -(Math.sqrt(3) / 2) * SEP,  stable: true  },
};

// A handful of Trojan particles near L4/L5 that slowly librate
const TROJANS = [
  ...[-14, -7, 0, 7, 14].map((dAngle, i) => ({ lp: "L4" as const, phase: (i * 1.3),   amp: 10 + Math.abs(dAngle), dAngle })),
  ...[-14, -7, 0, 7, 14].map((dAngle, i) => ({ lp: "L5" as const, phase: (i * 1.3) + Math.PI, amp: 10 + Math.abs(dAngle), dAngle })),
];

const ORBIT_SPEED = 0.004;

// ── Helpers ───────────────────────────────────────────────────────────────────

function rotatePoint(x: number, y: number, angle: number): [number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos - y * sin, x * sin + y * cos];
}

export default function LagrangePointsSimulation() {
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

    // ── Draw helpers ─────────────────────────────────────────────────────────

    const drawGlow = (x: number, y: number, r: number, color: string, glowColor: string) => {
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
      ctx.shadowBlur  = r * 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawLPoint = (x: number, y: number, label: string, stable: boolean) => {
      const color      = stable ? "rgba(80,220,120,0.9)"  : "rgba(255,180,60,0.85)";
      const glowColor  = stable ? "rgba(80,220,120,0.25)" : "rgba(255,180,60,0.2)";
      const r = 4;

      // Glow halo
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
      grad.addColorStop(0,   glowColor);
      grad.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(x, y, r * 5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Dot
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur  = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      ctx.font      = "10px 'Jura', monospace";
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      const labelY = y < 0 ? y - r - 7 : y + r + 14;
      ctx.fillText(label, x, labelY);
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

    const drawTriangleLine = (
      x1: number, y1: number,
      x2: number, y2: number,
      color: string,
    ) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth   = 0.5;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawTrojan = (x: number, y: number) => {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(80,220,120,0.5)";
      ctx.fill();
    };

    // ── Main loop ─────────────────────────────────────────────────────────────

    const tick = () => {
      const w   = canvas.width;
      const h   = canvas.height;
      const cx  = w / 2;
      const cy  = h / 2;

      // Scale so L4/L5 (farthest points) fit with padding
      const maxExtent = (Math.sqrt(3) / 2) * SEP + 30;
      const scale     = Math.min(w, h) / 2 / maxExtent;

      ctx.clearRect(0, 0, w, h);

      timeRef.current += ORBIT_SPEED;
      const angle = timeRef.current;

      // ── All rotating positions ──────────────────────────────────────────

      const toCanvas = (rx: number, ry: number): [number, number] => {
        const [rx2, ry2] = rotatePoint(rx, ry, angle);
        return [cx + rx2 * scale, cy + ry2 * scale];
      };

      const [sx, sy] = toCanvas(STAR_X, 0);
      const [px, py] = toCanvas(PLANET_X, 0);

      // Planet orbit ring (in world space, centered on barycenter)
      drawOrbitRing(cx, cy, PLANET_X * scale, "rgba(100,150,200,0.1)");

      // ── Equilateral triangle lines ──────────────────────────────────────
      const [l4x, l4y] = toCanvas(L_POINTS.L4.x, L_POINTS.L4.y);
      const [l5x, l5y] = toCanvas(L_POINTS.L5.x, L_POINTS.L5.y);

      drawTriangleLine(sx, sy, l4x, l4y, "rgba(80,220,120,0.18)");
      drawTriangleLine(px, py, l4x, l4y, "rgba(80,220,120,0.18)");
      drawTriangleLine(sx, sy, l5x, l5y, "rgba(80,220,120,0.18)");
      drawTriangleLine(px, py, l5x, l5y, "rgba(80,220,120,0.18)");

      // ── Trojan particles ────────────────────────────────────────────────
      for (const t of TROJANS) {
        const lp      = L_POINTS[t.lp];
        const libAngle = angle * 0.08 + t.phase;
        const libX    = lp.x + Math.cos(libAngle) * t.amp;
        const libY    = lp.y + Math.sin(libAngle) * t.amp * 0.6;
        const [tx, ty] = toCanvas(libX, libY);
        drawTrojan(tx, ty);
      }

      // ── L-points ────────────────────────────────────────────────────────
      for (const [label, lp] of Object.entries(L_POINTS)) {
        const [lx, ly] = toCanvas(lp.x, lp.y);
        drawLPoint(lx, ly, label, lp.stable);
      }

      // ── Bodies ──────────────────────────────────────────────────────────
      drawGlow(sx, sy, 16, "#FFD080", "rgba(255,200,80,0.45)");
      drawGlow(px, py,  6, "#80B0FF", "rgba(100,160,255,0.35)");

      // Body labels
      ctx.font      = "9px 'Jura', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,210,100,0.6)";
      ctx.fillText("STAR", sx, sy + 16 * scale * 0.5 + 14);
      ctx.fillStyle = "rgba(128,176,255,0.6)";
      ctx.fillText("PLANET", px, py + 6 * scale * 0.5 + 14);

      // Barycenter dot
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(100,180,255,0.35)";
      ctx.fill();

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
