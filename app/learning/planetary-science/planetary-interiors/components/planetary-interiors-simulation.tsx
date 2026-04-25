"use client";

import { useEffect, useRef } from "react";

// ── Interior layer & body data ──────────────────────────────────────────────

interface Layer {
  name:      string;
  outerR:    number;     // outer radius as fraction of planet radius
  color:     string;     // base
  hot?:      boolean;    // pulsing heat indicator
}

interface Body {
  name:        string;
  surfColor:   string;
  surfPattern: "barren" | "earth" | "mars" | "ice" | "gas-bands";
  bodyR:       number;     // visual radius weight (Earth = 1.0)
  layers:      Layer[];    // ordered outermost → innermost
  category:    string;     // brief label
  accent:      string;     // accent colour for label
  notes:       string;
}

const BODIES: Body[] = [
  {
    name:        "MERCURY",
    surfColor:   "#A89070",
    surfPattern: "barren",
    bodyR:       0.50,
    accent:      "#C0A080",
    category:    "iron-dominated",
    notes:       "Core ≈ 83% of radius",
    layers: [
      { name: "Crust",        outerR: 1.00, color: "#7C6444"            },
      { name: "Mantle",       outerR: 0.97, color: "#4E3820"            },
      { name: "Outer core",   outerR: 0.83, color: "#FF8030", hot: true },
      { name: "Inner core",   outerR: 0.45, color: "#FFD060", hot: true },
    ],
  },
  {
    name:        "EARTH",
    surfColor:   "#2E70B0",
    surfPattern: "earth",
    bodyR:       1.00,
    accent:      "#80C0FF",
    category:    "active dynamo",
    notes:       "Liquid Fe-Ni outer core",
    layers: [
      { name: "Crust",        outerR: 1.00, color: "#5A6048"            },
      { name: "Upper mantle", outerR: 0.99, color: "#80361C"            },
      { name: "Lower mantle", outerR: 0.84, color: "#4A1A0E"            },
      { name: "Outer core",   outerR: 0.55, color: "#FF7020", hot: true },
      { name: "Inner core",   outerR: 0.19, color: "#FFE090", hot: true },
    ],
  },
  {
    name:        "MARS",
    surfColor:   "#B86040",
    surfPattern: "mars",
    bodyR:       0.55,
    accent:      "#E08060",
    category:    "cooled / stagnant",
    notes:       "Liquid core, no inner core",
    layers: [
      { name: "Crust",        outerR: 1.00, color: "#604030"            },
      { name: "Mantle",       outerR: 0.95, color: "#3C1E10"            },
      { name: "Liquid core",  outerR: 0.50, color: "#E07020", hot: true },
    ],
  },
  {
    name:        "EUROPA",
    surfColor:   "#D8E0E8",
    surfPattern: "ice",
    bodyR:       0.30,
    accent:      "#A0D8FF",
    category:    "ocean world",
    notes:       "Subsurface liquid H₂O ocean",
    layers: [
      { name: "Ice crust",    outerR: 1.00, color: "#A0C0E0"            },
      { name: "Ocean",        outerR: 0.94, color: "#1E4E8C", hot: true },
      { name: "Rocky mantle", outerR: 0.85, color: "#4A2814"            },
      { name: "Iron core",    outerR: 0.20, color: "#E08040", hot: true },
    ],
  },
  {
    name:        "JUPITER",
    surfColor:   "#B89568",
    surfPattern: "gas-bands",
    bodyR:       1.55,
    accent:      "#E8B070",
    category:    "gas giant",
    notes:       "Metallic hydrogen mantle",
    layers: [
      { name: "Atmosphere",      outerR: 1.00, color: "#3A2814"            },
      { name: "Liquid H₂",       outerR: 0.94, color: "#7A4818"            },
      { name: "Metallic H",      outerR: 0.78, color: "#FFD080", hot: true },
      { name: "Rock/ice core",   outerR: 0.10, color: "#5A2818"            },
    ],
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

const seededRand = (seed: number) => {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

// ── Surface drawing (right half) ────────────────────────────────────────────

const drawSurface = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  body: Body, t: number,
) => {
  // Base body with 3D shading
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

  // Surface pattern (clipped to body)
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  if (body.surfPattern === "barren" || body.surfPattern === "mars") {
    const rand  = seededRand(body.name === "MARS" ? 17 : 5);
    const dark  = body.surfPattern === "mars" ? "#5A2810" : "#3A2820";
    for (let i = 0; i < 11; i++) {
      const a  = rand() * Math.PI * 2;
      const d  = Math.sqrt(rand()) * 0.85 * r;
      const sr = (0.05 + rand() * 0.10) * r;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, sr, 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha(dark, 0.55);
      ctx.fill();
    }
  }

  if (body.surfPattern === "earth") {
    ctx.fillStyle = hexAlpha("#5C9040", 0.55);
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.2,  cy - r * 0.3, r * 0.32, r * 0.18, 0, 0, Math.PI * 2);
    ctx.ellipse(cx - r * 0.32, cy + r * 0.1, r * 0.28, r * 0.22, 0, 0, Math.PI * 2);
    ctx.ellipse(cx - r * 0.05, cy + r * 0.45,r * 0.25, r * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();

    // White cloud bands
    ctx.fillStyle = hexAlpha("#FFFFFF", 0.30);
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.0, cy - r * 0.5, r * 0.55, r * 0.07, 0, 0, Math.PI * 2);
    ctx.ellipse(cx - r * 0.2, cy + r * 0.3, r * 0.45, r * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (body.surfPattern === "ice") {
    // Crack lines characteristic of Europa
    ctx.strokeStyle = hexAlpha("#5A4830", 0.45);
    ctx.lineWidth   = 0.8;
    const rand = seededRand(31);
    for (let i = 0; i < 7; i++) {
      const a1 = rand() * Math.PI * 2;
      const a2 = a1 + (rand() - 0.5) * 1.2;
      const r1 = (0.4 + rand() * 0.5) * r;
      const r2 = (0.4 + rand() * 0.5) * r;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1);
      ctx.bezierCurveTo(
        cx + Math.cos(a1 * 1.2) * r * 0.8, cy + Math.sin(a1 * 1.2) * r * 0.8,
        cx + Math.cos(a2 * 1.2) * r * 0.8, cy + Math.sin(a2 * 1.2) * r * 0.8,
        cx + Math.cos(a2) * r2, cy + Math.sin(a2) * r2,
      );
      ctx.stroke();
    }
  }

  if (body.surfPattern === "gas-bands") {
    const phase = t * 0.0014;
    const numBands = 8;
    for (let i = 0; i < numBands; i++) {
      const yPos = cy - r + (i + 0.5) * (2 * r / numBands);
      const half = r / numBands;
      const flow = 0.5 + 0.5 * Math.sin(phase * 1.5 + i * 0.7);
      const bandColor = i % 2 === 0
        ? adjust(body.surfColor, -0.20)
        : adjust(body.surfColor, 0.15);
      ctx.fillStyle = hexAlpha(bandColor, 0.40 + flow * 0.15);
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

// ── Cross-section drawing (left half) ───────────────────────────────────────

const drawCrossSection = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  body: Body, t: number,
) => {
  ctx.save();

  // Clip to left semicircle
  ctx.beginPath();
  ctx.rect(cx - r - 1, cy - r - 1, r + 1, r * 2 + 2);
  ctx.clip();

  // Draw layers from outermost → innermost (each disk overlays inner part of previous)
  body.layers.forEach((layer, i) => {
    const outerR = layer.outerR * r;
    const innerR = (i + 1 < body.layers.length) ? body.layers[i + 1].outerR * r : 0;

    // Hot pulse for active layers
    const pulse = layer.hot ? 1 + 0.08 * Math.sin(t * 0.04 + i * 0.7) : 1;

    // Radial gradient: bright at inner edge of band, dark at outer edge
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
    if (innerR === 0) {
      grad.addColorStop(0,   adjust(layer.color, 0.30 * pulse));
      grad.addColorStop(0.7, layer.color);
      grad.addColorStop(1,   adjust(layer.color, -0.25));
    } else {
      const f = innerR / outerR;
      grad.addColorStop(0,                              adjust(layer.color, -0.40));
      grad.addColorStop(Math.max(0, f - 0.04),          adjust(layer.color, 0.15 * pulse));
      grad.addColorStop(Math.min(1, f + 0.02),          layer.color);
      grad.addColorStop(1,                              adjust(layer.color, -0.30));
    }

    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Thin separator at the layer boundary
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, Math.PI / 2, Math.PI * 1.5);
    ctx.strokeStyle = hexAlpha(adjust(layer.color, -0.5), 0.6);
    ctx.lineWidth   = 0.6;
    ctx.stroke();
  });

  ctx.restore();
};

const drawCutawayLine = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
) => {
  // Vertical cut indicator
  ctx.beginPath();
  ctx.moveTo(cx, cy - r - 2);
  ctx.lineTo(cx, cy + r + 2);
  ctx.strokeStyle = "rgba(220, 230, 245, 0.30)";
  ctx.lineWidth   = 1;
  ctx.stroke();

  // Tiny "cut" markers at top & bottom
  ctx.beginPath();
  ctx.moveTo(cx - 3, cy - r - 4);
  ctx.lineTo(cx + 3, cy - r - 4);
  ctx.moveTo(cx - 3, cy + r + 4);
  ctx.lineTo(cx + 3, cy + r + 4);
  ctx.strokeStyle = "rgba(220, 230, 245, 0.45)";
  ctx.stroke();
};

// ── Panel ────────────────────────────────────────────────────────────────────

const drawPanel = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  body: Body, t: number,
) => {
  const cx       = x + w / 2;
  const labelH   = 56;
  const diagramH = h - labelH;
  const cy       = y + diagramH / 2;

  const maxR = Math.min(w, diagramH) * 0.42;
  const r    = Math.min(maxR, maxR * body.bodyR / 1.55);  // normalised so Jupiter just fits

  drawSurface(ctx, cx, cy, r, body, t);
  drawCrossSection(ctx, cx, cy, r, body, t);
  drawCutawayLine(ctx, cx, cy, r);

  // Labels
  const labelY = y + diagramH;

  ctx.font      = "bold 12px 'Jura', monospace";
  ctx.fillStyle = body.accent;
  ctx.textAlign = "center";
  ctx.fillText(body.name, cx, labelY + 12);

  ctx.font      = "8px 'Jura', monospace";
  ctx.fillStyle = "rgba(170,180,200,0.65)";
  ctx.fillText(body.category, cx, labelY + 26);

  ctx.fillStyle = "rgba(150,160,180,0.50)";
  ctx.fillText(body.notes, cx, labelY + 38);
};

// ── Component ────────────────────────────────────────────────────────────────

export default function PlanetaryInteriorsSimulation() {
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

      // Top hint: "SURFACE | INTERIOR"
      if (!compact) {
        ctx.font      = "9px 'Jura', monospace";
        ctx.fillStyle = "rgba(120,160,200,0.40)";
        ctx.textAlign = "left";
        ctx.fillText("◀ INTERIOR  |  SURFACE ▶", px + 6, py + 12);
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
