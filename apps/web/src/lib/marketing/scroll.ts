// Shared, non-reactive scroll/pointer state. Read inside rAF / useFrame loops so
// no React re-render happens per frame.

export const scrollState = {
  /** Float scene index 0..4, already eased between [data-scene] anchors. */
  scene: 0,
  /** Document scroll progress 0..1. */
  progress: 0,
  /** Pointer in -1..1 (y up). */
  px: 0,
  py: 0,
};

type Anchor = { idx: number; top: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function startScrollTracking(): () => void {
  let anchors: Anchor[] = [];

  const measure = () => {
    anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"))
      .map((el) => ({
        idx: Number(el.dataset.scene),
        top: el.getBoundingClientRect().top + window.scrollY,
      }))
      .sort((a, b) => a.top - b.top);
  };

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollState.progress = max > 0 ? clamp01(window.scrollY / max) : 0;

    const first = anchors[0];
    if (!first) return;
    const y = window.scrollY + window.innerHeight * 0.55;
    if (y <= first.top) {
      scrollState.scene = first.idx;
      return;
    }
    let i = 0;
    for (let k = 0; k < anchors.length; k++) {
      const a = anchors[k];
      if (a && a.top <= y) i = k;
    }
    const cur = anchors[i];
    const next = anchors[i + 1];
    if (!cur) return;
    if (!next) {
      scrollState.scene = cur.idx;
      return;
    }
    // Hold the scene for the first half of the section, then blend into the next.
    const t = (y - cur.top) / Math.max(1, next.top - cur.top);
    scrollState.scene = cur.idx + (next.idx - cur.idx) * smoothstep(0.5, 1, t);
  };

  const onPointer = (e: PointerEvent) => {
    scrollState.px = (e.clientX / window.innerWidth) * 2 - 1;
    scrollState.py = -((e.clientY / window.innerHeight) * 2 - 1);
  };

  const onResize = () => {
    measure();
    update();
  };

  measure();
  update();
  const ro = new ResizeObserver(onResize);
  ro.observe(document.body);
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("pointermove", onPointer, { passive: true });

  return () => {
    ro.disconnect();
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onPointer);
  };
}
