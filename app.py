# Setvion AI Solutions - one small Flask service that serves the React build
# (frontend/dist) and the contact-form API.
#
# Local dev:   python app.py            (API on :5000)  +  cd frontend && npm run dev
# Production:  gunicorn app:app         (see Dockerfile / README.md)

import csv
import html
import json
import logging
import os
import smtplib
import threading
import time
import urllib.error
import urllib.request
from collections import defaultdict, deque
from datetime import datetime, timezone
from email.message import EmailMessage

from flask import Flask, jsonify, request, send_from_directory
from flask_compress import Compress

from werkzeug.middleware.proxy_fix import ProxyFix

def _load_env(path):
    """Tiny .env reader for local development (Railway uses real environment variables)."""
    try:
        with open(path, encoding="utf-8-sig") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))
    except OSError:
        pass


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_load_env(os.path.join(BASE_DIR, ".env"))
DIST_DIR = os.path.join(BASE_DIR, "frontend", "dist")

# Messages are sent here. Override with the CONTACT_EMAIL environment variable.
CONTACT_EMAIL = os.environ.get("CONTACT_EMAIL", "amruthkumar206@gmail.com")
# Option A (recommended on Railway): Resend HTTPS API.
RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
RESEND_FROM = os.environ.get("RESEND_FROM", "Setvion Website <onboarding@resend.dev>")
# Option B: Gmail app password over SMTP (Railway blocks SMTP on Free/Hobby plans).
EMAIL_PASSWORD = os.environ.get("SETVION_EMAIL_PASSWORD")
# Backup copy of every message. Railway's disk is wiped on redeploy unless you
# attach a Volume and point MESSAGES_FILE at it (e.g. /data/messages.csv).
MESSAGES_FILE = os.environ.get("MESSAGES_FILE", os.path.join(BASE_DIR, "messages.csv"))

PAGES = {"/", "/about", "/services"}  # routes the React app knows; anything else gets a real 404 status

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("setvion")

log.info("Email provider: %s | notifications go to %s",
         "Resend" if RESEND_API_KEY else ("Gmail SMTP" if EMAIL_PASSWORD else "NONE (set RESEND_API_KEY)"), CONTACT_EMAIL)

app = Flask(__name__, static_folder=None)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)  # Railway sits behind a proxy
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024
app.config["COMPRESS_MIN_SIZE"] = 500
Compress(app)


# ---------- Security + caching headers ----------
@app.after_request
def add_headers(resp):
    resp.headers.setdefault("X-Content-Type-Options", "nosniff")
    resp.headers.setdefault("X-Frame-Options", "DENY")
    resp.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    resp.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    resp.headers.setdefault(
        "Content-Security-Policy",
        "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; "
        "script-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
    )
    if request.is_secure:
        resp.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    return resp


# ---------- Contact form ----------
_hits = defaultdict(deque)
_lock = threading.Lock()


def rate_limited(ip, limit=5, window=600):
    """Allow `limit` submissions per `window` seconds per IP (in memory; fine for one small service)."""
    now = time.time()
    with _lock:
        q = _hits[ip]
        while q and now - q[0] > window:
            q.popleft()
        if len(q) >= limit:
            return True
        q.append(now)
        return False


def csv_safe(value):
    """Stop spreadsheet apps treating a message as a formula."""
    return "'" + value if value[:1] in ("=", "+", "-", "@") else value


