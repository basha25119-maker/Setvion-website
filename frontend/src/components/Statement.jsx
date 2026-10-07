import { useRef } from "react";
import { useScroll, pinProgress, clamp } from "../scroll.js";

const WORDS = [
  "We", "build", "what", "your", "business", "actually", "needs,", "explain", "every", "choice",
  "in", "plain", "language,", "and", "hand", "over", "something", "you", ["fully", "own."],
].flat().map((w, i, all) => ({ w, gold: i >= all.length - 2 }));

// Pinned statement: the text stays on screen while words light up one by one as you scroll.
export default function Statement() {
  const ref = useRef(null);
  useScroll(ref, (rect, vh) => {
    const p = pinProgress(rect, vh);
    const spans = ref.current.querySelectorAll(".st-word");
    const n = spans.length;
    spans.forEach((s, i) => {
      const t = clamp((p * 1.15 - (i / n) * 0.95) / 0.1);
      s.style.opacity = 0.14 + 0.86 * t;
    });
    ref.current.querySelector(".st-kicker").style.opacity = clamp(p * 8);
  });
  return (
    <section className="statement" ref={ref} aria-label="Our approach">
      <div className="pin">
        <div className="wrap">
          <p className="kicker st-kicker">Our approach</p>
          <p className="st-text">
            {WORDS.map((x, i) => (
              <span key={i} className={`st-word ${x.gold ? "gold-text" : ""}`}>{x.w} </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
