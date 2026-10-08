# SETVION AI Solutions website

One small service: **React (Vite)** front end, served by **Flask** (which also handles the contact form).
Production image is a two-stage Docker build (Node builds the site, a slim Python image serves it).

```
app.py              Flask: serves frontend/dist + POST /api/contact + /healthz
frontend/           React app (src/content.js holds all the text)
Dockerfile          Builds both, runs gunicorn on $PORT
railway.json        Tells Railway to use the Dockerfile + health check
```

## Run locally

```bash
# terminal 1 - API
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env             # then put your RESEND_API_KEY etc. in .env
python app.py                       # http://127.0.0.1:5000

# terminal 2 - site with hot reload (proxies /api to Flask)
cd frontend && npm install && npm run dev     # http://localhost:5173
```

Production-style check: `cd frontend && npm run build`, then `python app.py` and open :5000.

## Deploy to Railway (single service)

1. Push this repo to GitHub.
2. Railway -> New Project -> Deploy from GitHub repo. It picks up `railway.json` + `Dockerfile` automatically.
3. Service -> Settings -> Networking -> Generate Domain (then add your custom domain; HTTPS is automatic).
4. Service -> Variables (see below).

### Variables

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | **Recommended.** Sends contact emails over HTTPS (resend.com, free tier). Verify your domain there and set `RESEND_FROM`, e.g. `SETVION AI Solutions <hello@yourdomain.com>`. |
| `RESEND_FROM` | Sender address. `onboarding@resend.dev` only delivers to your own Resend account email. **To also email the visitor a confirmation, verify your domain in Resend** and use e.g. `SETVION AI Solutions <hello@yourdomain.com>`. |
| `CONTACT_EMAIL` | Where messages go. Defaults to the address in `app.py`. |
| `SITE_URL` | Your live address, e.g. `https://www.yourdomain.com`. Adds the logo and a "Visit our website" button to emails. |
| `SETVION_EMAIL_PASSWORD` | Gmail app password (SMTP fallback). Railway blocks outbound SMTP on Free/Hobby plans, so use Resend unless you are on Pro. |
| `MESSAGES_FILE` | Optional CSV backup path. Attach a Railway Volume at `/data` and set `/data/messages.csv` to keep it across deploys. |

Every message is also written to the service logs (`CONTACT | ...`), so nothing is lost even with no email provider.

## Editing content

- Text, services, process steps, FAQ, values, mission: `frontend/src/content.js`
- **Clients:** drop a logo image into `frontend/src/clients/` (square-ish, ~400-600px, a little padding round the mark). It appears on Home and About automatically; the name comes from the file name, or set it in `CLIENT_NAME_OVERRIDES` in `content.js`.
- **Testimonials:** add entries to `TESTIMONIALS` in `content.js`; the auto-advancing carousel appears on the homepage once there is at least one. Open `/?preview` to see it with sample reviews before you have real ones (visitors never see these).
- Colours and spacing: top of `frontend/src/styles.css`.
- LinkedIn link in the footer: set `COMPANY.linkedin`.
