"use client";

import { useEffect, useRef } from "react";

// ── Supernova type definitions ───────────────────────────────────────────────

interface SNType {
  name:           string;       // "TYPE Ia"
  trigger:        string;       // brief description for label
  progenitorColor: string;
  progenitorR:    number;       // pre-explosion display radius
  flashColor:     string;
  shellColor:     string;
  remnantColor:   string | null;  // null = no remnant
  remnantR:       number;
  cycleOffset:    number;       // phase offset so panels desync
  shellMaxFactor: number;       // how big the expanding shell gets relative to cell
  energy:         number;       // 0..1 — affects flash size
  accent:         string;       // label colour
}

const TYPES: SNType[] = [
  {
    name:           "TYPE Ia",
    trigger:        "WD detonation",
    progenitorColor: "#A0BFFF",
    progenitorR:    4,
    flashColor:     "#FFFFFF",
    shellColor:     "#FFE090",
    remnantColor:   null,        // complete disruption — no compact remnant
    remnantR:       0,
    cycleOffset:    0,
    shellMaxFactor: 0.85,
    energy:         0.95,
    accent:         "#A0BFFF",
  },
  {
    name:           "TYPE Ib/Ic",
    trigger:        "stripped core-collapse",
    progenitorColor: "#80E0FF",
    progenitorR:    14,
    flashColor:     "#FFFFFF",
    shellColor:     "#80D0FF",
    remnantColor:   "#E8F4FF",   // neutron star
    remnantR:       2,
    cycleOffset:    90,
    shellMaxFactor: 0.80,
    energy:         0.85,
    accent:         "#80E0FF",
  },
  {
    name:           "TYPE II",
    trigger:        "red supergiant collapse",
    progenitorColor: "#FF6840",
    progenitorR:    22,
    flashColor:     "#FFFFE0",
    shellColor:     "#FFA060",
    remnantColor:   "#E8F4FF",
    remnantR:       2,
    cycleOffset:    180,
    shellMaxFactor: 0.85,
    energy:         0.90,
    accent:         "#FFA060",
  },
  {
    name:           "HYPERNOVA",
    trigger:        "extreme-mass collapse",
    progenitorColor: "#9070FF",
    progenitorR:    26,
    flashColor:     "#FFE0FF",
    shellColor:     "#C080FF",
    remnantColor:   "#020308",   // black hole
    remnantR:       4,
    cycleOffset:    270,
    shellMaxFactor: 0.95,
    energy:         1.0,
    accent:         "#C080FF",
  },
];

const drawProgenitor = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string,
) => {
  // Halo
  const cr = parseInt(color.slice(1, 3), 16);
  const cg = parseInt(color.slice(3, 5), 16);
  const cb = parseInt(color.slice(5, 7), 16);
  const halo = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 3.5);
  halo.addColorStop(0,   `rgba(${cr},${cg},${cb},0.55)`);
  halo.addColorStop(0.5, `rgba(${cr},${cg},${cb},0.15)`);
  halo.addColorStop(1,   "transparent");
  ctx.beginPath();
  ctx.arc(cx, cy, r * 3.5, 0, Math.PI * 2);
  ctx.fillStyle = halo;
  ctx.fill();

  const body = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
  body.addColorStop(0,   "#FFFFFF");
  body.addColorStop(0.4, color);
  body.addColorStop(1,   color);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle    = body;
  ctx.shadowColor  = color;
  ctx.shadowBlur   = r * 1.5;
  ctx.fill();
  ctx.shadowBlur   = 0;
};

