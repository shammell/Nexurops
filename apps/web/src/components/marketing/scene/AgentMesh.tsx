"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState } from "@/lib/marketing/scroll";
import { buildEdges, buildScenes, SCENE_COUNT } from "./generators";

const WEIGHTS = /* glsl */ `
  uniform float uScene;
  float w(float k) { return max(0.0, 1.0 - abs(uScene - k)); }
`;

const POINT_VERT = /* glsl */ `
  ${WEIGHTS}
  attribute vec3 p1; attribute vec3 p2; attribute vec3 p3; attribute vec3 p4;
  attribute float aSeed;
  uniform float uSize; uniform float uPixel;
  varying float vSeed;
  void main() {
    vec3 pos = position * w(0.0) + p1 * w(1.0) + p2 * w(2.0) + p3 * w(3.0) + p4 * w(4.0);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.55 + aSeed * 0.95) * uPixel * (9.0 / -mv.z);
    vSeed = aSeed;
  }
`;

const POINT_FRAG = /* glsl */ `
  uniform vec3 uA; uniform vec3 uB; uniform float uOpacity;
  varying float vSeed;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 1.6);
    vec3 col = mix(uA, uB, pow(vSeed, 1.8));
    gl_FragColor = vec4(col * (1.0 + a), a * uOpacity);
  }
`;

const LINE_VERT = /* glsl */ `
  ${WEIGHTS}
  attribute vec3 p1; attribute vec3 p2; attribute vec3 p3; attribute vec3 p4;
  attribute vec3 o0; attribute vec3 o1; attribute vec3 o2; attribute vec3 o3; attribute vec3 o4;
  attribute float aT; attribute float aSeed;
  varying float vLen; varying float vT; varying float vSeed;
  void main() {
    float w0 = w(0.0); float w1 = w(1.0); float w2 = w(2.0); float w3 = w(3.0); float w4 = w(4.0);
    vec3 self = position * w0 + p1 * w1 + p2 * w2 + p3 * w3 + p4 * w4;
    vec3 other = o0 * w0 + o1 * w1 + o2 * w2 + o3 * w3 + o4 * w4;
    vLen = distance(self, other);
    vT = aT;
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(self, 1.0);
  }
`;

const LINE_FRAG = /* glsl */ `
  uniform vec3 uA; uniform vec3 uB; uniform float uTime; uniform float uOpacity;
  varying float vLen; varying float vT; varying float vSeed;
  void main() {
    float fade = smoothstep(1.4, 0.6, vLen);
    float head = fract(uTime * 0.12 + vSeed);
    float pulse = smoothstep(0.2, 0.0, abs(vT - head));
    float a = fade * (0.1 + pulse * 0.75) * uOpacity;
    gl_FragColor = vec4(mix(uA, uB, pow(vSeed, 1.8)), a);
  }
`;

const SKY = new THREE.Color("#38bdf8");
const FUCHSIA = new THREE.Color("#e879f9");

const damp = (cur: number, target: number, lambda: number, dt: number) =>
  cur + (target - cur) * (1 - Math.exp(-lambda * dt));

