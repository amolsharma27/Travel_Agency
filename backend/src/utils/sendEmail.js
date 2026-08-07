import nodemailer from 'nodemailer';

const emailConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

let transporter = null;
if (emailConfigured) {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Sends an email. If SMTP credentials aren't configured (dev/local), the
 * message is logged to the console instead of failing the request, so the
 * rest of the flow (OTP, booking confirmation, etc.) can still be tested.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  if (!emailConfigured) {
    console.log('--- EMAIL (dev mode, not actually sent) ---');
    console.log(`To: ${to}\nSubject: ${subject}\n${text || html}`);
    console.log('--------------------------------------------');
    return { simulated: true };
  }

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
    text,
  });

  return info;
};

export default sendEmail;
