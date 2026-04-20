"use client";

import { useEffect, useRef, useState } from "react";
import { getBoxelDataFromId64 } from "@/core/string-utils";
import { settings } from "@/core/config";

// ── Coordinate offsets — maps id64 sector/boxel space to galactic coords (Sgr A* = 0,0,0) ──
// Derived from Sagittarius A* id64 20578934: sector (39,32,39), boxel (0,0,0), size 640
const BASE_X = 50240;
const BASE_Y = 41280;
const BASE_Z = 50240;

// Sol id64 — used to give it a distinct appearance regardless of coordinate origin
const SOL_ID64 = 10477373803n;

// LOD selection thresholds (camera radius in ly).
// Below 8000 ly we use full-detail per-sector tiles; above 60000 ly we serve
// only the single sampled global tile. The mid-zoom band uses LOD 1.
const LOD0_MIN_RADIUS = 80000;
// const LOD1_MIN_RADIUS = 12000;

function id64ToCoords(id64: bigint): [number, number, number] | null {
  try {
    const { sector, boxel } = getBoxelDataFromId64(id64);
    const half = boxel.size / 2;
    return [
      sector.x * 1280 + boxel.x * boxel.size + half - BASE_X,
      sector.y * 1280 + boxel.y * boxel.size + half - BASE_Y,
      sector.z * 1280 + boxel.z * boxel.size + half - BASE_Z,
    ];
  } catch {
    return null;
  }
}

// ── Matrix helpers (column-major, WebGL convention) ──

function mat4Multiply(a: Float32Array, b: Float32Array): Float32Array {
  const r = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) sum += a[k * 4 + row] * b[col * 4 + k];
      r[col * 4 + row] = sum;
    }
  }
  return r;
}

function mat4Perspective(fovRad: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1 / Math.tan(fovRad / 2);
  const nf = 1 / (near - far);
  // prettier-ignore
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0,          f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function mat4LookAt(
  ex: number, ey: number, ez: number,
  cx: number, cy: number, cz: number,
  ux: number, uy: number, uz: number,
): Float32Array {
  let fx = cx - ex, fy = cy - ey, fz = cz - ez;
  let len = Math.hypot(fx, fy, fz);
  fx /= len; fy /= len; fz /= len;
  let rx = fy * uz - fz * uy, ry = fz * ux - fx * uz, rz = fx * uy - fy * ux;
  len = Math.hypot(rx, ry, rz);
  rx /= len; ry /= len; rz /= len;
  const upx = ry * fz - rz * fy, upy = rz * fx - rx * fz, upz = rx * fy - ry * fx;
  // prettier-ignore
  return new Float32Array([
    rx,  ry,  rz,  0,
    upx, upy, upz, 0,
    -fx, -fy, -fz, 0,
    -(rx * ex + ry * ey + rz * ez),
    -(upx * ex + upy * ey + upz * ez),
    fx * ex + fy * ey + fz * ez,
    1,
  ]);
}

// ── Shared MVP calculation ──

function buildMvp(
  theta: number, phi: number, radius: number,
  tx: number, ty: number, tz: number,
  aspect: number,
): Float32Array {
  const ex = tx + radius * Math.sin(phi) * Math.sin(theta);
  const ey = ty + radius * Math.cos(phi);
  const ez = tz + radius * Math.sin(phi) * Math.cos(theta);
  return mat4Multiply(
    mat4Perspective(Math.PI / 4, aspect, 100, 600000),
    mat4LookAt(ex, ey, ez, tx, ty, tz, 0, 1, 0),
  );
}

// ── WebGL helpers ──

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "");
  return s;
}

