import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { COMPANY } from "../content.js";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`topbar ${scrolled || open ? "solid" : ""}`}>
      <div className="topbar-in">
        <Link to="/" className="brand" aria-label={`${COMPANY.name} home`}>
          <img src="/logo-bridge.png" alt="" width="44" height="18" />
          <span>SETVION</span>
        </Link>
        <button
          className="menu-btn"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen(!open)}
        >
          <span className="bars" aria-hidden="true" />
          <span className="sr">Menu</span>
        </button>
        <nav id="site-nav" className={open ? "open" : ""}>
          <NavLink to="/services">Services &amp; process</NavLink>
          <NavLink to="/about">About</NavLink>
          <Link to="/#contact" className="btn btn-sm">Contact us</Link>
        </nav>
      </div>
    </header>
  );
}
