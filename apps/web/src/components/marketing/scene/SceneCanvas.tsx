"use client";

import { Canvas } from "@react-three/fiber";
import { AgentMesh } from "./AgentMesh";

export default function SceneCanvas({
  count,
  active,
  onReady,
}: {
  count: number;
  active: boolean;
  onReady: () => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 9], fov: 50 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      onCreated={onReady}
    >
      <AgentMesh count={count} />
    </Canvas>
  );
}
