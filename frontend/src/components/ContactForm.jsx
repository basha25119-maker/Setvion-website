import { useState } from "react";

export default function ContactForm() {
  const [state, setState] = useState({ status: "idle", msg: "" });

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ status: "sending", msg: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      form.reset();
      setState({ status: "ok", msg: data.message });
    } catch (err) {
      setState({ status: "error", msg: err.message });
    }
  }

  const busy = state.status === "sending";
  return (
    <form className="form" onSubmit={onSubmit}>
      {/* Honeypot: hidden from people, bots fill it in */}
      <input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" required maxLength={120} autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="email">Your email</label>
        <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="message">How can we help?</label>
        <textarea id="message" name="message" rows="5" required maxLength={4000} />
      </div>
      <button className="btn btn-lg" type="submit" disabled={busy}>
        {busy ? "Sending..." : "Send message"}
      </button>
      <p className={`notice ${state.status}`} role="status" aria-live="polite">{state.msg}</p>
    </form>
  );
}
