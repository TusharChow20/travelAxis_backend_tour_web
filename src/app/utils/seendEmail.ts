import nodemailer from "nodemailer";
import varEnv from "../config/env";
import { renderTemplate } from "./renderTemplate";

const transporter = nodemailer.createTransport({
  host: varEnv.EMAIL_SENDER.SMTP_HOST,
  port: Number(varEnv.EMAIL_SENDER.SMTP_PORT),
  secure: false,
  auth: {
    user: varEnv.EMAIL_SENDER.SMTP_USER,
    pass: varEnv.EMAIL_SENDER.SMTP_PASS,
  },
});

interface ISendEmailOptions {
  to: string;
  subject: string;
  template: string;                     // ejs template name e.g. "forgetPassword"
  templateData?: Record<string, any>;   // data passed to template
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendMail = async ({
  to,
  subject,
  template,
  templateData = {},
  attachments,
}: ISendEmailOptions) => {
  const html = await renderTemplate(template, templateData);

  const info = await transporter.sendMail({
    from: varEnv.EMAIL_SENDER.SMTP_FROM,
    to,
    subject,
    html,
    attachments: attachments?.map((attachment) => ({ 
      filename: attachment.filename,
      content: attachment.content,
      contentType: attachment.contentType,
    })),
  });

  return info;
};