function createProgram(gl: WebGLRenderingContext, vert: string, frag: string): WebGLProgram {
  const p = gl.createProgram()!;
  gl.attachShader(p, compileShader(gl, gl.VERTEX_SHADER, vert));
  gl.attachShader(p, compileShader(gl, gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "");
  return p;
}

// ── Main render shaders ──

const VERT_SRC = `
  attribute vec3 a_position;
  attribute vec3 a_color;
  attribute float a_size;
  uniform mat4 u_mvp;
  uniform float u_fixedSize;
  varying vec3 v_color;
  void main() {
    gl_Position = u_mvp * vec4(a_position, 1.0);
    v_color = a_color;
    gl_PointSize = u_fixedSize > 0.0 ? u_fixedSize
                 : clamp(a_size * (8000.0 / max(gl_Position.w, 1.0)), 0.5, 8.0);
  }
`;

const FRAG_SRC = `
  precision mediump float;
  varying vec3 v_color;
  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c) * 2.0;
    if (d > 1.0) discard;
    gl_FragColor = vec4(v_color, pow(1.0 - d, 1.8) * 0.88);
  }
`;

// ── Galaxy disk shaders — textured flat plane in the XZ galactic plane ──

const DISK_VERT = `
  attribute vec3 a_position;
  attribute vec2 a_uv;
  uniform mat4 u_mvp;
  varying vec2 v_uv;
  void main() {
    gl_Position = u_mvp * vec4(a_position, 1.0);
    v_uv = a_uv;
  }
`;

const DISK_FRAG = `
  precision mediump float;
  uniform sampler2D u_tex;
  varying vec2 v_uv;
  void main() {
    gl_FragColor = texture2D(u_tex, v_uv);
  }
`;

// ── Star appearance helpers ──

// [cumulative probability, r, g, b, baseSize]
const STAR_CLASSES: [number, number, number, number, number][] = [
  [0.01, 0.55, 0.65, 1.00, 4.2], // O — deep blue
  [0.04, 0.68, 0.80, 1.00, 3.6], // B — blue-white
  [0.10, 0.90, 0.94, 1.00, 2.8], // A — white
  [0.18, 1.00, 0.97, 0.82, 2.4], // F — yellow-white
  [0.30, 1.00, 0.88, 0.50, 2.2], // G — yellow
  [0.52, 1.00, 0.65, 0.25, 2.0], // K — orange
  [1.00, 1.00, 0.38, 0.10, 1.6], // M — red
];

function hashFloat(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function starAppearance(seed: number): [number, number, number, number] {
  const h1 = hashFloat(seed), h2 = hashFloat(seed * 1.3 + 7.5), h3 = hashFloat(seed * 2.7 + 13.1);
  for (let i = 0; i < STAR_CLASSES.length; i++) {
    const [thr, r, g, b, sz] = STAR_CLASSES[i];
    if (h1 < thr) {
      const lum = 0.20 + h2;
      // const lum = 0.15 + h2 * 0.05;
      return [r * lum, g * lum, b * lum, sz * (0.8 + h3 * 0.4)];
    }
  }
  return [0.60, 0.20, 0.05, 1.4];
}

// ── Background starfield (seeded, deterministic) ──

function makeLcg(seed: number) {
  let s = seed | 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) | 0; return (s >>> 0) / 0x100000000; };
}

function buildStarfield(gl: WebGLRenderingContext, count: number) {
  const rng = makeLcg(42);
  const pos: number[] = [], col: number[] = [];
  for (let i = 0; i < count; i++) {
    let x: number, y: number, z: number, sq: number;
    do { x = rng()*2-1; y = rng()*2-1; z = rng()*2-1; sq = x*x+y*y+z*z; } while (sq > 1 || sq === 0);
    const sc = 350000 / Math.sqrt(sq);
    pos.push(x * sc, y * sc, z * sc);
    const t = rng();
    let r: number, g: number, b: number;
    if      (t < 0.10) { r=0.68; g=0.80; b=1.00; }
    else if (t < 0.30) { r=0.90; g=0.94; b=1.00; }
    else if (t < 0.62) { r=1.00; g=0.97; b=0.90; }
    else               { r=1.00; g=0.85; b=0.65; }
    const lum = 0.25 + rng() * 0.75;
    col.push(r * lum, g * lum, b * lum);
  }
  const posBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  const colBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(col), gl.STATIC_DRAW);
  return { posBuf, colBuf, count };
}

// ── Galaxy disk — procedural 2D-canvas texture rendered as a flat XZ plane ──