const drawFlash = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  intensity: number,    // 0..1, brightness factor
  flashColor: string,
  maxR: number,
) => {
  const cr = parseInt(flashColor.slice(1, 3), 16);
  const cg = parseInt(flashColor.slice(3, 5), 16);
  const cb = parseInt(flashColor.slice(5, 7), 16);

  // Bright flash core
  const flashR = maxR * (0.20 + intensity * 0.40);
  const flash = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashR);
  flash.addColorStop(0,   `rgba(${cr},${cg},${cb},${0.9 * intensity})`);
  flash.addColorStop(0.4, `rgba(${cr},${cg},${cb},${0.5 * intensity})`);
  flash.addColorStop(1,   "transparent");
  ctx.beginPath();
  ctx.arc(cx, cy, flashR, 0, Math.PI * 2);
  ctx.fillStyle = flash;
  ctx.fill();

  // Spike rays
  const numRays = 8;
  ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.6 * intensity})`;
  ctx.lineWidth   = 1;
  for (let i = 0; i < numRays; i++) {
    const a = (i / numRays) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * flashR * 1.4, cy + Math.sin(a) * flashR * 1.4);
    ctx.stroke();
  }
};

const drawShockwave = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  expansionT: number,    // 0..1
  shellColor: string,
  maxR: number,
) => {
  const cr = parseInt(shellColor.slice(1, 3), 16);
  const cg = parseInt(shellColor.slice(3, 5), 16);
  const cb = parseInt(shellColor.slice(5, 7), 16);

  const shellR    = maxR * expansionT;
  const fade      = 1 - expansionT;     // shell fades as it expands
  const thickness = maxR * 0.06 + maxR * 0.10 * (1 - expansionT);

  // Bright ring at the leading edge
  const innerR = Math.max(0, shellR - thickness);
  const ring   = ctx.createRadialGradient(cx, cy, innerR, cx, cy, shellR + thickness * 0.5);
  ring.addColorStop(0,   `rgba(${cr},${cg},${cb},0)`);
  ring.addColorStop(0.6, `rgba(${cr},${cg},${cb},${0.6 * fade})`);
  ring.addColorStop(0.85,`rgba(255,240,200,${0.7 * fade})`);
  ring.addColorStop(1,   `rgba(${cr},${cg},${cb},0)`);
  ctx.beginPath();
  ctx.arc(cx, cy, shellR + thickness * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = ring;
  ctx.fill();

  // Inner glow (cooling ejecta)
  if (expansionT > 0.15) {
    const inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, shellR);
    inner.addColorStop(0,   `rgba(${cr},${cg},${cb},${0.18 * fade})`);
    inner.addColorStop(1,   "transparent");
    ctx.beginPath();
    ctx.arc(cx, cy, shellR, 0, Math.PI * 2);
    ctx.fillStyle = inner;
    ctx.fill();
  }
};

const drawRemnant = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string, t: number,
) => {
  if (color === "#020308") {
    // Black hole — accretion ring + dark core
    const ringR = r * 2.5;
    const ringGrad = ctx.createRadialGradient(cx, cy, r * 1.2, cx, cy, ringR);
    ringGrad.addColorStop(0,   "rgba(255,200,120,0.7)");
    ringGrad.addColorStop(0.5, "rgba(255,140,60,0.4)");
    ringGrad.addColorStop(1,   "transparent");
    ctx.beginPath();
    ctx.ellipse(cx, cy, ringR, ringR * 0.4, 0, 0, Math.PI * 2);
    ctx.fillStyle = ringGrad;
    ctx.fill();

    // Event horizon
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    // Neutron star — bright pulsar with subtle pulse
    const pulse = 0.85 + 0.15 * Math.sin(t * 0.08);
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 5);
    halo.addColorStop(0,   `rgba(255,255,255,${0.7 * pulse})`);
    halo.addColorStop(0.5, "rgba(180,220,255,0.18)");
    halo.addColorStop(1,   "transparent");
    ctx.beginPath();
    ctx.arc(cx, cy, r * 5, 0, Math.PI * 2);
    ctx.fillStyle = halo;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle    = "#FFFFFF";
    ctx.shadowColor  = "rgba(255,255,255,1)";
    ctx.shadowBlur   = r * 4;
    ctx.fill();
    ctx.shadowBlur   = 0;
  }
};

const drawPanel = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  sn: SNType,
  t: number,
) => {
  const cx       = x + w / 2;
  const labelH   = 50;
  const diagramH = h - labelH;
  const cy       = y + diagramH / 2;
  const maxR     = Math.min(w, diagramH) * 0.5 - 10;
  const shellMax = maxR * sn.shellMaxFactor;

  // Cycle: 0..1 over CYCLE_FRAMES
  const CYCLE_FRAMES = 360;
  const phase = (((t + sn.cycleOffset) % CYCLE_FRAMES) + CYCLE_FRAMES) % CYCLE_FRAMES / CYCLE_FRAMES;

  // Phase breakdown:
  //   0.00 – 0.15  Progenitor stable
  //   0.15 – 0.20  Flash (rapid brightening)
  //   0.20 – 0.95  Shockwave expanding (with remnant if any)
  //   0.95 – 1.00  Cooldown / reset
  if (phase < 0.15) {
    drawProgenitor(ctx, cx, cy, sn.progenitorR, sn.progenitorColor);
  } else if (phase < 0.20) {
    const flashT = (phase - 0.15) / 0.05;       // 0..1
    drawProgenitor(ctx, cx, cy, sn.progenitorR * (1 - flashT), sn.progenitorColor);
    drawFlash(ctx, cx, cy, flashT * sn.energy, sn.flashColor, shellMax);
  } else if (phase < 0.95) {
    const expT = (phase - 0.20) / 0.75;
    drawShockwave(ctx, cx, cy, expT, sn.shellColor, shellMax);
    // Remnant appears after a brief delay
    if (sn.remnantColor && expT > 0.10) {
      drawRemnant(ctx, cx, cy, sn.remnantR, sn.remnantColor, t);
    }
  } else {
    // Cooldown — faded shell, remnant if any
    if (sn.remnantColor) {
      drawRemnant(ctx, cx, cy, sn.remnantR, sn.remnantColor, t);
    }
  }

  // ── Labels ────────────────────────────────────────────────────────────────
  const labelY = y + diagramH;
  ctx.font      = "bold 11px 'Jura', monospace";
  ctx.fillStyle = sn.accent;
  ctx.textAlign = "center";
  ctx.fillText(sn.name, cx, labelY + 12);

  ctx.font      = "8px 'Jura', monospace";
  ctx.fillStyle = "rgba(180,180,180,0.55)";
  ctx.fillText(sn.trigger, cx, labelY + 26);

  // Outcome tag
  const outcomeText = sn.remnantColor === null
    ? "→ NO REMNANT"
    : sn.remnantColor === "#020308"
    ? "→ BLACK HOLE"
    : "→ NEUTRON STAR";
  const outcomeColor = sn.remnantColor === null
    ? "rgba(255,200,120,0.55)"
    : sn.remnantColor === "#020308"
    ? "rgba(180,140,255,0.55)"
    : "rgba(180,220,255,0.55)";
  ctx.font      = "7px 'Jura', monospace";
  ctx.fillStyle = outcomeColor;
  ctx.fillText(outcomeText, cx, labelY + 38);
};

export default function SupernovaeSimulation() {
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
        const rows = TYPES.length;
        const rowH = ph / rows;
        TYPES.forEach((sn, i) => {
          drawPanel(ctx, px, py + i * rowH, pw, rowH, sn, t);
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
        const cols = TYPES.length;
        const colW = pw / cols;
        TYPES.forEach((sn, i) => {
          drawPanel(ctx, px + i * colW, py, colW, ph, sn, t);
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
