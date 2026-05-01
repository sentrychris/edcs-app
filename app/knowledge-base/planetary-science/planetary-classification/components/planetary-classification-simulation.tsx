"use client";

import { useEffect, useRef } from "react";

// ── Planet definitions ───────────────────────────────────────────────────────

type Pattern = "barren" | "earth" | "ocean" | "ammonia" | "bands" | "smooth" | "hot";

interface Planet {
  type:        string;
  category:    "rocky" | "atmospheric" | "gas-giant";
  baseColor:   string;
  bandColor:   string;
  atmColor:    string;
  atmStrength: number;
  displayR:    number;
  pattern:     Pattern;
  note:        string;
  rotSpeed:    number;
  seed:        number;
}

const PLANETS: Planet[] = [
  // Row 1: Rocky bodies
  { type: "ICY",         category: "rocky",       baseColor: "#D8E0E8", bandColor: "#90A8B8", atmColor: "#B0C8E0", atmStrength: 0.05, displayR: 0.62, pattern: "barren",  note: "H₂O ice surface",     rotSpeed: 0.0008, seed: 11 },
  { type: "ROCKY",       category: "rocky",       baseColor: "#A89070", bandColor: "#5A4028", atmColor: "#806840", atmStrength: 0.04, displayR: 0.60, pattern: "barren",  note: "Silicate basalts",    rotSpeed: 0.0010, seed: 27 },
  { type: "HMC",         category: "rocky",       baseColor: "#A87055", bandColor: "#603020", atmColor: "#A05030", atmStrength: 0.10, displayR: 0.85, pattern: "barren",  note: "High metal content",  rotSpeed: 0.0009, seed: 43 },
  { type: "METAL-RICH",  category: "rocky",       baseColor: "#807878", bandColor: "#3A3030", atmColor: "#000000", atmStrength: 0.00, displayR: 0.55, pattern: "barren",  note: "Iron-nickel core",    rotSpeed: 0.0012, seed: 59 },

  // Row 2: Atmospheric / habitable
  { type: "WATER WORLD", category: "atmospheric", baseColor: "#2E68A8", bandColor: "#FFFFFF", atmColor: "#80C0FF", atmStrength: 0.32, displayR: 0.85, pattern: "ocean",   note: "Liquid H₂O ocean",    rotSpeed: 0.0010, seed: 71 },
  { type: "EARTH-LIKE",  category: "atmospheric", baseColor: "#2E70B0", bandColor: "#5C9040", atmColor: "#80B0FF", atmStrength: 0.38, displayR: 0.85, pattern: "earth",   note: "Liquid water + life", rotSpeed: 0.0010, seed: 89 },
  { type: "AMMONIA",     category: "atmospheric", baseColor: "#C8A848", bandColor: "#7A4C18", atmColor: "#FFD060", atmStrength: 0.30, displayR: 0.90, pattern: "ammonia", note: "NH₃-based biosphere", rotSpeed: 0.0009, seed: 103 },
  { type: "WATER GIANT", category: "atmospheric", baseColor: "#3878B0", bandColor: "#A0D0E0", atmColor: "#60A0E0", atmStrength: 0.45, displayR: 1.10, pattern: "ocean",   note: "Massive H₂O envelope",rotSpeed: 0.0011, seed: 127 },

  // Row 3: Gas giants
  { type: "CLASS I",     category: "gas-giant",   baseColor: "#B89568", bandColor: "#7A5430", atmColor: "#C09060", atmStrength: 0.22, displayR: 1.55, pattern: "bands",   note: "NH₃ clouds, cold",    rotSpeed: 0.0014, seed: 149 },
  { type: "CLASS II",    category: "gas-giant",   baseColor: "#E8DCB8", bandColor: "#8C7A48", atmColor: "#F0E8C0", atmStrength: 0.24, displayR: 1.65, pattern: "bands",   note: "H₂O clouds",          rotSpeed: 0.0014, seed: 163 },
  { type: "CLASS III",   category: "gas-giant",   baseColor: "#2C5898", bandColor: "#1A3870", atmColor: "#80A0F0", atmStrength: 0.22, displayR: 1.65, pattern: "smooth",  note: "Cloudless deep blue", rotSpeed: 0.0011, seed: 181 },
  { type: "CLASS V",     category: "gas-giant",   baseColor: "#902018", bandColor: "#FF7030", atmColor: "#FF6040", atmStrength: 0.50, displayR: 1.65, pattern: "hot",     note: "Hot silicate clouds", rotSpeed: 0.0017, seed: 197 },
];

