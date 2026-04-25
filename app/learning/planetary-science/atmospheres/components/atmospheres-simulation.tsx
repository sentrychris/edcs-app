"use client";

import { useEffect, useRef } from "react";

// ── Atmospheric body data ────────────────────────────────────────────────────

interface AtmoBody {
  name:        string;
  surfColor:   string;     // surface tint
  atmoColor:   string;     // atmosphere tint
  cloudColor:  string;     // cloud particle colour
  pattern:     "barren" | "blue" | "haze" | "venus" | "gas";
  bodyR:       number;     // visual body radius weight (rel. 1.0)
  atmoThick:   number;     // visual atmosphere thickness relative to body radius
  pressure:    string;
  composition: string;
  surfaceT:    string;
  hazardClass: "hostile" | "fragile" | "ideal" | "extreme" | "gas-giant";
  hazardColor: string;
  cloudCount:  number;
  cloudSpeed:  number;
  hasBands:    boolean;
}

const BODIES: AtmoBody[] = [
  {
    name:        "MARS",
    surfColor:   "#B86040",
    atmoColor:   "#E8A070",
    cloudColor:  "#E8C0A0",
    pattern:     "barren",
    bodyR:       0.85,
    atmoThick:   0.10,        // very thin
    pressure:    "0.006 atm",
    composition: "95% CO₂, 3% N₂",
    surfaceT:    "−63 °C avg",
    hazardClass: "fragile",
    hazardColor: "#C09060",
    cloudCount:  3,
    cloudSpeed:  0.6,
    hasBands:    false,
  },
  {
    name:        "EARTH",
    surfColor:   "#2E70B0",
    atmoColor:   "#80B0FF",
    cloudColor:  "#FFFFFF",
    pattern:     "blue",
    bodyR:       1.00,
    atmoThick:   0.14,        // thin but visible
    pressure:    "1.0 atm",
    composition: "78% N₂, 21% O₂",
    surfaceT:    "+15 °C avg",
    hazardClass: "ideal",
    hazardColor: "#60D080",
    cloudCount:  6,
    cloudSpeed:  0.9,
    hasBands:    false,
  },
  {
    name:        "TITAN",
    surfColor:   "#A06030",
    atmoColor:   "#E08840",
    cloudColor:  "#FFB060",
    pattern:     "haze",
    bodyR:       0.55,
    atmoThick:   0.45,        // very thick relative to body
    pressure:    "1.45 atm",
    composition: "95% N₂, 5% CH₄",
    surfaceT:    "−179 °C",
    hazardClass: "fragile",
    hazardColor: "#FFA050",
    cloudCount:  4,
    cloudSpeed:  0.5,
    hasBands:    false,
  },
  {
    name:        "VENUS",
    surfColor:   "#A06820",
    atmoColor:   "#E8C040",
    cloudColor:  "#FFE890",
    pattern:     "venus",
    bodyR:       1.00,
    atmoThick:   0.32,
    pressure:    "92 atm",
    composition: "96% CO₂ + H₂SO₄",
    surfaceT:    "+462 °C",
    hazardClass: "extreme",
    hazardColor: "#FF6040",
    cloudCount:  8,
    cloudSpeed:  1.4,         // fast super-rotation
    hasBands:    false,
  },
  {
    name:        "JUPITER",
    surfColor:   "#B89568",
    atmoColor:   "#C09060",
    cloudColor:  "#7A5430",
    pattern:     "gas",
    bodyR:       1.50,
    atmoThick:   0.20,        // gas giant — no real surface, atmosphere extends deep
    pressure:    "no surface",
    composition: "~90% H, 10% He",
    surfaceT:    "−108 °C @ 1 bar",
    hazardClass: "gas-giant",
    hazardColor: "#B0A0E0",
    cloudCount:  0,
    cloudSpeed:  0,
    hasBands:    true,
  },
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

// ── Cloud feature generation (deterministic per body) ───────────────────────

interface Cloud {
  yFrac:     number;
  xPhase:    number;
  widthFrac: number;
  opacity:   number;
}

const seededRand = (seed: number) => {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const CLOUDS: Record<string, Cloud[]> = {};
BODIES.forEach((body, i) => {
  const rand = seededRand((i + 1) * 31);
  CLOUDS[body.name] = [];
  for (let k = 0; k < body.cloudCount; k++) {
    CLOUDS[body.name].push({
      yFrac:     -0.7 + rand() * 1.4,
      xPhase:    rand() * Math.PI * 2,
      widthFrac: 0.35 + rand() * 0.45,
      opacity:   0.30 + rand() * 0.30,
    });
  }
});

// ── Drawing primitives ──────────────────────────────────────────────────────

const drawAtmosphere = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, bodyR: number, atmoR: number,
  body: AtmoBody, t: number,
) => {
  // Layered atmosphere: dense at surface, fading to space
  const layers = 4;
  for (let i = layers - 1; i >= 0; i--) {
    const inner = bodyR + (atmoR - bodyR) * (i / layers);
    const outer = bodyR + (atmoR - bodyR) * ((i + 1) / layers);
    const opacity = 0.45 * (1 - i / layers) ** 1.4;

    const grad = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
    grad.addColorStop(0,   hexAlpha(body.atmoColor, opacity));
    grad.addColorStop(1,   hexAlpha(body.atmoColor, opacity * 0.4));
    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, Math.PI * 2);
    ctx.arc(cx, cy, inner, 0, Math.PI * 2, true);
    ctx.fillStyle = grad;
    ctx.fill("evenodd");
  }

  // Outer-edge limb glow (the "blue line" effect on Earth, etc.)
  const limb = ctx.createRadialGradient(cx, cy, atmoR * 0.94, cx, cy, atmoR);
  limb.addColorStop(0, hexAlpha(body.atmoColor, 0));
  limb.addColorStop(1, hexAlpha(body.atmoColor, 0.55));
  ctx.beginPath();
  ctx.arc(cx, cy, atmoR, 0, Math.PI * 2);
  ctx.fillStyle = limb;
  ctx.fill();
};

