"use client";

import { useEffect, useRef } from "react";

// ── Bezier helper ───────────────────────────────────────────────────────────

interface Pt { x: number; y: number; }

const cubicBezier = (t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt => {
  const u = 1 - t;
  return {
    x: u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
    y: u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y,
  };
};

export default function BinaryStarsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const timeRef   = useRef(0);

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

      const compact = w < 560;

      // ── Geometry ──────────────────────────────────────────────────────────
      const cx = w / 2;
      const cy = h * 0.50;
      const scale = Math.min(w / 700, h / 480);

      // Donor (red giant, Roche-lobe-overflowing)
      const donorCx = cx - w * 0.18;
      const donorCy = cy;
      const donorRx = 95 * scale;   // stretched toward L1 (right)
      const donorRy = 78 * scale;

      // L1 Lagrange point — at the right edge of the donor's tear-drop
      const L1x = donorCx + donorRx;
      const L1y = donorCy;

      // Accretor (white dwarf) — well inside its smaller Roche lobe
      const accCx = cx + w * 0.22;
      const accCy = cy;
      const accR  = 5 * scale;

      // Accretion disk
      const diskOuter = 56 * scale;
      const diskInner = accR * 1.6;

      // Stream control points (Bezier curve from L1 around the accretor)
      const stream = {
        p0: { x: L1x,                          y: L1y                       },
        p1: { x: cx + w * 0.04,                y: cy + 90 * scale           },
        p2: { x: accCx - 30 * scale,           y: cy + 38 * scale           },
        p3: { x: accCx - diskOuter * 0.55,     y: cy + diskOuter * 0.32     },
      };

      // ── Subtle background gradient ────────────────────────────────────────
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
      bg.addColorStop(0,   "rgba(255, 180, 100, 0.025)");
      bg.addColorStop(0.5, "rgba(120, 80, 60, 0.015)");
      bg.addColorStop(1,   "transparent");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // ── Faint Roche lobe outlines ─────────────────────────────────────────
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1;

      // Donor lobe (slightly larger than the donor)
      ctx.beginPath();
      ctx.ellipse(donorCx + 5 * scale, donorCy, donorRx + 6 * scale, donorRy + 5 * scale, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 175, 100, 0.18)";
      ctx.stroke();

      // Accretor lobe
      ctx.beginPath();
      ctx.ellipse(accCx + 8 * scale, accCy, 80 * scale, 64 * scale, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(160, 200, 255, 0.18)";
      ctx.stroke();

      ctx.setLineDash([]);

      // ── Donor (red giant — elongated body) ────────────────────────────────
      // Outer corona/halo
      const donorHalo = ctx.createRadialGradient(donorCx, donorCy, donorRx * 0.5, donorCx, donorCy, donorRx * 1.6);
      donorHalo.addColorStop(0,   "rgba(255, 160, 80, 0.30)");
      donorHalo.addColorStop(0.5, "rgba(255, 120, 60, 0.10)");
      donorHalo.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.ellipse(donorCx, donorCy, donorRx * 1.5, donorRy * 1.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = donorHalo;
      ctx.fill();

      // Donor body — elongated ellipse, gradient warm core to cool surface
      const donorPulse = 1 + Math.sin(t * 0.025) * 0.015;
      const donorBody = ctx.createRadialGradient(donorCx - donorRx * 0.25, donorCy - donorRy * 0.25, 0, donorCx, donorCy, donorRx * 1.05);
      donorBody.addColorStop(0,    "#FFE0A0");
      donorBody.addColorStop(0.4,  "#FF9050");
      donorBody.addColorStop(0.85, "#C04020");
      donorBody.addColorStop(1,    "#702010");
      ctx.beginPath();
      ctx.ellipse(donorCx, donorCy, donorRx * donorPulse, donorRy * donorPulse, 0, 0, Math.PI * 2);
      ctx.fillStyle    = donorBody;
      ctx.shadowColor  = "rgba(255, 120, 60, 0.7)";
      ctx.shadowBlur   = donorRx * 0.6;
      ctx.fill();
      ctx.shadowBlur   = 0;

      // Donor surface convection cells (subtle moving blobs)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(donorCx, donorCy, donorRx, donorRy, 0, 0, Math.PI * 2);
      ctx.clip();
      for (let i = 0; i < 6; i++) {
        const phase = t * 0.0008 + i * 1.04;
        const lon   = ((Math.sin(phase) + 1) % 2) - 1;
        const lat   = Math.cos(phase * 0.7 + i) * 0.6;
        const limbDim = 1 - Math.min(1, Math.abs(lon) * 0.85);
        const px = donorCx + lon * donorRx * 0.85;
        const py = donorCy + lat * donorRy * 0.85;
        const sr = (12 + Math.sin(phase * 1.3) * 4) * scale * limbDim;
        if (sr <= 1) continue;
        const blob = ctx.createRadialGradient(px, py, 0, px, py, sr);
        blob.addColorStop(0,   "rgba(255, 200, 120, 0.45)");
        blob.addColorStop(1,   "transparent");
        ctx.beginPath();
        ctx.arc(px, py, sr, 0, Math.PI * 2);
        ctx.fillStyle = blob;
        ctx.fill();
      }
      ctx.restore();

      // L1 indicator — small bright spot at the cusp
      const l1Pulse = 0.6 + 0.4 * Math.sin(t * 0.06);
      const l1Grad  = ctx.createRadialGradient(L1x, L1y, 0, L1x, L1y, 10 * scale);
      l1Grad.addColorStop(0,   `rgba(255, 240, 200, ${l1Pulse})`);
      l1Grad.addColorStop(0.4, `rgba(255, 180, 100, ${l1Pulse * 0.6})`);
      l1Grad.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(L1x, L1y, 10 * scale, 0, Math.PI * 2);
      ctx.fillStyle = l1Grad;
      ctx.fill();

      // ── Mass-transfer stream ──────────────────────────────────────────────
      // Faint guide curve
      ctx.beginPath();
      ctx.moveTo(stream.p0.x, stream.p0.y);
      ctx.bezierCurveTo(stream.p1.x, stream.p1.y, stream.p2.x, stream.p2.y, stream.p3.x, stream.p3.y);
      ctx.strokeStyle = "rgba(255, 200, 130, 0.10)";
      ctx.lineWidth   = 4 * scale;
      ctx.stroke();

      // Stream particles (animated along the curve)
      const numParticles = 36;
      const speed = 0.0028;
      for (let i = 0; i < numParticles; i++) {
        const tp = ((i / numParticles) + t * speed) % 1;
        const p  = cubicBezier(tp, stream.p0, stream.p1, stream.p2, stream.p3);
        // Particles accelerate as they fall — bigger and brighter near the disk
        const accel = 0.4 + tp * 0.9;
        const sz    = (1.0 + tp * 1.8) * scale;
        const alpha = 0.35 + tp * 0.55;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz * 4);
        grad.addColorStop(0,   `rgba(255, 230, 160, ${alpha})`);
        grad.addColorStop(0.5, `rgba(255, 160, 70,  ${alpha * 0.5})`);
        grad.addColorStop(1,   "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz * 4 * accel, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 250, 220, ${alpha})`;
        ctx.fill();
      }

      // ── Accretion disk (tilted) ───────────────────────────────────────────
      const tilt   = 0.32;
      const phase  = t * 0.025;

      ctx.save();
      ctx.translate(accCx, accCy);
      ctx.scale(1, tilt);

      // Disk body — hot inner, cool outer
      const diskGrad = ctx.createRadialGradient(0, 0, diskInner, 0, 0, diskOuter);
      diskGrad.addColorStop(0,   "rgba(255, 240, 180, 0.85)");
      diskGrad.addColorStop(0.4, "rgba(255, 150, 60,  0.6)");
      diskGrad.addColorStop(0.8, "rgba(180, 60, 30,   0.35)");
      diskGrad.addColorStop(1,   "rgba(120, 40, 20,   0)");
      ctx.beginPath();
      ctx.arc(0, 0, diskOuter, 0, Math.PI * 2);
      ctx.fillStyle = diskGrad;
      ctx.fill();

      // Punch out the inner hole
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(0, 0, diskInner, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      // Orbiting hot spots
      for (let i = 0; i < 24; i++) {
        const a    = (i / 24) * Math.PI * 2 + phase * (1 + (i % 3) * 0.18);
        const off  = ((i * 17) % 10) / 10;
        const ringR = diskInner + (diskOuter - diskInner) * (0.18 + 0.7 * off);
        const px    = Math.cos(a) * ringR;
        const py    = Math.sin(a) * ringR;
        ctx.beginPath();
        ctx.arc(px, py, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 240, 200, 0.85)";
        ctx.fill();
      }

      ctx.restore();

      // ── Hot spot (where stream meets disk) ────────────────────────────────
      const hotPulse = 0.7 + 0.3 * Math.sin(t * 0.08);
      const hsGrad = ctx.createRadialGradient(stream.p3.x, stream.p3.y, 0, stream.p3.x, stream.p3.y, 22 * scale);
      hsGrad.addColorStop(0,   `rgba(255, 250, 220, ${hotPulse})`);
      hsGrad.addColorStop(0.4, `rgba(255, 180, 80,  ${hotPulse * 0.6})`);
      hsGrad.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(stream.p3.x, stream.p3.y, 22 * scale, 0, Math.PI * 2);
      ctx.fillStyle = hsGrad;
      ctx.fill();

      // Hot-spot core
      ctx.beginPath();
      ctx.arc(stream.p3.x, stream.p3.y, 3 * scale, 0, Math.PI * 2);
      ctx.fillStyle   = "#FFFFFF";
      ctx.shadowColor = "#FFFFE0";
      ctx.shadowBlur  = 12 * scale;
      ctx.fill();
      ctx.shadowBlur  = 0;

      // ── Accretor (white dwarf) ────────────────────────────────────────────
      // Halo
      const accHalo = ctx.createRadialGradient(accCx, accCy, accR * 0.3, accCx, accCy, accR * 4);
      accHalo.addColorStop(0,   "rgba(220, 235, 255, 0.55)");
      accHalo.addColorStop(0.5, "rgba(180, 210, 255, 0.18)");
      accHalo.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(accCx, accCy, accR * 4, 0, Math.PI * 2);
      ctx.fillStyle = accHalo;
      ctx.fill();

      // Body
      const accBody = ctx.createRadialGradient(accCx - accR * 0.3, accCy - accR * 0.3, 0, accCx, accCy, accR);
      accBody.addColorStop(0,   "#FFFFFF");
      accBody.addColorStop(0.4, "#E8F0FF");
      accBody.addColorStop(1,   "#A0BFFF");
      ctx.beginPath();
      ctx.arc(accCx, accCy, accR, 0, Math.PI * 2);
      ctx.fillStyle    = accBody;
      ctx.shadowColor  = "rgba(180, 210, 255, 0.9)";
      ctx.shadowBlur   = accR * 4;
      ctx.fill();
      ctx.shadowBlur   = 0;

      // ── Common centre of mass marker ─────────────────────────────────────
      const comX = donorCx + (accCx - donorCx) * 0.78;  // closer to accretor (donor more massive)
      const comY = cy;
      ctx.beginPath();
      ctx.moveTo(comX - 5 * scale, comY);
      ctx.lineTo(comX + 5 * scale, comY);
      ctx.moveTo(comX, comY - 5 * scale);
      ctx.lineTo(comX, comY + 5 * scale);
      ctx.strokeStyle = "rgba(200, 220, 240, 0.30)";
      ctx.lineWidth   = 0.8;
      ctx.stroke();

      // ── Labels ────────────────────────────────────────────────────────────
      ctx.font      = compact ? "9px 'Jura', monospace" : "10px 'Jura', monospace";
      ctx.textAlign = "center";

      // DONOR
      ctx.fillStyle = "#FFAF50";
      ctx.fillText("DONOR", donorCx, donorCy - donorRy - 18 * scale);
      ctx.font      = compact ? "7px 'Jura', monospace" : "8px 'Jura', monospace";
      ctx.fillStyle = "rgba(220,180,140,0.65)";
      ctx.fillText("(RED GIANT)", donorCx, donorCy - donorRy - 8 * scale);

      // ACCRETOR
      ctx.font      = compact ? "9px 'Jura', monospace" : "10px 'Jura', monospace";
      ctx.fillStyle = "#A0BFFF";
      ctx.fillText("ACCRETOR", accCx, accCy - diskOuter * tilt - 30 * scale);
      ctx.font      = compact ? "7px 'Jura', monospace" : "8px 'Jura', monospace";
      ctx.fillStyle = "rgba(180,200,240,0.65)";
      ctx.fillText("(WHITE DWARF)", accCx, accCy - diskOuter * tilt - 20 * scale);

      // L1 label with leader
      ctx.beginPath();
      ctx.moveTo(L1x, L1y - 10 * scale);
      ctx.lineTo(L1x, L1y - 30 * scale);
      ctx.strokeStyle = "rgba(255, 220, 160, 0.4)";
      ctx.lineWidth   = 0.8;
      ctx.stroke();
      ctx.font      = compact ? "8px 'Jura', monospace" : "9px 'Jura', monospace";
      ctx.fillStyle = "rgba(255, 220, 160, 0.85)";
      ctx.fillText("L1", L1x, L1y - 34 * scale);

      // ACCRETION DISK label
      ctx.font      = compact ? "8px 'Jura', monospace" : "9px 'Jura', monospace";
      ctx.fillStyle = "rgba(255, 180, 80, 0.75)";
      ctx.textAlign = "left";
      ctx.fillText("ACCRETION DISK", accCx + diskOuter + 6 * scale, accCy - 4);

      // HOT SPOT label
      ctx.beginPath();
      ctx.moveTo(stream.p3.x + 4 * scale, stream.p3.y + 4 * scale);
      ctx.lineTo(stream.p3.x + 26 * scale, stream.p3.y + 30 * scale);
      ctx.strokeStyle = "rgba(255, 240, 200, 0.4)";
      ctx.stroke();
      ctx.font      = compact ? "8px 'Jura', monospace" : "9px 'Jura', monospace";
      ctx.fillStyle = "rgba(255, 240, 200, 0.85)";
      ctx.textAlign = "left";
      ctx.fillText("HOT SPOT", stream.p3.x + 28 * scale, stream.p3.y + 34 * scale);

      // STREAM label
      const streamMid = cubicBezier(0.5, stream.p0, stream.p1, stream.p2, stream.p3);
      ctx.font      = compact ? "8px 'Jura', monospace" : "9px 'Jura', monospace";
      ctx.fillStyle = "rgba(255, 200, 100, 0.65)";
      ctx.textAlign = "center";
      ctx.fillText("MASS-TRANSFER STREAM", streamMid.x, streamMid.y + 22 * scale);

      // Centre-of-mass label
      ctx.font      = "7px 'Jura', monospace";
      ctx.fillStyle = "rgba(200, 220, 240, 0.40)";
      ctx.fillText("BARYCENTRE", comX, comY - 10 * scale);

      // Top hint: rotation indicator
      if (!compact) {
        ctx.font      = "8px 'Jura', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(120, 160, 200, 0.4)";
        ctx.fillText("⟳ SEMI-DETACHED MASS-TRANSFER BINARY", 10, 16);
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
