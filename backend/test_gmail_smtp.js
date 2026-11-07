/**
 * test_gmail_smtp.js
 * Verification script for Gmail SMTP configuration and email delivery.
 * 
 * Safety & Security Rules:
 * - NEVER prints or logs GMAIL_APP_PASSWORD, tokens, or private secrets.
 * - Confirms SMTP connection, sender address, and message dispatch.
 */

const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const sendEmail = require('./utils/sendEmail');

async function runSmtpTests() {
  console.log('====================================================');
  console.log('   LUXE SALOON - GMAIL SMTP VERIFICATION TEST');
  console.log('====================================================\n');

  // Check required environment variables without printing secrets
  const gmailUser = process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  const emailFrom = process.env.EMAIL_FROM;

  console.log('1. Checking Environment Variables...');
  if (!gmailUser) {
    console.error('   ❌ FAILED: GMAIL_USER is missing.');
    process.exit(1);
  }
  if (!appPassword) {
    console.error('   ❌ FAILED: GMAIL_APP_PASSWORD is missing.');
    process.exit(1);
  }
  console.log(`   ✔ GMAIL_USER configured: ${gmailUser}`);
  console.log(`   ✔ GMAIL_APP_PASSWORD configured: [SECURE - ${appPassword.replace(/\s+/g, '').length} chars]`);
  console.log(`   ✔ EMAIL_FROM configured: ${emailFrom || '(defaults to GMAIL_USER)'}`);

  // Test 1: Transporter Connection Verification
  console.log('\n2. Verifying SMTP Connection to smtp.gmail.com:465 (SSL)...');
  let transporter;
  try {
    transporter = sendEmail.createTransporter();
    const isConnected = await transporter.verify();
    if (isConnected) {
      console.log('   ✔ SMTP Connection successfully established and authenticated.');
    } else {
      console.error('   ❌ FAILED: SMTP verify returned unexpected response.');
      process.exit(1);
    }
  } catch (err) {
    console.error('   ❌ SMTP Connection Failed:', err.message);
    process.exit(1);
  }

  // Test 2: Verify Sender Address Formatting
  console.log('\n3. Verifying Sender Address...');
  const senderAddress = sendEmail.getSenderAddress();
  console.log(`   ✔ Formatted Sender: ${senderAddress}`);
  if (!senderAddress.includes(gmailUser)) {
    console.error(`   ❌ FAILED: Sender address does not match authenticated user ${gmailUser}`);
    process.exit(1);
  }

  // Test 3: Actual Test Email Delivery
  console.log('\n4. Sending Test Email via Gmail SMTP...');
  const recipient = gmailUser; // Send to authorized address
  const testResetUrl = `${(process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '')}/reset-password/test_token_verification`;

  try {
    const result = await sendEmail({
      email: recipient,
      name: 'Faheem (Admin)',
      resetUrl: testResetUrl,
    });

    console.log('   ✔ Email successfully dispatched!');
    console.log(`   ✔ Message ID: ${result.messageId}`);
    console.log(`   ✔ Recipient: ${recipient}`);
  } catch (err) {
    console.error('   ❌ Email Delivery Failed:', err.message);
    process.exit(1);
  }

  console.log('\n====================================================');
  console.log('   🎉 ALL GMAIL SMTP TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================\n');
}

runSmtpTests().catch((err) => {
  console.error('Unexpected error during test execution:', err.message);
  process.exit(1);
});
