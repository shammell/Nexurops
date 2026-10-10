"use client";

import { useEffect, useRef } from "react";
import { scrollState } from "@/lib/marketing/scroll";

const SCENES = ["Mesh", "Agents", "Pipeline", "Secure", "Connect"];

export function ProgressRail() {
  const fill = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (fill.current) fill.current.style.transform = `scaleY(${scrollState.progress})`;
      if (label.current) {
        const i = Math.round(scrollState.scene);
        label.current.textContent = `0${i + 1} / ${SCENES[i] ?? ""}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-8 left-6 z-30 hidden items-end gap-3 md:flex"
    >
      <div className="relative h-24 w-px bg-white/10">
        <div
          ref={fill}
          className="absolute inset-0 origin-top bg-gradient-to-b from-primary-400 to-accent-400"
          style={{ transform: "scaleY(0)" }}
        />
      </div>
      <span ref={label} className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40" />
    </div>
  );
}