export function AgentMesh({ count }: { count: number }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const viewport = useThree((s) => s.viewport);
  const gl = useThree((s) => s.gl);
  const setDpr = useThree((s) => s.setDpr);
  const state = useRef({ scene: 0, offset: 0, rx: 0, ry: 0, slow: 0, frames: 0 });

  const { pointsGeo, linesGeo, pointsMat, linesMat } = useMemo(() => {
    const scenes = buildScenes(count);
    const edges = buildEdges(scenes, count);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) seeds[i] = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    for (let i = 0; i < count; i++) seeds[i] = Math.abs(seeds[i] ?? 0);

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(scenes[0]!, 3));
    for (let k = 1; k < SCENE_COUNT; k++) {
      pointsGeo.setAttribute(`p${k}`, new THREE.BufferAttribute(scenes[k]!, 3));
    }
    pointsGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const E = edges.length / 2;
    const V = E * 2;
    const self = Array.from({ length: SCENE_COUNT }, () => new Float32Array(V * 3));
    const other = Array.from({ length: SCENE_COUNT }, () => new Float32Array(V * 3));
    const aT = new Float32Array(V);
    const aSeed = new Float32Array(V);
    for (let e = 0; e < E; e++) {
      const a = edges[e * 2]!;
      const b = edges[e * 2 + 1]!;
      for (let k = 0; k < SCENE_COUNT; k++) {
        const s = scenes[k]!;
        for (let c = 0; c < 3; c++) {
          self[k]![(e * 2) * 3 + c] = s[a * 3 + c]!;
          other[k]![(e * 2) * 3 + c] = s[b * 3 + c]!;
          self[k]![(e * 2 + 1) * 3 + c] = s[b * 3 + c]!;
          other[k]![(e * 2 + 1) * 3 + c] = s[a * 3 + c]!;
        }
      }
      aT[e * 2] = 0;
      aT[e * 2 + 1] = 1;
      const seed = (Math.sin(e * 78.233) * 43758.5453) % 1;
      aSeed[e * 2] = Math.abs(seed);
      aSeed[e * 2 + 1] = Math.abs(seed);
    }
    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute("position", new THREE.BufferAttribute(self[0]!, 3));
    for (let k = 1; k < SCENE_COUNT; k++) {
      linesGeo.setAttribute(`p${k}`, new THREE.BufferAttribute(self[k]!, 3));
    }
    for (let k = 0; k < SCENE_COUNT; k++) {
      linesGeo.setAttribute(`o${k}`, new THREE.BufferAttribute(other[k]!, 3));
    }
    linesGeo.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
    linesGeo.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 1));

    const shared = {
      uScene: { value: 0 },
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uA: { value: SKY },
      uB: { value: FUCHSIA },
    };
    const pointsMat = new THREE.ShaderMaterial({
      vertexShader: POINT_VERT,
      fragmentShader: POINT_FRAG,
      uniforms: { ...shared, uSize: { value: 17 }, uPixel: { value: 1 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const linesMat = new THREE.ShaderMaterial({
      vertexShader: LINE_VERT,
      fragmentShader: LINE_FRAG,
      uniforms: shared,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { pointsGeo, linesGeo, pointsMat, linesMat };
  }, [count]);

  useEffect(
    () => () => {
      pointsGeo.dispose();
      linesGeo.dispose();
      pointsMat.dispose();
      linesMat.dispose();
    },
    [pointsGeo, linesGeo, pointsMat, linesMat],
  );

  useFrame((frame, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = state.current;

    s.scene = damp(s.scene, scrollState.scene, 4, dt);
    const wide = viewport.aspect > 1.1;
    const targetOffset = wide ? viewport.width * 0.24 * (1 - smooth(3, 4, s.scene)) : 0;
    s.offset = damp(s.offset, targetOffset, 4, dt);
    s.ry = damp(s.ry, scrollState.px * 0.35, 2.5, dt);
    s.rx = damp(s.rx, -scrollState.py * 0.2, 2.5, dt);

    const t = frame.clock.elapsedTime;
    const opacity = (wide ? 1 : 0.5) * (1 - 0.55 * smooth(3.4, 4, s.scene));
    pointsMat.uniforms.uPixel!.value = frame.gl.getPixelRatio();
    for (const m of [pointsMat, linesMat]) {
      m.uniforms.uScene!.value = s.scene;
      m.uniforms.uTime!.value = t;
      m.uniforms.uOpacity!.value = opacity;
    }

    if (outer.current) {
      outer.current.position.x = s.offset;
      const fit = Math.min(1, viewport.width / 11);
      outer.current.scale.setScalar(fit);
    }
    if (inner.current) {
      // Bounded sway (never an unbounded spin) so the pipeline scene stays legible.
      const calm = Math.max(0, 1 - Math.abs(s.scene - 2));
      const sway = (Math.sin(t * 0.15) * 0.45 + scrollState.progress * 0.6) * (1 - 0.9 * calm);
      inner.current.rotation.y = sway + s.ry;
      inner.current.rotation.x = s.rx + Math.sin(t * 0.1) * 0.05;
    }

    // Adaptive resolution: drop DPR if sustained frame time is poor.
    s.frames++;
    if (rawDt > 0.034) s.slow++;
    if (s.frames === 90) {
      if (s.slow > 45) setDpr(Math.max(1, gl.getPixelRatio() - 0.5));
      s.frames = 0;
      s.slow = 0;
    }
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <lineSegments geometry={linesGeo} material={linesMat} frustumCulled={false} />
        <points geometry={pointsGeo} material={pointsMat} frustumCulled={false} />
      </group>
    </group>
  );
}

function smooth(a: number, b: number, v: number) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
