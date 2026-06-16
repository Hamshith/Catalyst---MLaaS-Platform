import os
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from dotenv import load_dotenv


load_dotenv()


SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


def send_otp_email(
    email: str,
    otp: str,
    purpose: str
):
    subject = f"{purpose} OTP"

    body = f"""
Hello,

Your OTP for {purpose.lower().replace("_", " ")} is:

{otp}

This OTP will expire in 10 minutes.

If you did not request this, please ignore this email.

Regards,
MLaaS Team
"""

    message = MIMEMultipart()
    message["From"] = SMTP_USERNAME
    message["To"] = email
    message["Subject"] = subject

    message.attach(
        MIMEText(body, "plain")
    )

    try:
        server = smtplib.SMTP(
            SMTP_HOST,
            SMTP_PORT
        )

        server.starttls()

        server.login(
            SMTP_USERNAME,
            SMTP_PASSWORD
        )

        server.sendmail(
            SMTP_USERNAME,
            email,
            message.as_string()
        )

        server.quit()

        print(
            f"OTP email sent successfully to {email}"
        )

    except Exception as e:
        print(
            f"Failed to send email: {e}"
        )
        raise