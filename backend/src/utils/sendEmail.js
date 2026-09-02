import nodemailer from 'nodemailer';

/**
 * Sends an email. If SMTP credentials aren't configured (dev/local), the
 * message is logged to the console instead of failing the request, so the
 * rest of the flow (OTP, booking confirmation, etc.) can still be tested.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const isConfigured = Boolean(user && pass);

  if (!isConfigured) {
    console.log('\n📧 [EMAIL NOT SENT TO INBOX - SMTP NOT CONFIGURED]');
    console.log('💡 To receive real emails in your inbox, add your Gmail App Password to backend/.env (EMAIL_PASS=xxxx xxxx xxxx xxxx)');
    console.log(`➡️  To: ${to}`);
    console.log(`📌 Subject: ${subject}`);
    console.log('--------------------------------------------------\n');
    return { simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || user,
      to,
      subject,
      html,
      text,
    });

    console.log(`✅ [EMAIL DISPATCHED SUCCESSFULLY TO ${to}] MessageId: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ [EMAIL SENDING ERROR TO ${to}]:`, err.message);
    return { error: err.message };
  }
};

export default sendEmail;

