import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import Process from "../components/Process.jsx";
import { usePageMeta } from "../hooks.js";
import { SERVICES, PROCESS, FAQ, PRODUCT } from "../content.js";

export default function Services() {
  usePageMeta(
    "Services & Process | Setvion AI Solutions",
    "AI and automation, websites and apps, data and reporting, cloud and integration, and the clear four-stage process we follow on every project."
  );

  return (
    <>
      <section className="page-head">
        <div className="wrap page-head-row">
          <div className="page-head-copy">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Services</span>
            </nav>
            <h1>
              Technology that <span className="gold-text">earns its place</span> in your business.
            </h1>
            <p className="lead">
              Four focused services and one predictable process. Whatever we build, you get a fixed
              price, weekly progress and full ownership at the end.
            </p>
          </div>
          <nav className="jump" aria-label="Jump to a service">
            <p className="jump-h">On this page</p>
            {SERVICES.map((s, i) => (
              <a key={s.id} href={`#${s.id}`}><span>{String(i + 1).padStart(2, "0")}</span>{s.title}</a>
            ))}
            <a href="#process"><span>05</span>How we work</a>
          </nav>
        </div>
      </section>

      {SERVICES.map((s, i) => (
        <section key={s.id} id={s.id} className={`section svc ${i % 2 ? "alt" : ""}`}>
          <div className="wrap svc-grid">
            <Reveal className="svc-side">
              <span className="svc-n">{String(i + 1).padStart(2, "0")}</span>
              <h2>{s.title}</h2>
              <ul className="tags">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            </Reveal>
            <Reveal delay={80} className="svc-body">
              <p className="svc-intro">{s.intro}</p>
              <div className="svc-cols">
                <div>
                  <h3>What you get</h3>
                  <ul className="checks">{s.gets.map((g) => <li key={g}>{g}</li>)}</ul>
                </div>
                <div>
                  <h3>A good fit for</h3>
                  <ul className="dots-list">{s.fits.map((f) => <li key={f}>{f}</li>)}</ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      <Process />

      <section className="section">
        <div className="wrap">
          <Reveal className="head">
            <p className="kicker">Stage by stage</p>
            <h2>Exactly what to expect, at every step.</h2>
          </Reveal>
          <div className="stage-grid">
            {PROCESS.map((p, i) => (
              <Reveal key={p.title} as="article" delay={i * 60} className="stage-card">
                <span className="stage-card-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.title}</h3>
                <ul className="checks">{p.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                <p className="deliver"><span>You get</span>{p.deliverable}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <Reveal className="product">
            <div className="product-copy">
              <p className="kicker">Ready-made</p>
              <h2>{PRODUCT.name}</h2>
              <p className="muted">{PRODUCT.intro}</p>
              <Link to="/#contact" className="btn">Ask for a demo</Link>
            </div>
            <ul className="product-list">
              {PRODUCT.features.map((f) => (
                <li key={f.title}><h3>{f.title}</h3><p>{f.text}</p></li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <Reveal className="head left">
            <p className="kicker">Questions</p>
            <h2>Good to know before we talk.</h2>
          </Reveal>
          <Reveal delay={80} className="faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section closing">
        <div className="wrap">
          <Reveal className="closing-card">
            <h2>Not sure what you need yet?</h2>
            <p>Describe the problem. We will tell you honestly whether technology is the answer, and what it would take.</p>
            <Link to="/#contact" className="btn btn-lg">Talk to us</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
