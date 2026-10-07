import { useRef } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import Clients from "../components/Clients.jsx";
import CountUp from "../components/CountUp.jsx";
import { useScroll } from "../scroll.js";
import { usePageMeta } from "../hooks.js";
import { COMPANY, MOTTO, STATS, MISSION, VALUES, PROMISES } from "../content.js";

export default function About() {
  usePageMeta(
    "About | Setvion AI Solutions",
    "Why Setvion exists, our mission and the values we work by: clarity, honesty, ownership, craft, accountability and long-term partnership."
  );

  const mark = useRef(null);
  useScroll(mark, () => {
    mark.current.style.translate = `0 ${Math.min(window.scrollY, 600) * 0.12}px`;
  });

  return (
    <>
      <section className="page-head">
        <div className="wrap page-head-row">
          <div className="page-head-copy">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">About</span>
            </nav>
            <h1>
              Big-company engineering for <span className="gold-text">businesses of every size</span>.
            </h1>
            <p className="lead">
              Setvion exists to close a gap: large firms run on data, automation and AI, while smaller
              businesses are left with outdated tools or software built for someone else&rsquo;s problem.
            </p>
          </div>
          <div className="page-head-mark" aria-hidden="true" ref={mark}>
            <span className="mark-glow" />
            <img src="/logo-bridge.png" alt="" width="360" height="145" />
          </div>
        </div>
        <div className="wrap">
          <dl className="stats">
            {STATS.map((s) => (
              <div key={s.label}><dt>{s.label}</dt><dd><CountUp value={s.value} /></dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section id="story" className="section">
        <div className="wrap split">
          <Reveal className="head left">
            <p className="kicker">Our story</p>
            <h2>Why Setvion exists</h2>
          </Reveal>
          <Reveal delay={80} className="prose">
            <p>
              {COMPANY.name} was built on a simple observation: large companies use data, automation and AI
              to run smoothly, while smaller businesses are often left with outdated tools or overpriced,
              over-complicated software that was never designed for them.
            </p>
            <p>
              We started Setvion to bring the same quality of engineering that large organisations rely on
              to businesses that are usually told they&rsquo;re &ldquo;too small&rdquo; for it. We don&rsquo;t sell
              technology for its own sake. We build what a business actually needs, explain it in plain
              language, and hand over something the business genuinely owns.
            </p>
            <p>
              We are deliberately a focused team. That means senior attention on every project, quick
              answers, and no hand-offs between layers of account managers.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section alt motto">
        <div className="wrap">
          <Reveal className="motto-in">
            <p className="kicker">Our motto</p>
            <p className="motto-text"><span className="gold-text">{MOTTO}.</span></p>
            <p className="motto-sub">
              Every business has a vision and a gap between where it is and where it wants to be. Our job
              is to build the bridge: carefully engineered, clearly explained and made to last.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="mv">
            <Reveal className="mv-card">
              <p className="kicker">Our mission</p>
              <p className="mv-text">{MISSION.mission}</p>
            </Reveal>
            <Reveal delay={80} className="mv-card">
              <p className="kicker">Our vision</p>
              <p className="mv-text">{MISSION.vision}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="values" className="section alt">
        <div className="wrap">
          <Reveal className="head">
            <p className="kicker">What we stand for</p>
            <h2>The values behind every project.</h2>
          </Reveal>
          <div className="values">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} as="article" delay={(i % 3) * 70} className="value">
                <span className="value-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <Reveal className="head left">
            <p className="kicker">Our promise</p>
            <h2>What working with us is like.</h2>
            <p className="muted">
              These are not slogans. They are commitments we are happy to put in writing in every proposal.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <ul className="promises">
              {PROMISES.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap split">
          <Reveal className="head left">
            <p className="kicker">The name and the mark</p>
            <h2>A bridge, by design.</h2>
          </Reveal>
          <Reveal delay={80} className="prose">
            <p>
              <em>Setu</em> means bridge, and <em>vion</em> echoes vision. Together: we set the vision, then
              build the bridge to reach it.
            </p>
            <p>
              Our logo says the same thing. Two towers, one connecting span: the business you are today and
              the one you are building, joined by technology that carries real weight.
            </p>
          </Reveal>
        </div>
      </section>

      <Clients kicker="Proud to work with" />

      <section className="section closing">
        <div className="wrap">
          <Reveal className="closing-card">
            <h2>Ready to work with us?</h2>
            <p>Tell us what is slowing your team down. We will tell you honestly whether we can help.</p>
            <div className="cta-row center">
              <Link to="/#contact" className="btn btn-lg">Get in touch</Link>
              <Link to="/services" className="btn btn-ghost btn-lg">Explore services</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
