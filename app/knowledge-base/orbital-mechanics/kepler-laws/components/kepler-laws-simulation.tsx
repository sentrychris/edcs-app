"use client";

import { useEffect, useRef } from "react";

// Kepler's three laws — visualised in three panels.
// Law 1: Orbits are ellipses with the star at one focus.
// Law 2: A line from star to planet sweeps equal areas in equal times.
// Law 3: T² ∝ a³  (period squared proportional to semi-major axis cubed).

const drawStar = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color = "#FFD580",
) => {
  const g = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 4);
  g.addColorStop(0,   "rgba(255,213,128,0.55)");
  g.addColorStop(0.5, "rgba(255,213,128,0.10)");
  g.addColorStop(1,   "transparent");
  ctx.beginPath();
  ctx.arc(cx, cy, r * 4, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();

  const b = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
  b.addColorStop(0,   "#FFFFFF");
  b.addColorStop(0.4, color);
  b.addColorStop(1,   color);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle    = b;
  ctx.shadowColor  = color;
  ctx.shadowBlur   = r * 2;
  ctx.fill();
  ctx.shadowBlur   = 0;
};

const drawPlanet = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color = "#80B0E0",
) => {
  const halo = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.8);
  halo.addColorStop(0, "rgba(120,180,255,0.45)");
  halo.addColorStop(1, "transparent");
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.8, 0, Math.PI * 2);
  ctx.fillStyle = halo;
  ctx.fill();

  const b = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
  b.addColorStop(0,   "#A0D0FF");
  b.addColorStop(0.5, color);
  b.addColorStop(1,   "#0E2C5C");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = b;
  ctx.fill();
};

