"use client";

import { useEffect, useRef } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const PLANET_R   = 30;
const ROCHE_R    = 115;
const STABLE_R   = 195;
const BASE_SPEED = 0.018;  // ω at STABLE_R

// Phase durations (frames)
const DUR = { orbit: 200, inspiral: 220, distort: 65, shatter: 28, ring: 280, fade: 70 };
const TOTAL_FRAMES = Object.values(DUR).reduce((a, b) => a + b, 0);

// Particle colours — dusty rock tones
const PARTICLE_COLORS = ["#C8A870", "#B09060", "#D0B888", "#A07848", "#C09868"];

interface Particle {
  angle:  number;
  orbitR: number;
  speed:  number;
  size:   number;
  color:  string;
}

// Ease-in-out cubic
const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const easeIn    = (t: number) => t * t * t;
const clamp     = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp      = (a: number, b: number, t: number) => a + (b - a) * t;

export default function RocheLimitSimulation() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const frameRef      = useRef<number>(0);
  const timeRef       = useRef(0);
  const orbitAngleRef = useRef(0);
  const particlesRef  = useRef<Particle[]>([]);

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

    // ── Helpers ───────────────────────────────────────────────────────────

    const drawPlanet = (cx: number, cy: number, r: number) => {
      // Atmosphere halo
      const atmo = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.6);
      atmo.addColorStop(0, "rgba(80,120,200,0.15)");
      atmo.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = atmo;
      ctx.fill();

      // Body gradient
      const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
      grad.addColorStop(0, "#8090C0");
      grad.addColorStop(0.5, "#506090");
      grad.addColorStop(1, "#2C3860");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Surface bands (subtle)
      for (let i = 0; i < 3; i++) {
        const by = cy + (i - 1) * r * 0.35;
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, by, r * 0.98, r * 0.08, 0, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = "rgba(60,80,130,0.25)";
        ctx.fillRect(cx - r, by - r * 0.1, r * 2, r * 0.2);
        ctx.restore();
      }
    };

    const drawRocheRing = (cx: number, cy: number, r: number, alpha: number) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,120,60,${(alpha * 0.55).toFixed(2)})`;
      ctx.lineWidth   = 1;
      ctx.setLineDash([5, 7]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label at the top of the ring
      ctx.font      = "9px 'Jura', monospace";
      ctx.fillStyle = `rgba(255,140,80,${(alpha * 0.5).toFixed(2)})`;
      ctx.textAlign = "center";
      ctx.fillText("ROCHE LIMIT", cx, cy - r - 6);
    };

    // Draw satellite body — an ellipse elongated toward the planet
    const drawSatellite = (
      sx: number, sy: number,
      cx: number, cy: number,
      baseR: number, elongation: number,
      alpha: number,
    ) => {
      const angle = Math.atan2(sy - cy, sx - cx);
      const rMaj  = baseR * elongation;       // radial axis (toward planet)
      const rMin  = baseR / Math.sqrt(elongation); // tangential axis

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle);

      // Glow
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rMaj * 3);
      grad.addColorStop(0, `rgba(200,180,120,${(alpha * 0.4).toFixed(2)})`);
      grad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.ellipse(0, 0, rMaj * 3, rMin * 3, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Body
      ctx.beginPath();
      ctx.ellipse(0, 0, rMaj, rMin, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,175,120,${alpha.toFixed(2)})`;
      ctx.shadowColor = "#D0B870";
      ctx.shadowBlur  = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    };

    // Tidal force arrows during distortion
    const drawTidalArrows = (
      sx: number, sy: number,
      cx: number, cy: number,
      elongation: number, alpha: number,
    ) => {
      const strength = clamp((elongation - 1) / 1.5, 0, 1) * alpha;
      if (strength < 0.05) return;
      const angle  = Math.atan2(sy - cy, sx - cx);
      const arrowL = 18 * strength;
      const arrowColor = `rgba(255,100,60,${(strength * 0.8).toFixed(2)})`;

      // Near-side arrow (toward planet = inward = negative angle direction)
      // Far-side arrow (away from planet)
      for (const dir of [-1, 1]) {
        const ox = sx + Math.cos(angle) * dir * 10;
        const oy = sy + Math.sin(angle) * dir * 10;
        const ex = ox + Math.cos(angle) * dir * arrowL;
        const ey = oy + Math.sin(angle) * dir * arrowL;

        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = arrowColor;
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        // Arrow head
        const hAngle = angle + Math.PI * (dir > 0 ? 0 : 1);
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(
          ex + Math.cos(hAngle + 2.5) * 5,
          ey + Math.sin(hAngle + 2.5) * 5,
        );
        ctx.lineTo(
          ex + Math.cos(hAngle - 2.5) * 5,
          ey + Math.sin(hAngle - 2.5) * 5,
        );
        ctx.fillStyle = arrowColor;
        ctx.fill();
      }
    };

    const drawShatter = (
      sx: number, sy: number,
      progress: number, alpha: number,
    ) => {
      const n = 16;
      for (let i = 0; i < n; i++) {
        const a  = (i / n) * Math.PI * 2;
        const r  = progress * 35;
        const px = sx + Math.cos(a) * r;
        const py = sy + Math.sin(a) * r;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,185,120,${(alpha * 0.8).toFixed(2)})`;
        ctx.fill();
      }
    };

    const drawParticles = (
      cx: number, cy: number,
      scale: number, alpha: number,
    ) => {
      for (const p of particlesRef.current) {
        const px = cx + Math.cos(p.angle) * p.orbitR * scale;
        const py = cy + Math.sin(p.angle) * p.orbitR * scale;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace("rgb", "rgba").replace(")", `,${alpha.toFixed(2)})`);
        ctx.fill();
      }
    };

    // ── Main loop ─────────────────────────────────────────────────────────

    const tick = () => {
      const w   = canvas.width;
      const h   = canvas.height;
      const cx  = w / 2;
      const cy  = h / 2;
      const scale = Math.min(w, h) / 2 / (STABLE_R + 40);

      ctx.clearRect(0, 0, w, h);

      const frame = timeRef.current % TOTAL_FRAMES;
      timeRef.current++;

      // ── Determine phase & local progress ─────────────────────────────
      let phase    = "orbit";
      let phaseT   = 0;   // 0..1 within phase
      let accum    = 0;
      for (const [key, dur] of Object.entries(DUR)) {
        if (frame < accum + dur) {
          phase  = key;
          phaseT = (frame - accum) / dur;
          break;
        }
        accum += dur;
      }

      // ── Satellite position & shape ─────────────────────────────────────
      let satR      = STABLE_R;
      let elongation = 1.0;
      let satAlpha  = 1.0;
      let showSat   = true;

      if (phase === "orbit") {
        satR = STABLE_R;
      } else if (phase === "inspiral") {
        satR = lerp(STABLE_R, ROCHE_R * 0.82, easeIn(phaseT));
      } else if (phase === "distort") {
        satR = ROCHE_R * 0.82;
        const depth = clamp((ROCHE_R - satR * 0.9) / (ROCHE_R * 0.35), 0, 1);
        elongation  = lerp(1.0, 3.2, easeInOut(phaseT) * depth + phaseT * 0.6);
      } else if (phase === "shatter") {
        showSat = false;
      } else if (phase === "ring" || phase === "fade") {
        showSat = false;
      }

      // Advance orbit angle (Kepler: ω ∝ r^-3/2)
      if (phase !== "shatter" && phase !== "ring" && phase !== "fade") {
        const ω = BASE_SPEED * Math.pow(STABLE_R / satR, 1.5);
        orbitAngleRef.current += ω;
      }

      const angle = orbitAngleRef.current;
      const sx    = cx + Math.cos(angle) * satR * scale;
      const sy    = cy + Math.sin(angle) * satR * scale;

      // ── Spawn particles on first shatter frame ─────────────────────────
      if (phase === "shatter" && phaseT < 0.05 && particlesRef.current.length === 0) {
        for (let i = 0; i < 55; i++) {
          const spread    = (Math.random() - 0.5) * 0.7;
          const orbitR    = (ROCHE_R * 0.72 + Math.random() * ROCHE_R * 0.52);
          const orbitSpeed = BASE_SPEED * Math.pow(STABLE_R / orbitR, 1.5) * (1 + (Math.random() - 0.5) * 0.08);
          particlesRef.current.push({
            angle:  angle + spread,
            orbitR,
            speed:  orbitSpeed,
            size:   0.8 + Math.random() * 1.8,
            color:  PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          });
        }
      }

      // Reset particles on new cycle
      if (phase === "orbit" && phaseT < 0.02) {
        particlesRef.current = [];
        orbitAngleRef.current = 0;
      }

      // Advance particle angles
      if (phase === "ring" || phase === "fade" || phase === "shatter") {
        for (const p of particlesRef.current) {
          p.angle += p.speed;
        }
      }

      // ── Draw ───────────────────────────────────────────────────────────

      // Roche limit ring
      const rocheAlpha = phase === "fade" ? 1 - phaseT : 1;
      drawRocheRing(cx, cy, ROCHE_R * scale, rocheAlpha);

      // Orbit guide (only when satellite is visible)
      if (showSat || phase === "inspiral") {
        ctx.beginPath();
        ctx.arc(cx, cy, satR * scale, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(100,150,200,0.09)";
        ctx.lineWidth   = 1;
        ctx.setLineDash([3, 7]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Ring particles
      if (phase === "ring" || phase === "shatter") {
        const ringAlpha = phase === "shatter" ? phaseT : 1;
        drawParticles(cx, cy, scale, ringAlpha);
      }
      if (phase === "fade") {
        drawParticles(cx, cy, scale, 1 - phaseT);
      }

      // Shatter burst
      if (phase === "shatter") {
        drawShatter(sx, sy, phaseT, 1 - phaseT);
      }

      // Planet (drawn after rings so it occludes them at the center)
      drawPlanet(cx, cy, PLANET_R * scale);

      // Satellite
      if (showSat) {
        drawTidalArrows(sx, sy, cx, cy, elongation, satAlpha);
        drawSatellite(sx, sy, cx, cy, 7 * scale, elongation, satAlpha);
      }

      // ── Status label ──────────────────────────────────────────────────
      const labels: Record<string, string> = {
        orbit:    "SELF-GRAVITY DOMINANT — STABLE ORBIT",
        inspiral: "APPROACHING ROCHE LIMIT",
        distort:  "INSIDE ROCHE LIMIT — TIDAL FORCES DOMINANT",
        shatter:  "STRUCTURAL FAILURE — DISINTEGRATING",
        ring:     "RING SYSTEM FORMING",
        fade:     "RING SYSTEM STABLE",
      };
      const labelAlpha = phase === "fade" ? lerp(1, 0.3, phaseT) : 1;
      ctx.font      = "10px 'Jura', monospace";
      ctx.fillStyle = `rgba(100,160,220,${(labelAlpha * 0.45).toFixed(2)})`;
      ctx.textAlign = "center";
      ctx.fillText(labels[phase], cx, h - 14);

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
