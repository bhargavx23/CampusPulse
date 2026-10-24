import dotenv from 'dotenv';
dotenv.config();

import emailService from '../services/emailService.js';

async function main() {
  console.log('===============================================================');
  console.log('  CAMPUSPULSE: NODEMAILER SMTP TRANSPORT DIAGNOSTIC');
  console.log('===============================================================\n');

  console.log('SMTP Configuration Check:');
  console.log(`- SMTP_HOST:    ${process.env.SMTP_HOST || '(default: smtp.gmail.com)'}`);
  console.log(`- SMTP_PORT:    ${process.env.SMTP_PORT || '(default: 465)'}`);
  console.log(`- SMTP_SECURE:  ${process.env.SMTP_SECURE || 'true'}`);
  console.log(`- SMTP_USER:    ${process.env.SMTP_USER ? process.env.SMTP_USER.replace(/(.{3}).*(@.*)/, '$1***$2') : '(Not configured - using preview mode)'}`);
  console.log(`- MAIL_FROM:    ${process.env.MAIL_FROM || '(default: CampusPulse Support)'}`);
  console.log(`- CLIENT_URL:   ${process.env.CLIENT_URL || 'http://localhost:5173'}\n`);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || process.env.SMTP_USER === 'your-verified-sender@gmail.com') {
    console.log('[NOTE] Live SMTP credentials are not configured in server/.env.');
    console.log('[NOTE] The application is operating in local development preview mode.');
    console.log('[NOTE] Password-reset emails will be logged safely to the console during development.\n');
    console.log('To enable live Gmail delivery, add the following to server/.env:');
    console.log('  SMTP_HOST=smtp.gmail.com');
    console.log('  SMTP_PORT=465');
    console.log('  SMTP_SECURE=true');
    console.log('  SMTP_USER=your-verified-sender@gmail.com');
    console.log('  SMTP_PASS=your-16-character-google-app-password');
    console.log('  MAIL_FROM="CampusPulse Support <your-verified-sender@gmail.com>"\n');
    process.exit(0);
  }

  console.log('Verifying connection with remote SMTP server...');
  const res = await emailService.verifyEmailTransport();

  if (res.verified) {
    console.log('[SUCCESS] ✓ SMTP transporter verified and ready to dispatch emails.');
    process.exit(0);
  } else {
    console.error(`[FAILURE] ✗ SMTP connection failed: ${res.error}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Diagnostic error:', err);
  process.exit(1);
});
