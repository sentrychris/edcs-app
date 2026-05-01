"use client";

import { useEffect, useRef } from "react";

// ── Star + HZ data ───────────────────────────────────────────────────────────

interface StarHZ {
  type:        string;
  starColor:   string;
  starGlow:    string;
  starR:       number;     // visual radius weight (G = 1.0)
  hzInner:     number;     // AU
  hzOuter:     number;     // AU
  orbitSpeed:  number;     // animation
  note:        string;
  tidalRisk:   boolean;
}

const STARS: StarHZ[] = [
  { type: "O", starColor: "#9BB0FF", starGlow: "rgba(155,176,255,0.55)", starR: 3.0, hzInner: 165,  hzOuter: 237,  orbitSpeed: 0.0010, note: "Brief lifespan",        tidalRisk: false },
  { type: "A", starColor: "#D8E2FF", starGlow: "rgba(216,226,255,0.50)", starR: 1.6, hzInner: 4.7,  hzOuter: 6.85, orbitSpeed: 0.0018, note: "HZ at ~5–7 AU",         tidalRisk: false },
  { type: "G", starColor: "#FFD580", starGlow: "rgba(255,213,128,0.55)", starR: 1.0, hzInner: 0.95, hzOuter: 1.37, orbitSpeed: 0.0030, note: "Sun analogue",          tidalRisk: false },
  { type: "K", starColor: "#FFAF50", starGlow: "rgba(255,175,80,0.55)",  starR: 0.7, hzInner: 0.37, hzOuter: 0.53, orbitSpeed: 0.0050, note: "Long-lived, stable HZ", tidalRisk: false },
  { type: "M", starColor: "#FF6840", starGlow: "rgba(255,104,64,0.50)",  starR: 0.45,hzInner: 0.05, hzOuter: 0.20, orbitSpeed: 0.0110, note: "Tidal locking + flares",tidalRisk: true  },
];

// ── Format helpers ──────────────────────────────────────────────────────────

const formatAU = (au: number): string => {
  if (au >= 100) return au.toFixed(0);
  if (au >= 10)  return au.toFixed(1);
  if (au >= 1)   return au.toFixed(2);
  return au.toFixed(2);
};

// ── Drawing primitives ──────────────────────────────────────────────────────

const drawStar = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string, glow: string,
) => {
  // Outer glow
  const gg = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 4);
  gg.addColorStop(0,   glow);
  gg.addColorStop(0.5, glow.replace(/[\d.]+\)$/, "0.10)"));
  gg.addColorStop(1,   "transparent");
  ctx.beginPath();
  ctx.arc(cx, cy, r * 4, 0, Math.PI * 2);
  ctx.fillStyle = gg;
  ctx.fill();

  // Body
  const bg = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
  bg.addColorStop(0,   "#FFFFFF");
  bg.addColorStop(0.4, color);
  bg.addColorStop(1,   color);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle  = bg;
  ctx.shadowColor = color;
  ctx.shadowBlur  = r * 2;
  ctx.fill();
  ctx.shadowBlur  = 0;
};

const drawEarth = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
) => {
  // Atmosphere halo
  const ag = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.9);
  ag.addColorStop(0, "rgba(120,180,255,0.55)");
  ag.addColorStop(1, "transparent");
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.9, 0, Math.PI * 2);
  ctx.fillStyle = ag;
  ctx.fill();

  // Body — simple blue with hint of light side
  const bg = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, 0, cx, cy, r * 1.1);
  bg.addColorStop(0,   "#A0D0FF");
  bg.addColorStop(0.5, "#3478B8");
  bg.addColorStop(1,   "#0E2C5C");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = bg;
  ctx.fill();
};