const drawBody = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  body: AtmoBody, t: number,
) => {
  // 3D shaded body
  const lightX = cx - r * 0.4;
  const lightY = cy - r * 0.4;
  const grad   = ctx.createRadialGradient(lightX, lightY, 0, cx, cy, r * 1.2);
  grad.addColorStop(0,    adjust(body.surfColor, 0.40));
  grad.addColorStop(0.45, body.surfColor);
  grad.addColorStop(1,    adjust(body.surfColor, -0.65));
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // ── Surface pattern ───────────────────────────────────────────────────────
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  if (body.pattern === "blue") {
    // Subtle continent suggestions
    ctx.fillStyle = hexAlpha("#5C9040", 0.55);
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.2,  cy - r * 0.3, r * 0.35, r * 0.20, 0, 0, Math.PI * 2);
    ctx.ellipse(cx - r * 0.35, cy + r * 0.1, r * 0.30, r * 0.25, 0, 0, Math.PI * 2);
    ctx.ellipse(cx - r * 0.05, cy + r * 0.45,r * 0.25, r * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (body.pattern === "barren") {
    // Crater/dust spots
    const rand = seededRand(7);
    for (let i = 0; i < 9; i++) {
      const a = rand() * Math.PI * 2;
      const d = Math.sqrt(rand()) * 0.85 * r;
      const sr = (0.05 + rand() * 0.10) * r;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, sr, 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha(adjust(body.surfColor, -0.35), 0.55);
      ctx.fill();
    }
  }

  if (body.pattern === "venus") {
    // Hidden behind clouds — very subtle hot spots
    ctx.fillStyle = hexAlpha("#A04020", 0.25);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + 1;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r * 0.4, cy + Math.sin(a) * r * 0.4, r * 0.18, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (body.pattern === "haze") {
    // Hidden under thick haze — very subtle surface tint variation
    ctx.fillStyle = hexAlpha(adjust(body.surfColor, -0.3), 0.4);
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.1, cy + r * 0.2, r * 0.4, r * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (body.pattern === "gas" && body.hasBands) {
    const phase = t * 0.0014;
    const numBands = 8;
    for (let i = 0; i < numBands; i++) {
      const yPos = cy - r + (i + 0.5) * (2 * r / numBands);
      const half = r / numBands;
      const flow = 0.5 + 0.5 * Math.sin(phase * 1.5 + i * 0.7);
      const bandColor = i % 2 === 0
        ? adjust(body.cloudColor, -0.10)
        : adjust(body.cloudColor, 0.20);
      ctx.fillStyle = hexAlpha(bandColor, 0.30 + flow * 0.15);
      ctx.fillRect(cx - r, yPos - half, r * 2, half * 2);
    }
  }

  ctx.restore();

  // Limb darkening
  const limb = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.5, cx, cy, r);
  limb.addColorStop(0,   "rgba(0,0,0,0)");
  limb.addColorStop(0.7, "rgba(0,0,0,0)");
  limb.addColorStop(1,   "rgba(0,0,0,0.45)");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = limb;
  ctx.fill();
};

const drawClouds = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, bodyR: number, atmoR: number,
  body: AtmoBody, t: number,
) => {
  const clouds = CLOUDS[body.name];
  if (!clouds || clouds.length === 0) return;

  // Clouds drift at the mid-altitude of the atmosphere
  const cloudAltitude = bodyR + (atmoR - bodyR) * 0.35;
  const phase = t * 0.001 * body.cloudSpeed;

  ctx.save();
  // Clip to outer atmosphere so clouds don't escape
  ctx.beginPath();
  ctx.arc(cx, cy, atmoR * 0.99, 0, Math.PI * 2);
  ctx.clip();

  clouds.forEach(cloud => {
    const lon     = ((Math.sin(cloud.xPhase) + 1 + phase) % 2) - 1;
    const limbDim = 1 - Math.min(1, Math.abs(lon) * 0.85);
    const px      = cx + lon * cloudAltitude * 0.95;
    const py      = cy + cloud.yFrac * cloudAltitude * 0.92;
    const rx      = cloud.widthFrac * cloudAltitude * 0.45 * limbDim;
    const ry      = cloudAltitude * 0.05;
    if (rx < 1) return;

    ctx.beginPath();
    ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = hexAlpha(body.cloudColor, cloud.opacity * limbDim);
    ctx.fill();
  });

  ctx.restore();
};

const drawPanel = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  body: AtmoBody,
  t: number,
) => {
  const cx       = x + w / 2;
  const labelH   = 80;
  const diagramH = h - labelH;
  const cy       = y + diagramH / 2;

  // Sizing: pick a max radius that fits the cell
  const maxR    = Math.min(w, diagramH) * 0.5 - 10;
  // The fully expanded body+atmo must fit; atmoR = bodyR * (1 + atmoThick)
  const totalExpansion = 1 + body.atmoThick;
  const bodyR   = (maxR * 0.85) / totalExpansion * body.bodyR / 1.5;  // normalised
  // Re-normalise so the largest body fits
  const normR   = Math.min(maxR / totalExpansion, bodyR * 1.0);
  const realBodyR = Math.min(maxR / totalExpansion, maxR * 0.55 * body.bodyR / 1.5);
  const atmoR     = realBodyR * (1 + body.atmoThick);

  // Atmosphere → body → clouds → labels
  drawAtmosphere(ctx, cx, cy, realBodyR, atmoR, body, t);
  drawBody(ctx, cx, cy, realBodyR, body, t);
  drawClouds(ctx, cx, cy, realBodyR, atmoR, body, t);

  // Atmospheric thickness indicator (thin radial line + label)
  // Skipped — adds clutter

  // ── Labels ────────────────────────────────────────────────────────────────
  const labelY = y + diagramH;

  ctx.font      = "bold 12px 'Jura', monospace";
  ctx.fillStyle = body.hazardColor;
  ctx.textAlign = "center";
  ctx.fillText(body.name, cx, labelY + 12);

  ctx.font      = "9px 'Jura', monospace";
  ctx.fillStyle = "rgba(220,220,220,0.75)";
  ctx.fillText(body.pressure, cx, labelY + 26);

  ctx.font      = "8px 'Jura', monospace";
  ctx.fillStyle = "rgba(170,180,200,0.55)";
  ctx.fillText(body.composition, cx, labelY + 39);

  ctx.fillStyle = "rgba(160,160,160,0.50)";
  ctx.fillText(body.surfaceT, cx, labelY + 50);

  // Hazard tag
  const hazardLabels: Record<AtmoBody["hazardClass"], string> = {
    "hostile":   "HOSTILE",
    "fragile":   "FRAGILE",
    "ideal":     "● HABITABLE",
    "extreme":   "⚠ EXTREME",
    "gas-giant": "GAS GIANT",
  };
  ctx.font      = "7px 'Jura', monospace";
  ctx.fillStyle = body.hazardColor;
  ctx.fillText(hazardLabels[body.hazardClass], cx, labelY + 62);
};

