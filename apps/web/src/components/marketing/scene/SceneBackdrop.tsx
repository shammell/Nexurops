"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { startScrollTracking } from "@/lib/marketing/scroll";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

type Mode = { kind: "full"; count: number } | { kind: "static" } | null;

function detectMode(): Mode {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowEnd =
    (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory !== undefined && nav.deviceMemory <= 2);
  if (reduced || lowEnd) return { kind: "static" };

  try {
    const c = document.createElement("canvas");
    const ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
    if (!ok) return { kind: "static" };
  } catch {
    return { kind: "static" };
  }
  const mobile = window.matchMedia("(max-width: 768px)").matches;
  // 4^3 = 64 on mobile, 6^3 = 216 on desktop (clean lattice scene)
  return { kind: "full", count: mobile ? 64 : 216 };
}

export function SceneBackdrop() {
  const [mode, setMode] = useState<Mode>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setMode(detectMode());
    const stop = startScrollTracking();
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <StaticBackdrop />
      {mode?.kind === "full" && (
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: ready ? 1 : 0 }}
        >
          <SceneCanvas count={mode.count} active={visible} onReady={() => setReady(true)} />
        </div>
      )}
      {/* Scrim keeps copy readable over the mesh */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent md:from-background/70" />
    </div>
  );
}

/** Always-rendered CSS layer: the full experience for reduced-motion / no-WebGL users and the first paint for everyone. */
function StaticBackdrop() {
  return (
    <div className="absolute inset-0">
      <div className="absolute -right-40 top-10 h-[640px] w-[640px] rounded-full bg-primary-500/20 blur-[140px]" />
      <div className="absolute -bottom-40 right-1/4 h-[520px] w-[520px] rounded-full bg-accent-500/15 blur-[140px]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="white" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}