const drawPanel = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  star: StarHZ,
  t: number,
) => {
  const cx       = x + w / 2;
  const labelH   = 60;
  const diagramH = h - labelH;
  const cy       = y + diagramH / 2;

  // Visual sizing
  const maxR    = Math.min(w, diagramH) * 0.5 - 8;
  const hzOutR  = maxR * 0.92;
  const hzInR   = hzOutR * (star.hzInner / star.hzOuter);
  const orbitR  = (hzInR + hzOutR) / 2;
  const starR   = Math.min(maxR * 0.28, 4 + star.starR * 4);

  // ── Hot inner zone (red-tinted disk inside HZ) ────────────────────────────
  const hotGrad = ctx.createRadialGradient(cx, cy, starR, cx, cy, hzInR);
  hotGrad.addColorStop(0,   "rgba(255,80,40,0.20)");
  hotGrad.addColorStop(1,   "rgba(255,140,80,0.06)");
  ctx.beginPath();
  ctx.arc(cx, cy, hzInR, 0, Math.PI * 2);
  ctx.fillStyle = hotGrad;
  ctx.fill();

  // ── Cold outer zone (blue-tinted ring beyond HZ) ──────────────────────────
  const coldGrad = ctx.createRadialGradient(cx, cy, hzOutR, cx, cy, maxR);
  coldGrad.addColorStop(0, "rgba(80,140,220,0.10)");
  coldGrad.addColorStop(1, "rgba(40,80,160,0.02)");
  ctx.beginPath();
  ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
  ctx.arc(cx, cy, hzOutR, 0, Math.PI * 2, true);
  ctx.fillStyle = coldGrad;
  ctx.fill("evenodd");

  // ── Habitable zone band (green) ───────────────────────────────────────────
  ctx.beginPath();
  ctx.arc(cx, cy, hzOutR, 0, Math.PI * 2);
  ctx.arc(cx, cy, hzInR,  0, Math.PI * 2, true);
  ctx.fillStyle = "rgba(80,220,120,0.18)";
  ctx.fill("evenodd");

  // Inner edge — hot side (red, dashed)
  ctx.beginPath();
  ctx.arc(cx, cy, hzInR, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,120,80,0.55)";
  ctx.lineWidth   = 1;
  ctx.setLineDash([3, 3]);
  ctx.stroke();

  // Outer edge — cold side (blue, dashed)
  ctx.beginPath();
  ctx.arc(cx, cy, hzOutR, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(120,180,255,0.55)";
  ctx.stroke();
  ctx.setLineDash([]);

  // ── Planet orbit guide (very faint) ───────────────────────────────────────
  ctx.beginPath();
  ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(180,220,255,0.18)";
  ctx.lineWidth   = 0.8;
  ctx.stroke();

  // ── Star (with subtle pulse) ──────────────────────────────────────────────
  const pulse = 1 + Math.sin(t * 0.04) * 0.03;
  drawStar(ctx, cx, cy, starR * pulse, star.starColor, star.starGlow);

  // ── Earth-like planet orbiting in the HZ ──────────────────────────────────
  const angle = t * star.orbitSpeed;
  const px    = cx + Math.cos(angle) * orbitR;
  const py    = cy + Math.sin(angle) * orbitR;
  drawEarth(ctx, px, py, 3);

  // ── Labels ────────────────────────────────────────────────────────────────
  const labelY = y + diagramH + 4;

  ctx.font      = "bold 12px 'Jura', monospace";
  ctx.fillStyle = star.starColor;
  ctx.textAlign = "center";
  ctx.fillText(`${star.type}-TYPE`, cx, labelY + 11);

  ctx.font      = "9px 'Jura', monospace";
  ctx.fillStyle = "rgba(80,220,120,0.75)";
  ctx.fillText(`${formatAU(star.hzInner)} – ${formatAU(star.hzOuter)} AU`, cx, labelY + 25);

  ctx.font      = "8px 'Jura', monospace";
  ctx.fillStyle = star.tidalRisk ? "rgba(255,140,80,0.65)" : "rgba(170,170,170,0.55)";
  ctx.fillText(star.note, cx, labelY + 39);

  if (star.tidalRisk) {
    ctx.font      = "7px 'Jura', monospace";
    ctx.fillStyle = "rgba(255,140,80,0.45)";
    ctx.fillText("⚠ tidal lock risk", cx, labelY + 50);
  }
};

// ── Component ────────────────────────────────────────────────────────────────

export default function HabitableZonesSimulation() {
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

      const compact = w < 600;

      const ML = 4, MR = 4, MT = 8, MB = 8;
      const px = ML, py = MT;
      const pw = w - ML - MR;
      const ph = h - MT - MB;

      if (compact) {
        // Stack vertically — 5 rows, full width
        const rows = STARS.length;
        const rowH = ph / rows;
        STARS.forEach((star, i) => {
          drawPanel(ctx, px, py + i * rowH, pw, rowH, star, t);
        });

        // Subtle separators
        for (let i = 1; i < rows; i++) {
          ctx.beginPath();
          ctx.moveTo(px,        py + i * rowH);
          ctx.lineTo(px + pw,   py + i * rowH);
          ctx.strokeStyle = "rgba(100,150,200,0.10)";
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      } else {
        // 5 panels in a row
        const cols = STARS.length;
        const colW = pw / cols;
        STARS.forEach((star, i) => {
          drawPanel(ctx, px + i * colW, py, colW, ph, star, t);
        });

        // Subtle separators
        for (let i = 1; i < cols; i++) {
          ctx.beginPath();
          ctx.moveTo(px + i * colW, py + 8);
          ctx.lineTo(px + i * colW, py + ph - 8);
          ctx.strokeStyle = "rgba(100,150,200,0.10)";
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      }

      // Top axis hint: HOT → COOL across stars
      if (!compact) {
        ctx.font      = "9px 'Jura', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(100,140,220,0.40)";
        ctx.fillText("HOT", px + 4, py + 12);
        ctx.textAlign = "right";
        ctx.fillStyle = "rgba(220,100,80,0.40)";
        ctx.fillText("COOL", px + pw - 4, py + 12);
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
