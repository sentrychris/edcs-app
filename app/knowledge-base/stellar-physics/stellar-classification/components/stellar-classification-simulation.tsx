"use client";

import { useEffect, useRef } from "react";

// ── Star data ─────────────────────────────────────────────────────────────────
// displayR values are relative — scaled to fit canvas at runtime.
const STAR_CLASSES = [
  {
    class: "O",
    color: "#9BB0FF",
    glow:  "rgba(155,176,255,0.55)",
    label: "O-TYPE",
    labelOffset: 6,
    temp:  ">30,000 K",
    mass:  ">16 M☉",
    displayR: 56,
    pulseSpeed: 0.016,
    pulseAmp: 0.025,
    scoopable: true,
  },
  {
    class: "B",
    color: "#AABFFF",
    glow:  "rgba(170,191,255,0.50)",
    label: "B-TYPE",
    labelOffset: 3,
    temp:  "10–30K K",
    mass:  "2–16 M☉",
    displayR: 42,
    pulseSpeed: 0.020,
    pulseAmp: 0.025,
    scoopable: true,
  },
  {
    class: "A",
    color: "#D8E2FF",
    glow:  "rgba(216,226,255,0.45)",
    label: "A-TYPE",
    labelOffset: 1.2,
    temp:  "7,500–10K K",
    mass:  "1.4–2 M☉",
    displayR: 31,
    pulseSpeed: 0.024,
    pulseAmp: 0.030,
    scoopable: true,
  },
  {
    class: "F",
    color: "#FFFDE0",
    glow:  "rgba(255,253,220,0.40)",
    label: "F-TYPE",
    labelOffset: 1,
    temp:  "6,000–7,500 K",
    mass:  "1.0–1.4 M☉",
    displayR: 23,
    pulseSpeed: 0.028,
    pulseAmp: 0.030,
    scoopable: true,
  },
  {
    class: "G",
    color: "#FFD580",
    glow:  "rgba(255,213,128,0.45)",
    label: "G-TYPE",
    labelOffset: 1,
    temp:  "5,200–6,000 K",
    mass:  "0.8–1.0 M☉",
    displayR: 18,
    pulseSpeed: 0.033,
    pulseAmp: 0.030,
    scoopable: true,
  },
  {
    class: "K",
    color: "#FFAF50",
    glow:  "rgba(255,175,80,0.45)",
    label: "K-TYPE",
    labelOffset: 1,
    temp:  "3,700–5,200 K",
    mass:  "0.45–0.8 M☉",
    displayR: 13,
    pulseSpeed: 0.038,
    pulseAmp: 0.035,
    scoopable: true,
  },
  {
    class: "M",
    color: "#FF6840",
    glow:  "rgba(255,104,64,0.45)",
    label: "M-TYPE",
    labelOffset: 1,
    temp:  "2,400–3,700 K",
    mass:  "0.08–0.45 M☉",
    displayR: 9,
    pulseSpeed: 0.044,
    pulseAmp: 0.040,
    scoopable: true,
  },
];

