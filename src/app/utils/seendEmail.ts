import nodemailer from "nodemailer";
import varEnv from "../config/env";
const transporter = nodemailer.createTransport({
  host: varEnv.EMAIL_SENDER.SMTP_HOST,
  port: Number(varEnv.EMAIL_SENDER.SMTP_PORT),
  secure: true,
  auth: {
    user: varEnv.EMAIL_SENDER.SMTP_USER,
    pass: varEnv.EMAIL_SENDER.SMTP_PASS,
  },
});

interface ISendEMailOptions{
    to: string,
    subject: string,
    attachments?:{
        filename: string,
        content: Buffer |  string,
        contentType: string
    } 
}

const sendMail = async ({
    to,subject,attachments
})=>{
    const info = await transporter.sendMail({
        from:varEnv.EMAIL_SENDER.SMTP_FROM,
        to: to,
        subject: 
    })
}