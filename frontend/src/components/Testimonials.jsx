import { useCallback, useEffect, useRef, useState } from "react";
import { TESTIMONIALS, SAMPLE_TESTIMONIALS } from "../content.js";
import { reduced } from "../scroll.js";

// Time allowed to read a review: ~4s plus 250ms a word, kept between 6 and 14 seconds.
const readTime = (q) => Math.min(14000, Math.max(6000, 4000 + q.split(/\s+/).length * 250));

export default function Testimonials() {
  const preview = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("preview");
  const items = TESTIMONIALS.length ? TESTIMONIALS : preview ? SAMPLE_TESTIMONIALS : [];
  const n = items.length;

  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [remaining, setRemaining] = useState(null);
  const timer = useRef(null);
  const started = useRef(0);

  const go = useCallback((to) => setI(((to % n) + n) % n), [n]);

  // Auto-advance after the read time; pause on hover/focus; restart whenever the slide changes.
  useEffect(() => {
    if (n < 2 || reduced || paused) return;
    const ms = remaining ?? readTime(items[i].quote);
    started.current = performance.now();
    timer.current = setTimeout(() => { setRemaining(null); go(i + 1); }, ms);
    return () => clearTimeout(timer.current);
  }, [i, paused, n]); // eslint-disable-line react-hooks/exhaustive-deps

  const pause = () => {
    if (paused || n < 2) return;
    setRemaining(Math.max(800, readTime(items[i].quote) - (performance.now() - started.current)));
    setPaused(true);
  };
  const resume = () => setPaused(false);
  const manual = (to) => { setRemaining(null); go(to); };

  if (n === 0) return null;
  const t = items[i];

  return (
    <section className="section testimonials" aria-roledescription="carousel" aria-label="Client testimonials">
      <div className="wrap">
        <div className="head">
          <p className="kicker">What clients say</p>
          <h2>Results, in their own words.</h2>
        </div>

        <div
          className="t-card"
          onMouseEnter={pause} onMouseLeave={resume} onFocus={pause} onBlur={resume}
        >
          <span className="quote-mark" aria-hidden="true">&ldquo;</span>
          <figure key={i} className="t-slide" aria-live={paused ? "polite" : "off"}>
            <blockquote>{t.quote}</blockquote>
            <figcaption>
              {t.logo && <img src={t.logo} alt="" width="44" height="44" />}
              <span><strong>{t.name}</strong>{t.role && <em>{t.role}</em>}</span>
            </figcaption>
          </figure>

          <div className="t-bar" aria-hidden="true">
            {n > 1 && !reduced && (
              <span
                key={`${i}-${paused}`}
                className="t-fill"
                style={{
                  animationDuration: `${remaining ?? readTime(t.quote)}ms`,
                  animationPlayState: paused ? "paused" : "running",
                }}
              />
            )}
          </div>

          {n > 1 && (
            <div className="t-controls">
              <div className="t-dots" role="tablist" aria-label="Choose review">
                {items.map((_, d) => (
                  <button
                    key={d} role="tab" aria-selected={d === i} aria-label={`Review ${d + 1}`}
                    className={d === i ? "on" : ""} onClick={() => manual(d)}
                  />
                ))}
              </div>
              <div className="t-arrows">
                <button className="t-btn" onClick={() => manual(i - 1)} aria-label="Previous review">&larr;</button>
                <button className="t-btn t-next" onClick={() => manual(i + 1)} aria-label="Next review">Next review &rarr;</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
