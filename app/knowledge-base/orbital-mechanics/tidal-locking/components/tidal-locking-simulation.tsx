"use client";

import { useEffect, useRef } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const ORBIT_R          = 68;
const ORBIT_SPEED      = 0.014;
const SPIN_UNLOCKED    = 0.037;   // ~2.6× orbit — clearly different

const PLANET_R         = 16;
const MOON_R           = 9;

// Moon hemisphere colours
const NEAR_COLOR  = "#D0BC88";   // bright, lit face
const FAR_COLOR   = "#2E2418";   // dark far side
const FEATURE_CLR = "rgba(90,70,45,0.75)";  // crater-like marking on near side

export default function TidalLockingSimulation() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const frameRef     = useRef<number>(0);
  const orbitAngle   = useRef({ left: Math.PI * 0.25, right: Math.PI * 0.25 });
  const spinAngle    = useRef({ left: 0, right: 0 });

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

    // ── Draw helpers ──────────────────────────────────────────────────────

    const drawPlanet = (cx: number, cy: number, r: number) => {
      const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
      grad.addColorStop(0, "#7080A8");
      grad.addColorStop(0.6, "#485878");
      grad.addColorStop(1, "#242E48");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowColor = "#506090";
      ctx.shadowBlur  = r;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawOrbitRing = (cx: number, cy: number, r: number) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(100,140,200,0.10)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([3, 7]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // Draw moon with a near-side / far-side split.
    // spinDir: angle the near side (bright half) faces.
    const drawMoon = (
      mx: number, my: number, r: number,
      spinDir: number,
    ) => {
      // Outer glow
      const glow = ctx.createRadialGradient(mx, my, r * 0.5, mx, my, r * 3);
      glow.addColorStop(0, "rgba(210,190,130,0.20)");
      glow.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(mx, my, r * 3, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(spinDir);

      // Clip to moon disc
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.clip();

      // Far side (full disc, dark)
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = FAR_COLOR;
      ctx.fill();

      // Near side (right half — +x direction = spinDir after rotate)
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
      ctx.closePath();
      ctx.fillStyle = NEAR_COLOR;
      ctx.fill();

      // Subtle limb gradient over both halves
      const limb = ctx.createRadialGradient(-r * 0.1, -r * 0.1, r * 0.4, 0, 0, r);
      limb.addColorStop(0, "rgba(255,255,240,0.10)");
      limb.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = limb;
      ctx.fill();

      // Feature dot on near side (crater-like)
      ctx.beginPath();
      ctx.arc(r * 0.38, -r * 0.15, r * 0.14, 0, Math.PI * 2);
      ctx.fillStyle = FEATURE_CLR;
      ctx.fill();

      ctx.restore();

      // Outline
      ctx.beginPath();
      ctx.arc(mx, my, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(180,160,110,0.25)";
      ctx.lineWidth   = 0.5;
      ctx.stroke();
    };

    // Small label next to the moon's near/far sides
    const drawFaceLabels = (
      mx: number, my: number, r: number, spinDir: number,
    ) => {
      const nearX = mx + Math.cos(spinDir) * (r + 14);
      const nearY = my + Math.sin(spinDir) * (r + 14);
      const farX  = mx - Math.cos(spinDir) * (r + 14);
      const farY  = my - Math.sin(spinDir) * (r + 14);

      ctx.font      = "8px 'Jura', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(210,190,130,0.60)";
      ctx.fillText("NEAR", nearX, nearY + 3);
      ctx.fillStyle = "rgba(100,90,70,0.45)";
      ctx.fillText("FAR", farX, farY + 3);
    };

    // ── Main loop ─────────────────────────────────────────────────────────

    const tick = () => {
      const w  = canvas.width;
      const h  = canvas.height;
      const lx = w * 0.27;   // left system centre
      const rx = w * 0.73;   // right system centre
      const cy = h * 0.5;

      const scale = Math.min(w * 0.4, h * 0.8) / 2 / (ORBIT_R + 24);

      ctx.clearRect(0, 0, w, h);

      // Advance angles
      orbitAngle.current.left  += ORBIT_SPEED;
      orbitAngle.current.right += ORBIT_SPEED;
      spinAngle.current.left   += SPIN_UNLOCKED;
      // Locked: spin equals orbit so near side faces planet
      // Near side faces planet = in direction (orbitAngle + π) from moon center
      spinAngle.current.right = orbitAngle.current.right + Math.PI;

      const oa = orbitAngle.current;
      const sa = spinAngle.current;

      // Moon world positions
      const lmx = lx + Math.cos(oa.left)  * ORBIT_R * scale;
      const lmy = cy + Math.sin(oa.left)  * ORBIT_R * scale;
      const rmx = rx + Math.cos(oa.right) * ORBIT_R * scale;
      const rmy = cy + Math.sin(oa.right) * ORBIT_R * scale;

      // ── Divider ─────────────────────────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.08);
      ctx.lineTo(w * 0.5, h * 0.92);
      ctx.strokeStyle = "rgba(100,140,200,0.08)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Section labels ───────────────────────────────────────────────────
      ctx.font      = "10px 'Jura', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(180,140,80,0.50)";
      ctx.fillText("UNLOCKED", lx, h * 0.10);
      ctx.fillStyle = "rgba(80,200,140,0.55)";
      ctx.fillText("TIDALLY LOCKED", rx, h * 0.10);

      ctx.font      = "8px 'Jura', monospace";
      ctx.fillStyle = "rgba(140,140,140,0.35)";
      ctx.fillText("ROTATION ≠ ORBITAL PERIOD", lx, h * 0.10 + 14);
      ctx.fillStyle = "rgba(140,140,140,0.35)";
      ctx.fillText("ROTATION = ORBITAL PERIOD", rx, h * 0.10 + 14);

      // ── Left system — unlocked ───────────────────────────────────────────
      drawOrbitRing(lx, cy, ORBIT_R * scale);
      drawPlanet(lx, cy, PLANET_R * scale);
      drawMoon(lmx, lmy, MOON_R * scale, sa.left);

      // ── Right system — tidally locked ────────────────────────────────────
      drawOrbitRing(rx, cy, ORBIT_R * scale);
      drawPlanet(rx, cy, PLANET_R * scale);
      drawMoon(rmx, rmy, MOON_R * scale, sa.right);
      drawFaceLabels(rmx, rmy, MOON_R * scale, sa.right);

      // ── Bottom note ──────────────────────────────────────────────────────
      ctx.font      = "9px 'Jura', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(100,160,220,0.35)";
      ctx.fillText(
        "LIGHT HEMISPHERE — NEAR SIDE  ·  DARK HEMISPHERE — FAR SIDE",
        w * 0.5, h - 14,
      );

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
