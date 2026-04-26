"use client";

import { useEffect, useRef } from "react";

// ── Lens equation (point mass) ───────────────────────────────────────────────
// θ² − β θ − θ_E² = 0  →  two images: θ± = (β ± √(β² + 4 θ_E²)) / 2
// For each background source at angular separation β from the lens, two images
// appear along the lens-source line. Tangential and radial magnifications are
// the eigenvalues of the lensing Jacobian.

const THETA_E_PX     = 70;      // Einstein radius in pixels
const NUM_BG_STARS   = 60;
const LENS_SPEED     = 0.55;    // Pixels per frame
const TWO_PI         = Math.PI * 2;

// Visual caps so very-near-alignment doesn't produce infinite ellipses
const MAX_TANGENT    = 6.0;
const MIN_DRAW_MAG   = 0.05;

type Star = {
  x: number;            // True (unlensed) angular position in pixels
  y: number;
  size: number;
  tint: string;
  feature: boolean;     // Bright feature star, placed on lens path
};

export default function GravitationalLensingSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);

  const stars     = useRef<Star[]>([]);
  const lensX     = useRef(0);
  const initialised = useRef(false);

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

      // (Re)place stars whenever canvas is sized — ensures coverage of new area
      const w = canvas.width;
      const h = canvas.height;
      const yPath = h * 0.5;
      const tints = ["#FFFFFF", "#DCEAFF", "#FFEAC8", "#E8D8FF", "#D8FFE8"];

      const newStars: Star[] = [];
      for (let i = 0; i < NUM_BG_STARS; i++) {
        // Avoid placing background stars right on the path so feature stars dominate ring events
        const yJitter = (Math.random() - 0.5) * h * 0.85;
        newStars.push({
          x:       Math.random() * w,
          y:       yPath + yJitter,
          size:    Math.random() * 1.0 + 0.5,
          tint:    tints[Math.floor(Math.random() * tints.length)],
          feature: false,
        });
      }
      // Feature stars: bright, on lens path → produce clean ring/arc events
      [0.30, 0.65, 0.92].forEach((fx) => {
        newStars.push({
          x:       w * fx,
          y:       yPath,
          size:    1.6,
          tint:    "#FFE8B0",
          feature: true,
        });
      });
      stars.current = newStars;

      if (!initialised.current) {
        lensX.current = -THETA_E_PX;
        initialised.current = true;
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    // ── Drawing helpers ───────────────────────────────────────────────────────

    const drawLens = (cx: number, cy: number) => {
      const rDisc = 14;
      const rRing = 22;

      // Outer accretion-glow halo
      const halo = ctx.createRadialGradient(cx, cy, rRing, cx, cy, rRing + 14);
      halo.addColorStop(0, "rgba(255,160,80,0.25)");
      halo.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, rRing + 14, 0, TWO_PI);
      ctx.fillStyle = halo;
      ctx.fill();

      // Photon ring
      ctx.beginPath();
      ctx.arc(cx, cy, rRing, 0, TWO_PI);
      ctx.strokeStyle = "rgba(255,200,120,0.55)";
      ctx.lineWidth   = 1.2;
      ctx.stroke();

      // Event horizon disc
      ctx.beginPath();
      ctx.arc(cx, cy, rDisc, 0, TWO_PI);
      ctx.fillStyle   = "#000";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,180,90,0.40)";
      ctx.lineWidth   = 1;
      ctx.stroke();
    };

    const drawEinsteinRingGuide = (cx: number, cy: number) => {
      ctx.beginPath();
      ctx.arc(cx, cy, THETA_E_PX, 0, TWO_PI);
      ctx.strokeStyle = "rgba(140,200,255,0.12)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawStarImage = (
      cx: number, cy: number,
      lx: number, ly: number,
      muT: number, muR: number,
      base: number, tint: string,
    ) => {
      const dx = cx - lx;
      const dy = cy - ly;
      const angle = Math.atan2(dy, dx);

      const aT = base * Math.min(MAX_TANGENT, Math.max(0.4, Math.abs(muT))); // tangential
      const aR = base * Math.min(2.0,        Math.max(0.4, Math.abs(muR))); // radial

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);                     // local x = radial, local y = tangential

      // Soft glow
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(aT, aR) * 2.4);
      glow.addColorStop(0, "rgba(255,255,240,0.25)");
      glow.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.ellipse(0, 0, aR * 2.4, aT * 2.4, 0, 0, TWO_PI);
      ctx.fillStyle = glow;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.ellipse(0, 0, aR, aT, 0, 0, TWO_PI);
      ctx.fillStyle = tint;
      ctx.fill();

      ctx.restore();
    };

    // ── Main loop ─────────────────────────────────────────────────────────────

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Deep-space backdrop (very subtle)
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "rgba(8,10,22,0.45)");
      bg.addColorStop(1, "rgba(15,15,35,0.45)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Advance lens
      lensX.current += LENS_SPEED;
      if (lensX.current > w + THETA_E_PX) lensX.current = -THETA_E_PX;

      const lx = lensX.current;
      const ly = h * 0.5;

      // ── Render each background star's two images ───────────────────────────
      const θE  = THETA_E_PX;
      const θE2 = θE * θE;

      for (const s of stars.current) {
        const dx   = s.x - lx;
        const dy   = s.y - ly;
        const beta = Math.hypot(dx, dy);
        if (beta < 0.001) continue; // exact alignment — handled below as ring

        const u    = beta / θE;        // dimensionless impact parameter
        const root = Math.sqrt(beta * beta + 4 * θE2);
        const θp   =  (beta + root) / 2; // outer image, > θE
        const θm   =  (beta - root) / 2; // inner image, |θm| < θE, opposite side

        // Magnifications (Jacobian eigenvalues for a point lens)
        // For an image at radius θ:  μ_t = 1/(1 - θE²/θ²),  μ_r = 1/(1 + θE²/θ²)
        const mtP = 1 / (1 - θE2 / (θp * θp));
        const mrP = 1 / (1 + θE2 / (θp * θp));
        const mtM = 1 / (1 - θE2 / (θm * θm));
        const mrM = 1 / (1 + θE2 / (θm * θm));

        const ux = dx / beta;
        const uy = dy / beta;

        // Outer image (always drawn)
        const xP = lx + ux * θp;
        const yP = ly + uy * θp;
        drawStarImage(xP, yP, lx, ly, mtP, mrP, s.size, s.tint);

        // Inner image (often faint; skip when negligible)
        const muMTotal =
          ((u * u + 2) / (2 * u * Math.sqrt(u * u + 4))) - 0.5;
        if (muMTotal > MIN_DRAW_MAG && Math.abs(θm) > 0.6) {
          const xM = lx + ux * θm;   // θm < 0 → pulls in opposite direction
          const yM = ly + uy * θm;
          drawStarImage(xM, yM, lx, ly, mtM, mrM, s.size * 0.85, s.tint);
        }

        // Einstein ring flash for feature stars at near-perfect alignment
        if (s.feature && u < 0.18) {
          const ringAlpha = (0.18 - u) / 0.18 * 0.85;
          ctx.beginPath();
          ctx.arc(lx, ly, θE, 0, TWO_PI);
          ctx.strokeStyle = `rgba(255,232,176,${ringAlpha.toFixed(3)})`;
          ctx.lineWidth   = 1 + (0.18 - u) * 18;
          ctx.stroke();

          // Inner highlight
          ctx.beginPath();
          ctx.arc(lx, ly, θE, 0, TWO_PI);
          ctx.strokeStyle = `rgba(255,255,220,${(ringAlpha * 0.6).toFixed(3)})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }

      // ── Lens & Einstein-radius guide ───────────────────────────────────────
      drawEinsteinRingGuide(lx, ly);
      drawLens(lx, ly);

      // ── Labels (shortened on narrow viewports) ─────────────────────────────
      const narrow = w < 520;
      ctx.font      = "10px 'Jura', monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(140,200,160,0.55)";
      ctx.fillText("BACKGROUND STARFIELD", 14, 18);
      ctx.fillStyle = "rgba(140,140,140,0.40)";
      ctx.fillText(
        narrow ? "TWO IMAGES PER SOURCE" : "EACH SOURCE PRODUCES TWO IMAGES IN A POINT-LENS GEOMETRY",
        14, 32,
      );

      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(255,200,120,0.55)";
      ctx.fillText(narrow ? "LENS" : "FOREGROUND COMPACT MASS", w - 14, 18);
      ctx.fillStyle = "rgba(140,140,140,0.40)";
      ctx.fillText(
        narrow ? `θ_E = ${THETA_E_PX}px` : `θ_E = ${THETA_E_PX}px  (DASHED CIRCLE)`,
        w - 14, 32,
      );

      // Lens position readout
      ctx.font      = "9px 'Jura', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(100,160,220,0.45)";
      ctx.fillText(
        narrow ? "WATCH FOR ARCS & EINSTEIN RINGS" : "LENS DRIFTS — WATCH FOR ARCS, MULTIPLE IMAGES, AND EINSTEIN RINGS",
        w * 0.5, h - 8,
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
