# Setvion AI Solutions - a tiny Flask website.
# Run it with:  python app.py   then open http://127.0.0.1:5000

import csv
import os
import smtplib
from datetime import datetime
from email.message import EmailMessage

from flask import Flask, flash, redirect, render_template, request, url_for

app = Flask(__name__)
app.secret_key = "change-this-to-any-random-text"   # needed for the thank-you message

MESSAGES_FILE = "messages.csv"                 # backup copy of every message
MY_EMAIL = "amruthkumar206@gmail.com"          # messages are sent to this address
EMAIL_PASSWORD = os.environ.get("SETVION_EMAIL_PASSWORD")   # Gmail "app password" (see steps)

def asset_version():
    """A number that changes by itself whenever you replace static/style.css,
    so your browser always loads the newest copy. Nothing to bump by hand."""
    try:
        return str(int(os.path.getmtime(os.path.join(app.static_folder, "style.css"))))
    except OSError:
        return "1"


@app.context_processor
def inject_asset_version():
    return {"asset_version": asset_version()}


def send_email(name, email, message):
    """Email the message to you. If no password is set, we just skip this."""
    if not EMAIL_PASSWORD:
        print("Email password not set - message saved to messages.csv only.")
        return
    try:
        mail = EmailMessage()
        mail["Subject"] = "New website message from " + name
        mail["From"] = MY_EMAIL
        mail["To"] = MY_EMAIL
        mail["Reply-To"] = email          # pressing Reply answers the visitor
        mail.set_content("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(MY_EMAIL, EMAIL_PASSWORD)
            server.send_message(mail)
    except Exception as error:
        print("Could not send email:", error)   # the message is still safe in messages.csv


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact", methods=["POST"])
def contact():
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip()
    message = request.form.get("message", "").strip()

    if not name or not message or "@" not in email:
        flash("Please add your name, a valid email and a message.", "error")
        return redirect(url_for("home") + "#contact")

    # 1) Save a backup copy in messages.csv
    is_new_file = not os.path.exists(MESSAGES_FILE)
    with open(MESSAGES_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if is_new_file:
            writer.writerow(["time", "name", "email", "message"])
        writer.writerow([datetime.now().strftime("%Y-%m-%d %H:%M"), name, email, message])

    # 2) Send it to your inbox
    send_email(name, email, message)

    flash("Thanks, " + name + ". We have your message and will reply soon.", "success")
    return redirect(url_for("home") + "#contact")


# Shown whenever someone visits a link that doesn't exist on the site
@app.errorhandler(404)
def page_not_found(error):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(debug=True)
