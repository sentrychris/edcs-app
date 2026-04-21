"use client";

import { type FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MappedSystemBody } from "@/core/interfaces/SystemBody";
import type SystemMap from "../../lib/system-map";
import { SystemBodyType } from "@/core/constants/system";
import { systemDispatcher } from "@/core/events/SystemDispatcher";

interface NodeLayout {
  body: MappedSystemBody;
  x: number;
  y: number;
  depth: number;
  size: number;
  visible: number;
  labelSide: "below" | "right";
}

interface Edge {
  parent: NodeLayout;
  child: NodeLayout;
}

const LABEL_W = 100;
const LABEL_H = 40;
const LABEL_GAP = 38; // gap between node bottom and label top
const CELL_H_BUFFER = 28; // horizontal breathing room around each sibling
const ROW_V_GAP = 56; // vertical gap between a row's label strip and the next row's nodes
const ROOT_GAP = 80; // horizontal gap between separate root-star subtrees
const CANVAS_PAD = 72;
const VIEW_H = 520;

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 3;
const ZOOM_STEP = 1.2;

// Moons (depth 2+) stack vertically under their parent planet rather than
// spreading horizontally like depth 0/1. Deeper submoons indent right to
// preserve a readable tree shape while keeping the single vertical column.
const MOON_ROW_GAP = 32; // vertical gap between stacked moons
const MOON_TOP_GAP = 28; // gap between planet's label-bottom and first moon top
const MOON_LABEL_GAP = 28; // horizontal gap between a stacked moon and its right-side label
const MOON_INDENT = 22; // horizontal offset per depth step beyond 2 (submoons)

// Desired on-screen diameter (px) of the body's *visible* circle before sub-type
// scaling. Glow/ring padding is layered on top via viewBoxFactor; see below.
const DEPTH_VISIBLE: Record<number, number> = { 0: 96, 1: 58, 2: 38 };
const baseVisibleForDepth = (depth: number): number =>
  DEPTH_VISIBLE[Math.min(depth, 2)];

// EDSM may report a body as type "Star" even when our hierarchy code has
// reclassified it as a Planet (binary/companion stars orbiting another star).
// CSS styling lives on the raw type, so we want to check both.
const isStarLike = (body: MappedSystemBody): boolean => {
  if (body.type === SystemBodyType.Star) return true;
  if (body._type === SystemBodyType.Star) return true;
  const st = body.sub_type ?? "";
  return /\bstar\b|dwarf|black hole|neutron/i.test(st);
};

const rootToken = (body: MappedSystemBody): string => {
  if (body._type === SystemBodyType.Barycenter) return body._barycenter_token ?? "";
  const parts = body.name.trim().split(/\s+/);
  const last = parts[parts.length - 1];
  return /^[A-Z]$/.test(last) ? last : "A";
};

const isInteractive = (body: MappedSystemBody): boolean =>
  body._type !== SystemBodyType.Barycenter && body._type !== SystemBodyType.Null;

// Visual size multiplier based on body sub_type. Applied to the depth base
// so gas giants dwarf rocky/icy bodies while staying within their depth class.
const subTypeMultiplier = (body: MappedSystemBody): number => {
  if (isStarLike(body)) return 1.3;
  if (body._type === SystemBodyType.Barycenter) return 1.0;
  if (body._type === SystemBodyType.Null) return 0.55;

  const st = (body.sub_type ?? "").toLowerCase();
  if (st.includes("gas giant") || st.includes("water giant") || st.includes("helium")) return 1.35;
  if (st.includes("earth-like")) return 1.05;
  if (st.includes("water world") || st.includes("ammonia world")) return 1.0;
  if (st.includes("high metal content")) return 0.95;
  if (st.includes("metal-rich")) return 0.88;
  if (st.includes("rocky ice")) return 0.76;
  if (st.includes("rocky body")) return 0.78;
  if (st.includes("icy body")) return 0.7;
  return 0.9;
};

