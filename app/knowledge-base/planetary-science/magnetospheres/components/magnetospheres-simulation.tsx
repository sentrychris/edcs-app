"use client";

import { useEffect, useRef } from "react";

interface SolarParticle {
  x:     number;
  y:     number;
  vx:    number;
  vy:    number;
  life:  number;     // frames remaining
  size:  number;
  cap:   boolean;    // captured into the magnetosphere?
}

export default function MagnetospheresSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const timeRef   = useRef(0);
  const partsRef  = useRef<SolarParticle[]>([]);

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

      // ── Layout ────────────────────────────────────────────────────────────
      // Planet positioned slightly toward the sun side so the magnetotail
      // has room to stretch off to the right.
      const cx = w * 0.40;
      const cy = h * 0.50;
      const planetR = Math.min(w, h) * 0.075;

      // Magnetopause stand-off (sun-side) — where solar-wind pressure equals
      // the magnetic field pressure
      const standoff = planetR * 4.0;
      // Bow shock further out
      const bowR    = standoff * 1.3;
      // Magnetotail — extends far to the right
      const tailLen = w * 0.45;

      // ── Background subtle gradient (sun-side warmer) ──────────────────────
      const bg = ctx.createLinearGradient(0, 0, w, 0);
      bg.addColorStop(0,   "rgba(255, 200, 120, 0.05)");
      bg.addColorStop(0.4, "rgba(120, 80, 60, 0.02)");
      bg.addColorStop(1,   "transparent");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // ── Solar-wind direction indicator (top-left) ─────────────────────────
      ctx.font      = "9px 'Jura', monospace";
      ctx.fillStyle = "rgba(255, 200, 120, 0.45)";
      ctx.textAlign = "left";
      ctx.fillText("SOLAR WIND →", 10, 16);

      // ── Bow shock (faint curve) ───────────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(cx + bowR, cy);
      // Upper arc curving back to the right
      ctx.bezierCurveTo(
        cx + bowR * 0.6,  cy - bowR * 1.4,
        cx - bowR * 0.7,  cy - bowR * 2.5,
        cx - bowR * 1.7,  cy - bowR * 2.0,
      );
      ctx.moveTo(cx + bowR, cy);
      ctx.bezierCurveTo(
        cx + bowR * 0.6,  cy + bowR * 1.4,
        cx - bowR * 0.7,  cy + bowR * 2.5,
        cx - bowR * 1.7,  cy + bowR * 2.0,
      );
      ctx.strokeStyle = "rgba(255, 180, 100, 0.18)";
      ctx.setLineDash([4, 6]);
      ctx.lineWidth   = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      // Bow-shock label
      ctx.font      = "8px 'Jura', monospace";
      ctx.fillStyle = "rgba(255, 180, 100, 0.55)";
      ctx.textAlign = "right";
      ctx.fillText("BOW SHOCK", cx - bowR + 4, cy - bowR * 0.6);

      // ── Magnetopause boundary (more prominent, dashed) ────────────────────
      ctx.beginPath();
      // Sun-side arc
      ctx.moveTo(cx - standoff, cy);
      ctx.bezierCurveTo(
        cx - standoff,         cy - standoff * 1.3,
        cx + standoff * 0.5,   cy - standoff * 1.5,
        cx + standoff * 1.0,   cy - standoff * 1.4,
      );
      // Trail off into the magnetotail (top edge)
      ctx.lineTo(cx + tailLen, cy - standoff * 0.95);
      ctx.moveTo(cx - standoff, cy);
      ctx.bezierCurveTo(
        cx - standoff,         cy + standoff * 1.3,
        cx + standoff * 0.5,   cy + standoff * 1.5,
        cx + standoff * 1.0,   cy + standoff * 1.4,
      );
      ctx.lineTo(cx + tailLen, cy + standoff * 0.95);
      ctx.strokeStyle = "rgba(120, 200, 255, 0.35)";
      ctx.setLineDash([3, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Magnetopause label
      ctx.font      = "8px 'Jura', monospace";
      ctx.fillStyle = "rgba(120, 200, 255, 0.65)";
      ctx.textAlign = "center";
      ctx.fillText("MAGNETOPAUSE", cx + standoff * 0.5, cy + standoff * 1.6 + 12);

      // Magnetotail label
      ctx.fillStyle = "rgba(120, 200, 255, 0.55)";
      ctx.textAlign = "right";
      ctx.fillText("MAGNETOTAIL →", cx + tailLen - 4, cy - 6);

      // ── Magnetic field lines (closed dipole loops) ────────────────────────
      const numFieldLines = 6;
      for (let i = 0; i < numFieldLines; i++) {
        const radius = planetR * (1.6 + i * 0.55);  // closed loops growing outward
        // Polar latitude where the line emerges (closer to pole for bigger loops)
        const latitude = 0.4 - i * 0.05;             // simplification

        // North loop
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(Math.PI / 2 - latitude) * planetR, cy - Math.sin(Math.PI / 2 - latitude) * planetR);
        // Loop up, out, around, back in to S pole
        ctx.bezierCurveTo(
          cx + radius * 1.0, cy - radius * 1.3,
          cx + radius * 0.4, cy - radius * 1.6,
          cx,                cy - radius * 1.3,
        );
        ctx.bezierCurveTo(
          cx - radius * 0.4, cy - radius * 1.6,
          cx - radius * 1.0, cy - radius * 1.3,
          cx + Math.cos(Math.PI / 2 - latitude + Math.PI) * planetR,
          cy - Math.sin(Math.PI / 2 - latitude + Math.PI) * planetR,
        );
        // Note: above is rough, but visually conveys closed lines
        ctx.strokeStyle = `rgba(180, 220, 255, ${0.30 - i * 0.025})`;
        ctx.lineWidth   = 0.9;
        ctx.stroke();

        // South loop (mirror)
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(-Math.PI / 2 + latitude) * planetR, cy - Math.sin(-Math.PI / 2 + latitude) * planetR);
        ctx.bezierCurveTo(
          cx + radius * 1.0, cy + radius * 1.3,
          cx + radius * 0.4, cy + radius * 1.6,
          cx,                cy + radius * 1.3,
        );
        ctx.bezierCurveTo(
          cx - radius * 0.4, cy + radius * 1.6,
          cx - radius * 1.0, cy + radius * 1.3,
          cx + Math.cos(-Math.PI / 2 + latitude + Math.PI) * planetR,
          cy - Math.sin(-Math.PI / 2 + latitude + Math.PI) * planetR,
        );
        ctx.strokeStyle = `rgba(180, 220, 255, ${0.30 - i * 0.025})`;
        ctx.stroke();
      }

      // ── Solar wind particles ──────────────────────────────────────────────
      // Spawn new particles
      if (t % 2 === 0) {
        for (let i = 0; i < 2; i++) {
          partsRef.current.push({
            x:    -10,
            y:    Math.random() * h,
            vx:   2.2 + Math.random() * 1.0,
            vy:   (Math.random() - 0.5) * 0.4,
            life: 800,
            size: 0.8 + Math.random() * 0.8,
            cap:  false,
          });
        }
      }

      // Update + draw particles
      const survivors: SolarParticle[] = [];
      for (const p of partsRef.current) {
        // Vector from particle to planet
        const dx = cx - p.x;
        const dy = cy - p.y;
        const d  = Math.hypot(dx, dy);

        // Deflect particles by the magnetopause: when they're close, push tangentially
        if (d < bowR && d > planetR * 1.5) {
          const repel = (1 - (d / bowR)) * 0.18;
          p.vx -= (dx / d) * repel;
          p.vy -= (dy / d) * repel;
          // Add vertical kick away from equator (like field-line guidance)
          const sign = p.y < cy ? -1 : 1;
          p.vy += sign * 0.04;
        }

        // Capture into polar cusps if the particle is heading toward a pole
        if (!p.cap && d < planetR * 1.8) {
          const angleToCenter = Math.atan2(p.y - cy, p.x - cx);
          // Cusps near the magnetic poles (top/bottom) on the sun-side
          if (Math.cos(angleToCenter + Math.PI / 2) > 0.6 || Math.cos(angleToCenter - Math.PI / 2) > 0.6) {
            p.cap = true;
            // Steer toward nearest pole
            const polar = p.y < cy ? cy - planetR : cy + planetR;
            p.vx = (cx - p.x) * 0.04;
            p.vy = (polar - p.y) * 0.06;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        // Cull off-screen or dead
        if (p.life > 0 && p.x < w + 20 && p.x > -40 && p.y > -40 && p.y < h + 40 && d > planetR * 0.8) {
          survivors.push(p);

          // Draw
          const alpha = Math.min(1, p.life / 100);
          if (p.cap) {
            ctx.fillStyle = `rgba(140, 240, 200, ${alpha})`;
            ctx.shadowColor = "rgba(140, 240, 200, 0.6)";
            ctx.shadowBlur  = 4;
          } else {
            ctx.fillStyle = `rgba(255, 200, 130, ${alpha * 0.7})`;
            ctx.shadowColor = "rgba(255, 200, 130, 0.5)";
            ctx.shadowBlur  = 3;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      partsRef.current = survivors;

      // ── Auroral ovals (polar caps) ────────────────────────────────────────
      const auroraPulse = 0.6 + 0.4 * Math.sin(t * 0.05);
      // North aurora
      const nAurora = ctx.createRadialGradient(cx, cy - planetR * 0.95, 0, cx, cy - planetR * 0.95, planetR * 0.9);
      nAurora.addColorStop(0,   `rgba(140, 255, 180, ${0.6 * auroraPulse})`);
      nAurora.addColorStop(0.5, `rgba(120, 220, 200, ${0.30 * auroraPulse})`);
      nAurora.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.ellipse(cx, cy - planetR * 0.95, planetR * 0.7, planetR * 0.25, 0, 0, Math.PI * 2);
      ctx.fillStyle = nAurora;
      ctx.fill();

      // South aurora
      const sAurora = ctx.createRadialGradient(cx, cy + planetR * 0.95, 0, cx, cy + planetR * 0.95, planetR * 0.9);
      sAurora.addColorStop(0,   `rgba(140, 255, 180, ${0.6 * auroraPulse})`);
      sAurora.addColorStop(0.5, `rgba(120, 220, 200, ${0.30 * auroraPulse})`);
      sAurora.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.ellipse(cx, cy + planetR * 0.95, planetR * 0.7, planetR * 0.25, 0, 0, Math.PI * 2);
      ctx.fillStyle = sAurora;
      ctx.fill();

      // ── Planet ────────────────────────────────────────────────────────────
      // Atmosphere halo
      const atmHalo = ctx.createRadialGradient(cx, cy, planetR * 0.92, cx, cy, planetR * 1.18);
      atmHalo.addColorStop(0, "rgba(120, 180, 255, 0.45)");
      atmHalo.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, planetR * 1.18, 0, Math.PI * 2);
      ctx.fillStyle = atmHalo;
      ctx.fill();

      // Body
      const body = ctx.createRadialGradient(cx - planetR * 0.4, cy - planetR * 0.4, 0, cx, cy, planetR * 1.1);
      body.addColorStop(0,   "#A0D0FF");
      body.addColorStop(0.45,"#3478B8");
      body.addColorStop(1,   "#0E2C5C");
      ctx.beginPath();
      ctx.arc(cx, cy, planetR, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();

      // Subtle continent shapes
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, planetR, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = "rgba(92, 144, 64, 0.55)";
      ctx.beginPath();
      ctx.ellipse(cx + planetR * 0.2,  cy - planetR * 0.2, planetR * 0.30, planetR * 0.18, 0, 0, Math.PI * 2);
      ctx.ellipse(cx - planetR * 0.30, cy + planetR * 0.15, planetR * 0.25, planetR * 0.20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Limb darkening
      const limb = ctx.createRadialGradient(cx - planetR * 0.4, cy - planetR * 0.4, planetR * 0.5, cx, cy, planetR);
      limb.addColorStop(0,   "rgba(0,0,0,0)");
      limb.addColorStop(0.7, "rgba(0,0,0,0)");
      limb.addColorStop(1,   "rgba(0,0,0,0.45)");
      ctx.beginPath();
      ctx.arc(cx, cy, planetR, 0, Math.PI * 2);
      ctx.fillStyle = limb;
      ctx.fill();

      // ── Aurora label ──────────────────────────────────────────────────────
      ctx.font      = "8px 'Jura', monospace";
      ctx.fillStyle = "rgba(140, 255, 180, 0.75)";
      ctx.textAlign = "center";
      ctx.fillText("AURORA", cx, cy - planetR - 4);
      ctx.fillText("AURORA", cx, cy + planetR + 12);

      // PLANET label
      ctx.font      = "bold 10px 'Jura', monospace";
      ctx.fillStyle = "#80B0FF";
      ctx.fillText("PLANET", cx, cy + planetR + 28);
      ctx.font      = "7px 'Jura', monospace";
      ctx.fillStyle = "rgba(180, 200, 240, 0.55)";
      ctx.fillText("(magnetic dipole)", cx, cy + planetR + 38);

      // Title
      if (w > 460) {
        ctx.font      = "8px 'Jura', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(120, 160, 200, 0.40)";
        ctx.fillText("⟳ MAGNETOSPHERE — DIPOLE FIELD vs SOLAR WIND", 10, h - 8);
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
