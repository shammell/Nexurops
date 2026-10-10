// Deterministic position buffers for the five "Agent Mesh" scenes.
// 0 mesh · 1 agent orbits · 2 pipeline · 3 lattice · 4 converge

export const SCENE_COUNT = 5;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: () => number) {
  return Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r());
}

type Gen = (n: number, r: () => number) => Float32Array;

const mesh: Gen = (n, r) => {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    // uniform point in unit ball, scaled to an ellipsoid
    const u = r();
    const v = r();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const rad = Math.cbrt(r());
    out[i * 3] = Math.sin(phi) * Math.cos(theta) * rad * 3.4;
    out[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * rad * 2.4;
    out[i * 3 + 2] = Math.cos(phi) * rad * 2.4;
  }
  return out;
};

const orbits: Gen = (n, r) => {
  const out = new Float32Array(n * 3);
  const rings = 4;
  const radii = [1.1, 1.8, 2.5, 3.2];
  const tilts = [0.35, -0.6, 0.9, -0.2];
  for (let i = 0; i < n; i++) {
    const ring = i % rings;
    const idxInRing = Math.floor(i / rings);
    const perRing = Math.ceil(n / rings);
    const a = (idxInRing / perRing) * Math.PI * 2 + ring * 0.7;
    const rad = (radii[ring] ?? 2) + (r() - 0.5) * 0.12;
    const x = Math.cos(a) * rad;
    const y = Math.sin(a) * rad;
    const tilt = tilts[ring] ?? 0;
    out[i * 3] = x;
    out[i * 3 + 1] = y * Math.cos(tilt);
    out[i * 3 + 2] = y * Math.sin(tilt) + (r() - 0.5) * 0.1;
  }
  return out;
};

const pipeline: Gen = (n, r) => {
  const out = new Float32Array(n * 3);
  const stages = 4;
  for (let i = 0; i < n; i++) {
    const s = i % stages;
    const cx = (s - (stages - 1) / 2) * 1.6;
    out[i * 3] = cx + gauss(r) * 0.32;
    out[i * 3 + 1] = gauss(r) * 0.42;
    out[i * 3 + 2] = gauss(r) * 0.32;
  }
  return out;
};

const lattice: Gen = (n) => {
  const out = new Float32Array(n * 3);
  const d = Math.ceil(Math.cbrt(n));
  const spacing = 0.95;
  const off = ((d - 1) * spacing) / 2;
  for (let i = 0; i < n; i++) {
    const x = i % d;
    const y = Math.floor(i / d) % d;
    const z = Math.floor(i / (d * d));
    out[i * 3] = x * spacing - off;
    out[i * 3 + 1] = y * spacing - off;
    out[i * 3 + 2] = z * spacing - off;
  }
  return out;
};

const converge: Gen = (n, r) => {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const outlier = i % 9 === 0;
    const s = outlier ? 1.6 : 0.5;
    out[i * 3] = gauss(r) * s;
    out[i * 3 + 1] = gauss(r) * s;
    out[i * 3 + 2] = gauss(r) * s;
  }
  return out;
};

const generators: Gen[] = [mesh, orbits, pipeline, lattice, converge];

export function buildScenes(n: number): Float32Array[] {
  return generators.map((g, k) => g(n, rng(1337 + k * 101)));
}

/** Union of each scene's k-nearest-neighbour edges (deduped). */
export function buildEdges(scenes: Float32Array[], n: number, k = 2): Uint32Array {
  const seen = new Set<number>();
  const edges: number[] = [];
  for (const buf of scenes) {
    for (let a = 0; a < n; a++) {
      const best: { d: number; j: number }[] = [];
      const ax = buf[a * 3] ?? 0;
      const ay = buf[a * 3 + 1] ?? 0;
      const az = buf[a * 3 + 2] ?? 0;
      for (let b = 0; b < n; b++) {
        if (a === b) continue;
        const dx = ax - (buf[b * 3] ?? 0);
        const dy = ay - (buf[b * 3 + 1] ?? 0);
        const dz = az - (buf[b * 3 + 2] ?? 0);
        const d = dx * dx + dy * dy + dz * dz;
        if (best.length < k || d < (best[best.length - 1]?.d ?? Infinity)) {
          best.push({ d, j: b });
          best.sort((p, q) => p.d - q.d);
          if (best.length > k) best.pop();
        }
      }
      for (const { j } of best) {
        const lo = Math.min(a, j);
        const hi = Math.max(a, j);
        const key = lo * n + hi;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push(lo, hi);
        }
      }
    }
  }
  return Uint32Array.from(edges);
}
