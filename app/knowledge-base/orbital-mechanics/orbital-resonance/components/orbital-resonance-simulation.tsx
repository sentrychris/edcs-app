"use client";

import { useEffect, useRef } from "react";

// ── System constants ──────────────────────────────────────────────────────────
// 1:2:4 Laplace resonance (Io / Europa / Ganymede analogue).
// Orbital radii derived from Kepler's 3rd law (T² ∝ r³) so that
// periods are exactly 1T : 2T : 4T.
const BASE_SPEED = 0.020;            // inner planet angular speed (rad/frame)

const PLANETS = [
  {
    label:      "A",
    desc:       "1T",
    orbitR:     70,
    speed:      BASE_SPEED,          // 1×
    color:      "#60B8FF",
    glow:       "rgba(96,184,255,0.5)",
    bodyR:      5,
    trailColor: "rgba(96,184,255,",
  },
  {
    label:      "B",
    desc:       "2T",
    orbitR:     111,
    speed:      BASE_SPEED / 2,      // ½× — period 2T
    color:      "#60DD90",
    glow:       "rgba(96,221,144,0.5)",
    bodyR:      6,
    trailColor: "rgba(96,221,144,",
  },
  {
    label:      "C",
    desc:       "4T",
    orbitR:     176,
    speed:      BASE_SPEED / 4,      // ¼× — period 4T
    color:      "#FFB347",
    glow:       "rgba(255,179,71,0.5)",
    bodyR:      7,
    trailColor: "rgba(255,179,71,",
  },
] as const;

const TRAIL_LENGTH  = 80;            // frames of history kept
const CONJ_THRESH   = 0.14;          // ~8° in radians — conjunction detection
const FLASH_FRAMES  = 18;            // how long a conjunction flash lasts

// Pairs to watch for conjunctions
const PAIRS = [
  { a: 0, b: 1, color: "rgba(180,230,255,0.55)" },
  { a: 0, b: 2, color: "rgba(255,230,160,0.45)" },
  { a: 1, b: 2, color: "rgba(160,255,200,0.45)" },
];

