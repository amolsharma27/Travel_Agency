import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

/**
 * Sends an email. If SMTP credentials aren't configured (dev/local), the
 * message is logged to the console instead of failing the request, so the
 * rest of the flow (OTP, booking confirmation, etc.) can still be tested.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  // Always load freshest credentials from .env in real time
  dotenv.config({ override: true });

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
    if (err.message && err.message.includes('535') || err.message.includes('BadCredentials') || err.message.includes('Username and Password not accepted')) {
      console.log('\n⚠️ [GMAIL AUTHENTICATION FAILED - APP PASSWORD REQUIRED]');
      console.log('👉 Google does NOT accept your normal account login password for automated emails.');
      console.log('🔑 Please generate a 16-character Google App Password:');
      console.log('   1. Go to: https://myaccount.google.com/apppasswords');
      console.log('   2. Select App: "Mail" or type "PCTE Travels"');
      console.log('   3. Copy the 16-character password (e.g. "abcd efgh ijkl mnop")');
      console.log('   4. Paste into backend/.env -> EMAIL_PASS=abcd efgh ijkl mnop');
      console.log('-------------------------------------------------------------\n');
    }
    return { error: err.message };
  }
};

export default sendEmail;