def save_message(name, email, message):
    try:
        new_file = not os.path.exists(MESSAGES_FILE)
        with open(MESSAGES_FILE, "a", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            if new_file:
                w.writerow(["time_utc", "name", "email", "message"])
            w.writerow([datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M"), csv_safe(name), csv_safe(email), csv_safe(message)])
    except OSError as err:
        log.warning("Could not write %s: %s", MESSAGES_FILE, err)


def _send(to, subject, text, html=None, reply_to=None):
    """Send one email via Resend (preferred) or Gmail SMTP. Returns True on success, never raises."""
    try:
        if RESEND_API_KEY:
            data = {"from": RESEND_FROM, "to": [to], "subject": subject, "text": text}
            if html:
                data["html"] = html
            if reply_to:
                data["reply_to"] = reply_to
            req = urllib.request.Request(
                "https://api.resend.com/emails", data=json.dumps(data).encode(), method="POST",
                headers={
                    "Authorization": f"Bearer {RESEND_API_KEY}",
                    "Content-Type": "application/json",
                    "User-Agent": "setvion-website/1.0",  # Resend's edge rejects Python's default agent
                },
            )
            urllib.request.urlopen(req, timeout=15).read()
        elif EMAIL_PASSWORD:
            mail = EmailMessage()
            mail["Subject"], mail["From"], mail["To"] = subject, CONTACT_EMAIL, to
            if reply_to:
                mail["Reply-To"] = reply_to
            mail.set_content(text)
            if html:
                mail.add_alternative(html, subtype="html")
            with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15) as server:
                server.login(CONTACT_EMAIL, EMAIL_PASSWORD)
                server.send_message(mail)
        else:
            log.warning("No email provider configured (set RESEND_API_KEY); email to %s not sent.", to)
            return False
        log.info("Email sent to %s (%s)", to, subject)
        return True
    except urllib.error.HTTPError as err:  # e.g. unverified domain, bad key: Resend explains why in the body
        log.error("Resend rejected the email to %s (%s): %s", to, err.code, err.read().decode("utf-8", "replace")[:400])
    except Exception as err:  # the message is still in the logs / CSV
        log.error("Could not send email to %s: %s", to, err)
    return False


def deliver(name, email, message):
    """Email the team the enquiry, then send the visitor a confirmation. Runs in a background thread."""
    clean = name.replace("\r", " ").replace("\n", " ")
    esc_name, esc_email = html.escape(clean), html.escape(email)
    esc_msg = html.escape(message).replace("\n", "<br>")

    # 1) To you: the enquiry. Pressing Reply answers the visitor.
    _send(
        CONTACT_EMAIL,
        f"New website message from {clean}",
        f"Name: {clean}\nEmail: {email}\n\nMessage:\n{message}",
        html=(f"<p><strong>Name:</strong> {esc_name}<br><strong>Email:</strong> {esc_email}</p>"
              f"<p><strong>Message:</strong></p><p>{esc_msg}</p>"),
        reply_to=email,
    )

    # 2) To the visitor: confirmation with a copy of what they sent.
    first = esc_name.split(" ")[0] or "there"
    _send(
        email,
        "We've received your message | Setvion AI Solutions",
        (f"Hi {clean.split(' ')[0] or 'there'},\n\n"
         "Thank you for getting in touch with Setvion AI Solutions. We have your message and will reply "
         "within one working day.\n\nYour message:\n" + message +
         "\n\nBest regards,\nThe Setvion team\n" + CONTACT_EMAIL),
        html=(f"<div style='font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1a1a1f;line-height:1.6'>"
              f"<h2 style='margin:0 0 4px'>Thanks, {first}.</h2>"
              "<p style='color:#555;margin-top:0'>We have your message and will reply within one working day.</p>"
              f"<div style='border-left:3px solid #c08a3c;padding:4px 16px;margin:20px 0;background:#faf7f0'>"
              f"<p style='margin:8px 0;color:#555;font-size:13px'>Your message</p><p style='margin:8px 0'>{esc_msg}</p></div>"
              "<p>Best regards,<br><strong>The Setvion team</strong><br>"
              f"<a href='mailto:{html.escape(CONTACT_EMAIL)}'>{html.escape(CONTACT_EMAIL)}</a></p>"
              "<p style='color:#999;font-size:12px'>Setvion AI Solutions &middot; Building bridges with modern technology</p></div>"),
        reply_to=CONTACT_EMAIL,
    )


@app.post("/api/contact")
def contact():
    data = request.get_json(silent=True) or {}
    if data.get("website"):  # honeypot filled in: pretend success, do nothing
        return jsonify(message="Thanks. We have your message and will reply soon.")

    name = str(data.get("name", "")).strip()[:120]
    email = str(data.get("email", "")).strip()[:200]
    message = str(data.get("message", "")).strip()[:4000]
    if not name or not message or "@" not in email or " " in email:
        return jsonify(error="Please add your name, a valid email and a message."), 400
    if rate_limited(request.remote_addr or "unknown"):
        return jsonify(error="Too many messages from your connection. Please try again later."), 429

    log.info("CONTACT | %s <%s> | %s", name, email, message.replace("\n", " ")[:500])
    save_message(name, email, message)
    threading.Thread(target=deliver, args=(name, email, message), daemon=True).start()
    return jsonify(message=f"Thanks, {name}. We have your message and will reply within one working day.")


@app.get("/healthz")
def health():
    return "ok"


# ---------- React app ----------
@app.errorhandler(413)
def too_big(_):
    return jsonify(error="Message is too long."), 413


@app.route("/api/<path:_>", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
def api_404(_):
    return jsonify(error="Not found"), 404


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def spa(path):
    file_path = os.path.join(DIST_DIR, path)
    if path and os.path.isfile(file_path):
        resp = send_from_directory(DIST_DIR, path)
        # Vite fingerprints everything in /assets, so it can be cached forever.
        resp.headers["Cache-Control"] = (
            "public, max-age=31536000, immutable" if path.startswith("assets/") else "public, max-age=3600"
        )
        return resp
    if "." in os.path.basename(path):  # a missing file, not a page
        return "Not found", 404
    status = 200 if "/" + path.rstrip("/") in PAGES or path == "" else 404
    resp = send_from_directory(DIST_DIR, "index.html")
    resp.status_code = status
    resp.headers["Cache-Control"] = "no-cache"
    return resp


if __name__ == "__main__":
    app.run(port=int(os.environ.get("PORT", 5000)), debug=True)
