"use client";

import { useEffect, useRef } from "react";

// ── Cluster star data — generated deterministically per mount ───────────────

interface ClusterStar {
  x:     number;     // -1..1, position within cluster (normalised)
  y:     number;     // -1..1
  size:  number;     // base radius in px
  color: string;
  glow:  string;
  pulse: number;     // pulse phase offset
  drift: { x: number; y: number };  // small individual proper-motion variation
}

// Spectral palette weighted toward young/hot stars (typical of open clusters)
const SPECTRAL = [
  { color: "#9BB0FF", glow: "rgba(155,176,255,0.55)", weight: 0.05 },  // O
  { color: "#AABFFF", glow: "rgba(170,191,255,0.50)", weight: 0.20 },  // B
  { color: "#D8E2FF", glow: "rgba(216,226,255,0.45)", weight: 0.25 },  // A
  { color: "#FFFDE0", glow: "rgba(255,253,220,0.40)", weight: 0.15 },  // F
  { color: "#FFD580", glow: "rgba(255,213,128,0.45)", weight: 0.15 },  // G
  { color: "#FFAF50", glow: "rgba(255,175,80,0.45)",  weight: 0.12 },  // K
  { color: "#FF6840", glow: "rgba(255,104,64,0.40)",  weight: 0.08 },  // M
];

const seededRand = (seed: number) => {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const buildCluster = (count: number): ClusterStar[] => {
  const rand  = seededRand(42);
  const stars: ClusterStar[] = [];

  for (let i = 0; i < count; i++) {
    // Concentrated toward centre using sqrt distribution (King-like profile)
    const angle = rand() * Math.PI * 2;
    // Bias inward — square-root makes more stars near centre
    const r     = Math.sqrt(rand()) * 1.0;
    // Slightly elliptical
    const x     = Math.cos(angle) * r;
    const y     = Math.sin(angle) * r * 0.85;

    // Pick spectral type by weighted random
    const roll = rand();
    let cumulative = 0;
    let chosen = SPECTRAL[0];
    for (const s of SPECTRAL) {
      cumulative += s.weight;
      if (roll <= cumulative) {
        chosen = s;
        break;
      }
    }

    // Size — smaller for cooler / lower-mass stars, larger for hotter
    const isHot = chosen.color === "#9BB0FF" || chosen.color === "#AABFFF";
    const size  = isHot ? 2.5 + rand() * 1.5 : 1.2 + rand() * 1.6;

    stars.push({
      x, y, size,
      color: chosen.color,
      glow:  chosen.glow,
      pulse: rand() * Math.PI * 2,
      drift: {
        x: (rand() - 0.5) * 0.0006,
        y: (rand() - 0.5) * 0.0006,
      },
    });
  }
  return stars;
};

const drawStar = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string, glow: string,
) => {
  // Outer glow
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 6);
  g.addColorStop(0,   glow);
  g.addColorStop(0.5, glow.replace(/[\d.]+\)$/, "0.10)"));
  g.addColorStop(1,   "transparent");
  ctx.beginPath();
  ctx.arc(cx, cy, r * 6, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();

  // Bright core
  const b = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  b.addColorStop(0,   "#FFFFFF");
  b.addColorStop(0.4, color);
  b.addColorStop(1,   color);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle    = b;
  ctx.shadowColor  = color;
  ctx.shadowBlur   = r * 2.5;
  ctx.fill();
  ctx.shadowBlur   = 0;
};

export default function OpenClusterSimulation() {
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

    const stars = buildCluster(75);

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 1;
      const t = timeRef.current;

      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.42;

      // ── Faint nebular remnant glow (suggests recent formation) ────────────
      const nebula = ctx.createRadialGradient(cx, cy - radius * 0.1, 0, cx, cy, radius * 1.4);
      nebula.addColorStop(0,   "rgba(140, 180, 240, 0.10)");
      nebula.addColorStop(0.5, "rgba(120, 100, 200, 0.04)");
      nebula.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = nebula;
      ctx.fill();

      // Wispy nebula filaments (subtle)
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2 + t * 0.0002;
        const wx = cx + Math.cos(a) * radius * 0.6;
        const wy = cy + Math.sin(a) * radius * 0.6;
        const wisp = ctx.createRadialGradient(wx, wy, 0, wx, wy, radius * 0.5);
        wisp.addColorStop(0,   "rgba(120, 160, 240, 0.06)");
        wisp.addColorStop(1,   "transparent");
        ctx.beginPath();
        ctx.arc(wx, wy, radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = wisp;
        ctx.fill();
      }

      // ── Common proper-motion drift (very slow shift) ──────────────────────
      const driftX = Math.cos(t * 0.0004) * 1.5;
      const driftY = Math.sin(t * 0.0004) * 1.5;

      // ── Stars ─────────────────────────────────────────────────────────────
      // Update individual proper motions, slowly diffusing
      for (const s of stars) {
        s.x += s.drift.x;
        s.y += s.drift.y;
        // Loose gravitational restoring toward centre (cluster bound)
        const ds = Math.hypot(s.x, s.y);
        if (ds > 1.05) {
          s.drift.x -= (s.x / ds) * 0.000004;
          s.drift.y -= (s.y / ds) * 0.000004;
        }
      }

      // Sort by size (descending) so big stars draw on top
      const ordered = [...stars].sort((a, b) => a.size - b.size);

      for (const s of ordered) {
        const px    = cx + s.x * radius + driftX;
        const py    = cy + s.y * radius + driftY;
        const pulse = 1 + Math.sin(t * 0.04 + s.pulse) * 0.12;
        const r     = s.size * pulse;
        drawStar(ctx, px, py, r, s.color, s.glow);
      }

      // ── Cluster boundary indicator (tidal radius) ─────────────────────────
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(150, 200, 255, 0.10)";
      ctx.setLineDash([2, 6]);
      ctx.lineWidth   = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Labels ────────────────────────────────────────────────────────────
      if (w > 460) {
        ctx.font      = "8px 'Jura', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(120, 160, 200, 0.40)";
        ctx.fillText("⟳ OPEN CLUSTER — 75 STARS, COMMON FORMATION", 10, 16);

        ctx.textAlign = "right";
        ctx.fillStyle = "rgba(150, 200, 255, 0.45)";
        ctx.fillText("TIDAL RADIUS", cx + radius * 1.05, cy - radius * 0.95);
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
