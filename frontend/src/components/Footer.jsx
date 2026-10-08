import { Link } from "react-router-dom";
import { COMPANY } from "../content.js";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Link to="/" className="brand">
            <img src="/logo-bridge.png" alt="" width="52" height="21" />
            <span className="brand-name">SETVION<small>AI Solutions</small></span>
          </Link>
          <p className="footer-tag">{COMPANY.tagline}.</p>
        </div>
        <div>
          <p className="footer-h">Explore</p>
          <Link to="/services">Services</Link>
          <Link to="/services#process">Process</Link>
          <Link to="/about">About</Link>
        </div>
        <div>
          <p className="footer-h">Contact</p>
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}>{COMPANY.phoneLabel}</a>
          {COMPANY.linkedin && <a href={COMPANY.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
        </div>
      </div>
      <div className="wrap footer-base">
        <span>&copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</span>
      </div>
    </footer>
  );
}
