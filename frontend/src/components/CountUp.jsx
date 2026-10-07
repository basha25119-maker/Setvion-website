import { useEffect, useRef, useState } from "react";
import { reduced } from "../scroll.js";

// "24h" -> counts 0..24 then shows "h". Starts when scrolled into view.
export default function CountUp({ value }) {
  const m = String(value).match(/^(\d+)(.*)$/);
  const target = m ? parseInt(m[1], 10) : 0;
  const suffix = m ? m[2] : "";
  const ref = useRef(null);
  const [n, setN] = useState(reduced || !m ? target : 0);

  useEffect(() => {
    if (reduced || !m) return;
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now(), dur = 1400;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        setN(Math.round(target * (1 - Math.pow(1 - t, 4))));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, m]);

  return <span ref={ref}>{n}{suffix}</span>;
}
