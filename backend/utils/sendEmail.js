const nodemailer = require('nodemailer');

/**
 * Creates and returns a Nodemailer transporter configured for Gmail SMTP
 */
const createTransporter = () => {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, '') : null;

  if (!user || !pass) {
    const configError = new Error('GMAIL_USER and GMAIL_APP_PASSWORD must be configured in environment variables');
    configError.statusCode = 500;
    throw configError;
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for port 465
    auth: {
      user: user.trim(),
      pass: pass.trim(),
    },
  });
};

/**
 * Format sender address to ensure it matches the authenticated Gmail account
 */
const getSenderAddress = () => {
  const user = (process.env.GMAIL_USER || '').trim();
  const rawFrom = (process.env.EMAIL_FROM || user).trim();

  // If already formatted as "Display Name <email@domain.com>"
  if (rawFrom.includes('<') && rawFrom.includes('>')) {
    return rawFrom;
  }

  // Format with salon brand
  return `"LUXE Saloon" <${rawFrom}>`;
};

/**
 * Send password reset email via Gmail SMTP
 * 
 * @param {Object} options
 * @param {string} options.email - Recipient email address
 * @param {string} options.name - Recipient name
 * @param {string} options.resetUrl - Full password reset URL
 */
const sendEmail = async ({ email, name, resetUrl }) => {
  const transporter = createTransporter();
  const recipientName = name ? name.trim() : 'Valued Customer';
  const subject = 'LUXE Saloon - Password Reset Request';
  const from = getSenderAddress();

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0f12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0d0f12; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #161a20; border: 1px solid #2d3748; border-radius: 12px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
          
          <!-- Top Accent Gold Line -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #d4af37 0%, #f6e05e 50%, #d4af37 100%);"></td>
          </tr>

          <!-- Header / Brand -->
          <tr>
            <td align="center" style="padding: 36px 32px 20px 32px; background: radial-gradient(circle at top center, rgba(212, 175, 55, 0.12) 0%, transparent 70%);">
              <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 32px; letter-spacing: 5px; color: #ffffff; font-weight: 700;">
                LUXE<span style="color: #d4af37;">.</span>
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #9ca3af;">
                Haute Coiffure & Luxury Grooming
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 24px 36px 36px 36px;">
              <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #ffffff; letter-spacing: 0.5px;">
                Reset Your Password
              </h2>
              
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #d1d5db;">
                Hello <strong style="color: #ffffff;">${recipientName}</strong>,
              </p>

              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #9ca3af;">
                We received a request to reset your password for your LUXE Saloon account. To create a new password and regain access to your dashboard, please click the button below:
              </p>

              <!-- CTA Button -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                <tr>
                  <td align="center" style="border-radius: 6px; background-color: #d4af37;">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #0a0a0c; text-decoration: none; border-radius: 6px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry Alert -->
              <div style="background-color: #1f2530; border-left: 3px solid #d4af37; padding: 14px 16px; border-radius: 4px; margin: 24px 0;">
                <p style="margin: 0; font-size: 13px; color: #e5e7eb; line-height: 1.5;">
                  <strong style="color: #d4af37;">Important:</strong> This reset link will expire in <strong>30 minutes</strong>.
                </p>
              </div>

              <!-- Direct Link Fallback -->
              <p style="margin: 28px 0 8px 0; font-size: 12px; color: #6b7280; line-height: 1.5;">
                If the button above does not work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0; font-size: 12px; line-height: 1.5; word-break: break-all;">
                <a href="${resetUrl}" target="_blank" style="color: #d4af37; text-decoration: underline;">
                  ${resetUrl}
                </a>
              </p>

              <hr style="border: none; border-top: 1px solid #2d3748; margin: 32px 0 24px 0;" />

              <!-- Security Notice -->
              <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #6b7280;">
                If you did not request a password reset, you can safely disregard this email. Your password will remain unchanged and your account is secure.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 20px 32px; background-color: #11141a; border-top: 1px solid #232a35;">
              <p style="margin: 0; font-size: 12px; color: #4b5563;">
                &copy; 2026 LUXE Saloon Management System. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const textContent = `
LUXE Saloon - Password Reset Request

Hello ${recipientName},

We received a request to reset the password for your LUXE Saloon account.

Please use the following link to reset your password (valid for 30 minutes):
${resetUrl}

If you did not request this password reset, please ignore this email. Your account remains secure.

© 2026 LUXE Saloon
  `.trim();

  try {
    const info = await transporter.sendMail({
      from,
      to: email,
      subject,
      html: htmlContent,
      text: textContent,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err) {
    console.error('[SMTP Delivery Error]:', err.message);
    const deliveryError = new Error(err.message || 'SMTP email delivery failed');
    deliveryError.statusCode = 500;
    deliveryError.name = 'SmtpDeliveryError';
    throw deliveryError;
  }
};

sendEmail.createTransporter = createTransporter;
sendEmail.getSenderAddress = getSenderAddress;

module.exports = sendEmail;
