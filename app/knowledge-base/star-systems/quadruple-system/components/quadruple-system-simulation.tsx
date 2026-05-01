"use client";

import { useEffect, useRef } from "react";

// Hierarchical quadruple = two close binaries orbiting their common barycentre.
// We show: AB (left) — Aa+Ab tight pair. CD (right) — Ca+Cb tight pair.
// AB and CD orbit a system-wide barycentre at the centre.

interface SimStar {
  color: string;
  glow:  string;
  r:     number;
}

const STARS = {
  Aa: { color: "#FFD580", glow: "rgba(255,213,128,0.55)", r: 9  } as SimStar,
  Ab: { color: "#FFAF50", glow: "rgba(255,175,80,0.50)",  r: 7  } as SimStar,
  Ca: { color: "#D8E2FF", glow: "rgba(216,226,255,0.50)", r: 8  } as SimStar,
  Cb: { color: "#AABFFF", glow: "rgba(170,191,255,0.50)", r: 7  } as SimStar,
};

const drawStar = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string, glow: string,
) => {
  const g = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 4);
  g.addColorStop(0,   glow);
  g.addColorStop(0.5, glow.replace(/[\d.]+\)$/, "0.10)"));
  g.addColorStop(1,   "transparent");
  ctx.beginPath();
  ctx.arc(cx, cy, r * 4, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();

  const b = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
  b.addColorStop(0,   "#FFFFFF");
  b.addColorStop(0.4, color);
  b.addColorStop(1,   color);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle    = b;
  ctx.shadowColor  = color;
  ctx.shadowBlur   = r * 2;
  ctx.fill();
  ctx.shadowBlur   = 0;
};

export default function QuadrupleSystemSimulation() {
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

      // ── System scale ──────────────────────────────────────────────────────
      const wideR  = Math.min(w, h) * 0.30;   // Wide orbit radius (AB ↔ CD pair separation)
      const tightR = Math.min(w, h) * 0.08;   // Tight binary separation

      // Wide-orbit angular speed (AB and CD around system barycentre)
      const wideAngle  = t * 0.0018;
      const tightAngle = t * 0.014;

      // AB pair barycentre
      const abX = cx + Math.cos(wideAngle + Math.PI) * wideR;
      const abY = cy + Math.sin(wideAngle + Math.PI) * wideR;
      // CD pair barycentre
      const cdX = cx + Math.cos(wideAngle) * wideR;
      const cdY = cy + Math.sin(wideAngle) * wideR;

      // Tight binary positions inside each pair
      // Aa is more massive than Ab → smaller orbit
      const aaX = abX + Math.cos(tightAngle + Math.PI) * tightR * 0.4;
      const aaY = abY + Math.sin(tightAngle + Math.PI) * tightR * 0.4;
      const abX2 = abX + Math.cos(tightAngle) * tightR * 0.6;
      const abY2 = abY + Math.sin(tightAngle) * tightR * 0.6;
      // Ca slightly more massive than Cb
      const caX = cdX + Math.cos(tightAngle * 1.15) * tightR * 0.45;
      const caY = cdY + Math.sin(tightAngle * 1.15) * tightR * 0.45;
      const cbX = cdX + Math.cos(tightAngle * 1.15 + Math.PI) * tightR * 0.55;
      const cbY = cdY + Math.sin(tightAngle * 1.15 + Math.PI) * tightR * 0.55;

      // ── Wide orbital path (faint) ─────────────────────────────────────────
      ctx.beginPath();
      ctx.arc(cx, cy, wideR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(150, 200, 255, 0.10)";
      ctx.setLineDash([4, 6]);
      ctx.lineWidth   = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Tight orbital paths (faint, around each sub-barycentre) ───────────
      [{ x: abX, y: abY }, { x: cdX, y: cdY }].forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, tightR * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(180, 200, 220, 0.12)";
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      });

      // ── System barycentre marker ──────────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy);
      ctx.lineTo(cx + 5, cy);
      ctx.moveTo(cx, cy - 5);
      ctx.lineTo(cx, cy + 5);
      ctx.strokeStyle = "rgba(200, 220, 240, 0.40)";
      ctx.lineWidth   = 0.8;
      ctx.stroke();

      // ── Sub-barycentre markers (smaller crosses) ──────────────────────────
      [{ x: abX, y: abY }, { x: cdX, y: cdY }].forEach(p => {
        ctx.beginPath();
        ctx.moveTo(p.x - 3, p.y);
        ctx.lineTo(p.x + 3, p.y);
        ctx.moveTo(p.x, p.y - 3);
        ctx.lineTo(p.x, p.y + 3);
        ctx.strokeStyle = "rgba(180, 200, 220, 0.30)";
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      });

      // ── Stars ─────────────────────────────────────────────────────────────
      drawStar(ctx, aaX, aaY, STARS.Aa.r, STARS.Aa.color, STARS.Aa.glow);
      drawStar(ctx, abX2, abY2, STARS.Ab.r, STARS.Ab.color, STARS.Ab.glow);
      drawStar(ctx, caX, caY, STARS.Ca.r, STARS.Ca.color, STARS.Ca.glow);
      drawStar(ctx, cbX, cbY, STARS.Cb.r, STARS.Cb.color, STARS.Cb.glow);

      // ── Labels ────────────────────────────────────────────────────────────
      ctx.font      = "bold 10px 'Jura', monospace";
      ctx.textAlign = "center";

      ctx.fillStyle = "rgba(255,213,128,0.80)";
      ctx.fillText("AB PAIR", abX, abY - tightR - 14);
      ctx.font      = "8px 'Jura', monospace";
      ctx.fillStyle = "rgba(220,180,140,0.55)";
      ctx.fillText("Aa + Ab", abX, abY - tightR - 4);

      ctx.font      = "bold 10px 'Jura', monospace";
      ctx.fillStyle = "rgba(216,226,255,0.80)";
      ctx.fillText("CD PAIR", cdX, cdY - tightR - 14);
      ctx.font      = "8px 'Jura', monospace";
      ctx.fillStyle = "rgba(180,200,240,0.55)";
      ctx.fillText("Ca + Cb", cdX, cdY - tightR - 4);

      ctx.font      = "8px 'Jura', monospace";
      ctx.fillStyle = "rgba(200, 220, 240, 0.45)";
      ctx.fillText("SYSTEM BARYCENTRE", cx, cy + 14);

      if (w > 460) {
        ctx.font      = "8px 'Jura', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(120,160,200,0.40)";
        ctx.fillText("⟳ HIERARCHICAL QUADRUPLE — 2 + 2", 10, 16);
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
