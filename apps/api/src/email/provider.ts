import { SmtpEmailSender, type EmailSender } from "@dailyread/email";
import { env } from "../config/env.js";

export function createEmailSender(): EmailSender {
  return new SmtpEmailSender({
    from: env.EMAIL_FROM,
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    secure: env.SMTP_SECURE === "true"
  });
}
