import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks.js";

export default function NotFound() {
  usePageMeta("Page not found | SETVION AI Solutions");
  return (
    <section className="notfound">
      <div className="wrap">
        <p className="kicker">Error 404</p>
        <h1>This page took a <span className="gold-text">wrong turn</span>.</h1>
        <p className="lead">The bridge doesn&rsquo;t reach here yet.</p>
        <Link to="/" className="btn btn-lg">Back to homepage</Link>
      </div>
    </section>
  );
}