export default function OrbitalResonanceSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const timeRef   = useRef(0);

  // Trails: circular buffer of [x, y] per planet
  const trailsRef = useRef<Array<Array<[number, number]>>>(
    PLANETS.map(() => []),
  );

  // Active conjunction flashes: { pairIndex, framesLeft }
  const flashesRef = useRef<Array<{ pair: number; frames: number }>>([]);

  // Conjunction dot positions accumulated on orbit rings
  const conjDotsRef = useRef<Array<{ orbitR: number; angle: number; color: string }>>([]);

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

    const drawGlow = (x: number, y: number, r: number, color: string, glow: string) => {
      const grad = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 3.5);
      grad.addColorStop(0,   glow);
      grad.addColorStop(0.5, glow.replace(/[\d.]+\)$/, "0.1)"));
      grad.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(x, y, r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur  = r * 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const tick = () => {
      const w  = canvas.width;
      const h  = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Scale so the outer orbit fits with padding
      const scale = Math.min(w, h) / 2 / (PLANETS[2].orbitR + 35);

      ctx.clearRect(0, 0, w, h);
      timeRef.current++;

      // ── Compute current planet angles ───────────────────────────────────
      const angles = PLANETS.map((p, i) => {
        // Start each planet at a different phase so the pattern is visible quickly
        const phase = [0, Math.PI * 0.5, Math.PI * 1.2][i];
        return timeRef.current * p.speed + phase;
      });

      const positions = PLANETS.map((p, i) => ({
        x: cx + Math.cos(angles[i]) * p.orbitR * scale,
        y: cy + Math.sin(angles[i]) * p.orbitR * scale,
      }));

      // ── Update trails ───────────────────────────────────────────────────
      PLANETS.forEach((_, i) => {
        trailsRef.current[i].push([positions[i].x, positions[i].y]);
        if (trailsRef.current[i].length > TRAIL_LENGTH) {
          trailsRef.current[i].shift();
        }
      });

      // ── Detect conjunctions ─────────────────────────────────────────────
      for (const pair of PAIRS) {
        const diff = Math.abs(
          ((angles[pair.a] - angles[pair.b] + Math.PI * 3) % (Math.PI * 2)) - Math.PI,
        );
        if (diff < CONJ_THRESH) {
          const alreadyFlashing = flashesRef.current.some(
            (f) => f.pair === PAIRS.indexOf(pair) && f.frames > FLASH_FRAMES * 0.6,
          );
          if (!alreadyFlashing) {
            flashesRef.current.push({ pair: PAIRS.indexOf(pair), frames: FLASH_FRAMES });
            // Drop a conjunction dot on the outer planet's orbit ring
            conjDotsRef.current.push({
              orbitR: PLANETS[pair.b].orbitR,
              angle:  angles[pair.b],
              color:  pair.color,
            });
            // Cap dots to avoid overdraw
            if (conjDotsRef.current.length > 60) {
              conjDotsRef.current.shift();
            }
          }
        }
      }

      // Tick down flashes
      flashesRef.current = flashesRef.current
        .map((f) => ({ ...f, frames: f.frames - 1 }))
        .filter((f) => f.frames > 0);

      // ── Draw orbit rings ─────────────────────────────────────────────────
      PLANETS.forEach((p) => {
        ctx.beginPath();
        ctx.arc(cx, cy, p.orbitR * scale, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(100,150,200,0.10)";
        ctx.lineWidth   = 1;
        ctx.setLineDash([3, 7]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // ── Draw accumulated conjunction dots ────────────────────────────────
      for (const dot of conjDotsRef.current) {
        const dx = cx + Math.cos(dot.angle) * dot.orbitR * scale;
        const dy = cy + Math.sin(dot.angle) * dot.orbitR * scale;
        ctx.beginPath();
        ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = dot.color.replace(/[\d.]+\)$/, "0.5)");
        ctx.fill();
      }

      // ── Draw active conjunction flashes ─────────────────────────────────
      for (const flash of flashesRef.current) {
        const pair   = PAIRS[flash.pair];
        const alpha  = (flash.frames / FLASH_FRAMES) * 0.7;
        const pa     = positions[pair.a];
        const pb     = positions[pair.b];
        const color  = pair.color.replace(/[\d.]+\)$/, `${alpha.toFixed(2)})`);

        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = color;
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        // Flash highlight on both planets
        ctx.beginPath();
        ctx.arc(pa.x, pa.y, PLANETS[pair.a].bodyR * 2.5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pb.x, pb.y, PLANETS[pair.b].bodyR * 2.5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      // ── Draw trails ─────────────────────────────────────────────────────
      PLANETS.forEach((p, i) => {
        const trail = trailsRef.current[i];
        for (let t = 1; t < trail.length; t++) {
          const alpha = (t / trail.length) * 0.35;
          ctx.beginPath();
          ctx.moveTo(trail[t - 1][0], trail[t - 1][1]);
          ctx.lineTo(trail[t][0], trail[t][1]);
          ctx.strokeStyle = `${p.trailColor}${alpha.toFixed(2)})`;
          ctx.lineWidth   = 1.5;
          ctx.stroke();
        }
      });

      // ── Draw star ───────────────────────────────────────────────────────
      drawGlow(cx, cy, 14, "#FFD580", "rgba(255,213,128,0.5)");

      // ── Draw planets ─────────────────────────────────────────────────────
      PLANETS.forEach((p, i) => {
        drawGlow(positions[i].x, positions[i].y, p.bodyR, p.color, p.glow);

        // Period label
        ctx.font      = "9px 'Jura', monospace";
        ctx.fillStyle = `${p.color}99`;
        ctx.textAlign = "center";
        ctx.fillText(p.label, positions[i].x, positions[i].y - p.bodyR - 8);
      });

      // ── Period ratio label ────────────────────────────────────────────────
      ctx.font      = "10px 'Jura', monospace";
      ctx.fillStyle = "rgba(100,160,220,0.4)";
      ctx.textAlign = "center";
      ctx.fillText("1 : 2 : 4  LAPLACE RESONANCE", cx, h - 14);

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
