import { useRef } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import ContactForm from "../components/ContactForm.jsx";
import Statement from "../components/Statement.jsx";
import { useScroll, clamp } from "../scroll.js";
import Clients from "../components/Clients.jsx";
import Testimonials from "../components/Testimonials.jsx";
import { usePageMeta } from "../hooks.js";
import { COMPANY, SERVICES, PRINCIPLES } from "../content.js";

const ICONS = {
  ai: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="16" height="16" rx="3" />
      <path d="M12 3v5M20 3v5M12 24v5M20 24v5M3 12h5M3 20h5M24 12h5M24 20h5" />
      <path d="M13 16h6M16 13v6" />
    </svg>
  ),
  web: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="26" height="20" rx="3" />
      <path d="M3 12h26" />
      <path d="M8 9h.01M12 9h.01" />
      <path d="M12 19l-3 3 3 3M20 19l3 3-3 3" transform="translate(0 -3)" />
    </svg>
  ),
  data: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 27h24" />
      <rect x="6" y="17" width="5" height="10" rx="1" />
      <rect x="13.5" y="10" width="5" height="17" rx="1" />
      <rect x="21" y="5" width="5" height="22" rx="1" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 24a6 6 0 1 1 1.4-11.8A8 8 0 0 1 25.5 14a5 5 0 0 1-.5 10z" />
      <path d="M12 28h8" />
    </svg>
  ),
};

function Hero() {
  const scene = useRef(null);
  const logo = useRef(null);

  // Tilt the logo toward the pointer (skipped for reduced-motion users via CSS transition only)
  const move = (e) => {
    const box = scene.current.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;
    logo.current.style.transform = `rotateY(${x * 24}deg) rotateX(${-y * 24}deg)`;
  };
  const leave = () => { logo.current.style.transform = ""; };

  // Scroll-linked: copy drifts up and fades, the logo scene grows and recedes (Apple-style).
  const root = useRef(null);
  useScroll(root, (rect) => {
    const p = clamp(-rect.top / (rect.height * 0.8));
    const copy = root.current.querySelector(".hero-copy");
    copy.style.opacity = 1 - p * 1.3;
    copy.style.translate = `0 ${-p * 70}px`;
    scene.current.style.scale = 1 + p * 0.35;
    scene.current.style.translate = `0 ${p * 40}px`;
    scene.current.style.opacity = 1 - p * 1.1;
    root.current.querySelector(".hero-bg").style.opacity = 1 - p;
  });

  return (
    <section className="hero" ref={root}>
      <div className="hero-bg" aria-hidden="true">
        <span className="orb o1" /><span className="orb o2" /><span className="grid" />
      </div>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse" /> AI, automation &amp; software studio</p>
          <h1>
            Building bridges with <span className="gold-text">modern technology</span>
          </h1>
          <p className="lead">
            We help growing businesses move from manual work and scattered tools to AI, automation and
            software that simply works. Fixed scope, plain language, fully yours.
          </p>
          <div className="cta-row">
            <Link to="/#contact" className="btn btn-lg">Start a conversation</Link>
            <Link to="/services" className="btn btn-ghost btn-lg">Explore services</Link>
          </div>
          <ul className="trust">
            <li>Fixed-price proposals</li>
            <li>Weekly visible progress</li>
            <li>You own everything</li>
          </ul>
        </div>

        <div className="scene" ref={scene} onPointerMove={move} onPointerLeave={leave}>
          <span className="ring r1" /><span className="ring r2" /><span className="ring r3" />
          <div className="float">
            <img ref={logo} className="tilt" src="/logo-bridge.png" alt="Setvion bridge logo" width="520" height="210" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  usePageMeta(
    `${COMPANY.name} | ${COMPANY.tagline}`,
    "SETVION AI Solutions helps growing businesses adopt AI, automation and modern software, built around how you actually work."
  );

  return (
    <>
      <Hero />

      <Statement />

      <section id="services" className="section">
        <div className="wrap">
          <Reveal className="head">
            <p className="kicker">What we build</p>
            <h2>Four services, one goal: make technology useful for your team.</h2>
          </Reveal>
          <div className="cards">
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} delay={i * 80} as="article" className="card">
                <div className="card-icon">{ICONS[s.id]}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <ul className="tags">
                  {s.tags.map((t) => <li key={t}>{t}</li>)}
                </ul>
                <Link to={`/services#${s.id}`} className="card-link">Learn more &rarr;</Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="more">
            <Link to="/services" className="btn btn-ghost">Explore all services &amp; our process</Link>
          </Reveal>
        </div>
      </section>

      <section id="why-us" className="section">
        <div className="wrap why">
          <Reveal className="head left">
            <p className="kicker">Why Setvion</p>
            <h2>Enterprise-grade engineering, without the enterprise friction.</h2>
            <p className="muted">
              We are a young company and we work like one: close to the client, quick to respond, and
              accountable for what we ship.
            </p>
            <Link to="/about" className="link">More about us &rarr;</Link>
          </Reveal>
          <div className="principles">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 70} className="principle">
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Clients title="Businesses that trust Setvion." />

      <Testimonials />

      <section id="contact" className="section alt contact">
        <div className="wrap contact-grid">
          <Reveal className="head left">
            <p className="kicker">Contact</p>
            <h2>Let&rsquo;s build something together.</h2>
            <p className="muted">Send a short message and we will reply within one working day.</p>
            <div className="contact-lines">
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}>{COMPANY.phoneLabel}</a>
            </div>
          </Reveal>
          <Reveal delay={100} className="panel">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