// True-anomaly solver — returns position on ellipse given mean anomaly M.
// We approximate by iterating Kepler's equation.
const solveKepler = (M: number, e: number): number => {
  let E = M;
  for (let i = 0; i < 5; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  return E;
};

const ellipsePos = (a: number, e: number, M: number) => {
  const E = solveKepler(M, e);
  // x along major axis (perihelion at +x relative to focus)
  const x = a * (Math.cos(E) - e);
  const y = a * Math.sqrt(1 - e * e) * Math.sin(E);
  return { x, y };
};

// ── Law 1 panel — ellipse with foci marked ──────────────────────────────────

const drawLaw1 = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, t: number,
) => {
  const cx       = x + w / 2;
  const labelH   = 56;
  const diagramH = h - labelH;
  const cy       = y + diagramH / 2;

  const a = Math.min(w, diagramH) * 0.36;
  const e = 0.55;
  const b = a * Math.sqrt(1 - e * e);
  const c = a * e;  // focus offset from centre

  const focusX = cx + c;          // star at +c (perihelion side)
  const otherFocusX = cx - c;

  // Ellipse outline
  ctx.beginPath();
  ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(150, 200, 255, 0.40)";
  ctx.lineWidth   = 1;
  ctx.stroke();

  // Major axis line (faint)
  ctx.beginPath();
  ctx.moveTo(cx - a, cy);
  ctx.lineTo(cx + a, cy);
  ctx.strokeStyle = "rgba(150, 200, 255, 0.15)";
  ctx.setLineDash([2, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Foci markers
  // Empty focus
  ctx.beginPath();
  ctx.arc(otherFocusX, cy, 3, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(180, 200, 220, 0.5)";
  ctx.lineWidth   = 1;
  ctx.stroke();

  // Star at focus
  drawStar(ctx, focusX, cy, 8);

  // Animated planet
  const M = t * 0.012;
  const p = ellipsePos(a, e, M);
  const px = focusX + p.x - c;   // shift so focus is "origin"... wait.
  // Simpler: orbit centred at cx,cy in ellipse coords, focus at cx+c.
  // The position from ellipse centre is (a(cosE - e), b sinE). So absolute:
  const planetX = cx + a * (Math.cos(solveKepler(M, e)) - e) + c;
  // Hmm. Actually a(cosE - e) is position from focus (since focus is at -c from centre... hmm)
  // Let me redo: standard ellipse param E, position from centre: (a cosE, b sinE).
  // Focus is at (c, 0) from centre. So position from focus is (a cosE - c, b sinE).
  // |position from focus| = a(1 - e cosE), ranges from a(1-e) to a(1+e).
  // For the planet to look right with star at focus, draw at centre + (a cosE, b sinE).
  const E   = solveKepler(M, e);
  const pos = { x: cx + a * Math.cos(E), y: cy + b * Math.sin(E) };
  // Suppress the unused planetX/p variable warnings
  void planetX; void p; void px;

  drawPlanet(ctx, pos.x, pos.y, 4);

  // Labels (perihelion / aphelion)
  ctx.font      = "8px 'Jura', monospace";
  ctx.fillStyle = "rgba(180, 200, 220, 0.55)";
  ctx.textAlign = "center";
  ctx.fillText("perihelion", cx + a, cy + b + 10);
  ctx.fillText("aphelion",   cx - a, cy + b + 10);

  ctx.font      = "7px 'Jura', monospace";
  ctx.fillStyle = "rgba(255, 213, 128, 0.55)";
  ctx.fillText("focus", focusX, cy - 14);
  ctx.fillStyle = "rgba(180, 200, 220, 0.40)";
  ctx.fillText("(empty)", otherFocusX, cy - 14);

  // Panel label
  const labelY = y + diagramH;
  ctx.font      = "bold 11px 'Jura', monospace";
  ctx.fillStyle = "#80B0FF";
  ctx.fillText("1ST LAW", cx, labelY + 14);
  ctx.font      = "8px 'Jura', monospace";
  ctx.fillStyle = "rgba(200,220,240,0.65)";
  ctx.fillText("Orbits are ellipses", cx, labelY + 28);
  ctx.fillStyle = "rgba(150,180,210,0.50)";
  ctx.fillText("with the star at one focus", cx, labelY + 40);
};

// ── Law 2 panel — equal areas swept in equal times ──────────────────────────

const drawLaw2 = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, t: number,
) => {
  const cx       = x + w / 2;
  const labelH   = 56;
  const diagramH = h - labelH;
  const cy       = y + diagramH / 2;

  const a = Math.min(w, diagramH) * 0.36;
  const e = 0.55;
  const b = a * Math.sqrt(1 - e * e);
  const c = a * e;
  const focusX = cx + c;

  // Ellipse
  ctx.beginPath();
  ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(150, 200, 255, 0.30)";
  ctx.lineWidth   = 1;
  ctx.stroke();

  // Sweep wedges — show 4 fixed-time-interval wedges
  // We pick mean anomaly intervals at known points.
  const nWedges = 4;
  const phaseOffset = (t * 0.012) % (2 * Math.PI / nWedges);  // animate sweep rotation

  for (let i = 0; i < nWedges; i++) {
    const M0 = (i * 2 * Math.PI / nWedges) + phaseOffset;
    const M1 = M0 + 0.55;  // fixed time interval

    const E0 = solveKepler(M0, e);
    const E1 = solveKepler(M1, e);
    const p0 = { x: cx + a * Math.cos(E0), y: cy + b * Math.sin(E0) };
    const p1 = { x: cx + a * Math.cos(E1), y: cy + b * Math.sin(E1) };

    // Wedge as triangle from focus → p0 → p1 (approximate — true wedge is curved)
    // Better: sample along the arc
    ctx.beginPath();
    ctx.moveTo(focusX, cy);
    const samples = 12;
    for (let s = 0; s <= samples; s++) {
      const M = M0 + (M1 - M0) * (s / samples);
      const E = solveKepler(M, e);
      ctx.lineTo(cx + a * Math.cos(E), cy + b * Math.sin(E));
    }
    ctx.closePath();

    // Colour wedges with a hint of speed
    ctx.fillStyle   = `rgba(120, 220, 160, 0.18)`;
    ctx.strokeStyle = `rgba(120, 220, 160, 0.35)`;
    ctx.lineWidth   = 1;
    ctx.fill();
    ctx.stroke();

    void p0; void p1;
  }

  // Star
  drawStar(ctx, focusX, cy, 8);

  // Animated planet showing speed variation
  const Mp = t * 0.012;
  const Ep = solveKepler(Mp, e);
  drawPlanet(ctx, cx + a * Math.cos(Ep), cy + b * Math.sin(Ep), 4);

  // Speed indicator labels
  ctx.font      = "7px 'Jura', monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(120, 220, 160, 0.7)";
  ctx.fillText("FAST", cx + a * 0.85, cy + b + 10);
  ctx.fillText("SLOW", cx - a * 0.85, cy + b + 10);

  // Panel label
  const labelY = y + diagramH;
  ctx.font      = "bold 11px 'Jura', monospace";
  ctx.fillStyle = "#80FFA0";
  ctx.fillText("2ND LAW", cx, labelY + 14);
  ctx.font      = "8px 'Jura', monospace";
  ctx.fillStyle = "rgba(200,240,220,0.65)";
  ctx.fillText("Equal areas in equal times", cx, labelY + 28);
  ctx.fillStyle = "rgba(160,200,180,0.50)";
  ctx.fillText("planet speeds up near the star", cx, labelY + 40);
};

// ── Law 3 panel — T² ∝ a³ ────────────────────────────────────────────────────

const drawLaw3 = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, t: number,
) => {
  const cx       = x + w / 2;
  const labelH   = 56;
  const diagramH = h - labelH;
  const cy       = y + diagramH / 2;

  // Three concentric circular orbits
  const orbits = [
    { a: 0.30, color: "#FFAF50", periodFactor: 1.0,                          label: "a"     },
    { a: 0.55, color: "#80B0FF", periodFactor: Math.pow(0.55 / 0.30, 1.5),   label: "1.8a"  },
    { a: 0.85, color: "#A0FFD0", periodFactor: Math.pow(0.85 / 0.30, 1.5),   label: "2.8a"  },
  ];

  const maxR = Math.min(w, diagramH) * 0.45;

  // Orbit paths
  orbits.forEach(o => {
    ctx.beginPath();
    ctx.arc(cx, cy, o.a * maxR, 0, Math.PI * 2);
    ctx.strokeStyle = `${o.color}40`;
    ctx.lineWidth   = 1;
    ctx.setLineDash([2, 4]);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // Star at centre
  drawStar(ctx, cx, cy, 8);

  // Planets — angular speed inversely proportional to T = a^1.5
  orbits.forEach(o => {
    const omega = 0.012 / o.periodFactor;  // smaller for outer orbits
    const angle = t * omega;
    const px    = cx + Math.cos(angle) * o.a * maxR;
    const py    = cy + Math.sin(angle) * o.a * maxR;
    drawPlanet(ctx, px, py, 3.5, o.color);
  });

  // Annotations: T values
  orbits.forEach((o, i) => {
    const py = cy + maxR + 12 + i * 10;
    ctx.font      = "7px 'Jura', monospace";
    ctx.fillStyle = `${o.color}AA`;
    ctx.textAlign = "left";
    ctx.fillText(`T ∝ ${o.label}^1.5`, x + 8, py - maxR - 8 + i * 11);
    void py;
  });

  // Panel label
  const labelY = y + diagramH;
  ctx.font      = "bold 11px 'Jura', monospace";
  ctx.fillStyle = "#FFA050";
  ctx.textAlign = "center";
  ctx.fillText("3RD LAW", cx, labelY + 14);
  ctx.font      = "8px 'Jura', monospace";
  ctx.fillStyle = "rgba(240,220,200,0.65)";
  ctx.fillText("T² ∝ a³", cx, labelY + 28);
  ctx.fillStyle = "rgba(200,180,160,0.50)";
  ctx.fillText("longer orbit ⇒ slower year", cx, labelY + 40);
};

export default function KeplerLawsSimulation() {
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

      const compact = w < 600;

      const ML = 4, MR = 4, MT = 8, MB = 8;
      const px = ML, py = MT;
      const pw = w - ML - MR;
      const ph = h - MT - MB;

      if (compact) {
        const rowH = ph / 3;
        drawLaw1(ctx, px, py + 0 * rowH, pw, rowH, t);
        drawLaw2(ctx, px, py + 1 * rowH, pw, rowH, t);
        drawLaw3(ctx, px, py + 2 * rowH, pw, rowH, t);
        for (let i = 1; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(px,        py + i * rowH);
          ctx.lineTo(px + pw,   py + i * rowH);
          ctx.strokeStyle = "rgba(100,150,200,0.10)";
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      } else {
        const colW = pw / 3;
        drawLaw1(ctx, px + 0 * colW, py, colW, ph, t);
        drawLaw2(ctx, px + 1 * colW, py, colW, ph, t);
        drawLaw3(ctx, px + 2 * colW, py, colW, ph, t);
        for (let i = 1; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(px + i * colW, py + 8);
          ctx.lineTo(px + i * colW, py + ph - 8);
          ctx.strokeStyle = "rgba(100,150,200,0.10)";
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
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