export default function StellarClassificationSimulation() {
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

    const drawStar = (
      cx: number, cy: number, r: number,
      color: string, glow: string,
    ) => {
      // Outer glow
      const grad = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 3.5);
      grad.addColorStop(0,   glow);
      grad.addColorStop(0.5, glow.replace(/[\d.]+\)$/, "0.12)"));
      grad.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Star body
      const bodyGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
      bodyGrad.addColorStop(0, "#ffffff");
      bodyGrad.addColorStop(0.3, color);
      bodyGrad.addColorStop(1, color);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.shadowColor = color;
      ctx.shadowBlur  = r * 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 1;

      const n = STAR_CLASSES.length;

      // Below this width the horizontal 7-up sequence squashes the stars and
      // overlaps the temperature/mass labels — fall back to a 2-column grid.
      const compact = w < 480;
      const maxR = STAR_CLASSES[0].displayR;

      // ── Temperature gradient backdrop ───────────────────────────────────
      // Horizontal in the desktop layout, vertical in compact mode (since
      // temperature progresses top-to-bottom there).
      const bgGrad = compact
        ? ctx.createLinearGradient(0, 0, 0, h)
        : ctx.createLinearGradient(0, 0, w, 0);
      bgGrad.addColorStop(0,   "rgba(100,120,255,0.04)");
      bgGrad.addColorStop(0.5, "rgba(255,255,240,0.02)");
      bgGrad.addColorStop(1,   "rgba(255,80,40,0.04)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      if (compact) {
        // ── 2-column grid layout (mobile) ─────────────────────────────────
        const cols   = 2;
        const rows   = Math.ceil(n / cols);
        const cellW  = w / cols;
        const cellH  = h / rows;
        // Reserve fixed bands at the top (class label) and bottom
        // (temp/mass/scoopable dot) of every cell, then size stars to fit
        // the remaining vertical space without overlapping either band.
        const TOP_BAND    = 22;
        const BOTTOM_BAND = 36;
        const innerH      = Math.max(0, cellH - TOP_BAND - BOTTOM_BAND);
        const scale       = Math.min(innerH / 2 / maxR, (cellW * 0.32) / maxR);

        STAR_CLASSES.forEach((star, i) => {
          const col     = i % cols;
          const row     = Math.floor(i / cols);
          const cellTop = row * cellH;
          const sx      = col * cellW + cellW / 2;
          const sy      = cellTop + TOP_BAND + innerH / 2;

          const pulse = 1 + Math.sin(timeRef.current * star.pulseSpeed + i) * star.pulseAmp;
          const r = star.displayR * scale * pulse;

          drawStar(sx, sy, r, star.color, star.glow);

          // Class label — anchored to top of cell
          ctx.font      = "bold 12px 'Jura', monospace";
          ctx.fillStyle = star.color;
          ctx.textAlign = "center";
          ctx.fillText(star.class, sx, cellTop + 14);

          // Temperature & mass — anchored to bottom of cell
          ctx.font      = "8px 'Jura', monospace";
          ctx.fillStyle = "rgba(180,180,180,0.55)";
          ctx.fillText(star.temp, sx, cellTop + cellH - 24);
          ctx.fillStyle = "rgba(120,160,200,0.45)";
          ctx.fillText(star.mass, sx, cellTop + cellH - 14);

          // Scoopable dot
          if (star.scoopable) {
            ctx.beginPath();
            ctx.arc(sx, cellTop + cellH - 5, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(80,200,120,0.6)";
            ctx.fill();
          }
        });

        // ── HOT → COOL axis (vertical in compact mode) ───────────────────
        ctx.font      = "9px 'Jura', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(100,140,220,0.35)";
        ctx.fillText("HOT", 6, 12);
        ctx.fillStyle = "rgba(220,100,80,0.35)";
        ctx.fillText("COOL", 6, h - 4);

        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      // ── Horizontal layout (desktop) ─────────────────────────────────────
      const colW   = w / (n + 1);
      const scale  = Math.min(1.0, (h * 0.26) / maxR);
      const baseline = h * 0.62;

      // ── Thin main-sequence baseline ─────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(colW * 0.5, baseline);
      ctx.lineTo(colW * (n + 0.5), baseline);
      ctx.strokeStyle = "rgba(100,150,200,0.08)";
      ctx.lineWidth   = 1;
      ctx.stroke();

      // ── Stars ────────────────────────────────────────────────────────────
      STAR_CLASSES.forEach((star, i) => {
        const x = colW * (i + 1);
        const pulse = 1 + Math.sin(timeRef.current * star.pulseSpeed + i) * star.pulseAmp;
        const r = star.displayR * scale * pulse;
        const cy = baseline - r;

        drawStar(x, cy, r, star.color, star.glow);

        // Spectral class label — above
        ctx.font      = `bold ${Math.max(9, 11 * scale)}px 'Jura', monospace`;
        ctx.fillStyle = star.color;
        ctx.textAlign = "center";
        ctx.fillText(star.class, x, baseline - star.displayR * scale * 1.15 - 28 * scale - 6 * star.labelOffset);

        // Thin tick
        ctx.beginPath();
        ctx.moveTo(x, baseline + 4);
        ctx.lineTo(x, baseline + 10);
        ctx.strokeStyle = `${star.color}44`;
        ctx.lineWidth   = 1;
        ctx.stroke();

        // Temperature label — below baseline
        ctx.font      = `${Math.max(7, 8 * Math.min(1, w / 520))}px 'Jura', monospace`;
        ctx.fillStyle = "rgba(180,180,180,0.55)";
        ctx.fillText(star.temp, x, baseline + 22);

        // Mass label
        ctx.fillStyle = "rgba(120,160,200,0.45)";
        ctx.fillText(star.mass, x, baseline + 36);

        // Scoopable dot
        if (star.scoopable) {
          ctx.beginPath();
          ctx.arc(x, baseline + 50, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(80,200,120,0.6)";
          ctx.fill();
        }
      });

      // ── Scoopable legend ─────────────────────────────────────────────────
      ctx.font      = `${Math.max(7, 8 * Math.min(1, w / 520))}px 'Jura', monospace`;
      ctx.fillStyle = "rgba(80,200,120,0.45)";
      ctx.textAlign = "left";
      ctx.fillText("● FUEL SCOOPABLE", 8, baseline + 52);

      // ── "HOT → COOL" axis label ──────────────────────────────────────────
      const arrowY = h * 0.12;
      ctx.font      = "9px 'Jura', monospace";
      ctx.fillStyle = "rgba(100,140,220,0.35)";
      ctx.textAlign = "left";
      ctx.fillText("HOT", 8, arrowY);
      ctx.fillStyle = "rgba(220,100,80,0.35)";
      ctx.textAlign = "right";
      ctx.fillText("COOL", w - 8, arrowY);
      ctx.beginPath();
      ctx.moveTo(30, arrowY - 4);
      ctx.lineTo(w - 30, arrowY - 4);
      const axisGrad = ctx.createLinearGradient(30, 0, w - 30, 0);
      axisGrad.addColorStop(0, "rgba(100,140,220,0.25)");
      axisGrad.addColorStop(1, "rgba(220,100,80,0.25)");
      ctx.strokeStyle = axisGrad;
      ctx.lineWidth   = 1;
      ctx.stroke();

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
