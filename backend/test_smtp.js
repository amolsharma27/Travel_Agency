import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import sendEmail from './src/utils/sendEmail.js';

async function testSMTP() {
  console.log('Testing SMTP connection & email dispatch...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS set?:', Boolean(process.env.EMAIL_PASS));

  if (!process.env.EMAIL_PASS) {
    console.log('\n❌ EMAIL_PASS is empty in backend/.env!');
    console.log('Please add your 16-character Google App Password to backend/.env (EMAIL_PASS=xxxx xxxx xxxx xxxx)');
    return;
  }

  const result = await sendEmail({
    to: process.env.EMAIL_USER || 'amolsharma2705@gmail.com',
    subject: 'PCTE Travel Agency - SMTP Test Email',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #2563eb; margin-top: 0;">🎉 SMTP Email Working!</h2>
          <p>This is a test email sent directly from your PCTE Travel Agency backend.</p>
          <p>If you are seeing this in your inbox, your Nodemailer Gmail SMTP setup is 100% active and configured!</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #64748b; font-size: 13px;">Sent from PCTE Travel Agency System</p>
        </div>
      </div>
    `,
    text: 'This is a test email from PCTE Travel Agency backend. SMTP is working!',
  });

  console.log('\nResult:', result);
}

testSMTP();
