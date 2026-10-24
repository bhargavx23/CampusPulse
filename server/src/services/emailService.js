import 'dotenv/config';
import nodemailer from 'nodemailer';

/**
 * CampusPulse Institutional Email Service
 * Powered by Nodemailer with SMTP transport (Gmail SMTP / Custom SMTP)
 */

class EmailService {
  constructor() {
    this.transporter = null;
    this.isLiveConfigured = false;
    this.sentEmails = []; // Used for testing and in-memory verification
    this.mockMode = process.env.NODE_ENV === 'test';
    this.initializeTransporter();
  }

  /**
   * Initializes the Nodemailer transport based on environment variables.
   */
  initializeTransporter() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // If explicit credentials are provided, configure the real SMTP transporter
    if (user && pass && user !== 'your-verified-sender@gmail.com') {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
      });
      this.isLiveConfigured = true;
      console.log(`[EMAIL SERVICE] Initialized SMTP transporter for host ${host}:${port} (${user})`);
    } else {
      // In development / testing without live SMTP credentials:
      // Transporter uses a stream or mock mode that logs safe delivery previews
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'windows',
        buffer: true,
      });
      if (process.env.NODE_ENV !== 'test') {
        console.log('[EMAIL SERVICE] SMTP credentials not set. Running in development preview mode (emails logged locally).');
      }
    }
  }

  /**
   * Diagnostic verification of the SMTP transport.
   * Can be safely executed on demand without sending test emails on application boot.
   */
  async verifyEmailTransport() {
    if (!this.transporter) {
      return { verified: false, error: 'Transporter is not initialized.' };
    }
    try {
      const result = await this.transporter.verify();
      return { verified: true, result };
    } catch (err) {
      console.error('[EMAIL SERVICE] SMTP Transport verification failed:', err.message);
      return { verified: false, error: err.message };
    }
  }

  /**
   * Enable or disable mock mode (for automated integration tests)
   */
  setMockMode(isMock) {
    this.mockMode = Boolean(isMock);
  }

  getSentEmails() {
    return this.sentEmails;
  }

  clearSentEmails() {
    this.sentEmails = [];
  }

  /**
   * Dispatches a secure, branded OTP email for password reset.
   * @param {Object} params
   * @param {string} params.to Recipient email address
   * @param {string} params.name Recipient's display name
   * @param {string} params.otp Cryptographically generated 6-digit OTP
   */
  async sendPasswordResetOtpEmail({ to, name, otp }) {
    if (!this.isLiveConfigured) {
      this.initializeTransporter();
    }
    const sender = process.env.MAIL_FROM || `"CampusPulse Support" <${process.env.SMTP_USER || 'support@campuspulse.internal'}>`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your CampusPulse Verification Code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #F7F8FC;
      color: #172033;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #F7F8FC;
      padding: 40px 0;
    }
    .main-table {
      margin: 0 auto;
      width: 100%;
      max-width: 580px;
      background-color: #FFFFFF;
      border: 1px solid #E5E9F2;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(23, 37, 84, 0.05);
    }
    .header-banner {
      background: linear-gradient(135deg, #172554 0%, #3730A3 100%);
      padding: 32px;
      text-align: center;
    }
    .brand-title {
      color: #FFFFFF;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-tagline {
      color: #EEF2FF;
      font-size: 12px;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .content-body {
      padding: 36px 32px;
      line-height: 1.6;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #172033;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .instruction {
      font-size: 14px;
      color: #596579;
      margin-bottom: 20px;
    }
    .otp-container {
      text-align: center;
      margin: 28px 0;
    }
    .otp-code {
      display: inline-block;
      font-family: 'Courier New', Courier, monospace;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 10px;
      color: #4F46E5;
      background-color: #EEF2FF;
      border: 2px dashed #818CF8;
      border-radius: 12px;
      padding: 16px 28px;
      user-select: all;
    }
    .otp-expiry {
      font-size: 13px;
      color: #596579;
      margin-top: 10px;
    }
    .notice-box {
      background-color: #FFF4DB;
      border-left: 4px solid #D97706;
      padding: 14px 16px;
      border-radius: 6px;
      font-size: 12px;
      color: #78350F;
      margin: 24px 0 16px;
    }
    .footer {
      background-color: #F7F8FC;
      border-top: 1px solid #E5E9F2;
      padding: 20px 32px;
      text-align: center;
      font-size: 12px;
      color: #8993A5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main-table" cellpadding="0" cellspacing="0">
      <tr>
        <td class="header-banner">
          <h1 class="brand-title">CampusPulse</h1>
          <div class="brand-tagline">Smart Campus Issue Management</div>
        </td>
      </tr>
      <tr>
        <td class="content-body">
          <p class="greeting">Hello ${name ? name.split(' ')[0] : 'there'},</p>
          <p class="instruction">
            We received a request to reset the password for your CampusPulse account associated with <strong>${to}</strong>.
          </p>
          <p class="instruction">
            Use the One-Time Password (OTP) below to verify your account and proceed with your password reset:
          </p>

          <div class="otp-container">
            <div class="otp-code">${otp}</div>
            <p class="otp-expiry">This verification code is single-use and will expire in <strong>5 minutes</strong>.</p>
          </div>

          <div class="notice-box">
            <strong>CRITICAL SECURITY NOTICE:</strong> Do NOT share this code with anyone. CampusPulse faculty, staff, and administrators will NEVER ask for your OTP. If you did not initiate this request, your account is secure and you can safely disregard this email.
          </div>
        </td>
      </tr>
      <tr>
        <td class="footer">
          &copy; ${new Date().getFullYear()} CampusPulse &bull; StackMitra — Projects Made Simple.<br>
          This is an automated institutional notification. Please do not reply directly to this email.
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
    `;

    const textContent = `
CampusPulse — Password Reset Verification Code

Hello ${name || 'User'},

We received a request to reset your password for your CampusPulse account (${to}).

Your One-Time Password (OTP) is:
${otp}

This code is valid for 5 minutes and can only be used once.

CRITICAL SECURITY NOTICE:
Do NOT share this code with anyone. CampusPulse faculty, staff, and administrators will never ask for your verification code.

If you did not make this request, you can safely ignore this email. Your password will remain unchanged.

— CampusPulse Security Team
StackMitra — Projects Made Simple
    `.trim();

    const mailOptions = {
      from: sender,
      to,
      subject: `Your CampusPulse Verification Code: ${otp}`,
      text: textContent,
      html: htmlContent,
    };

    // If running in automated test mode or mock mode, record email in memory
    if (this.mockMode) {
      this.sentEmails.push({
        to,
        subject: mailOptions.subject,
        otp,
        date: new Date(),
      });
      return { messageId: `mock-otp-${Date.now()}` };
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      if (process.env.NODE_ENV !== 'production' && !process.env.SMTP_USER) {
        console.log(`\n[EMAIL PREVIEW] ----------------------------------------------`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`OTP Code: ${otp}`);
        console.log(`---------------------------------------------------------------\n`);
      }
      return info;
    } catch (error) {
      console.error('[EMAIL SERVICE] Failed to deliver password reset OTP email:', error.message);
      throw error;
    }
  }

  /**
   * Dispatches a secure, branded password-reset email (kept for backward compatibility).
   * @param {Object} params
   * @param {string} params.to Recipient email address
   * @param {string} params.name Recipient's display name
   * @param {string} params.token Cryptographic raw reset token
   */
  async sendPasswordResetEmail({ to, name, token }) {
    if (!this.isLiveConfigured) {
      this.initializeTransporter();
    }
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;
    const sender = process.env.MAIL_FROM || `"CampusPulse Support" <${process.env.SMTP_USER || 'support@campuspulse.internal'}>`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your CampusPulse password</title>
</head>
<body>
  <div style="font-family: sans-serif; padding: 20px;">
    <h2>CampusPulse Password Reset</h2>
    <p>Please use OTP verification on the forgot password page to reset your credentials.</p>
    <p><a href="${resetUrl}">Reset Password</a></p>
  </div>
</body>
</html>
    `;

    const textContent = `
CampusPulse — Password Reset Request
To set a new password, open: ${resetUrl}
    `.trim();

    const mailOptions = {
      from: sender,
      to,
      subject: 'Reset your CampusPulse password',
      text: textContent,
      html: htmlContent,
    };

    if (this.mockMode) {
      this.sentEmails.push({
        to,
        subject: mailOptions.subject,
        resetUrl,
        token,
        date: new Date(),
      });
      return { messageId: `mock-${Date.now()}` };
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error('[EMAIL SERVICE] Failed to deliver password reset email:', error.message);
      throw error;
    }
  }
}

export const emailService = new EmailService();
export default emailService;
