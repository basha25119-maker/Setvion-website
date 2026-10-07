# Setvion AI Solutions - one small Flask service that serves the React build
# (frontend/dist) and the contact-form API.
#
# Local dev:   python app.py            (API on :5000)  +  cd frontend && npm run dev
# Production:  gunicorn app:app         (see Dockerfile / README.md)

import csv
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

try:  # local development: read variables from a .env file (Railway uses real env vars instead)
    from dotenv import load_dotenv
    load_dotenv(override=False)
except ImportError:
    pass
from werkzeug.middleware.proxy_fix import ProxyFix

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
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


def deliver(name, email, message):
    """Email the message. Runs in a background thread so the visitor isn't kept waiting."""
    subject = "New website message from " + name.replace("\r", " ").replace("\n", " ")
    body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
    try:
        if RESEND_API_KEY:
            payload = json.dumps({"from": RESEND_FROM, "to": [CONTACT_EMAIL], "reply_to": email, "subject": subject, "text": body}).encode()
            req = urllib.request.Request(
                "https://api.resend.com/emails", data=payload, method="POST",
                headers={
                    "Authorization": f"Bearer {RESEND_API_KEY}",
                    "Content-Type": "application/json",
                    "User-Agent": "setvion-website/1.0",  # Resend's edge rejects Python's default agent
                },
            )
            urllib.request.urlopen(req, timeout=15).read()
            log.info("Email sent via Resend to %s", CONTACT_EMAIL)
        elif EMAIL_PASSWORD:
            mail = EmailMessage()
            mail["Subject"], mail["From"], mail["To"], mail["Reply-To"] = subject, CONTACT_EMAIL, CONTACT_EMAIL, email
            mail.set_content(body)
            with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15) as server:
                server.login(CONTACT_EMAIL, EMAIL_PASSWORD)
                server.send_message(mail)
        else:
            log.info("No email provider configured; message only logged.")
    except urllib.error.HTTPError as err:  # e.g. unverified domain, bad key: Resend explains why in the body
        log.error("Resend rejected the email (%s): %s", err.code, err.read().decode("utf-8", "replace")[:300])
    except Exception as err:  # the message is still in the logs / CSV
        log.error("Could not send email: %s", err)


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