// ViewBox padding factor: how much empty space to reserve around the body in
// the SVG coordinate space so the CSS drop-shadow glow has room to render.
// Tree stars use a tree-scoped CSS override (system.css) that disables the
// oversized SVG url() filter and swaps the 15rem drop-shadow for a small
// rem-based one, so the padding here just needs to fit that smaller glow.
const viewBoxFactor = (body: MappedSystemBody): number => {
  const hasRings = body.rings && body.rings.length > 0;
  const st = body.sub_type ?? "";
  if (st === "Neutron Star" || st === "Black Hole") return 2.2;
  if (st.startsWith("White Dwarf")) return 2.0;
  if (isStarLike(body)) return hasRings ? 2.2 : 1.8;
  if (hasRings) return 2.4;
  if (body._type === SystemBodyType.Barycenter) return 1.15;
  return 1.25;
};

// Fixed reference size for the node's SVG viewBox. viewBoxFactor scales this
// to reserve padding for glow/rings. Per-body radius is constant in the tree —
// on-screen sizing is driven by the outer width/height (see computeBoxSize),
// not by the SVG-internal radius, so every body fills the same fraction of
// its viewBox regardless of its real _r.
const VIEWBOX_BASE = 2000;
const TREE_BODY_RADIUS = 3000;

const computeVisibleSize = (
  body: MappedSystemBody,
  depth: number,
  parentVisible?: number,
): number => {
  const base = baseVisibleForDepth(depth);
  let size = Math.round(base * subTypeMultiplier(body));
  if (parentVisible !== undefined) {
    size = Math.min(size, Math.round(parentVisible * 0.78));
  }
  return Math.max(size, 18);
};

const computeBoxSize = (body: MappedSystemBody, visible: number): number =>
  Math.round(visible * viewBoxFactor(body));

interface CardProps {
  body: MappedSystemBody;
  size: number;
}

const TreeNodeCard: FunctionComponent<CardProps> = ({ body, size }) => {
  const interactive = isInteractive(body);
  const handleClick = () => {
    if (!interactive) return;
    systemDispatcher.selectBody({ body, type: "display-body-panel" });
  };

  const radius = TREE_BODY_RADIUS;
  const extent = VIEWBOX_BASE * viewBoxFactor(body);
  const viewBox = `${-extent} ${-extent} ${extent * 2} ${extent * 2}`;
  const maskId = `tree-ring-mask-${body._type}-${body.body_id}`;

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
      style={{ width: size, height: size, overflow: "visible" }}
      className={
        interactive ? "system-tree__node-glow hover:cursor-pointer" : "opacity-80"
      }
      onClick={handleClick}
      onMouseDown={(e) => {
        // prevent starting a pan drag when clicking a body
        if (interactive) e.stopPropagation();
      }}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => {
        if (!interactive) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <g
        className="system-map__system-object"
        data-system-object-name={body.name}
        data-system-object-type={body.type ?? body._type}
        data-system-object-small={body._small}
        data-system-object-sub-type={body.sub_type}
        data-system-object-atmosphere={body.atmosphere_type}
        data-system-object-landable={body.is_landable === 1}
      >
        <g className="system-map__body">
          <g className="system-map__planet">
            <circle cx={0} cy={0} r={radius} />
            <circle className="system-map__planet-surface" cx={0} cy={0} r={radius} />
            {body.rings && body.rings.length > 0 && (
              <>
                <defs>
                  <mask id={maskId} className="system-map__planet-ring-mask">
                    <ellipse cx={0} cy={0} rx={radius * 2} ry={radius / 3} fill="white" />
                    <ellipse
                      cx={0}
                      cy={0 - radius / 5}
                      rx={radius}
                      ry={radius / 3}
                      fill="black"
                    />
                    <ellipse
                      cx={0}
                      cy={0 - radius / 15}
                      rx={radius * 1.2}
                      ry={radius / 5}
                      fill="black"
                    />
                  </mask>
                </defs>
                <ellipse
                  className="system-map__planet-ring"
                  cx={0}
                  cy={0}
                  rx={radius * 2}
                  ry={radius / 3}
                  mask={`url(#${maskId})`}
                  opacity="1"
                />
                <ellipse
                  className="system-map__planet-ring"
                  cx={0}
                  cy={0 - radius / 80}
                  rx={radius * 1.85}
                  ry={radius / 4.2}
                  mask={`url(#${maskId})`}
                  opacity=".25"
                />
              </>
            )}
          </g>
        </g>
      </g>
    </svg>
  );
};

interface Props {
  systemMap: SystemMap;
  height?: number | string;
}

