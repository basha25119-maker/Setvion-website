import { useRef } from "react";
import { useScroll, clamp, ease } from "../scroll.js";

// Apple-style scrubbed reveal: the element rises, scales up and fades in as it travels
// up the screen, and reverses if you scroll back. Uses the individual `translate` and
// `scale` properties so it never fights a CSS :hover transform.
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);
  useScroll(ref, (rect, vh) => {
    const p = ease(clamp((vh * 0.95 - rect.top - delay * 0.4) / (vh * 0.32)));
    const el = ref.current;
    el.style.opacity = p;
    el.style.translate = `0 ${(1 - p) * 56}px`;
    el.style.scale = 0.93 + 0.07 * p;
  });
  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>;
}
