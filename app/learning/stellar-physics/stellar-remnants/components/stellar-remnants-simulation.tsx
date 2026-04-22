"use client";

import { useEffect, useRef } from "react";

// ── Display radii (unscaled) ──────────────────────────────────────────────────
const WD_R       = 38;
const NS_R       = 4;
const BH_R       = 18;
const DISC_R     = 52;
const BEAM_LEN   = 90;
const DISC_INCL  = 0.18;   // nearly edge-on → Gargantua silhouette
const BEAM_SPEED = 0.050;

// ── Disc particles ────────────────────────────────────────────────────────────
const DISC_PARTICLES = Array.from({ length: 60 }, (_, i) => {
  const orbitR = BH_R + 4 + (i / 60) * (DISC_R - BH_R - 6);
  return {
    angle:  (i / 60) * Math.PI * 2,
    orbitR,
    speed:  0.035 * Math.pow(BH_R / orbitR, 0.5),
    size:   0.5 + Math.random() * 1.0,
    bright: Math.random(),
  };
});

export default function StellarRemnantsSimulation() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const frameRef   = useRef<number>(0);
  const timeRef    = useRef(0);
  const beamAngle  = useRef(0);
  const discAngles = useRef(DISC_PARTICLES.map((p) => p.angle));

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

    // ── White Dwarf ───────────────────────────────────────────────────────────
    const drawWhiteDwarf = (cx: number, cy: number, r: number, t: number) => {
      const pulse = 1 + Math.sin(t * 0.012) * 0.015;

      const outerGlow = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 3.5);
      outerGlow.addColorStop(0,   "rgba(180,200,255,0.30)");
      outerGlow.addColorStop(0.4, "rgba(140,170,255,0.10)");
      outerGlow.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, r * 3.5 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      const body = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, 0, cx, cy, r * pulse);
      body.addColorStop(0,   "#FFFFFF");
      body.addColorStop(0.3, "#E0ECFF");
      body.addColorStop(0.7, "#A0B8F0");
      body.addColorStop(1,   "#6070C0");
      ctx.beginPath();
      ctx.arc(cx, cy, r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.shadowColor = "#C0D8FF";
      ctx.shadowBlur  = r * 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    // ── Neutron Star — Elite Dangerous style ──────────────────────────────────
    const drawNeutronStar = (cx: number, cy: number, r: number, beam: number) => {
      // Two wide opposing cone beams — ED "flower" silhouette
      for (const offset of [0, Math.PI]) {
        const a     = beam + offset;
        const halfW = 0.55; // ~31° — wide ED-style cone

        // Outermost soft halo
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, BEAM_LEN, a - halfW * 1.5, a + halfW * 1.5);
        ctx.closePath();
        ctx.fillStyle = "rgba(30,100,220,0.04)";
        ctx.fill();

        // Six layered cones fading to a bright white spine
        const layers: [number, number, number][] = [
          [0.06, 1.30, 1.00],
          [0.11, 1.05, 0.91],
          [0.17, 0.80, 0.82],
          [0.26, 0.56, 0.71],
          [0.38, 0.34, 0.59],
          [0.55, 0.16, 0.46],
        ];
        for (const [alpha, wMul, lenF] of layers) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, BEAM_LEN * lenF, a - halfW * wMul, a + halfW * wMul);
          ctx.closePath();
          ctx.fillStyle = `rgba(100,210,255,${alpha.toFixed(2)})`;
          ctx.fill();
        }

        // Bright white spine
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, BEAM_LEN * 0.38, a - 0.035, a + 0.035);
        ctx.closePath();
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.fill();
      }

      // Faint equatorial disc glow (perpendicular to beam axis)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(beam + Math.PI * 0.5);
      ctx.scale(1, 0.22);
      const eqGrad = ctx.createRadialGradient(0, 0, r * 2, 0, 0, r * 8);
      eqGrad.addColorStop(0,   "rgba(50,150,255,0.16)");
      eqGrad.addColorStop(0.6, "rgba(30,100,200,0.06)");
      eqGrad.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(0, 0, r * 8, 0, Math.PI * 2);
      ctx.fillStyle = eqGrad;
      ctx.fill();
      ctx.restore();

      // Core halo
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 10);
      glow.addColorStop(0,    "rgba(255,255,255,0.85)");
      glow.addColorStop(0.06, "rgba(210,245,255,0.65)");
      glow.addColorStop(0.18, "rgba(120,210,255,0.35)");
      glow.addColorStop(0.45, "rgba(60,150,255,0.12)");
      glow.addColorStop(1,    "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, r * 10, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Tiny blinding core
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "#80F0FF";
      ctx.shadowBlur  = r * 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    // ── Black Hole — Gargantua / Interstellar style ───────────────────────────
    const drawBlackHole = (cx: number, cy: number, rBH: number, rDisc: number) => {
      const ry = (r: number) => r * DISC_INCL;

      // 1. Outer diffuse amber glow
      const outerGlow = ctx.createRadialGradient(cx, cy, rBH, cx, cy, rDisc * 2.0);
      outerGlow.addColorStop(0,   "rgba(255,150,30,0.18)");
      outerGlow.addColorStop(0.4, "rgba(180,80,10,0.08)");
      outerGlow.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.ellipse(cx, cy, rDisc * 2.0, ry(rDisc * 2.0), 0, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // 2. Back half of disc (behind BH — lower screen region)
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx - rDisc * 2, cy, rDisc * 4, rDisc * 2);
      ctx.clip();
      drawDiscBands(cx, cy, rBH, rDisc, ry);
      ctx.restore();

      // 3. Photon ring shadow (circular — shadow is always a sphere)
      const photonRing = ctx.createRadialGradient(cx, cy, rBH * 0.86, cx, cy, rBH * 1.55);
      photonRing.addColorStop(0,    "rgba(0,0,0,1)");
      photonRing.addColorStop(0.60, "rgba(0,0,0,1)");
      photonRing.addColorStop(0.74, "rgba(255,160,40,0.55)");
      photonRing.addColorStop(0.88, "rgba(255,220,130,0.25)");
      photonRing.addColorStop(1,    "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, rBH * 1.55, 0, Math.PI * 2);
      ctx.fillStyle = photonRing;
      ctx.fill();

      // 4. Event horizon
      ctx.beginPath();
      ctx.arc(cx, cy, rBH, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();

      // 5. Front half of disc (in front — upper screen region)
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx - rDisc * 2, cy - rDisc * 2, rDisc * 4, rDisc * 2);
      ctx.clip();
      drawDiscBands(cx, cy, rBH, rDisc, ry);
      drawDiscParticles(cx, cy, ry);
      ctx.restore();

      // 6. Re-occlude event horizon over front particles
      ctx.beginPath();
      ctx.arc(cx, cy, rBH * 0.97, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();

      // 7. Lensed ghost arc — gravitational lensing makes back disc appear above shadow
      drawLensedArc(cx, cy, rBH, rDisc);

      // 8. Doppler brightening — left (approaching) side is brighter
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, rDisc * 1.05, ry(rDisc * 1.05), 0, 0, Math.PI * 2);
      ctx.clip();
      const dopplerGrad = ctx.createLinearGradient(cx - rDisc, cy, cx + rDisc, cy);
      dopplerGrad.addColorStop(0,    "rgba(255,230,150,0.32)");
      dopplerGrad.addColorStop(0.25, "rgba(255,200,80,0.16)");
      dopplerGrad.addColorStop(0.50, "rgba(0,0,0,0)");
      dopplerGrad.addColorStop(0.75, "rgba(0,0,0,0.08)");
      dopplerGrad.addColorStop(1,    "rgba(0,0,0,0.16)");
      ctx.fillStyle = dopplerGrad;
      ctx.fillRect(cx - rDisc * 1.1, cy - ry(rDisc) * 4, rDisc * 2.2, ry(rDisc) * 8);
      ctx.restore();
    };

    // Lensed arc: back of disc appears above the event horizon due to light bending
    const drawLensedArc = (cx: number, cy: number, rBH: number, rDisc: number) => {
      for (let pass = 0; pass < 5; pass++) {
        const expand = pass * 1.2;
        const alpha  = 0.75 - pass * 0.13;
        const thick  = Math.max(0.5, 3.0 - pass * 0.45);

        // Gradient encodes Doppler: left (approaching) side brighter/warmer
        const grad = ctx.createLinearGradient(cx - rDisc * 0.9, cy, cx + rDisc * 0.9, cy);
        grad.addColorStop(0,    "rgba(255,240,160,0)");
        grad.addColorStop(0.06, `rgba(255,255,210,${(alpha * 1.15).toFixed(2)})`);
        grad.addColorStop(0.28, `rgba(255,240,160,${alpha.toFixed(2)})`);
        grad.addColorStop(0.50, `rgba(240,180,60,${(alpha * 0.72).toFixed(2)})`);
        grad.addColorStop(0.70, `rgba(180,100,20,${(alpha * 0.38).toFixed(2)})`);
        grad.addColorStop(0.90, `rgba(120,50,5,${(alpha * 0.14).toFixed(2)})`);
        grad.addColorStop(1,    "rgba(80,20,0,0)");

        ctx.beginPath();
        ctx.moveTo(cx - rDisc * 0.82 - expand, cy - rBH * 0.92);
        ctx.quadraticCurveTo(
          cx, cy - rBH * 1.65 - expand * 0.4,
          cx + rDisc * 0.82 + expand, cy - rBH * 0.92,
        );
        ctx.strokeStyle = grad;
        ctx.lineWidth   = thick;
        ctx.stroke();
      }
    };

    const drawDiscBands = (
      cx: number, cy: number,
      rBH: number, rDisc: number,
      ry: (r: number) => number,
    ) => {
      const BANDS = 8;
      for (let band = 0; band < BANDS; band++) {
        const frac  = band / BANDS;
        const inner = rBH * 1.06 + (rDisc - rBH * 1.06) * frac;
        const outer = rBH * 1.06 + (rDisc - rBH * 1.06) * ((band + 1) / BANDS);
        const heat  = Math.pow(1 - frac, 1.6);
        const g     = Math.round(60 + heat * 180);
        const b     = Math.round(heat * 70);
        const a     = 0.80 - frac * 0.48;

        ctx.beginPath();
        ctx.ellipse(cx, cy, outer, ry(outer), 0, 0, Math.PI * 2);
        ctx.ellipse(cx, cy, inner, ry(inner), 0, 0, Math.PI * 2, true);
        ctx.fillStyle = `rgba(255,${g},${b},${a.toFixed(2)})`;
        ctx.fill("evenodd");
      }
    };

    const drawDiscParticles = (
      cx: number, cy: number,
      ry: (r: number) => number,
    ) => {
      DISC_PARTICLES.forEach((p, i) => {
        const angle   = discAngles.current[i];
        const px      = cx + Math.cos(angle) * p.orbitR;
        const py      = cy + Math.sin(angle) * ry(p.orbitR);
        const doppler = 0.5 + Math.max(0, -Math.cos(angle)) * 0.5;
        const bright  = (0.30 + p.bright * 0.50) * (0.7 + doppler * 0.3);
        const gVal    = Math.round(120 + p.bright * 80 + doppler * 50);
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,${gVal},${Math.round(p.bright * 50)},${bright.toFixed(2)})`;
        ctx.fill();
      });
    };

    // ── Labels ────────────────────────────────────────────────────────────────
    const drawLabel = (
      cx: number, top: number,
      title: string, titleColor: string,
      sub: string, stats: string[],
    ) => {
      ctx.textAlign = "center";
      ctx.font      = "bold 11px 'Jura', monospace";
      ctx.fillStyle = titleColor;
      ctx.fillText(title, cx, top);
      ctx.font      = "8px 'Jura', monospace";
      ctx.fillStyle = "rgba(100,160,220,0.45)";
      ctx.fillText(sub, cx, top + 14);
      stats.forEach((s, i) => {
        ctx.fillStyle = "rgba(160,160,160,0.40)";
        ctx.fillText(s, cx, top + 28 + i * 12);
      });
    };

    // ── Main loop ─────────────────────────────────────────────────────────────
    const tick = () => {
      const w     = canvas.width;
      const h     = canvas.height;
      const scale = Math.min(w / 3, h) * 0.36 / (DISC_R + 10);

      ctx.clearRect(0, 0, w, h);
      timeRef.current++;
      beamAngle.current += BEAM_SPEED;
      discAngles.current = discAngles.current.map((a, i) => a + DISC_PARTICLES[i].speed);

      const colW = w / 3;
      const midY = h * 0.46;

      // ── White Dwarf ────────────────────────────────────────────────────────
      drawWhiteDwarf(colW * 0.5, midY, WD_R * scale, timeRef.current);
      drawLabel(
        colW * 0.5, midY + WD_R * scale * 1.4 + 14,
        "WHITE DWARF", "rgba(180,200,255,0.80)",
        "LOW / MID-MASS REMNANT",
        ["~7,000 KM RADIUS", "~0.6 M☉ AVG", "ELECTRON DEGENERACY"],
      );

      ctx.beginPath();
      ctx.moveTo(colW, h * 0.10);
      ctx.lineTo(colW, h * 0.90);
      ctx.strokeStyle = "rgba(100,140,200,0.07)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Neutron Star ───────────────────────────────────────────────────────
      drawNeutronStar(colW * 1.5, midY, NS_R * scale, beamAngle.current);
      drawLabel(
        colW * 1.5, midY + BEAM_LEN * scale * 0.55 + 14,
        "NEUTRON STAR", "rgba(120,230,255,0.80)",
        "MASSIVE STAR REMNANT",
        ["~10 KM RADIUS", "1.4–3 M☉", "NEUTRON DEGENERACY"],
      );

      ctx.beginPath();
      ctx.moveTo(colW * 2, h * 0.10);
      ctx.lineTo(colW * 2, h * 0.90);
      ctx.strokeStyle = "rgba(100,140,200,0.07)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Black Hole ─────────────────────────────────────────────────────────
      drawBlackHole(colW * 2.5, midY, BH_R * scale, DISC_R * scale);
      drawLabel(
        colW * 2.5, midY + DISC_R * scale + 24,
        "BLACK HOLE", "rgba(180,120,255,0.75)",
        "VERY MASSIVE STAR REMNANT",
        [">30 KM HORIZON (10 M☉)", ">3 M☉", "SINGULARITY"],
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
