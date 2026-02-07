import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "BrokerFlow"}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export const sendVerificationEmail = async (
  to: string,
  name: string,
  code: string,
) => {
  const subject = "Verify your account";
  const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to Home Aura Realtor, ${name}!</h2>
        <p>Please use the following code to verify your account:</p>
        <h1 style="color: #4f46e5; letter-spacing: 5px;">${code}</h1>
        <p>Or click <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify?code=${code}">here</a> to verify.</p>
      </div>
    `;
  return sendMail(to, subject, html);
};
