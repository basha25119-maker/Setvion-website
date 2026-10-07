import { CLIENTS } from "../content.js";

export default function Clients({ kicker = "Trusted by", title }) {
  if (CLIENTS.length === 0) return null;
  return (
    <section className="section alt clients" aria-label="Our clients">
      <div className="wrap">
        <div className="head">
          <p className="kicker">{kicker}</p>
          {title && <h2>{title}</h2>}
        </div>
        <ul className="client-grid">
          {CLIENTS.map((c) => (
            <li key={c.name} className="client">
              <div className="client-logo">
                <img src={c.logo} alt={`${c.name} logo`} loading="lazy" width="240" height="240" />
              </div>
              <span className="client-name">{c.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
