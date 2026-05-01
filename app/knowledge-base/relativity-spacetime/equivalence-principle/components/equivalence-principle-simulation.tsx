"use client";

import { useEffect, useRef } from "react";

// ── Physics ──────────────────────────────────────────────────────────────────
const G_PX           = 0.045;        // Effective "gravity" / acceleration (px/frame²)
const BEAM_VX        = 3.6;          // Horizontal pixel-speed of light beam
const TRAIL_LEN      = 80;

// ── Elevator geometry (local interior coordinates) ───────────────────────────
const ELEV_W         = 96;
const ELEV_H         = 200;
const WALL_T         = 6;

// Ball
const BALL_R         = 5;
const BALL_RESET_FR  = 60;           // Pause frames after ball hits floor

// Beam
const BEAM_GAP_FR    = 50;           // Pause frames between beam emissions
const BEAM_START_Y   = 36;           // Entry y, from elevator top

// Right-scene background
const STAR_COUNT     = 70;
const STAR_BASE_SPD  = 3.0;

type Star = { x: number; y: number; sz: number; speedRel: number };
type Pt   = { x: number; y: number };

export default function EquivalencePrincipleSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);

  // Single physics state — drawn identically inside both elevators
  const ball       = useRef({ y: 0, vy: 0, restTimer: 0 });
  const beam       = useRef({ x: 0, y: BEAM_START_Y, vy: 0, active: true, restTimer: 0 });
  const beamTrail  = useRef<Pt[]>([]);
  const stars      = useRef<Star[]>([]);
  const exhaustT   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Init starfield (relative coords 0..1 over right-half panel)
    stars.current = Array.from({ length: STAR_COUNT }, () => ({
      x:        Math.random(),
      y:        Math.random(),
      sz:       Math.random() * 1.2 + 0.4,
      speedRel: Math.random() * 0.7 + 0.6,
    }));

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

    const drawElevatorShell = (originX: number, originY: number, accent: string) => {
      // Outer hull
      ctx.strokeStyle = accent;
      ctx.lineWidth   = 1.5;
      ctx.strokeRect(originX - WALL_T, originY - WALL_T, ELEV_W + WALL_T * 2, ELEV_H + WALL_T * 2);

      // Subtle interior tint
      const grad = ctx.createLinearGradient(originX, originY, originX, originY + ELEV_H);
      grad.addColorStop(0, "rgba(80,130,200,0.06)");
      grad.addColorStop(1, "rgba(40,60,100,0.10)");
      ctx.fillStyle = grad;
      ctx.fillRect(originX, originY, ELEV_W, ELEV_H);

      // Floor line accent
      ctx.beginPath();
      ctx.moveTo(originX, originY + ELEV_H);
      ctx.lineTo(originX + ELEV_W, originY + ELEV_H);
      ctx.strokeStyle = "rgba(140,180,220,0.35)";
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Ceiling line (entry slot for the beam)
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + ELEV_W, originY);
      ctx.strokeStyle = "rgba(140,180,220,0.20)";
      ctx.stroke();
    };

    const drawBall = (cx: number, cy: number) => {
      const grad = ctx.createRadialGradient(cx - 1.5, cy - 1.5, 0, cx, cy, BALL_R);
      grad.addColorStop(0, "#D8E0EC");
      grad.addColorStop(0.6, "#7888A4");
      grad.addColorStop(1, "#34405A");
      ctx.beginPath();
      ctx.arc(cx, cy, BALL_R, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = "rgba(180,200,230,0.35)";
      ctx.lineWidth   = 0.5;
      ctx.stroke();
    };

    const drawBeam = (originX: number, originY: number) => {
      // Trail
      const trail = beamTrail.current;
      if (trail.length > 1) {
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i - 1];
          const b = trail[i];
          const alpha = (i / trail.length) * 0.55;
          ctx.beginPath();
          ctx.moveTo(originX + a.x, originY + a.y);
          ctx.lineTo(originX + b.x, originY + b.y);
          ctx.strokeStyle = `rgba(255,200,140,${alpha.toFixed(3)})`;
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      }
      // Photon head
      if (beam.current.active) {
        const x = originX + beam.current.x;
        const y = originY + beam.current.y;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 9);
        glow.addColorStop(0, "rgba(255,240,180,0.90)");
        glow.addColorStop(0.4, "rgba(255,200,120,0.50)");
        glow.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#FFE9B0";
        ctx.fill();
      }
    };

    type Rect = { left: number; top: number; right: number; bot: number };

    // Planet surface scene
    const drawPlanetBg = (rect: Rect, cx: number) => {
      const { left, top, right, bot } = rect;

      // Sky gradient
      const sky = ctx.createLinearGradient(0, top, 0, bot);
      sky.addColorStop(0, "rgba(20,30,55,0.55)");
      sky.addColorStop(1, "rgba(45,30,20,0.65)");
      ctx.fillStyle = sky;
      ctx.fillRect(left, top, right - left, bot - top);

      // Horizon (slight planetary arc)
      const horizonY = bot - 26;
      ctx.beginPath();
      ctx.moveTo(left, horizonY);
      ctx.quadraticCurveTo(cx, horizonY - 6, right, horizonY);
      ctx.strokeStyle = "rgba(180,140,90,0.50)";
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Ground fill
      ctx.beginPath();
      ctx.moveTo(left, horizonY);
      ctx.quadraticCurveTo(cx, horizonY - 6, right, horizonY);
      ctx.lineTo(right, bot);
      ctx.lineTo(left, bot);
      ctx.closePath();
      const ground = ctx.createLinearGradient(0, horizonY, 0, bot);
      ground.addColorStop(0, "rgba(120,80,40,0.30)");
      ground.addColorStop(1, "rgba(40,25,15,0.45)");
      ctx.fillStyle = ground;
      ctx.fill();

      // Distant rocks (clipped to scene)
      ctx.fillStyle = "rgba(80,55,35,0.50)";
      [-110, -60, 30, 95].forEach((dx, i) => {
        const rw = 14 + (i % 2) * 6;
        const rh = 5 + (i % 3) * 2;
        const rx = cx + dx;
        if (rx >= left && rx + rw <= right) {
          ctx.fillRect(rx, horizonY - rh, rw, rh);
        }
      });

      // Gravity arrow indicator
      ctx.strokeStyle = "rgba(220,170,90,0.45)";
      ctx.fillStyle   = "rgba(220,170,90,0.45)";
      ctx.lineWidth   = 1;
      const ax = Math.max(left + 12, cx - 100);
      ctx.beginPath();
      ctx.moveTo(ax, top + 30);
      ctx.lineTo(ax, top + 70);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ax - 4, top + 64);
      ctx.lineTo(ax,     top + 72);
      ctx.lineTo(ax + 4, top + 64);
      ctx.closePath();
      ctx.fill();
      ctx.font      = "9px 'Jura', monospace";
      ctx.textAlign = "left";
      ctx.fillText("g", ax + 7, top + 56);
    };

    // Deep-space scene with streaming stars (elevator accelerating up)
    const drawSpaceBg = (rect: Rect, cx: number) => {
      const { left, top, right, bot } = rect;
      const rw = right - left;
      const rh = bot - top;

      const space = ctx.createLinearGradient(0, top, 0, bot);
      space.addColorStop(0, "rgba(8,10,22,0.80)");
      space.addColorStop(1, "rgba(15,15,35,0.80)");
      ctx.fillStyle = space;
      ctx.fillRect(left, top, rw, rh);

      stars.current.forEach((s) => {
        s.y += (s.speedRel * STAR_BASE_SPD) / rh;
        if (s.y > 1) s.y -= 1;
        const px = left + s.x * rw;
        const py = top + s.y * rh;
        const len = s.speedRel * 4;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px, py + len);
        ctx.strokeStyle = `rgba(220,230,255,${(0.25 + s.sz * 0.25).toFixed(3)})`;
        ctx.lineWidth   = s.sz * 0.8;
        ctx.stroke();
      });

      // Acceleration arrow (upward)
      ctx.strokeStyle = "rgba(220,170,90,0.45)";
      ctx.fillStyle   = "rgba(220,170,90,0.45)";
      ctx.lineWidth   = 1;
      const ax = Math.max(left + 12, cx - 100);
      ctx.beginPath();
      ctx.moveTo(ax, top + 70);
      ctx.lineTo(ax, top + 30);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ax - 4, top + 38);
      ctx.lineTo(ax,     top + 30);
      ctx.lineTo(ax + 4, top + 38);
      ctx.closePath();
      ctx.fill();
      ctx.font      = "9px 'Jura', monospace";
      ctx.textAlign = "left";
      ctx.fillText("a = g", ax + 7, top + 56);
    };

    const drawRocketExhaust = (cx: number, floorY: number) => {
      exhaustT.current += 1;
      const t = exhaustT.current;
      // Three flame layers
      const layers = [
        { spread: 30, len: 60, color: "rgba(255,90,30,",   alpha: 0.32 },
        { spread: 22, len: 46, color: "rgba(255,180,80,",  alpha: 0.45 },
        { spread: 12, len: 30, color: "rgba(255,240,180,", alpha: 0.55 },
      ];
      layers.forEach((L, i) => {
        const flicker = 0.85 + 0.15 * Math.sin(t * 0.4 + i * 1.7);
        ctx.beginPath();
        ctx.moveTo(cx - L.spread, floorY + 2);
        ctx.quadraticCurveTo(
          cx, floorY + L.len * flicker + 14,
          cx + L.spread, floorY + 2,
        );
        ctx.closePath();
        const g = ctx.createLinearGradient(0, floorY, 0, floorY + L.len);
        g.addColorStop(0, L.color + L.alpha + ")");
        g.addColorStop(1, L.color + "0)");
        ctx.fillStyle = g;
        ctx.fill();
      });
    };

    // ── Physics step ──────────────────────────────────────────────────────────

    const stepBall = () => {
      const b = ball.current;
      if (b.restTimer > 0) {
        b.restTimer -= 1;
        if (b.restTimer === 0) {
          b.y  = 0;
          b.vy = 0;
        }
        return;
      }
      b.vy += G_PX;
      b.y  += b.vy;
      if (b.y >= ELEV_H - BALL_R) {
        b.y         = ELEV_H - BALL_R;
        b.restTimer = BALL_RESET_FR;
      }
    };

    const stepBeam = () => {
      const p = beam.current;
      if (!p.active) {
        p.restTimer -= 1;
        if (p.restTimer <= 0) {
          p.x        = 0;
          p.y        = BEAM_START_Y;
          p.vy       = 0;
          p.active   = true;
          beamTrail.current = [];
        }
        return;
      }
      p.vy += G_PX;
      p.x  += BEAM_VX;
      p.y  += p.vy;
      beamTrail.current.push({ x: p.x, y: p.y });
      if (beamTrail.current.length > TRAIL_LEN) beamTrail.current.shift();
      if (p.x >= ELEV_W) {
        p.active    = false;
        p.restTimer = BEAM_GAP_FR;
      }
    };

    // ── Main loop ─────────────────────────────────────────────────────────────

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Layout: side-by-side on wide viewports, stacked on narrow
      const isStacked = w < 520;

      let planetRect: Rect, rocketRect: Rect;
      let planetCx: number, rocketCx: number;
      let planetOY: number, rocketOY: number;

      if (isStacked) {
        planetRect = { left: 0, top: 0,         right: w, bot: h * 0.5 };
        rocketRect = { left: 0, top: h * 0.5,   right: w, bot: h };
        planetCx   = w * 0.5;
        rocketCx   = w * 0.5;
        // Elevator near top of each half so the ground / exhaust has room below
        planetOY   = planetRect.top + 36;
        rocketOY   = rocketRect.top + 36;
      } else {
        planetRect = { left: 0,       top: 0, right: w * 0.5, bot: h };
        rocketRect = { left: w * 0.5, top: 0, right: w,       bot: h };
        planetCx   = w * 0.27;
        rocketCx   = w * 0.73;
        planetOY   = (h - ELEV_H) * 0.5;
        rocketOY   = (h - ELEV_H) * 0.5;
      }

      // ── Backgrounds ─────────────────────────────────────────────────────────
      drawPlanetBg(planetRect, planetCx);
      drawSpaceBg(rocketRect, rocketCx);

      // Rocket exhaust beneath rocket-scene elevator
      drawRocketExhaust(rocketCx, rocketOY + ELEV_H + WALL_T);

      // ── Divider ─────────────────────────────────────────────────────────────
      ctx.beginPath();
      if (isStacked) {
        ctx.moveTo(0, h * 0.5);
        ctx.lineTo(w, h * 0.5);
      } else {
        ctx.moveTo(w * 0.5, 12);
        ctx.lineTo(w * 0.5, h - 12);
      }
      ctx.strokeStyle = "rgba(100,140,200,0.12)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Elevator shells ─────────────────────────────────────────────────────
      drawElevatorShell(planetCx - ELEV_W / 2, planetOY, "rgba(140,200,160,0.55)");
      drawElevatorShell(rocketCx - ELEV_W / 2, rocketOY, "rgba(220,170,100,0.55)");

      // ── Physics ─────────────────────────────────────────────────────────────
      stepBall();
      stepBeam();

      // ── Render ball + beam in BOTH elevators (identical local coords) ──────
      const drawInside = (originX: number, originY: number) => {
        drawBeam(originX, originY);
        drawBall(originX + ELEV_W / 2, originY + ball.current.y + BALL_R);
      };
      drawInside(planetCx - ELEV_W / 2, planetOY);
      drawInside(rocketCx - ELEV_W / 2, rocketOY);

      // ── Frame labels ────────────────────────────────────────────────────────
      ctx.font      = "10px 'Jura', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(140,200,160,0.65)";
      ctx.fillText(
        isStacked ? "STATIONARY ON A PLANET" : "STATIONARY ON A PLANET",
        planetCx, planetRect.top + 14,
      );
      ctx.fillStyle = "rgba(220,170,100,0.65)";
      ctx.fillText("ACCELERATING IN DEEP SPACE", rocketCx, rocketRect.top + 14);

      ctx.font      = "8px 'Jura', monospace";
      ctx.fillStyle = "rgba(140,140,140,0.40)";
      ctx.fillText("GRAVITY g PULLS DOWN",   planetCx, planetRect.top + 26);
      ctx.fillText("THRUST a = g PUSHES UP", rocketCx, rocketRect.top + 26);

      // ── Bottom note (shorter on narrow viewports) ──────────────────────────
      ctx.font      = "9px 'Jura', monospace";
      ctx.fillStyle = "rgba(100,160,220,0.50)";
      ctx.fillText(
        isStacked
          ? "NO LOCAL EXPERIMENT TELLS THE TWO APART"
          : "INSIDE THE ELEVATOR — NO LOCAL EXPERIMENT CAN TELL THE TWO APART",
        w * 0.5, h - 6,
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
