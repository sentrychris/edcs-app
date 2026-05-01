"use client";

import { useEffect, useRef } from "react";

// ── Physics ──────────────────────────────────────────────────────────────────
// Pixel-speed of light. Photon path-length per frame, in pixels.
const C_PX        = 4;
// Velocity as fraction of c. 0.866c gives γ = 2 exactly — moving clock ticks at half rate.
const V_OVER_C    = 0.866;
const GAMMA       = 1 / Math.sqrt(1 - V_OVER_C * V_OVER_C);

// Light clock geometry (proper height between mirrors, in pixels)
const CLOCK_H     = 90;
const CLOCK_W     = 32;   // hull width

// Velocity components in lab frame: photon speed is still c, but split between x and y.
const VX_LAB      = V_OVER_C * C_PX;
const VY_LAB      = Math.sqrt(C_PX * C_PX - VX_LAB * VX_LAB);   // = C_PX / GAMMA

// Trail length (frames retained for the photon's path)
const TRAIL_LEN   = 90;

type Pt = { x: number; y: number };

export default function SpecialRelativitySimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);

  // Rest-frame photon: bounces vertically inside its clock
  const restPhoton = useRef({ y: 0, vy: C_PX, ticks: 0 });

  // Lab-frame photon: bounces vertically (relative to ship) but ship translates horizontally
  const labShipX   = useRef(0);
  const labPhoton  = useRef({ y: 0, vy: VY_LAB, ticks: 0 });
  const labTrail   = useRef<Pt[]>([]);
  const restTrail  = useRef<Pt[]>([]);

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

    // ── Drawing helpers ───────────────────────────────────────────────────────

    const drawShipHull = (cx: number, topY: number, botY: number) => {
      const halfW = CLOCK_W / 2;
      ctx.strokeStyle = "rgba(120,170,220,0.45)";
      ctx.lineWidth   = 1;

      // Side walls
      ctx.beginPath();
      ctx.moveTo(cx - halfW, topY);
      ctx.lineTo(cx - halfW, botY);
      ctx.moveTo(cx + halfW, topY);
      ctx.lineTo(cx + halfW, botY);
      ctx.stroke();

      // Mirror plates (top and bottom)
      const mw = CLOCK_W * 0.95;
      ctx.strokeStyle = "rgba(180,210,240,0.65)";
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.moveTo(cx - mw / 2, topY);
      ctx.lineTo(cx + mw / 2, topY);
      ctx.moveTo(cx - mw / 2, botY);
      ctx.lineTo(cx + mw / 2, botY);
      ctx.stroke();

      // Subtle inner glow
      const grad = ctx.createLinearGradient(cx - halfW, 0, cx + halfW, 0);
      grad.addColorStop(0, "rgba(80,130,200,0.04)");
      grad.addColorStop(0.5, "rgba(120,170,220,0.10)");
      grad.addColorStop(1, "rgba(80,130,200,0.04)");
      ctx.fillStyle = grad;
      ctx.fillRect(cx - halfW, topY, CLOCK_W, botY - topY);
    };

    const drawPhoton = (x: number, y: number) => {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 10);
      glow.addColorStop(0, "rgba(255,240,180,0.95)");
      glow.addColorStop(0.4, "rgba(255,200,120,0.55)");
      glow.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = "#FFE9B0";
      ctx.fill();
    };

    const drawTrail = (trail: Pt[], color: string) => {
      if (trail.length < 2) return;
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        const alpha = (i / trail.length) * 0.55;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${color},${alpha.toFixed(3)})`;
        ctx.lineWidth   = 1;
        ctx.stroke();
      }
    };

    const drawTickerBar = (
      cx: number, y: number, ticks: number, label: string, accent: string,
    ) => {
      const text = `${label}  ${ticks.toString().padStart(3, "0")}`;
      ctx.font      = "11px 'Jura', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = accent;
      ctx.fillText(text, cx, y);
    };

    // ── Tick advancement ──────────────────────────────────────────────────────

    const stepRest = (topY: number, botY: number) => {
      const p = restPhoton.current;
      p.y += p.vy;
      if (p.y >= botY) { p.y = botY; p.vy = -C_PX; }
      if (p.y <= topY) { p.y = topY; p.vy = +C_PX; p.ticks += 1; }
    };

    const stepLab = (topY: number, botY: number) => {
      const p = labPhoton.current;
      p.y += p.vy;
      if (p.y >= botY) { p.y = botY; p.vy = -VY_LAB; }
      if (p.y <= topY) { p.y = topY; p.vy = +VY_LAB; p.ticks += 1; }
    };

    // ── Main loop ─────────────────────────────────────────────────────────────

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Layout: top half = rest frame, bottom half = lab frame
      const halfH    = h / 2;
      const restMidY = halfH * 0.5;
      const labMidY  = halfH + halfH * 0.5;

      const restTopY = restMidY - CLOCK_H / 2;
      const restBotY = restMidY + CLOCK_H / 2;
      const labTopY  = labMidY  - CLOCK_H / 2;
      const labBotY  = labMidY  + CLOCK_H / 2;

      // Initialise photon Y positions on first tick
      if (restPhoton.current.y === 0) restPhoton.current.y = restTopY;
      if (labPhoton.current.y  === 0) labPhoton.current.y  = labTopY;

      // ── Centre divider ──────────────────────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(0, halfH);
      ctx.lineTo(w, halfH);
      ctx.strokeStyle = "rgba(100,140,200,0.10)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Frame labels (shortened on narrow viewports) ───────────────────────
      const narrow = w < 520;
      ctx.font      = "10px 'Jura', monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(80,200,140,0.55)";
      ctx.fillText("REST FRAME — v = 0", 14, 18);
      ctx.fillStyle = "rgba(140,140,140,0.40)";
      ctx.fillText(narrow ? "VERTICAL BOUNCE" : "PHOTON BOUNCES STRAIGHT UP AND DOWN", 14, 32);

      ctx.fillStyle = "rgba(220,160,80,0.60)";
      ctx.fillText(
        narrow ? `LAB — v = ${V_OVER_C.toFixed(2)}c` : `LAB FRAME — v = ${V_OVER_C.toFixed(3)} c`,
        14, halfH + 18,
      );
      ctx.fillStyle = "rgba(140,140,140,0.40)";
      ctx.fillText(
        narrow ? "DIAGONAL — LONGER PATH" : "PHOTON TRAVELS DIAGONALLY — LONGER PATH PER TICK",
        14, halfH + 32,
      );

      // ── REST FRAME ──────────────────────────────────────────────────────────
      const restCx = w * 0.5;
      stepRest(restTopY, restBotY);

      // Trail (vertical line — barely visible but for completeness)
      restTrail.current.push({ x: restCx, y: restPhoton.current.y });
      if (restTrail.current.length > TRAIL_LEN) restTrail.current.shift();
      drawTrail(restTrail.current, "180,230,255");

      drawShipHull(restCx, restTopY, restBotY);
      drawPhoton(restCx, restPhoton.current.y);
      drawTickerBar(
        restCx, restBotY + 30,
        restPhoton.current.ticks, "TICKS",
        "rgba(180,230,255,0.75)",
      );

      // ── LAB FRAME ───────────────────────────────────────────────────────────
      // Ship translates horizontally, wraps around panel
      labShipX.current += VX_LAB;
      if (labShipX.current > w + CLOCK_W) {
        labShipX.current = -CLOCK_W;
        labTrail.current = [];
      }
      stepLab(labTopY, labBotY);

      // Trail records lab-frame photon position (zigzag)
      labTrail.current.push({ x: labShipX.current, y: labPhoton.current.y });
      if (labTrail.current.length > TRAIL_LEN) labTrail.current.shift();
      drawTrail(labTrail.current, "255,200,140");

      drawShipHull(labShipX.current, labTopY, labBotY);
      drawPhoton(labShipX.current, labPhoton.current.y);
      drawTickerBar(
        Math.max(60, Math.min(w - 60, labShipX.current)), labBotY + 30,
        labPhoton.current.ticks, "TICKS",
        "rgba(255,200,140,0.75)",
      );

      // ── γ readout ───────────────────────────────────────────────────────────
      ctx.textAlign = "right";
      ctx.font      = "10px 'Jura', monospace";
      ctx.fillStyle = "rgba(140,140,140,0.50)";
      ctx.fillText(`γ = ${GAMMA.toFixed(2)}`, w - 14, 18);
      ctx.fillText(narrow ? "γ× SLOWER" : "LAB CLOCK TICKS γ× SLOWER", w - 14, 32);

      const ratio =
        labPhoton.current.ticks === 0
          ? "—"
          : (restPhoton.current.ticks / Math.max(1, labPhoton.current.ticks)).toFixed(2);
      ctx.fillStyle = "rgba(140,140,140,0.50)";
      ctx.fillText(
        narrow ? `RATIO  ${ratio}` : `REST / LAB TICK RATIO  ${ratio}`,
        w - 14, halfH + 18,
      );
      ctx.fillStyle = "rgba(140,140,140,0.40)";
      ctx.fillText(narrow ? "→ γ" : "(SETTLES TOWARD γ)", w - 14, halfH + 32);

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
