import { useLayoutEffect } from "react";

// A tiny scroll engine: one passive scroll listener + one rAF loop drives every
// scroll-linked effect by writing styles straight to the DOM (no React re-renders).
// Effects are skipped entirely for visitors who prefer reduced motion, and the
// default CSS state is the fully visible one, so nothing is ever stuck hidden.

export const reduced =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const items = new Set();
let queued = false;

function frame() {
  queued = false;
  const vh = window.innerHeight;
  items.forEach((it) => it.fn(it.el.getBoundingClientRect(), vh));
}
function request() {
  if (!queued) { queued = true; requestAnimationFrame(frame); }
}
if (typeof window !== "undefined") {
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
}

export const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
export const ease = (t) => 1 - Math.pow(1 - t, 3);

// Run fn(rect, vh) for `ref.current` on every scroll frame (and once, before first paint).
export function useScroll(ref, fn) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const it = { el, fn };
    items.add(it);
    fn(el.getBoundingClientRect(), window.innerHeight);
    return () => items.delete(it);
  });
}

// Progress (0..1) through a tall section whose child is `position: sticky`.
export const pinProgress = (rect, vh) => clamp(-rect.top / Math.max(1, rect.height - vh));
