import { useRef } from "react";
import { useScroll, pinProgress, clamp } from "../scroll.js";
import { PROCESS } from "../content.js";

// Pinned storytelling section: the screen holds still while the four steps play
// through as you scroll, driving a progress rail and cross-fading big step panels.
export default function Process() {
  const ref = useRef(null);
  const n = PROCESS.length;

  useScroll(ref, (rect, vh) => {
    const p = pinProgress(rect, vh);
    const root = ref.current;
    const t = p * n;
    const idx = Math.min(n - 1, Math.floor(t));
    root.style.setProperty("--p", p.toFixed(4));
    root.querySelectorAll(".stage").forEach((el, i) => {
      const local = t - i;
      let o = 0, y = 0;
      if (i === idx) {
        const inn = clamp(local / 0.14);
        const out = i < n - 1 ? clamp((1 - local) / 0.14) : 1;
        o = Math.min(inn, out);
        y = (1 - inn) * 36 - (1 - out) * 36;
      }
      el.style.opacity = o;
      el.style.translate = `0 ${y}px`;
    });
    root.querySelectorAll(".rail li").forEach((el, i) => {
      el.classList.toggle("on", i <= idx);
      el.classList.toggle("cur", i === idx);
    });
  });

  return (
    <section id="process" className="process" ref={ref} style={{ "--n": n }}>
      <div className="pin">
        <div className="wrap process-grid">
          <div className="process-side">
            <p className="kicker">How we work</p>
            <h2>A simple, predictable path from idea to launch.</h2>
            <ol className="rail">
              {PROCESS.map((s, i) => (
                <li key={s.title}><span className="rail-dot" /><span className="rail-n">{String(i + 1).padStart(2, "0")}</span>{s.title}</li>
              ))}
            </ol>
          </div>
          <div className="stages" aria-live="off">
            {PROCESS.map((s, i) => (
              <div className="stage" key={s.title}>
                <span className="stage-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <p className="stage-out"><span>You get</span>{s.deliverable}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