const CATEGORIES: { key: Planet["category"]; label: string }[] = [
  { key: "rocky",       label: "ROCKY BODIES" },
  { key: "atmospheric", label: "ATMOSPHERIC"  },
  { key: "gas-giant",   label: "GAS GIANTS"   },
];

// ── Color helpers ────────────────────────────────────────────────────────────

const adjust = (hex: string, factor: number): string => {
  if (!hex.startsWith("#")) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const f = 1 + factor;
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${c(r)}, ${c(g)}, ${c(b)})`;
};

const hexAlpha = (hex: string, alpha: number): string => {
  if (!hex.startsWith("#")) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// ── Seeded RNG for deterministic per-planet features ────────────────────────

const seededRand = (seed: number) => {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

// ── Pre-computed features per planet ────────────────────────────────────────

interface BarrenFeature    { x: number; y: number; r: number; darken: number; }
interface BandFeature      { yFrac: number; thickness: number; darken: number; phaseOffset: number; }
interface CloudFeature     { yFrac: number; xPhase: number; widthFrac: number; opacity: number; speed: number; }
interface ContinentFeature { x: number; y: number; rx: number; ry: number; }
interface HotSpot          { yFrac: number; xFrac: number; r: number; phase: number; }

interface Features {
  barren?:     BarrenFeature[];
  bands?:      BandFeature[];
  clouds?:     CloudFeature[];
  continents?: ContinentFeature[];
  hotspots?:   HotSpot[];
}

const generateFeatures = (planet: Planet): Features => {
  const rand = seededRand(planet.seed);
  const f: Features = {};

  if (planet.pattern === "barren") {
    f.barren = [];
    const count = 9 + Math.floor(rand() * 7);
    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2;
      const dist  = Math.sqrt(rand()) * 0.86;
      f.barren.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        r: 0.05 + rand() * 0.10,
        darken: -0.30 - rand() * 0.25,
      });
    }
  }

  if (planet.pattern === "bands") {
    f.bands = [];
    const count = 7 + Math.floor(rand() * 3);
    for (let i = 0; i < count; i++) {
      f.bands.push({
        yFrac: -1 + (i + 0.5) / count * 2,
        thickness: 1.0 / count,
        darken: i % 2 === 0 ? -0.25 : 0.15,
        phaseOffset: rand() * Math.PI * 2,
      });
    }
  }

  if (planet.pattern === "ammonia") {
    f.bands = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      f.bands.push({
        yFrac: -1 + (i + 0.5) / count * 2,
        thickness: 1.0 / count,
        darken: i % 2 === 0 ? -0.20 : 0.12,
        phaseOffset: rand() * Math.PI * 2,
      });
    }
  }

  if (planet.pattern === "ocean" || planet.pattern === "earth") {
    f.clouds = [];
    const count = 5 + Math.floor(rand() * 3);
    for (let i = 0; i < count; i++) {
      f.clouds.push({
        yFrac:     -0.75 + rand() * 1.5,
        xPhase:    rand() * Math.PI * 2,
        widthFrac: 0.35 + rand() * 0.45,
        opacity:   0.25 + rand() * 0.30,
        speed:     0.7 + rand() * 0.8,
      });
    }
  }

  if (planet.pattern === "earth") {
    f.continents = [];
    const count = 5 + Math.floor(rand() * 3);
    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2;
      const dist  = Math.sqrt(rand()) * 0.7;
      f.continents.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        rx: 0.18 + rand() * 0.22,
        ry: 0.12 + rand() * 0.18,
      });
    }
  }

  if (planet.pattern === "hot") {
    f.hotspots = [];
    const count = 6 + Math.floor(rand() * 3);
    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2;
      const dist  = Math.sqrt(rand()) * 0.8;
      f.hotspots.push({
        xFrac: Math.cos(angle) * dist,
        yFrac: Math.sin(angle) * dist,
        r:     0.10 + rand() * 0.12,
        phase: rand() * Math.PI * 2,
      });
    }
  }

  return f;
};

const PLANET_FEATURES: Record<string, Features> = {};
PLANETS.forEach(p => { PLANET_FEATURES[p.type] = generateFeatures(p); });

// ── Drawing primitives ──────────────────────────────────────────────────────

const drawAtmosphere = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, p: Planet) => {
  if (p.atmStrength <= 0) return;
  const haloR = r * (1 + p.atmStrength * 0.55);
  const grad  = ctx.createRadialGradient(cx, cy, r * 0.94, cx, cy, haloR);
  grad.addColorStop(0,   hexAlpha(p.atmColor, 0.55));
  grad.addColorStop(0.5, hexAlpha(p.atmColor, 0.18));
  grad.addColorStop(1,   "transparent");
  ctx.beginPath();
  ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
};

const drawBody = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, p: Planet) => {
  const lightX = cx - r * 0.4;
  const lightY = cy - r * 0.4;
  const grad   = ctx.createRadialGradient(lightX, lightY, 0, cx, cy, r * 1.2);
  grad.addColorStop(0,    adjust(p.baseColor, 0.40));
  grad.addColorStop(0.45, p.baseColor);
  grad.addColorStop(1,    adjust(p.baseColor, -0.65));
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
};

const drawSurface = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  p: Planet, t: number,
) => {
  const f     = PLANET_FEATURES[p.type];
  const phase = t * p.rotSpeed;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  // Bands — drawn first (behind everything else)
  if (f.bands) {
    f.bands.forEach(band => {
      const yPos = cy + band.yFrac * r;
      const half = band.thickness * r;
      const flow = 0.5 + 0.5 * Math.sin(phase * 1.5 + band.phaseOffset);
      ctx.fillStyle = hexAlpha(adjust(p.bandColor, band.darken), 0.30 + flow * 0.15);
      ctx.fillRect(cx - r, yPos - half, r * 2, half * 2);
    });
  }

  // Continents (earth)
  if (f.continents) {
    f.continents.forEach(c => {
      const lon       = ((c.x + 1 + phase * 0.6) % 2) - 1;
      const limbDim   = 1 - Math.min(1, Math.abs(lon) * 0.95);
      const px        = cx + lon * r;
      const py        = cy + c.y * r;
      const rx        = c.rx * r * limbDim;
      const ry        = c.ry * r;
      if (rx < 1.5) return;

      ctx.beginPath();
      ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha(p.bandColor, 0.55 + limbDim * 0.20);
      ctx.fill();
    });
  }

  // Clouds (water/earth)
  if (f.clouds) {
    f.clouds.forEach(cloud => {
      const lon     = ((Math.sin(cloud.xPhase) + 1 + phase * cloud.speed) % 2) - 1;
      const limbDim = 1 - Math.min(1, Math.abs(lon) * 0.85);
      const px      = cx + lon * r * 0.95;
      const py      = cy + cloud.yFrac * r * 0.92;
      const rx      = cloud.widthFrac * r * 0.5 * limbDim;
      const ry      = r * 0.05;
      if (rx < 1) return;

      ctx.beginPath();
      ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha("#FFFFFF", cloud.opacity * limbDim);
      ctx.fill();
    });
  }

  // Barren spots
  if (f.barren) {
    f.barren.forEach(spot => {
      const lon     = ((spot.x + 1 + phase * 0.3) % 2) - 1;
      const limbDim = 1 - Math.min(1, Math.abs(lon) * 0.9);
      const px      = cx + lon * r;
      const py      = cy + spot.y * r;
      const sr      = spot.r * r * limbDim;
      if (sr < 0.6) return;

      ctx.beginPath();
      ctx.arc(px, py, sr, 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha(adjust(p.bandColor, spot.darken), 0.55);
      ctx.fill();
    });
  }

  // Hot spots (Class V silicate clouds)
  if (f.hotspots) {
    f.hotspots.forEach(spot => {
      const lon     = ((spot.xFrac + 1 + phase * 0.4) % 2) - 1;
      const limbDim = 1 - Math.min(1, Math.abs(lon) * 0.7);
      const pulse   = 0.55 + 0.45 * Math.sin(t * 0.04 + spot.phase);
      const px      = cx + lon * r;
      const py      = cy + spot.yFrac * r;
      const sr      = spot.r * r * (0.75 + pulse * 0.5) * limbDim;
      if (sr < 0.8) return;

      const grad = ctx.createRadialGradient(px, py, 0, px, py, sr);
      grad.addColorStop(0,   `rgba(255, 240, 180, ${0.55 + pulse * 0.30})`);
      grad.addColorStop(0.5, `rgba(255, 130, 60,  ${0.30 + pulse * 0.20})`);
      grad.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(px, py, sr, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });
  }

  ctx.restore();
};

const drawLimb = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
  const grad = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.5, cx, cy, r);
  grad.addColorStop(0,   "rgba(0,0,0,0)");
  grad.addColorStop(0.7, "rgba(0,0,0,0)");
  grad.addColorStop(1,   "rgba(0,0,0,0.40)");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
};

const drawPlanet = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  p: Planet, t: number,
) => {
  drawAtmosphere(ctx, cx, cy, r, p);
  drawBody(ctx, cx, cy, r, p);
  drawSurface(ctx, cx, cy, r, p, t);
  drawLimb(ctx, cx, cy, r);
};

// ── Component ────────────────────────────────────────────────────────────────

export default function PlanetaryClassificationSimulation() {
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
      const cols    = compact ? 2 : 4;
      const rows    = CATEGORIES.length;

      // Plot area margins
      const ML = compact ? 8  : 16;
      const MR = compact ? 8  : 16;
      const MT = compact ? 6  : 10;
      const MB = compact ? 6  : 12;

      const px = ML, py = MT;
      const pw = w - ML - MR;
      const ph = h - MT - MB;

      const rowH = ph / rows;
      const cellW = pw / cols;

      // Reserve label space at the top of each row + below each planet
      const HEADER  = compact ? 16 : 18;
      const FOOTER  = compact ? 28 : 30;
      const innerH  = rowH - HEADER - FOOTER;

      const maxR    = 1.7;
      const baseR   = Math.min(cellW * 0.42 / maxR, innerH * 0.42 / maxR);

      // Faint background gradient (cold blue → warm orange across rows)
      const bg = ctx.createLinearGradient(0, py, 0, py + ph);
      bg.addColorStop(0,    "rgba(80,140,220,0.04)");
      bg.addColorStop(0.5,  "rgba(255,255,240,0.02)");
      bg.addColorStop(1,    "rgba(220,120,60,0.04)");
      ctx.fillStyle = bg;
      ctx.fillRect(px, py, pw, ph);

      CATEGORIES.forEach((cat, rowIdx) => {
        const rowTop  = py + rowIdx * rowH;
        const rowMidY = rowTop + HEADER + innerH / 2;
        const planetsInCat = PLANETS.filter(p => p.category === cat.key);

        // Row label
        ctx.font      = `${compact ? 9 : 10}px 'Jura', monospace`;
        ctx.fillStyle = "rgba(120,160,200,0.55)";
        ctx.textAlign = "left";
        ctx.fillText(cat.label, px + 4, rowTop + HEADER - 4);

        // Subtle row separator above (except first)
        if (rowIdx > 0) {
          ctx.beginPath();
          ctx.moveTo(px,        rowTop);
          ctx.lineTo(px + pw,   rowTop);
          ctx.strokeStyle = "rgba(100,150,200,0.10)";
          ctx.lineWidth   = 1;
          ctx.stroke();
        }

        // Render planets in row (handle wrapping for compact 2-col layout)
        planetsInCat.forEach((planet, i) => {
          const col      = i % cols;
          const subRow   = Math.floor(i / cols);
          const subRowH  = subRow * (innerH * 0.5); // Not used in non-compact
          const wrapped  = compact && planetsInCat.length > 2;

          // For compact mode with >2 planets per category, we'd need more rows;
          // we keep cols=2 + plan up to 4 per category, so split row vertically.
          const cellWInner = pw / cols;
          const verticalSplit = wrapped ? 2 : 1;
          const rowSubH       = innerH / verticalSplit;
          const rowSub        = wrapped ? Math.floor(i / cols) : 0;
          const planetCenterY = rowTop + HEADER + rowSub * rowSubH + rowSubH / 2;

          const cx = px + cellWInner * (col + 0.5);
          const cy = wrapped ? planetCenterY : rowMidY;
          const r  = planet.displayR * baseR * (wrapped ? 0.7 : 1);

          drawPlanet(ctx, cx, cy, r, planet, t);

          // Type label below planet
          ctx.font      = `bold ${compact ? 8 : 9}px 'Jura', monospace`;
          ctx.fillStyle = "rgba(220,220,220,0.85)";
          ctx.textAlign = "center";
          ctx.fillText(planet.type, cx, cy + r + (compact ? 12 : 14));

          // Note line below the type label
          if (!compact || !wrapped) {
            ctx.font      = `${compact ? 7 : 8}px 'Jura', monospace`;
            ctx.fillStyle = "rgba(150,170,190,0.55)";
            ctx.fillText(planet.note, cx, cy + r + (compact ? 22 : 26));
          }
        });
      });

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
