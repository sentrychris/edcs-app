"use client";

import { type FunctionComponent, useCallback, useMemo, useRef } from "react";
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
}

interface Edge {
  parent: NodeLayout;
  child: NodeLayout;
}

const COL_W = 340;
const LABEL_W = 220;
const LABEL_H = 40;
const CELL_V_BUFFER = 36;
const ROOT_GAP = 56;
const CANVAS_PAD = 72;
const VIEW_H = 600;

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
  if (isStarLike(body)) return 1.0;
  if (body._type === SystemBodyType.Barycenter) return 0.55;
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

const bodyRadius = (body: MappedSystemBody): number => body._r ?? 2000;

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

  const radius = bodyRadius(body);
  const extent = radius * viewBoxFactor(body);
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
}

const SystemBodiesTree: FunctionComponent<Props> = ({ systemMap }) => {
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

    // Tallest cell height a subtree at this depth could occupy; used as a
    // floor for vertical space even if children are small.
    const cellHeightFor = (size: number) => size + LABEL_H + CELL_V_BUFFER;

    const rootColOffset = Math.round(baseVisibleForDepth(0) * 1.8);

    const layout = (
      body: MappedSystemBody,
      depth: number,
      yOffset: number,
      parentVisible?: number,
    ): { height: number; root: NodeLayout } => {
      const visible = computeVisibleSize(body, depth, parentVisible);
      const size = computeBoxSize(body, visible);
      const cellH = cellHeightFor(size);
      const x = depth * COL_W + rootColOffset;
      const children = body._children ?? [];

      if (children.length === 0) {
        const y = yOffset + cellH / 2;
        const node: NodeLayout = { body, x, y, depth, size };
        ns.push(node);
        return { height: cellH, root: node };
      }

      let cursor = yOffset;
      const childRoots: NodeLayout[] = [];
      for (const child of children) {
        const res = layout(child, depth + 1, cursor, visible);
        cursor += res.height;
        childRoots.push(res.root);
      }
      const childrenSpan = cursor - yOffset;
      const span = Math.max(childrenSpan, cellH);
      const firstY = childRoots[0].y;
      const lastY = childRoots[childRoots.length - 1].y;
      const centerY = (firstY + lastY) / 2;
      const node: NodeLayout = { body, x, y: centerY, depth, size };
      ns.push(node);
      for (const cr of childRoots) es.push({ parent: node, child: cr });
      return { height: span, root: node };
    };

    let yCursor = 0;
    let maxDepth = 0;
    for (const root of roots) {
      const res = layout(root, 0, yCursor, undefined);
      yCursor += res.height + ROOT_GAP;
      for (const n of ns) if (n.depth > maxDepth) maxDepth = n.depth;
    }
    const rootFloor = Math.round(baseVisibleForDepth(0) * 3) + LABEL_H + CELL_V_BUFFER;
    const totalH = Math.max(yCursor - ROOT_GAP, rootFloor);
    const totalW = (maxDepth + 1) * COL_W + LABEL_W - COL_W + rootColOffset * 2;

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

  const bindScrollable = useCallback((node: HTMLDivElement | null) => {
    scrollRef.current = node;
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

  if (nodes.length === 0) {
    return (
      <div className="text-glow__blue py-6 text-center text-lg font-bold uppercase">
        No Orbital Telemetry Available
      </div>
    );
  }

  const canvasW = width + CANVAS_PAD * 2;
  const canvasH = height + CANVAS_PAD * 2;

  return (
    <div
      ref={bindScrollable}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      className="relative w-full overflow-auto border border-sky-900/20 bg-black/30"
      style={{ height: VIEW_H, cursor: "grab" }}
    >
      <div className="relative" style={{ width: canvasW, height: canvasH }}>
        <svg
          className="pointer-events-none absolute inset-0"
          width={canvasW}
          height={canvasH}
        >
          {edges.map((e, i) => {
            const px = e.parent.x + e.parent.size / 2 - 2 + CANVAS_PAD;
            const py = e.parent.y + CANVAS_PAD;
            const cx = e.child.x - e.child.size / 2 + 2 + CANVAS_PAD;
            const cy = e.child.y + CANVAS_PAD;
            const mx = (px + cx) / 2;
            const d = `M ${px} ${py} C ${mx} ${py}, ${mx} ${cy}, ${cx} ${cy}`;
            return (
              <path
                key={i}
                d={d}
                className={`system-tree__edge ${e.parent.depth === 0 ? "system-tree__edge--root" : ""}`}
              />
            );
          })}
        </svg>

        {nodes.map((n) => (
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
          </div>
        ))}

        {nodes.map((n) => (
          <div
            key={`label-${n.body._type}-${n.body.body_id}-${n.body.name}`}
            className="pointer-events-none absolute text-center"
            style={{
              left: n.x - LABEL_W / 2 + CANVAS_PAD,
              top: n.y + n.size / 2 + 6 + CANVAS_PAD,
              width: LABEL_W,
            }}
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
        ))}
      </div>
    </div>
  );
};

export default SystemBodiesTree;
