"use client";

import { useEffect, useRef } from "react";

// ── Alcubierre warp parameters ───────────────────────────────────────────────
const GRID_SPACING    = 28;
const WARP_SIGMA_LONG = 60;     // Gaussian width along bubble motion
const WARP_SIGMA_LAT  = 60;     // Gaussian width perpendicular
const WARP_AMPLITUDE  = 26;     // Pixel displacement at bubble centre
const BUBBLE_R_MAJOR  = 38;
const BUBBLE_R_MINOR  = 22;
const BUBBLE_SPEED    = 1.0;

// ── Wormhole parameters ─────────────────────────────────────────────────────
const MOUTH_R         = 32;
const TRANSIT_FRAMES  = 320;
const TWO_PI          = Math.PI * 2;

type Star = { x: number; y: number; size: number; tint: string };

export default function WarpWormholesSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);

  const bubbleX      = useRef<number>(-BUBBLE_R_MAJOR);
  const localStars   = useRef<Star[]>([]);
  const destStarsA   = useRef<Star[]>([]);
  const destStarsB   = useRef<Star[]>([]);
  const transitFrame = useRef<number>(0);
  const swirlPhase   = useRef<number>(0);

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

      const tints = ["#FFFFFF", "#DCEAFF", "#FFEAC8", "#E8D8FF"];
      localStars.current = Array.from({ length: 70 }, () => ({
        x:    Math.random(),
        y:    Math.random(),
        size: Math.random() * 0.9 + 0.3,
        tint: tints[Math.floor(Math.random() * tints.length)],
      }));
      destStarsA.current = Array.from({ length: 35 }, () => ({
        x:    Math.random(),
        y:    Math.random(),
        size: Math.random() * 0.9 + 0.4,
        tint: ["#FFD8A0", "#FFEFC8", "#FFC890"][Math.floor(Math.random() * 3)],
      }));
      destStarsB.current = Array.from({ length: 35 }, () => ({
        x:    Math.random(),
        y:    Math.random(),
        size: Math.random() * 0.9 + 0.4,
        tint: ["#A8D0FF", "#C8E0FF", "#90B8FF"][Math.floor(Math.random() * 3)],
      }));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    // ── Drawing helpers ───────────────────────────────────────────────────────

    const warpDx = (gx: number, gy: number, bx: number, by: number) => {
      const dx = gx - bx;
      const dy = gy - by;
      const lat = Math.exp(-(dy * dy) / (2 * WARP_SIGMA_LAT  * WARP_SIGMA_LAT));
      const lng = Math.exp(-(dx * dx) / (2 * WARP_SIGMA_LONG * WARP_SIGMA_LONG));
      return -WARP_AMPLITUDE * lng * lat;
    };

    const drawWarpGrid = (
      pl: number, pt: number, pw: number, ph: number,
      bx: number, by: number,
    ) => {
      ctx.strokeStyle = "rgba(80,140,200,0.18)";
      ctx.lineWidth   = 1;

      // Vertical lines
      for (let x0 = pl - GRID_SPACING; x0 < pl + pw + GRID_SPACING; x0 += GRID_SPACING) {
        ctx.beginPath();
        let first = true;
        for (let y = pt; y <= pt + ph; y += 5) {
          const rx = x0 + warpDx(x0, y, bx, by);
          if (first) { ctx.moveTo(rx, y); first = false; }
          else       { ctx.lineTo(rx, y); }
        }
        ctx.stroke();
      }

      // Horizontal lines
      for (let y0 = pt - GRID_SPACING; y0 <= pt + ph + GRID_SPACING; y0 += GRID_SPACING) {
        ctx.beginPath();
        let first = true;
        for (let x = pl - GRID_SPACING; x <= pl + pw + GRID_SPACING; x += 5) {
          const rx = x + warpDx(x, y0, bx, by);
          if (first) { ctx.moveTo(rx, y0); first = false; }
          else       { ctx.lineTo(rx, y0); }
        }
        ctx.stroke();
      }
    };

    const drawBubble = (cx: number, cy: number) => {
      // Outer halo
      const halo = ctx.createRadialGradient(cx, cy, BUBBLE_R_MINOR, cx, cy, BUBBLE_R_MAJOR + 14);
      halo.addColorStop(0, "rgba(120,200,255,0.18)");
      halo.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.ellipse(cx, cy, BUBBLE_R_MAJOR + 14, BUBBLE_R_MINOR + 12, 0, 0, TWO_PI);
      ctx.fillStyle = halo;
      ctx.fill();

      // Bubble shell
      ctx.beginPath();
      ctx.ellipse(cx, cy, BUBBLE_R_MAJOR, BUBBLE_R_MINOR, 0, 0, TWO_PI);
      ctx.strokeStyle = "rgba(140,220,255,0.65)";
      ctx.lineWidth   = 1.4;
      ctx.stroke();

      // Inner hint
      ctx.beginPath();
      ctx.ellipse(cx, cy, BUBBLE_R_MAJOR * 0.7, BUBBLE_R_MINOR * 0.7, 0, 0, TWO_PI);
      ctx.strokeStyle = "rgba(140,220,255,0.20)";
      ctx.lineWidth   = 1;
      ctx.stroke();
    };

    const drawShip = (cx: number, cy: number, angle: number, scale = 1, alpha = 1) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo( 9 * scale,  0);
      ctx.lineTo(-6 * scale,  4 * scale);
      ctx.lineTo(-3 * scale,  0);
      ctx.lineTo(-6 * scale, -4 * scale);
      ctx.closePath();
      ctx.fillStyle   = "rgba(255,240,200,0.95)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,200,120,0.90)";
      ctx.lineWidth   = 0.8;
      ctx.stroke();
      ctx.restore();
    };

    const drawStarsBg = (
      pl: number, pt: number, pw: number, ph: number, stars: Star[],
    ) => {
      ctx.fillStyle = "rgba(8,10,22,0.45)";
      ctx.fillRect(pl, pt, pw, ph);

      stars.forEach((s) => {
        const sx = pl + s.x * pw;
        const sy = pt + s.y * ph;
        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, TWO_PI);
        ctx.fillStyle = s.tint;
        ctx.fill();
      });
    };

    const drawMouth = (
      cx: number, cy: number, r: number,
      stars: Star[], swirl: number,
    ) => {
      // Outer violet halo
      const halo = ctx.createRadialGradient(cx, cy, r, cx, cy, r * 1.7);
      halo.addColorStop(0, "rgba(180,140,255,0.45)");
      halo.addColorStop(0.5, "rgba(180,140,255,0.18)");
      halo.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.7, 0, TWO_PI);
      ctx.fillStyle = halo;
      ctx.fill();

      // Interior — different starfield (the destination)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TWO_PI);
      ctx.clip();

      ctx.fillStyle = "rgba(15,5,35,0.95)";
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      // Stars on the other side, slightly rotated to suggest motion through the throat
      const cosS = Math.cos(swirl);
      const sinS = Math.sin(swirl);
      stars.forEach((s) => {
        const ux = (s.x - 0.5) * 2;
        const uy = (s.y - 0.5) * 2;
        const rx =  ux * cosS - uy * sinS;
        const ry =  ux * sinS + uy * cosS;
        const sx = cx + rx * r * 1.05;
        const sy = cy + ry * r * 1.05;
        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, TWO_PI);
        ctx.fillStyle = s.tint;
        ctx.fill();
      });

      ctx.restore();

      // Outer rim
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TWO_PI);
      ctx.strokeStyle = "rgba(180,140,255,0.75)";
      ctx.lineWidth   = 1.4;
      ctx.stroke();

      // Inner rim hint
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.92, 0, TWO_PI);
      ctx.strokeStyle = "rgba(180,140,255,0.30)";
      ctx.lineWidth   = 0.8;
      ctx.stroke();
    };

    const drawConnection = (m1x: number, m1y: number, m2x: number, m2y: number) => {
      ctx.beginPath();
      ctx.moveTo(m1x, m1y);
      const midX = (m1x + m2x) / 2;
      ctx.bezierCurveTo(midX, m1y - 40, midX, m2y + 40, m2x, m2y);
      ctx.strokeStyle = "rgba(180,140,255,0.20)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([2, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // ── Main loop ─────────────────────────────────────────────────────────────

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      const isStacked = w < 520;

      ctx.clearRect(0, 0, w, h);
      swirlPhase.current += 0.004;

      // Layout — side-by-side on wide, stacked top/bottom on narrow
      let warpL: number, warpT: number, warpW: number, warpH: number;
      let wormL: number, wormT: number, wormW: number, wormH: number;
      if (isStacked) {
        warpL = 0; warpT = 0;       warpW = w; warpH = h * 0.5;
        wormL = 0; wormT = h * 0.5; wormW = w; wormH = h * 0.5;
      } else {
        warpL = 0;       warpT = 0; warpW = w * 0.5; warpH = h;
        wormL = w * 0.5; wormT = 0; wormW = w * 0.5; wormH = h;
      }

      // Divider
      ctx.beginPath();
      if (isStacked) {
        ctx.moveTo(w * 0.06, h * 0.5);
        ctx.lineTo(w * 0.94, h * 0.5);
      } else {
        ctx.moveTo(w * 0.5, h * 0.06);
        ctx.lineTo(w * 0.5, h * 0.94);
      }
      ctx.strokeStyle = "rgba(100,140,200,0.10)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── ALCUBIERRE WARP scene ──────────────────────────────────────────────
      drawStarsBg(warpL, warpT, warpW, warpH, localStars.current);

      bubbleX.current += BUBBLE_SPEED;
      if (bubbleX.current > warpL + warpW + BUBBLE_R_MAJOR + 10) {
        bubbleX.current = warpL - BUBBLE_R_MAJOR - 10;
      }
      const bx = bubbleX.current;
      const by = warpT + warpH * 0.5;

      drawWarpGrid(warpL, warpT, warpW, warpH, bx, by);
      drawBubble(bx, by);
      drawShip(bx, by, 0, 1.3, 1);

      ctx.font      = "10px 'Jura', monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(140,220,255,0.65)";
      ctx.fillText("ALCUBIERRE WARP DRIVE", warpL + 14, warpT + 18);
      ctx.fillStyle = "rgba(140,140,140,0.45)";
      ctx.fillText(
        isStacked ? "COMPRESSED AHEAD, EXPANDED BEHIND" : "SPACETIME COMPRESSED AHEAD, EXPANDED BEHIND",
        warpL + 14, warpT + 32,
      );

      ctx.font      = "8px 'Jura', monospace";
      ctx.fillStyle = "rgba(140,220,255,0.55)";
      ctx.fillText(
        isStacked ? "INTERIOR IS LOCALLY FLAT" : "BUBBLE SURFS THE METRIC — INTERIOR IS LOCALLY FLAT",
        warpL + 14, warpT + warpH - 10,
      );

      // ── WORMHOLE scene ─────────────────────────────────────────────────────
      drawStarsBg(wormL, wormT, wormW, wormH, localStars.current);

      const m1x = wormL + wormW * 0.26;
      const m1y = wormT + wormH * 0.32;
      const m2x = wormL + wormW * 0.74;
      const m2y = wormT + wormH * 0.68;

      drawConnection(m1x, m1y, m2x, m2y);

      drawMouth(m1x, m1y, MOUTH_R, destStarsA.current,  swirlPhase.current);
      drawMouth(m2x, m2y, MOUTH_R, destStarsB.current, -swirlPhase.current);

      // Ship transit — phased animation around both mouths
      transitFrame.current = (transitFrame.current + 1) % TRANSIT_FRAMES;
      const phase = transitFrame.current / TRANSIT_FRAMES;

      const startX = wormL + wormW * 0.05;
      const startY = wormT + wormH * 0.15;
      const endX   = wormL + wormW * 0.95;
      const endY   = wormT + wormH * 0.85;

      let sx = 0, sy = 0, sa = 0, sang = 0;
      if (phase < 0.35) {
        const p = phase / 0.35;
        sx   = startX + (m1x - startX) * p;
        sy   = startY + (m1y - startY) * p;
        sa   = 1;
        sang = Math.atan2(m1y - startY, m1x - startX);
      } else if (phase < 0.45) {
        const p = (phase - 0.35) / 0.10;
        sx   = m1x;
        sy   = m1y;
        sa   = 1 - p;
        sang = Math.atan2(m1y - startY, m1x - startX);
      } else if (phase < 0.55) {
        sa = 0; // in transit
      } else if (phase < 0.65) {
        const p = (phase - 0.55) / 0.10;
        sx   = m2x;
        sy   = m2y;
        sa   = p;
        sang = Math.atan2(endY - m2y, endX - m2x);
      } else {
        const p = (phase - 0.65) / 0.35;
        sx   = m2x + (endX - m2x) * p;
        sy   = m2y + (endY - m2y) * p;
        sa   = 1;
        sang = Math.atan2(endY - m2y, endX - m2x);
      }
      if (sa > 0.01) drawShip(sx, sy, sang, 1.2, sa);

      // Mouth labels
      ctx.font      = "8px 'Jura', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(180,140,255,0.65)";
      ctx.fillText(isStacked ? "MOUTH A" : "MOUTH A — HERE",          m1x, m1y - MOUTH_R - 8);
      ctx.fillText(isStacked ? "MOUTH B" : "MOUTH B — DESTINATION", m2x, m2y + MOUTH_R + 14);

      ctx.font      = "10px 'Jura', monospace";
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(180,140,255,0.65)";
      ctx.fillText("EINSTEIN-ROSEN BRIDGE", wormL + wormW - 14, wormT + 18);
      ctx.fillStyle = "rgba(140,140,140,0.45)";
      ctx.fillText(
        isStacked ? "ONE TOPOLOGICAL THROAT" : "TWO MOUTHS, ONE TOPOLOGICAL THROAT",
        wormL + wormW - 14, wormT + 32,
      );

      ctx.font      = "8px 'Jura', monospace";
      ctx.fillStyle = "rgba(180,140,255,0.55)";
      ctx.fillText(
        isStacked ? "REQUIRES EXOTIC MATTER" : "MORRIS-THORNE THROAT REQUIRES EXOTIC MATTER",
        wormL + wormW - 14, wormT + wormH - 10,
      );

      // ── Bottom centre disclaimer ────────────────────────────────────────────
      ctx.font      = "9px 'Jura', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(100,160,220,0.45)";
      ctx.fillText(
        isStacked
          ? "BOTH REQUIRE NEGATIVE ENERGY DENSITY"
          : "BOTH ARE GR-VALID SOLUTIONS — BOTH REQUIRE NEGATIVE ENERGY DENSITY",
        w * 0.5, h - 2,
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
