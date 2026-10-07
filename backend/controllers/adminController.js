import { Admin } from '../models/Admin.js';
import { resend, transporter } from '../config/email.js';

// Keep track of failed login attempts per IP
const loginAttempts = new Map();

export const login = async (req, res) => {
  const { username, password } = req.body;
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

  if (loginAttempts.has(clientIp)) {
    const record = loginAttempts.get(clientIp);
    if (record.lockUntil && record.lockUntil > Date.now()) {
      const remainingTimeMs = record.lockUntil - Date.now();
      const remainingMin = Math.ceil(remainingTimeMs / 60000);
      return res.status(429).json({
        error: `Too many failed attempts. You are locked out for 1 hour. Please try again in ${remainingMin} minutes.`,
        lockUntil: record.lockUntil
      });
    }
  }

  try {
    const admin = await Admin.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });

    if (admin && admin.password === password) {
      loginAttempts.delete(clientIp);
      res.json({ success: true });
    } else {
      let record = loginAttempts.get(clientIp) || { count: 0, lockUntil: 0 };
      
      if (record.lockUntil && record.lockUntil <= Date.now()) {
        record.count = 0;
        record.lockUntil = 0;
      }

      record.count += 1;

      if (record.count >= 5) {
        record.lockUntil = Date.now() + 60 * 60 * 1000; // 1 hour lockout
        loginAttempts.set(clientIp, record);
        
        return res.status(429).json({
          error: 'Too many failed attempts. You are locked out for 1 hour.',
          lockUntil: record.lockUntil
        });
      } else {
        loginAttempts.set(clientIp, record);
        const remainingAttempts = 5 - record.count;
        res.status(401).json({
          error: `Invalid credentials. Remaining attempts before 1-hour lockout: ${remainingAttempts}`
        });
      }
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) {
      return res.status(404).json({ error: 'No admin account found with that email' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = {
      code: otpCode,
      expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
    };
    await admin.save();

    console.log('\n==========================================');
    console.log(`[OTP Verification] Reset code for admin: ${otpCode}`);
    console.log(`Email recipient: ${email}`);
    console.log('==========================================\n');

    const isResendConfigured = !!resend && process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key';
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const isSmtpConfigured = smtpUser && smtpUser !== 'your_email@gmail.com' && smtpPass && smtpPass !== 'your_gmail_app_password';

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #10b981; text-align: center;">BandaMart Admin</h2>
        <hr style="border: 0; border-top: 1px solid #e2e8f0;" />
        <p>Hello Admin,</p>
        <p>You requested to reset your password. Please use the following 6-digit verification code (OTP) to complete the process:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b; background-color: #f1f5f9; padding: 10px 20px; border-radius: 6px; border: 1px solid #cbd5e1;">${otpCode}</span>
        </div>
        <p>This verification code is valid for <strong>15 minutes</strong>. If you did not initiate this request, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">This is an automated email from BandaMart. Please do not reply.</p>
      </div>
    `;

    const emailText = `Hello,\n\nYou requested to reset your BandaMart Admin password. Your 6-digit OTP verification code is: ${otpCode}\n\nThis code will expire in 15 minutes.\n\nIf you did not request this, please ignore this email.`;

    if (isResendConfigured) {
      try {
        await resend.emails.send({
          from: 'BandaMart Admin <onboarding@resend.dev>',
          to: email.trim().toLowerCase(),
          subject: 'BandaMart Admin Password Reset OTP',
          text: emailText,
          html: emailHtml
        });
        console.log(`[Resend Email Sent] Reset code sent to ${email}`);
        return res.json({ success: true, message: 'Reset code sent to your email.' });
      } catch (resendErr) {
        console.error('[Resend Error] Failed to send email via Resend:', resendErr.message);
        if (!isSmtpConfigured) {
          return res.json({
            success: true,
            message: 'Reset code generated. (Resend failed, please view your backend console logs to retrieve the OTP).'
          });
        }
      }
    }

    if (isSmtpConfigured) {
      try {
        const mailOptions = {
          from: `"BandaMart Admin" <${smtpUser}>`,
          to: email.trim().toLowerCase(),
          subject: 'BandaMart Admin Password Reset OTP',
          text: emailText,
          html: emailHtml
        };

        await transporter.sendMail(mailOptions);
        console.log(`[SMTP Email Sent] Reset code sent to ${email}`);
        return res.json({ success: true, message: 'Reset code sent to your email.' });
      } catch (mailErr) {
        console.error('[SMTP Error] Failed to send email via SMTP:', mailErr.message);
        return res.json({
          success: true,
          message: 'Reset code generated. (SMTP connection timed out/failed, please view terminal logs to retrieve the OTP code).'
        });
      }
    } else if (!isResendConfigured) {
      console.log('[Email Warning] Neither Resend nor SMTP is configured. Using console log fallback.');
      return res.json({
        success: true,
        message: 'Reset code generated. (Email service is not configured on the server, please view the terminal console to get the code).'
      });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process forgot password: ' + err.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and verification code (OTP) are required' });
  }

  try {
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) {
      return res.status(404).json({ error: 'No admin account found with that email' });
    }

    if (!admin.otp || !admin.otp.code || admin.otp.code !== otp) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (admin.otp.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    res.json({ success: true, message: 'Verification code verified successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify code: ' + err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'All fields (email, otp, newPassword) are required' });
  }

  try {
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) {
      return res.status(404).json({ error: 'No admin account found with that email' });
    }

    if (!admin.otp || !admin.otp.code || admin.otp.code !== otp) {
      return res.status(400).json({ error: 'Invalid or missing verification code' });
    }

    if (admin.otp.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    admin.password = newPassword;
    admin.otp = undefined;
    await admin.save();

    res.json({ success: true, message: 'Password reset successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset password: ' + err.message });
  }
};