// ── Component ────────────────────────────────────────────────────────────────

export default function AtmospheresSimulation() {
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
        const rows = BODIES.length;
        const rowH = ph / rows;
        BODIES.forEach((body, i) => {
          drawPanel(ctx, px, py + i * rowH, pw, rowH, body, t);
        });
        for (let i = 1; i < rows; i++) {
          ctx.beginPath();
          ctx.moveTo(px,        py + i * rowH);
          ctx.lineTo(px + pw,   py + i * rowH);
          ctx.strokeStyle = "rgba(100,150,200,0.10)";
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      } else {
        const cols = BODIES.length;
        const colW = pw / cols;
        BODIES.forEach((body, i) => {
          drawPanel(ctx, px + i * colW, py, colW, ph, body, t);
        });
        for (let i = 1; i < cols; i++) {
          ctx.beginPath();
          ctx.moveTo(px + i * colW, py + 8);
          ctx.lineTo(px + i * colW, py + ph - 8);
          ctx.strokeStyle = "rgba(100,150,200,0.10)";
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      }

      // Top hint: pressure scale
      if (!compact) {
        ctx.font      = "9px 'Jura', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(120,160,200,0.40)";
        ctx.fillText("← THIN", px + 6, py + 12);
        ctx.textAlign = "right";
        ctx.fillStyle = "rgba(220,140,80,0.40)";
        ctx.fillText("DENSE →", px + pw - 6, py + 12);
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
