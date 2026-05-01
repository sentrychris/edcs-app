"use client";

import { useEffect, useRef } from "react";

// Single-scene simulation: protostar with bipolar jets and a tilted accretion
// disk fed by infalling material. Faint nebular cloud in the background as
// the formation environment.

interface JetParticle {
  age:     number;     // 0..1 along jet length
  side:    1 | -1;     // +1 = top jet, -1 = bottom jet
  spread:  number;     // small lateral displacement
  speed:   number;
  size:    number;
}

interface InfallParticle {
  angle:    number;
  radius:   number;     // orbital radius (decreasing as it falls in)
  fallRate: number;
  size:     number;
}

const seededRand = (seed: number) => {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

export default function StarFormationSimulation() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const frameRef     = useRef<number>(0);
  const timeRef      = useRef(0);
  const jetsRef      = useRef<JetParticle[]>([]);
  const infallRef    = useRef<InfallParticle[]>([]);

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

    // Pre-seed infalling particles
    const rand = seededRand(7);
    for (let i = 0; i < 35; i++) {
      infallRef.current.push({
        angle:    rand() * Math.PI * 2,
        radius:   0.4 + rand() * 0.6,    // 0..1 normalised, will scale to disk size
        fallRate: 0.0015 + rand() * 0.0015,
        size:     1.0 + rand() * 1.2,
      });
    }

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 1;
      const t = timeRef.current;

      // ── Layout ────────────────────────────────────────────────────────────
      const cx = w / 2;
      const cy = h / 2;
      const protostarR = Math.min(w, h) * 0.045;
      const diskOuterR = Math.min(w, h) * 0.30;
      const diskInnerR = protostarR * 1.4;
      const jetLen     = h * 0.40;

      // ── Background nebula glow ────────────────────────────────────────────
      const neb = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
      neb.addColorStop(0,   "rgba(120, 60, 200, 0.10)");
      neb.addColorStop(0.4, "rgba(80, 40, 140, 0.04)");
      neb.addColorStop(1,   "transparent");
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, w, h);

      // Wispy nebular filaments (drifting)
      const numWisps = 5;
      for (let i = 0; i < numWisps; i++) {
        const phase = t * 0.0003 + i * 1.3;
        const wx = cx + Math.cos(phase) * w * 0.35;
        const wy = cy + Math.sin(phase * 0.8) * h * 0.30;
        const wr = Math.min(w, h) * 0.20;
        const wisp = ctx.createRadialGradient(wx, wy, 0, wx, wy, wr);
        wisp.addColorStop(0,   "rgba(180, 100, 255, 0.06)");
        wisp.addColorStop(1,   "transparent");
        ctx.beginPath();
        ctx.arc(wx, wy, wr, 0, Math.PI * 2);
        ctx.fillStyle = wisp;
        ctx.fill();
      }

      // ── Bipolar jets (drawn behind disk) ──────────────────────────────────
      // Spawn new jet particles
      if (t % 2 === 0) {
        for (let i = 0; i < 2; i++) {
          jetsRef.current.push({
            age:    0,
            side:   Math.random() > 0.5 ? 1 : -1,
            spread: (Math.random() - 0.5) * 0.4,
            speed:  0.005 + Math.random() * 0.003,
            size:   1.5 + Math.random() * 1.0,
          });
        }
      }

      // Draw jet cones (behind everything)
      for (const side of [-1, 1] as const) {
        const tipY = cy + side * jetLen;
        const grad = ctx.createLinearGradient(cx, cy, cx, tipY);
        grad.addColorStop(0,   "rgba(180, 220, 255, 0.30)");
        grad.addColorStop(0.4, "rgba(140, 180, 255, 0.18)");
        grad.addColorStop(1,   "rgba(120, 160, 255, 0)");

        const baseHalf = protostarR * 0.5;
        const tipHalf  = protostarR * 2.5;
        ctx.beginPath();
        ctx.moveTo(cx - baseHalf, cy);
        ctx.lineTo(cx + baseHalf, cy);
        ctx.lineTo(cx + tipHalf,  tipY);
        ctx.lineTo(cx - tipHalf,  tipY);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Update + draw jet particles
      const jetSurvivors: JetParticle[] = [];
      for (const p of jetsRef.current) {
        p.age += p.speed;
        if (p.age > 1) continue;
        jetSurvivors.push(p);

        // Position: along the jet axis, with a small lateral spread that
        // grows as the particle gets older (jet diverges).
        const jy = cy + p.side * jetLen * p.age;
        const lateralSpread = p.spread * protostarR * (1 + p.age * 4);
        const jx = cx + lateralSpread;

        const fade = 1 - p.age;
        const sz   = p.size * (1 + p.age * 0.5);

        const grad = ctx.createRadialGradient(jx, jy, 0, jx, jy, sz * 4);
        grad.addColorStop(0,   `rgba(220, 240, 255, ${0.7 * fade})`);
        grad.addColorStop(0.5, `rgba(160, 200, 255, ${0.4 * fade})`);
        grad.addColorStop(1,   "transparent");
        ctx.beginPath();
        ctx.arc(jx, jy, sz * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(jx, jy, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${fade})`;
        ctx.fill();
      }
      jetsRef.current = jetSurvivors;

      // ── Accretion disk (tilted) ───────────────────────────────────────────
      const tilt    = 0.30;
      const phase   = t * 0.014;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, tilt);

      // Disk radial gradient
      const diskGrad = ctx.createRadialGradient(0, 0, diskInnerR, 0, 0, diskOuterR);
      diskGrad.addColorStop(0,   "rgba(255, 230, 160, 0.85)");
      diskGrad.addColorStop(0.4, "rgba(255, 130, 60, 0.5)");
      diskGrad.addColorStop(0.8, "rgba(180, 60, 30, 0.30)");
      diskGrad.addColorStop(1,   "rgba(120, 40, 20, 0)");
      ctx.beginPath();
      ctx.arc(0, 0, diskOuterR, 0, Math.PI * 2);
      ctx.fillStyle = diskGrad;
      ctx.fill();

      // Punch the inner hole
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(0, 0, diskInnerR, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      // Bright orbiting disk knots (clumps in the disk)
      for (let i = 0; i < 36; i++) {
        const a    = (i / 36) * Math.PI * 2 + phase * (1 + (i % 4) * 0.12);
        const off  = ((i * 23) % 10) / 10;
        const ringR = diskInnerR + (diskOuterR - diskInnerR) * (0.10 + 0.85 * off);
        const px    = Math.cos(a) * ringR;
        const py    = Math.sin(a) * ringR;
        ctx.beginPath();
        ctx.arc(px, py, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 240, 200, 0.85)";
        ctx.fill();
      }

      ctx.restore();

      // ── Infalling particles (from outside the disk into it) ──────────────
      for (const p of infallRef.current) {
        p.angle  += 0.008 / Math.max(0.1, p.radius);  // orbit faster as it falls
        p.radius -= p.fallRate;
        if (p.radius < 0.18) {
          // Recycle to outer edge
          p.radius = 1.0 + Math.random() * 0.3;
          p.angle  = Math.random() * Math.PI * 2;
        }
        const r = p.radius * diskOuterR;
        const px = cx + Math.cos(p.angle) * r;
        // Apply tilt (squash y)
        const py = cy + Math.sin(p.angle) * r * tilt;

        const trail = 0.6 + 0.4 * (1 - p.radius);
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle   = `rgba(255, 200, 130, ${trail})`;
        ctx.shadowColor = "rgba(255, 200, 130, 0.5)";
        ctx.shadowBlur  = 3;
        ctx.fill();
        ctx.shadowBlur  = 0;
      }

      // ── Protostar (drawn last so it sits on top) ──────────────────────────
      const psPulse = 0.95 + Math.sin(t * 0.04) * 0.05;

      // Halo
      const halo = ctx.createRadialGradient(cx, cy, protostarR * 0.4, cx, cy, protostarR * 5);
      halo.addColorStop(0,   "rgba(255, 180, 80, 0.55)");
      halo.addColorStop(0.5, "rgba(255, 140, 60, 0.18)");
      halo.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, protostarR * 5, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // Protostar body — irregular, hot, glowing red-orange
      const body = ctx.createRadialGradient(cx - protostarR * 0.3, cy - protostarR * 0.3, 0, cx, cy, protostarR);
      body.addColorStop(0,   "#FFE0A0");
      body.addColorStop(0.4, "#FF8030");
      body.addColorStop(1,   "#A02010");
      ctx.beginPath();
      ctx.arc(cx, cy, protostarR * psPulse, 0, Math.PI * 2);
      ctx.fillStyle    = body;
      ctx.shadowColor  = "rgba(255, 130, 60, 0.9)";
      ctx.shadowBlur   = protostarR * 2;
      ctx.fill();
      ctx.shadowBlur   = 0;

      // ── Labels ────────────────────────────────────────────────────────────
      ctx.font      = "8px 'Jura', monospace";
      ctx.textAlign = "center";

      // Protostar label
      ctx.fillStyle = "#FFAF50";
      ctx.font      = "bold 10px 'Jura', monospace";
      ctx.fillText("PROTOSTAR", cx, cy - protostarR - 10);
      ctx.font      = "7px 'Jura', monospace";
      ctx.fillStyle = "rgba(220, 180, 140, 0.55)";
      ctx.fillText("(class 0/I YSO)", cx, cy - protostarR - 22);

      // Disk label
      ctx.font      = "9px 'Jura', monospace";
      ctx.fillStyle = "rgba(255, 180, 80, 0.65)";
      ctx.textAlign = "left";
      ctx.fillText("ACCRETION DISK", cx + diskOuterR + 6, cy);
      ctx.font      = "7px 'Jura', monospace";
      ctx.fillStyle = "rgba(255, 180, 80, 0.45)";
      ctx.fillText("(material falling in →)", cx + diskOuterR + 6, cy + 11);

      // Jet labels
      ctx.font      = "9px 'Jura', monospace";
      ctx.fillStyle = "rgba(180, 220, 255, 0.65)";
      ctx.textAlign = "center";
      ctx.fillText("BIPOLAR JET", cx, cy - jetLen + 14);
      ctx.fillText("BIPOLAR JET", cx, cy + jetLen - 4);

      // Title + descriptor
      if (w > 460) {
        ctx.font      = "8px 'Jura', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(120, 160, 200, 0.40)";
        ctx.fillText("⟳ PROTOSTAR — STAR FORMATION INSIDE A MOLECULAR CLOUD", 10, 16);

        ctx.textAlign = "right";
        ctx.fillStyle = "rgba(180, 100, 255, 0.40)";
        ctx.fillText("nebular remnant", w - 10, h - 8);
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