function makeGalaxyTexture(gl: WebGLRenderingContext): WebGLTexture {
  const SIZE = 1024;
  const off = document.createElement("canvas");
  off.width = off.height = SIZE;
  const ctx = off.getContext("2d")!;
  const cx = SIZE / 2, cy = SIZE / 2;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Outer stellar halo — faint blue wash
  const halo = ctx.createRadialGradient(cx, cy, SIZE * 0.08, cx, cy, SIZE * 0.5);
  halo.addColorStop(0,    "rgba(70,80,170,0)");
  halo.addColorStop(0.30, "rgba(50,60,145,0.18)");
  halo.addColorStop(0.60, "rgba(30,38,105,0.09)");
  halo.addColorStop(1,    "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Spiral arms — two main + two minor, log-spiral, orange→blue-white gradient
  const drawArm = (baseAngle: number, strength: number) => {
    for (let step = 0; step < 500; step++) {
      const t = step / 500;
      const radius = (0.03 + t * 0.46) * SIZE;
      const angle  = baseAngle + t * Math.PI * 2.3;
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;
      if (px < 0 || px > SIZE || py < 0 || py > SIZE) continue;
      const blobR = (0.014 + t * 0.026) * SIZE;
      const alpha = Math.max(0, (0.38 - t * 0.30)) * strength;
      const warm  = Math.pow(Math.max(0, 1 - t * 2.4), 0.65);
      const rr = Math.round(78  + warm * 177);
      const gg = Math.round(98  + warm * 102);
      const g  = ctx.createRadialGradient(px, py, 0, px, py, blobR);
      g.addColorStop(0, `rgba(${rr},${gg},220,${alpha.toFixed(3)})`);
      g.addColorStop(1, `rgba(${rr},${gg},220,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, blobR, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  drawArm(0.4,             0.02); // Sagittarius / Perseus analogue
  drawArm(0.4 + Math.PI,   0.02); // opposite arm
  drawArm(1.85,            0.01); // minor arm
  drawArm(1.85 + Math.PI,  0.01); // minor arm opposite

  // Inner bulge — warm orange disk
  const bulge = ctx.createRadialGradient(cx, cy, 0, cx, cy, SIZE * 0.22);
  bulge.addColorStop(0,    "rgba(255,232,128,0.92)");
  bulge.addColorStop(0.10, "rgba(255,168,52,0.78)");
  bulge.addColorStop(0.26, "rgba(212,108,22,0.42)");
  bulge.addColorStop(0.52, "rgba(145,68,10,0.16)");
  bulge.addColorStop(0.80, "rgba(80,38,6,0.05)");
  bulge.addColorStop(1,    "rgba(0,0,0,0)");
  ctx.fillStyle = bulge;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Bright core point
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, SIZE * 0.052);
  core.addColorStop(0,    "rgba(255,255,238,1.0)");
  core.addColorStop(0.22, "rgba(255,246,165,0.92)");
  core.addColorStop(0.56, "rgba(255,192,68,0.46)");
  core.addColorStop(1,    "rgba(255,132,14,0)");
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, off);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
}

function buildDisk(gl: WebGLRenderingContext): { posBuf: WebGLBuffer; uvBuf: WebGLBuffer } {
  // Triangle strip: TL(-R,−R), TR(+R,−R), BL(−R,+R), BR(+R,+R) — flat in XZ at Y=−200
  const R = 65000, Y = -200;
  const positions = new Float32Array([-R, Y, -R,  R, Y, -R,  -R, Y, R,  R, Y, R]);
  const uvs       = new Float32Array([ 0, 0,   1, 0,   0, 1,   1, 1]);
  const posBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  const uvBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
  gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
  return { posBuf, uvBuf };
}

// ── Tile manifest + binary decoding ──

interface Manifest {
  version: number;
  generated_at: string;
  sector_size: number;
  lod1_size: number;
  lod0: { url: string; count: number };
  lod1_url_template: string;
  lod2_url_template: string;
  lod1_tiles: string[];
  lod2_tiles: string[];
}

interface DecodedTile {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  count: number;
}

interface TileBuffers {
  posBuf: WebGLBuffer;
  colBuf: WebGLBuffer;
  sizeBuf: WebGLBuffer;
  count: number;
}

/**
 * Decode a binary tile: [uint32 LE count][uint64 LE id64 × count].
 * Each id64 is converted to galactic coordinates via the boxel encoding,
 * and given a deterministic colour/size based on its low bits.
 */
function decodeTile(buffer: ArrayBuffer): DecodedTile {
  const view = new DataView(buffer);
  const count = view.getUint32(0, true);

  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);
  const sizes     = new Float32Array(count);

  let written = 0;
  for (let i = 0; i < count; i++) {
    const offset = 4 + i * 8;
    const id64 = view.getBigUint64(offset, true);
    const coords = id64ToCoords(id64);
    if (!coords) continue;

    const isSol = id64 === SOL_ID64;
    // starAppearance only needs deterministic floats; use the low 32 bits
    const seed = Number(id64 & 0xffffffffn);
    const [r, g, b, sz] = isSol ? [1.0, 0.95, 0.75, 5.0] : starAppearance(seed);

    positions[written * 3]     = coords[0];
    positions[written * 3 + 1] = coords[1];
    positions[written * 3 + 2] = coords[2];
    colors[written * 3]     = r;
    colors[written * 3 + 1] = g;
    colors[written * 3 + 2] = b;
    sizes[written] = sz;
    written++;
  }

  return {
    positions: positions.subarray(0, written * 3),
    colors:    colors.subarray(0, written * 3),
    sizes:     sizes.subarray(0, written),
    count: written,
  };
}

function uploadTile(gl: WebGLRenderingContext, decoded: DecodedTile): TileBuffers {
  const posBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, decoded.positions, gl.STATIC_DRAW);

  const colBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
  gl.bufferData(gl.ARRAY_BUFFER, decoded.colors, gl.STATIC_DRAW);

  const sizeBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
  gl.bufferData(gl.ARRAY_BUFFER, decoded.sizes, gl.STATIC_DRAW);

  return { posBuf, colBuf, sizeBuf, count: decoded.count };
}

function deleteTile(gl: WebGLRenderingContext, t: TileBuffers): void {
  gl.deleteBuffer(t.posBuf);
  gl.deleteBuffer(t.colBuf);
  gl.deleteBuffer(t.sizeBuf);
}

/**
 * Resolve a manifest tile URL against the API origin. The manifest carries
 * absolute paths like `/galaxy-tiles/v1/...`; tiles are served from the same
 * host as the API but outside the `/api` prefix.
 */
function resolveTileUrl(path: string): string {
  return new URL(path, settings.api.url).toString();
}

function pickLod(radius: number): 0 | 1 | 2 {
  // if (radius >= LOD0_MIN_RADIUS) return 0;
  return 1;
}

/**
 * Compute the set of tile keys that should be loaded for the current camera.
 *
 * Spherical cull: iterate every populated tile and keep those whose centre is
 * within `reach` of the camera target. An axis-aligned box would produce a
 * hard square boundary at the cull edge, which is visible as you zoom.
 *
 * `reach = radius * 1.5 + tileSize` covers the visible volume on both sides
 * of the target (the view frustum extends *past* the target by roughly one
 * more radius) with a bit of slack so tiles load just before they come into
 * view.
 *
 * Tile keys are BASE-shifted on every axis (so Sgr A* sits at sector
 * (39,32,39) at LOD 2 / (9,8,9) at LOD 1) — matching the bake-side encoding.
 */
function tileKeysForView(
  target: { x: number; y: number; z: number },
  radius: number,
  tileSize: number,
  populated: Iterable<string>,
): Set<string> {
  const reach = radius * 1.5 + tileSize;
  const reach2 = reach * reach;
  const half = tileSize / 2;

  const out = new Set<string>();
  for (const key of populated) {
    const [sx, sy, sz] = key.split("_").map(Number);
    const cx = sx * tileSize + half - BASE_X;
    const cy = sy * tileSize + half - BASE_Y;
    const cz = sz * tileSize + half - BASE_Z;
    const dx = cx - target.x;
    const dy = cy - target.y;
    const dz = cz - target.z;
    if (dx * dx + dy * dy + dz * dz <= reach2) {
      out.add(key);
    }
  }
  return out;
}

// ── Types ──

type Status = "loading" | "error" | "ready";

interface GlState {
  gl: WebGLRenderingContext;
  // Main render
  prog: WebGLProgram;
  uMvp: WebGLUniformLocation;
  uFixed: WebGLUniformLocation;
  aPos: number; aColor: number; aSize: number;
  // Tile registries — keyed by `lod{N}:{tileKey}` (or `lod0:global`)
  tiles: Map<string, TileBuffers>;
  inflight: Set<string>;
  // Starfield
  sfPos: WebGLBuffer; sfCol: WebGLBuffer; sfCount: number;
  // Galaxy disk
  diskProg: WebGLProgram;
  diskUMvp: WebGLUniformLocation;
  diskUTex: WebGLUniformLocation;
  diskAPos: number; diskAUv: number;
  diskPosBuf: WebGLBuffer; diskUvBuf: WebGLBuffer;
  diskTex: WebGLTexture;
}

// ── Component ──

export default function GalaxyMapCanvas() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const glRef      = useRef<GlState | null>(null);
  const manifestRef= useRef<Manifest | null>(null);
  const lod1Pop    = useRef<Set<string>>(new Set());
  const lod2Pop    = useRef<Set<string>>(new Set());
  const rafRef     = useRef<number>(0);
  const thetaRef   = useRef(0.5);
  const phiRef     = useRef(0.45);
  const radiusRef  = useRef(85000);
  const targetRef  = useRef({ x: 0, y: 0, z: 0 });
  const dragRef    = useRef<{ x: number; y: number; button: number } | null>(null);
  const autoRef    = useRef(true);
  const pausedRef  = useRef(false);
  const autoTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tileTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [status, setStatus] = useState<Status>("loading");
  const [count,  setCount]  = useState(0);
  const [paused, setPaused] = useState(false);

  const recountVisible = () => {
    const s = glRef.current;
    if (!s) return;
    let n = 0;
    for (const t of s.tiles.values()) n += t.count;
    setCount(n);
  };

  // ── Tile fetcher ──
  // Computes the desired tile set for the current LOD/camera and reconciles
  // the in-memory cache against it. Out-of-view tiles get evicted; missing
  // tiles get fetched in parallel (capped). LOD 0 is loaded once and kept.
  const reconcileTiles = async () => {
    const s = glRef.current;
    const m = manifestRef.current;
    if (!s || !m) return;

    const lod = pickLod(radiusRef.current);

    // Single-LOD-at-a-time. Mixing LODs would double-render systems via the
    // sampled tiles (LOD 0/1 are subsets of LOD 2's id64 list).
    const desired = new Set<string>();
    if (lod === 0) {
      desired.add("lod0:global");
    } else if (lod === 1) {
      const keys = tileKeysForView(targetRef.current, radiusRef.current, m.lod1_size, lod1Pop.current);
      for (const k of keys) desired.add(`lod1:${k}`);
    } else {
      const keys = tileKeysForView(targetRef.current, radiusRef.current, m.sector_size, lod2Pop.current);
      for (const k of keys) desired.add(`lod2:${k}`);
    }

    // Evict tiles not in the desired set
    for (const [key, buf] of s.tiles) {
      if (!desired.has(key)) {
        deleteTile(s.gl, buf);
        s.tiles.delete(key);
      }
    }

    // Fetch missing
    const toFetch: string[] = [];
    for (const key of desired) {
      if (!s.tiles.has(key) && !s.inflight.has(key)) toFetch.push(key);
    }

    const CONCURRENCY = 8;
    let cursor = 0;
    const workers = Array.from({ length: Math.min(CONCURRENCY, toFetch.length) }, async () => {
      while (cursor < toFetch.length) {
        const key = toFetch[cursor++];
        s.inflight.add(key);
        try {
          const url = tileUrlFor(key, m);
          const resp = await fetch(url);
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const buf = await resp.arrayBuffer();
          const decoded = decodeTile(buf);
          // Tile may have been evicted again before we returned; check membership.
          if (key === "lod0:global" || desired.has(key)) {
            s.tiles.set(key, uploadTile(s.gl, decoded));
          }
        } catch (err) {
          // 404 means an empty/missing tile — silently ignore so we don't retry.
          console.warn(`tile fetch failed for ${key}:`, err);
        } finally {
          s.inflight.delete(key);
        }
      }
    });

    await Promise.all(workers);
    recountVisible();
  };

  /** Trailing-edge debounce so panning/zooming bursts only fire one reconcile. */
  const scheduleReconcile = (delay = 120) => {
    if (tileTimer.current) clearTimeout(tileTimer.current);
    tileTimer.current = setTimeout(() => { void reconcileTiles(); }, delay);
  };

  // ── Draw one frame ──
  const draw = () => {
    const s = glRef.current;
    const canvas = canvasRef.current;
    if (!s || !canvas) return;
    const { gl } = s;

    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const { x: tx, y: ty, z: tz } = targetRef.current;
    const mvp = buildMvp(thetaRef.current, phiRef.current, radiusRef.current, tx, ty, tz, w / h);

    // ── Pass 0: galaxy disk — normal alpha blend so it sits behind stars ──
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(s.diskProg);
    gl.uniformMatrix4fv(s.diskUMvp, false, mvp);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, s.diskTex);
    gl.uniform1i(s.diskUTex, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, s.diskPosBuf);
    gl.enableVertexAttribArray(s.diskAPos);
    gl.vertexAttribPointer(s.diskAPos, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, s.diskUvBuf);
    gl.enableVertexAttribArray(s.diskAUv);
    gl.vertexAttribPointer(s.diskAUv, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disableVertexAttribArray(s.diskAPos);
    gl.disableVertexAttribArray(s.diskAUv);

    // ── Passes 1 & 2: stars — additive blend for glow ──
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.useProgram(s.prog);
    gl.uniformMatrix4fv(s.uMvp, false, mvp);

    const bindCol = (buf: WebGLBuffer) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(s.aColor);
      gl.vertexAttribPointer(s.aColor, 3, gl.FLOAT, false, 0, 0);
    };

    // Pass 1: starfield at fixed pixel size
    gl.uniform1f(s.uFixed, 1.4);
    gl.bindBuffer(gl.ARRAY_BUFFER, s.sfPos);
    gl.enableVertexAttribArray(s.aPos);
    gl.vertexAttribPointer(s.aPos, 3, gl.FLOAT, false, 0, 0);
    bindCol(s.sfCol);
    gl.disableVertexAttribArray(s.aSize);
    gl.vertexAttrib1f(s.aSize, 1.0);
    gl.drawArrays(gl.POINTS, 0, s.sfCount);

    // Pass 2: galaxy systems at depth-scaled size — one drawArrays per loaded tile
    gl.uniform1f(s.uFixed, -1.0);
    gl.enableVertexAttribArray(s.aSize);
    for (const tile of s.tiles.values()) {
      gl.bindBuffer(gl.ARRAY_BUFFER, tile.posBuf);
      gl.vertexAttribPointer(s.aPos, 3, gl.FLOAT, false, 0, 0);
      bindCol(tile.colBuf);
      gl.bindBuffer(gl.ARRAY_BUFFER, tile.sizeBuf);
      gl.vertexAttribPointer(s.aSize, 1, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, tile.count);
    }
  };

  const startLoop = () => {
    let lastRadius = radiusRef.current;
    let lastTarget = { ...targetRef.current };
    const loop = () => {
      if (autoRef.current) thetaRef.current += 0.0003;
      // Trigger tile reconcile if camera moved enough to matter
      const r = radiusRef.current;
      const dx = targetRef.current.x - lastTarget.x;
      const dy = targetRef.current.y - lastTarget.y;
      const dz = targetRef.current.z - lastTarget.z;
      if (Math.abs(r - lastRadius) > 200 || dx*dx + dy*dy + dz*dz > 200*200) {
        lastRadius = r;
        lastTarget = { ...targetRef.current };
        scheduleReconcile();
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const pauseAutoRotate = () => {
    autoRef.current = false;
    if (autoTimer.current) clearTimeout(autoTimer.current);
    if (!pausedRef.current) {
      autoTimer.current = setTimeout(() => { autoRef.current = true; }, 3000);
    }
  };

  const togglePause = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    autoRef.current = !next;
    if (!next && autoTimer.current) {
      clearTimeout(autoTimer.current);
      autoTimer.current = null;
    }
  };

  // ── Pointer controls ──
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, button: e.button };
    pauseAutoRotate();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current = { x: e.clientX, y: e.clientY, button: dragRef.current.button };
    if (dragRef.current.button === 2) {
      // Right-drag: pan camera
      const theta = thetaRef.current, phi = phiRef.current, panScale = radiusRef.current * 0.0006;
      targetRef.current.x += (dx *  Math.cos(theta) - dy * -Math.sin(theta) * Math.cos(phi)) * panScale;
      targetRef.current.y += (-dy * Math.sin(phi)) * panScale;
      targetRef.current.z += (dx * -Math.sin(theta) - dy * -Math.cos(theta) * Math.cos(phi)) * panScale;
    } else {
      // Left-drag: orbit
      thetaRef.current -= dx * 0.005;
      phiRef.current = Math.max(0.05, Math.min(Math.PI - 0.05, phiRef.current + dy * 0.005));
    }
  };

  const onPointerUp = () => {
    dragRef.current = null;
    pauseAutoRotate();
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    radiusRef.current = Math.max(4000, Math.min(200000, radiusRef.current * (e.deltaY > 0 ? 1.12 : 0.89)));
    pauseAutoRotate();
  };

  // ── Init WebGL ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false });
    if (!gl) { setStatus("error"); return; }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clearColor(0, 0, 0, 1);

    let prog: WebGLProgram, diskProg: WebGLProgram;
    try {
      prog     = createProgram(gl, VERT_SRC, FRAG_SRC);
      diskProg = createProgram(gl, DISK_VERT, DISK_FRAG);
    } catch (err) {
      console.error(err);
      setStatus("error");
      return;
    }

    const sf      = buildStarfield(gl, 3500);
    const diskTex = makeGalaxyTexture(gl);
    const disk    = buildDisk(gl);

    glRef.current = {
      gl, prog,
      uMvp:   gl.getUniformLocation(prog, "u_mvp")!,
      uFixed: gl.getUniformLocation(prog, "u_fixedSize")!,
      aPos:   gl.getAttribLocation(prog, "a_position"),
      aColor: gl.getAttribLocation(prog, "a_color"),
      aSize:  gl.getAttribLocation(prog, "a_size"),
      tiles: new Map(),
      inflight: new Set(),
      sfPos: sf.posBuf, sfCol: sf.colBuf, sfCount: sf.count,
      diskProg,
      diskUMvp: gl.getUniformLocation(diskProg, "u_mvp")!,
      diskUTex: gl.getUniformLocation(diskProg, "u_tex")!,
      diskAPos: gl.getAttribLocation(diskProg, "a_position"),
      diskAUv:  gl.getAttribLocation(diskProg, "a_uv"),
      diskPosBuf: disk.posBuf, diskUvBuf: disk.uvBuf, diskTex,
    };

    // Fetch manifest, populate populated-tile sets, then load LOD 0 immediately.
    fetch(`${settings.api.url}/galaxy/manifest`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() as Promise<Manifest>; })
      .then(async (m) => {
        manifestRef.current = m;
        lod1Pop.current = new Set(m.lod1_tiles);
        lod2Pop.current = new Set(m.lod2_tiles);
        await reconcileTiles();
        setStatus("ready");
        startLoop();
      })
      .catch((err) => { console.error(err); setStatus("error"); });

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (autoTimer.current) clearTimeout(autoTimer.current);
      if (tileTimer.current) clearTimeout(tileTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full select-none" style={{ height: "68vh", minHeight: "420px" }}>
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* ── Loading / error overlays ── */}
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
          <i className="icarus-terminal-star text-glow__blue animate-pulse text-4xl" />
          <p className="text-xs uppercase tracking-widest text-neutral-500">Plotting stellar coordinates...</p>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
          <i className="icarus-terminal-system-orbits text-2xl text-red-700" />
          <p className="text-xs uppercase tracking-widest text-neutral-600">Navigation data unavailable</p>
        </div>
      )}

      {/* ── HUD (shown once data is loaded) ── */}
      {status === "ready" && (
        <>
          {/* Top-right: axis labels */}
          <div className="absolute right-4 top-4 flex flex-col gap-1 text-right text-xs uppercase tracking-widest text-neutral-700">
            <span>X — Galactic East</span>
            <span>Z — Core Direction</span>
            <span>Y — Vertical</span>
          </div>

          {/* Bottom-left: counts + legend */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1 text-xs uppercase tracking-widest text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="fx-dot-blue h-1.5 w-1.5" />
              <span>{count.toLocaleString()} systems plotted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-200/60" />
              <span>Sol (origin)</span>
            </div>
          </div>

          {/* Bottom-right: controls hint + pause button */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
            <span className="hidden text-xs uppercase tracking-widest text-neutral-700 sm:inline">
              Left drag — orbit · Right drag — pan · Scroll — zoom
            </span>
            <button
              onClick={togglePause}
              className={`border px-2.5 py-1 text-xs uppercase tracking-widest transition-colors ${
                paused
                  ? "border-sky-500/60 text-sky-400 hover:border-sky-400"
                  : "border-neutral-800 text-neutral-600 hover:border-neutral-600 hover:text-neutral-400"
              }`}
            >
              {paused ? "▶ Resume" : "⏸ Pause"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Resolve the URL for a tile registry key like `lod0:global` / `lod1:1_0_0`
 * against the manifest's URL templates.
 */
function tileUrlFor(key: string, m: Manifest): string {
  if (key === "lod0:global") return resolveTileUrl(m.lod0.url);
  const [lod, tileKey] = key.split(":");
  const template = lod === "lod1" ? m.lod1_url_template : m.lod2_url_template;
  return resolveTileUrl(template.replace("{key}", tileKey));
}
