"""Email templates for the contact form.

Email clients ignore most modern CSS, so these use table layout and inline styles.
Each builder returns (subject, plain_text, html). Everything user-supplied is escaped.
"""

import html as _html
from datetime import datetime, timezone

GOLD = "#c9a24d"
GOLD_LIGHT = "#f0dc8a"
INK = "#0b0b0f"
TEXT = "#1d1d24"
MUTED = "#6b6b76"
BG = "#efede6"
LOGO_CID = "setvion-logo"
FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif"


def _e(value):
    return _html.escape(str(value), quote=True)


def _multiline(value):
    return _e(value).replace("\r\n", "\n").replace("\n", "<br>")


def _shell(preheader, eyebrow, title, body_html, site_url, contact_email):
    logo = (f'<img src="cid:{LOGO_CID}" width="130" alt="SETVION AI Solutions logo" '
            'style="display:block;margin:0 auto 18px;border:0;outline:none;height:auto;">')
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><title>SETVION AI Solutions</title></head>
<body style="margin:0;padding:0;background:{BG};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">{_e(preheader)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{BG};padding:32px 12px;">
<tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
    <tr><td style="background:{INK};border-radius:20px 20px 0 0;padding:40px 36px 34px;text-align:center;">
      {logo}
      <div style="font-family:{FONT};font-size:22px;font-weight:700;letter-spacing:7px;color:{GOLD_LIGHT};">SETVION</div>
      <div style="font-family:{FONT};font-size:13px;letter-spacing:4px;color:#b9b8c2;margin-top:6px;">AI Solutions</div>
      <div style="height:1px;width:48px;background:{GOLD};margin:26px auto 22px;line-height:1px;font-size:1px;">&nbsp;</div>
      <div style="font-family:{FONT};font-size:11px;letter-spacing:3px;color:{GOLD};text-transform:uppercase;">{_e(eyebrow)}</div>
      <h1 style="font-family:{FONT};font-size:28px;line-height:1.25;font-weight:700;color:#ffffff;margin:12px 0 0;">{title}</h1>
    </td></tr>
    <tr><td style="background:#ffffff;padding:36px;font-family:{FONT};color:{TEXT};font-size:16px;line-height:1.65;">
      {body_html}
    </td></tr>
    <tr><td style="background:#faf8f3;border-top:1px solid #e9e5d8;border-radius:0 0 20px 20px;padding:24px 36px;text-align:center;font-family:{FONT};font-size:12px;line-height:1.7;color:{MUTED};">
      <strong style="color:{TEXT};letter-spacing:1px;">SETVION AI Solutions</strong><br>
      Building bridges with modern technology<br>
      <a href="mailto:{_e(contact_email)}" style="color:{GOLD};text-decoration:none;">{_e(contact_email)}</a>
    </td></tr>
  </table>
</td></tr></table></body></html>"""


def _quote(label, text):
    return (
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">'
        f'<tr><td style="border-left:3px solid {GOLD};background:#faf8f3;padding:16px 20px;border-radius:0 12px 12px 0;">'
        f'<div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:{MUTED};margin-bottom:8px;">{_e(label)}</div>'
        f'<div style="font-size:16px;line-height:1.65;color:{TEXT};">{_multiline(text)}</div>'
        f"</td></tr></table>"
    )


def _button(label, href):
    return (
        f'<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;"><tr>'
        f'<td style="background:{INK};border-radius:999px;">'
        f'<a href="{_e(href)}" style="display:inline-block;padding:14px 30px;font-family:{FONT};font-size:15px;'
        f'font-weight:700;color:{GOLD_LIGHT};text-decoration:none;">{_e(label)}</a></td></tr></table>'
    )


def team_email(name, email, message, site_url, contact_email):
    """Notification to the SETVION AI Solutions team."""
    when = datetime.now(timezone.utc).strftime("%d %b %Y, %H:%M UTC")
    subject = f"New enquiry from {name}"
    rows = "".join(
        f'<tr><td style="padding:12px 0;border-bottom:1px solid #eee9db;font-size:12px;letter-spacing:2px;'
        f'text-transform:uppercase;color:{MUTED};width:110px;vertical-align:top;">{_e(k)}</td>'
        f'<td style="padding:12px 0;border-bottom:1px solid #eee9db;font-size:16px;color:{TEXT};">{v}</td></tr>'
        for k, v in (
            ("Name", _e(name)),
            ("Email", f'<a href="mailto:{_e(email)}" style="color:{GOLD};text-decoration:none;">{_e(email)}</a>'),
            ("Received", _e(when)),
        )
    )
    body = (
        f'<p style="margin:0 0 20px;color:{MUTED};">Someone has just sent a message through the website contact form.</p>'
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0">{rows}</table>'
        + _quote("Their message", message)
        + _button(f"Reply to {name.split(' ')[0] or 'them'}", f"mailto:{email}")
        + f'<p style="margin:22px 0 0;font-size:13px;color:{MUTED};">Tip: replying to this email also goes straight to {_e(email)}.</p>'
    )
    text = f"New enquiry from {name}\n\nName: {name}\nEmail: {email}\nReceived: {when}\n\nMessage:\n{message}\n"
    page = _shell(f"{name} sent a message: {message[:90]}", "New enquiry", "You have a new message", body, site_url, contact_email)
    return subject, text, page


def visitor_email(name, message, site_url, contact_email):
    """Confirmation to the person who contacted Setvion."""
    first = name.split(" ")[0] or "there"
    subject = "Thanks for contacting SETVION AI Solutions"
    steps = [
        ("We read it", "Your message goes straight to the people who will work on it."),
        ("We reply within one working day", "With answers, or the questions we need to give you a proper one."),
        ("We agree a plan", "If we are a good fit, you get a clear scope, timeline and fixed price in writing."),
    ]
    step_rows = "".join(
        f'<tr><td style="width:44px;vertical-align:top;padding:10px 0;">'
        f'<div style="width:30px;height:30px;line-height:30px;border-radius:50%;background:{INK};color:{GOLD_LIGHT};'
        f'font-size:13px;font-weight:700;text-align:center;">{i}</div></td>'
        f'<td style="padding:10px 0;"><strong style="color:{TEXT};">{_e(t)}</strong><br>'
        f'<span style="color:{MUTED};font-size:15px;">{_e(d)}</span></td></tr>'
        for i, (t, d) in enumerate(steps, 1)
    )
    body = (
        f'<p style="margin:0 0 16px;font-size:18px;color:{TEXT};">Hi {_e(first)},</p>'
        f'<p style="margin:0 0 8px;">Thank you for getting in touch. We have received your message and one of us '
        f"will reply <strong>within one working day</strong>.</p>"
        + _quote("Your message", message)
        + f'<p style="margin:28px 0 6px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:{MUTED};">What happens next</p>'
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0">{step_rows}</table>'
        + (f'<div style="margin-top:26px;">{_button("Visit our website", site_url)}</div>' if site_url else "")
        + f'<p style="margin:28px 0 0;">Speak soon,<br><strong>The SETVION AI Solutions team</strong></p>'
        f'<p style="margin:18px 0 0;font-size:13px;color:{MUTED};">Need to add something? Just reply to this email.</p>'
    )
    text = (
        f"Hi {first},\n\nThank you for getting in touch with SETVION AI Solutions. We have received your message "
        f"and will reply within one working day.\n\nYour message:\n{message}\n\n"
        "What happens next:\n1. We read it\n2. We reply within one working day\n"
        "3. If we are a good fit, we agree a clear scope, timeline and fixed price in writing\n\n"
        f"Speak soon,\nThe SETVION AI Solutions team\n{contact_email}\n"
    )
    page = _shell("We have your message and will reply within one working day.", "Message received",
                  f"Thank you, {_e(first)}.", body, site_url, contact_email)
    return subject, text, page