const SystemBodiesTree: FunctionComponent<Props> = ({ systemMap, height: heightOverride }) => {
  const { nodes, edges, width, height } = useMemo(() => {
    const roots = [...systemMap.stars]
      .filter((s) => s._type !== SystemBodyType.Null || (s._children?.length ?? 0) > 0)
      .sort((a, b) => {
        if (a._type === SystemBodyType.Null) return 1;
        if (b._type === SystemBodyType.Null) return -1;
        return rootToken(a).localeCompare(rootToken(b));
      });

    const ns: NodeLayout[] = [];
    const es: Edge[] = [];

    // Horizontal width a sibling should occupy, including label width so
    // labels don't collide between neighbouring siblings.
    const cellWidthFor = (size: number) =>
      Math.max(size, LABEL_W) + CELL_H_BUFFER;

    interface MoonPlan {
      body: MappedSystemBody;
      parent: MappedSystemBody;
      depth: number;
      visible: number;
      size: number;
    }

    // Walk all descendants of a planet in DFS order, recording the display
    // size each moon would render at. Used both for sizing the planet's
    // horizontal cell and for the vertical post-layout pass.
    const collectMoons = (
      planet: MappedSystemBody,
      planetVisible: number,
    ): MoonPlan[] => {
      const out: MoonPlan[] = [];
      const walk = (
        parent: MappedSystemBody,
        parentVisible: number,
        depth: number,
      ) => {
        for (const child of parent._children ?? []) {
          const visible = computeVisibleSize(child, depth, parentVisible);
          const size = computeBoxSize(child, visible);
          out.push({ body: child, parent, depth, visible, size });
          walk(child, visible, depth + 1);
        }
      };
      walk(planet, planetVisible, 2);
      return out;
    };

    // Horizontal half-width a planet needs in order to keep its vertical
    // moon column (with right-side labels) inside its own cell.
    const planetHalfWidthFor = (
      planetSize: number,
      moons: MoonPlan[],
    ): number => {
      let right = Math.max(planetSize / 2, LABEL_W / 2);
      let left = Math.max(planetSize / 2, LABEL_W / 2);
      for (const m of moons) {
        const indent = (m.depth - 2) * MOON_INDENT;
        const r = indent + m.size / 2 + MOON_LABEL_GAP + LABEL_W;
        if (r > right) right = r;
        const l = m.size / 2 - indent;
        if (l > left) left = l;
      }
      return Math.max(left, right);
    };

    // Post-order: lay children out left-to-right, then center the parent
    // over them. Recursion stops at depth 1 (planets) — moons (depth 2+)
    // are laid out vertically in a second pass below. y is assigned later
    // once per-depth row heights are known.
    const layout = (
      body: MappedSystemBody,
      depth: number,
      xOffset: number,
      parentVisible?: number,
    ): { width: number; root: NodeLayout } => {
      const visible = computeVisibleSize(body, depth, parentVisible);
      const size = computeBoxSize(body, visible);
      const children = body._children ?? [];

      if (depth >= 1) {
        const moons = collectMoons(body, visible);
        const halfW = planetHalfWidthFor(size, moons);
        const cellW = halfW * 2 + CELL_H_BUFFER;
        const x = xOffset + cellW / 2;
        const node: NodeLayout = {
          body,
          x,
          y: 0,
          depth,
          size,
          visible,
          labelSide: "below",
        };
        ns.push(node);
        return { width: cellW, root: node };
      }

      if (children.length === 0) {
        const cellW = cellWidthFor(size);
        const x = xOffset + cellW / 2;
        const node: NodeLayout = {
          body,
          x,
          y: 0,
          depth,
          size,
          visible,
          labelSide: "below",
        };
        ns.push(node);
        return { width: cellW, root: node };
      }

      let cursor = xOffset;
      const childRoots: NodeLayout[] = [];
      for (const child of children) {
        const res = layout(child, depth + 1, cursor, visible);
        cursor += res.width;
        childRoots.push(res.root);
      }
      const cellW = cellWidthFor(size);
      const span = Math.max(cursor - xOffset, cellW);
      const firstX = childRoots[0].x;
      const lastX = childRoots[childRoots.length - 1].x;
      const centerX = (firstX + lastX) / 2;
      const node: NodeLayout = {
        body,
        x: centerX,
        y: 0,
        depth,
        size,
        visible,
        labelSide: "below",
      };
      ns.push(node);
      for (const cr of childRoots) es.push({ parent: node, child: cr });
      return { width: span, root: node };
    };

    let xCursor = 0;
    for (const root of roots) {
      const res = layout(root, 0, xCursor, undefined);
      xCursor += res.width + ROOT_GAP;
    }

    // Resolve row y positions for depths 0 and 1 (stars and planets). Moons
    // are placed per-planet in the vertical pass that follows.
    const maxSizePerDepth: Record<number, number> = {};
    for (const n of ns) {
      if (n.depth > 1) continue;
      const prev = maxSizePerDepth[n.depth] ?? 0;
      if (n.size > prev) maxSizePerDepth[n.depth] = n.size;
    }
    const rowCenterY: Record<number, number> = {};
    let yAccum = 0;
    for (let d = 0; d <= 1; d++) {
      const rowH = maxSizePerDepth[d] ?? baseVisibleForDepth(d);
      rowCenterY[d] = yAccum + rowH / 2;
      yAccum += rowH + LABEL_GAP + LABEL_H + ROW_V_GAP;
    }
    for (const n of ns) {
      if (n.depth <= 1) n.y = rowCenterY[n.depth];
    }

    // Vertical moon pass: for each planet, stack its descendants in DFS
    // order beneath it at the planet's x. Deeper submoons indent right so
    // their edges don't overlap sibling subtrees above them.
    let moonStackBottom = yAccum - ROW_V_GAP;
    const planetNodes = ns.filter((n) => n.depth === 1);
    for (const planetNode of planetNodes) {
      const moons = collectMoons(planetNode.body, planetNode.visible);
      if (moons.length === 0) continue;
      const bodyToNode = new Map<MappedSystemBody, NodeLayout>();
      bodyToNode.set(planetNode.body, planetNode);
      let cursorY =
        planetNode.y +
        planetNode.visible / 2 +
        LABEL_GAP +
        LABEL_H +
        MOON_TOP_GAP;
      for (const m of moons) {
        const indent = (m.depth - 2) * MOON_INDENT;
        const x = planetNode.x + indent;
        const y = cursorY + m.visible / 2;
        cursorY = y + m.visible / 2 + MOON_ROW_GAP;
        const moonNode: NodeLayout = {
          body: m.body,
          x,
          y,
          depth: m.depth,
          size: m.size,
          visible: m.visible,
          labelSide: "right",
        };
        ns.push(moonNode);
        const parentNode = bodyToNode.get(m.parent) ?? planetNode;
        es.push({ parent: parentNode, child: moonNode });
        bodyToNode.set(m.body, moonNode);
      }
      const thisBottom = cursorY - MOON_ROW_GAP;
      if (thisBottom > moonStackBottom) moonStackBottom = thisBottom;
    }

    const totalW = Math.max(xCursor - ROOT_GAP, baseVisibleForDepth(0) * 4);
    const totalH = Math.max(moonStackBottom, baseVisibleForDepth(0) * 2);

    return { nodes: ns, edges: es, width: totalW, height: totalH };
  }, [systemMap]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const panStateRef = useRef<{
    dragging: boolean;
    startLeft: number;
    startTop: number;
    startX: number;
    startY: number;
  }>({ dragging: false, startLeft: 0, startTop: 0, startX: 0, startY: 0 });

  const [zoom, setZoom] = useState(1);

  const bindScrollable = useCallback((node: HTMLDivElement | null) => {
    scrollRef.current = node;
  }, []);

  // Zoom toward a viewport point (cursor, or container center when omitted),
  // preserving the content coordinate under that point across the zoom change.
  const zoomAt = useCallback((next: number, clientX?: number, clientY?: number) => {
    const node = scrollRef.current;
    setZoom((prev) => {
      const target = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
      if (!node || target === prev) return target;
      const rect = node.getBoundingClientRect();
      const vx = clientX !== undefined ? clientX - rect.left : node.clientWidth / 2;
      const vy = clientY !== undefined ? clientY - rect.top : node.clientHeight / 2;
      const cx = (node.scrollLeft + vx) / prev;
      const cy = (node.scrollTop + vy) / prev;
      requestAnimationFrame(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollLeft = cx * target - vx;
        scrollRef.current.scrollTop = cy * target - vy;
      });
      return target;
    });
  }, []);

  // Ctrl/Cmd + wheel zooms (also fired by trackpad pinch). Plain wheel keeps
  // its native scroll behavior. Attached manually so we can preventDefault —
  // React's synthetic wheel handler is passive.
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      setZoom((prev) => {
        const target = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev * factor));
        if (target === prev) return prev;
        const rect = node.getBoundingClientRect();
        const vx = e.clientX - rect.left;
        const vy = e.clientY - rect.top;
        const cx = (node.scrollLeft + vx) / prev;
        const cy = (node.scrollTop + vy) / prev;
        requestAnimationFrame(() => {
          node.scrollLeft = cx * target - vx;
          node.scrollTop = cy * target - vy;
        });
        return target;
      });
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, []);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const node = scrollRef.current;
    if (!node) return;
    panStateRef.current = {
      dragging: true,
      startLeft: node.scrollLeft,
      startTop: node.scrollTop,
      startX: e.clientX,
      startY: e.clientY,
    };
    node.style.cursor = "grabbing";
    node.style.userSelect = "none";
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const state = panStateRef.current;
    const node = scrollRef.current;
    if (!state.dragging || !node) return;
    node.scrollLeft = state.startLeft - (e.clientX - state.startX);
    node.scrollTop = state.startTop - (e.clientY - state.startY);
  };

  const endDrag = () => {
    const node = scrollRef.current;
    if (!node) return;
    panStateRef.current.dragging = false;
    node.style.cursor = "grab";
    node.style.removeProperty("user-select");
  };

  const canvasW = width + CANVAS_PAD * 2;
  const canvasH = height + CANVAS_PAD * 2;

  // Tile-based starfield used as a CSS background on the scroll container so
  // the viewport stays populated even when the scaled tree shrinks below it.
  // Tile is large and pseudo-randomly scattered to hide seams.
  const starfieldUrl = useMemo(() => {
    const TILE = 512;
    let s = 0x1f123bb5;
    const rand = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
    const circles: string[] = [];
    for (let i = 0; i < 80; i++) {
      const x = (rand() * TILE).toFixed(1);
      const y = (rand() * TILE).toFixed(1);
      const r = (0.3 + rand() * rand() * 1.4).toFixed(2);
      const o = (0.15 + rand() * 0.5).toFixed(2);
      circles.push(`<circle cx='${x}' cy='${y}' r='${r}' fill='%23e2f1ff' opacity='${o}'/>`);
    }
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${TILE}' height='${TILE}'>${circles.join("")}</svg>`;
    return `url("data:image/svg+xml;utf8,${svg}")`;
  }, []);

  if (nodes.length === 0) {
    return (
      <div className="text-glow__blue py-6 text-center text-lg font-bold uppercase">
        No Orbital Telemetry Available
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height: heightOverride ?? VIEW_H }}>
      <div
        ref={bindScrollable}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        className="relative h-full w-full overflow-auto border border-sky-900/20 bg-black/30"
        style={{ cursor: "grab" }}
      >
        <div
          style={{
            width: canvasW * zoom,
            height: canvasH * zoom,
            minWidth: "100%",
            minHeight: "100%",
            backgroundImage: [
              starfieldUrl,
              "linear-gradient(to right, rgba(56, 189, 248, 0.11) 1px, transparent 1px)",
              "linear-gradient(to bottom, rgba(56, 189, 248, 0.11) 1px, transparent 1px)",
              "linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px)",
              "linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px)",
            ].join(", "),
            backgroundSize: "512px 512px, 200px 200px, 200px 200px, 40px 40px, 40px 40px",
            backgroundRepeat: "repeat",
          }}
        >
          <div
            className="relative"
            style={{
              width: canvasW,
              height: canvasH,
              transform: `scale(${zoom})`,
              transformOrigin: "0 0",
            }}
          >
        <svg
          className="pointer-events-none absolute inset-0"
          width={canvasW}
          height={canvasH}
        >
          {edges.map((e, i) => {
            // Start edge below the parent's label strip (or directly below
            // the parent's body when its label sits to the right), end at
            // the child's top edge.
            const px = e.parent.x + CANVAS_PAD;
            const parentLabelBelow = e.parent.labelSide === "below";
            const py =
              e.parent.y +
              e.parent.visible / 2 +
              (parentLabelBelow ? LABEL_GAP + LABEL_H : 0) +
              CANVAS_PAD;
            const cx = e.child.x + CANVAS_PAD;
            const cy = e.child.y - e.child.visible / 2 - 2 + CANVAS_PAD;
            const my = (py + cy) / 2;
            const d = `M ${px} ${py} C ${px} ${my}, ${cx} ${my}, ${cx} ${cy}`;
            return (
              <path
                key={i}
                d={d}
                className={`system-tree__edge ${e.parent.depth === 0 ? "system-tree__edge--root" : ""}`}
              />
            );
          })}
        </svg>

        {nodes.map((n) => {
          const landable = n.body.is_landable === 1;
          // Anchor to the 45° bottom-right point on the visible circle
          // (size/2 + r·cos45). Icon is sized relative to the visible circle
          // but clamped so it stays legible on small moons and unobtrusive
          // on gas giants.
          const iconSize = Math.max(12, Math.min(28, Math.round(n.visible)));
          const anchor = n.size / 2 + n.visible * 0.354;
          return (
            <div
              key={`node-${n.body._type}-${n.body.body_id}-${n.body.name}`}
              className="absolute flex items-center justify-center"
              style={{
                left: n.x - n.size / 2 + CANVAS_PAD,
                top: n.y - n.size / 2 + CANVAS_PAD,
                width: n.size,
                height: n.size,
              }}
            >
              <TreeNodeCard body={n.body} size={n.size} />
              {landable && (
                <i
                  aria-hidden="true"
                  className="icarus-terminal-planet-lander text-sky-300/60 pointer-events-none absolute"
                  style={{
                    left: anchor - iconSize / 2,
                    top: anchor - iconSize / 2,
                    fontSize: iconSize,
                    lineHeight: 1,
                  }}
                />
              )}
            </div>
          );
        })}

        {nodes.map((n) => {
          const rightLabel = n.labelSide === "right";
          const style: React.CSSProperties = rightLabel
            ? {
                left: n.x + n.visible / 2 + MOON_LABEL_GAP + CANVAS_PAD,
                top: n.y - LABEL_H / 2 + CANVAS_PAD,
                width: LABEL_W,
              }
            : {
                left: n.x - LABEL_W / 2 + CANVAS_PAD,
                top: n.y + n.visible / 2 + LABEL_GAP + CANVAS_PAD,
                width: LABEL_W,
              };
          return (
            <div
              key={`label-${n.body._type}-${n.body.body_id}-${n.body.name}`}
              className={`pointer-events-none absolute ${rightLabel ? "text-left" : "text-center"}`}
              style={style}
            >
              <div className="text-glow system-tree__node-label truncate text-[0.7rem] font-bold uppercase tracking-wider">
                {n.body._label ?? n.body.name}
              </div>
              {n.body.sub_type && (
                <div className="truncate text-[0.6rem] uppercase tracking-widest text-neutral-500">
                  {n.body.sub_type}
                </div>
              )}
              {!n.body.sub_type && n.body._description && (
                <div className="truncate text-[0.6rem] uppercase tracking-widest text-neutral-500">
                  {n.body._description}
                </div>
              )}
            </div>
          );
        })}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 flex flex-col gap-1">
        <button
          type="button"
          aria-label="Zoom in"
          title="Zoom in"
          onClick={() => zoomAt(zoom * ZOOM_STEP)}
          disabled={zoom >= MAX_ZOOM - 0.001}
          className="text-glow__blue pointer-events-auto flex h-7 w-7 items-center justify-center border border-sky-900 bg-black/60 text-sm transition-colors hover:border-sky-500 disabled:opacity-40 disabled:hover:border-sky-900"
        >
          +
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          title="Zoom out"
          onClick={() => zoomAt(zoom / ZOOM_STEP)}
          disabled={zoom <= MIN_ZOOM + 0.001}
          className="text-glow__blue pointer-events-auto flex h-7 w-7 items-center justify-center border border-sky-900 bg-black/60 text-sm transition-colors hover:border-sky-500 disabled:opacity-40 disabled:hover:border-sky-900"
        >
          −
        </button>
        <button
          type="button"
          aria-label="Reset zoom"
          title="Reset zoom"
          onClick={() => zoomAt(1)}
          disabled={Math.abs(zoom - 1) < 0.001}
          className="text-glow__blue pointer-events-auto flex h-7 w-7 items-center justify-center border border-sky-900 bg-black/60 text-xs transition-colors hover:border-sky-500 disabled:opacity-40 disabled:hover:border-sky-900"
        >
          1:1
        </button>
      </div>
    </div>
  );
};

export default SystemBodiesTree;
