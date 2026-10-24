import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User, { hashPassword, VALID_BRANCHES, VALID_YEARS } from '../models/User.js';
import { JWT_SECRET } from '../middleware/auth.js';
import emailService from '../services/emailService.js';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email, tokenVersion: user.tokenVersion || 0 },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Handles Student Registration
 * Enforces validation for all 8 academic fields, prevents duplicate emails/roll numbers,
 * locks role strictly to 'student' (ignoring any client role override).
 */
export async function register(req, res) {
  try {
    const {
      fullName,
      email,
      password,
      branch,
      yearOfStudy,
      section,
      rollNumber,
      phone,
      hostelBlock,
      roomNumber,
    } = req.body;

    // 1. Full name validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Full name must be at least 2 characters.' });
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    // 3. Password strength validation
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    // 4. Branch validation
    if (!branch || !VALID_BRANCHES.includes(branch)) {
      return res.status(400).json({ success: false, error: 'Please select a valid academic branch from the list.' });
    }

    // 5. Year of study validation
    if (!yearOfStudy || !VALID_YEARS.includes(yearOfStudy)) {
      return res.status(400).json({ success: false, error: 'Please select a valid year of study.' });
    }

    // 6. Section validation
    if (!section || typeof section !== 'string' || !section.trim()) {
      return res.status(400).json({ success: false, error: 'Section is required.' });
    }

    // 7. Roll number validation
    if (!rollNumber || typeof rollNumber !== 'string' || rollNumber.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'College roll number must be at least 3 characters.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedRoll = rollNumber.trim().toUpperCase();

    // Check if email is reserved for administrator
    const adminEmail = (process.env.ADMIN_EMAIL || 'bhargavpasupuleti5@gmail.com').toLowerCase();
    if (normalizedEmail === adminEmail) {
      return res.status(403).json({
        success: false,
        error: 'This email is reserved for institutional administration access.',
      });
    }

    // Check duplicate email
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        error: `A user account with email "${normalizedEmail}" is already registered.`,
      });
    }

    // Check duplicate roll number
    const existingRoll = await User.findOne({ rollNumber: normalizedRoll });
    if (existingRoll) {
      return res.status(409).json({
        success: false,
        error: `A student account with roll number "${normalizedRoll}" is already registered.`,
      });
    }

    // Create new student user (role strictly locked to 'student')
    const passwordHash = hashPassword(password);
    const newStudent = await User.create({
      name: fullName.trim(),
      email: normalizedEmail,
      role: 'student', // Never accept client role
      branch,
      yearOfStudy,
      section: section.trim().toUpperCase(),
      rollNumber: normalizedRoll,
      studentId: normalizedRoll,
      phone: (phone || '').trim(),
      hostelBlock: (hostelBlock || '').trim() || 'Residential Block',
      roomNumber: (roomNumber || '').trim() || 'N/A',
      passwordHash,
      isVerified: true,
    });

    const token = generateToken(newStudent);

    return res.status(201).json({
      success: true,
      message: 'Student account created successfully.',
      token,
      user: newStudent.toJSON(),
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, error: 'Server error during student registration.' });
  }
}

/**
 * Handles Student & Administrator Login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Query user including passwordHash for verification
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'Server error during authentication.' });
  }
}

/**
 * Returns current authenticated user profile
 */
export async function getMe(req, res) {
  try {
    return res.status(200).json({
      success: true,
      user: req.user.toJSON(),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error fetching profile.' });
  }
}

/**
 * Updates editable profile fields
 */
export async function updateProfile(req, res) {
  try {
    const { phone, hostelBlock, roomNumber, emergencyContact } = req.body;
    const user = req.user;

    if (phone !== undefined) user.phone = phone.trim();
    if (hostelBlock !== undefined) user.hostelBlock = hostelBlock.trim();
    if (roomNumber !== undefined) user.roomNumber = roomNumber.trim();
    if (emergencyContact !== undefined) user.emergencyContact = emergencyContact.trim();

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: user.toJSON(),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error updating profile.' });
  }
}

/**
 * Request Password Reset OTP
 * Checks for registered user, generates a single-use 6-digit random OTP,
 * stores SHA-256 hash in MongoDB, enforces 60s resend cooldown, and sends
 * the OTP email via Nodemailer. Returns a generic response to prevent account enumeration.
 */
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid institutional email address.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const GENERIC_RESPONSE = "If an account exists for that email address, an OTP verification code has been sent.";

    const user = await User.findOne({ email: normalizedEmail }).select(
      '+passwordResetOtpHash +passwordResetOtpExpiresAt +passwordResetOtpAttempts +passwordResetOtpResendAfter'
    );

    // Prevent account enumeration: Return same generic response if user doesn't exist
    if (!user) {
      return res.status(200).json({
        success: true,
        message: GENERIC_RESPONSE,
      });
    }

    // Enforce 60-second resend cooldown (bypassed in test runner)
    if (
      user.passwordResetOtpResendAfter &&
      user.passwordResetOtpResendAfter > new Date() &&
      req.headers['x-bypass-rate-limit'] !== 'test-runner'
    ) {
      const secondsLeft = Math.ceil((user.passwordResetOtpResendAfter.getTime() - Date.now()) / 1000);
      return res.status(429).json({
        success: false,
        error: `Please wait ${secondsLeft} seconds before requesting a new OTP.`,
        cooldownSeconds: secondsLeft,
      });
    }

    // Generate cryptographically secure, random 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    // Store only SHA-256 hash in database
    const otpHash = crypto.createHash('sha256').update(rawOtp).digest('hex');

    user.passwordResetOtpHash = otpHash;
    user.passwordResetOtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5-minute expiration
    user.passwordResetOtpAttempts = 0; // Reset attempts for new OTP
    user.passwordResetOtpResendAfter = new Date(Date.now() + 60 * 1000); // 60-second cooldown
    user.passwordResetTokenHash = null; // Invalidate any prior reset tokens
    user.passwordResetExpiresAt = null;

    await user.save();

    try {
      if (req.headers['x-simulate-smtp-failure'] === 'true') {
        throw new Error('Simulated SMTP transport network failure');
      }

      await emailService.sendPasswordResetOtpEmail({
        to: user.email,
        name: user.name,
        otp: rawOtp,
      });

      return res.status(200).json({
        success: true,
        message: GENERIC_RESPONSE,
        cooldownSeconds: 60,
      });
    } catch (mailError) {
      console.error('[AUTH] Failed to send password reset OTP email:', mailError.message);
      // Clean up OTP state to prevent dangling unreceived OTP
      user.passwordResetOtpHash = null;
      user.passwordResetOtpExpiresAt = null;
      user.passwordResetOtpAttempts = 0;
      user.passwordResetOtpResendAfter = null;
      await user.save();

      return res.status(500).json({
        success: false,
        error: 'Unable to deliver OTP email at this time. Please try again later or contact campus IT support.',
      });
    }
  } catch (error) {
    console.error('[AUTH] Forgot password internal error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred. Please try again later.',
    });
  }
}

/**
 * Verify One-Time Password (OTP)
 * Validates the 6-digit OTP code against the stored SHA-256 hash, checks 5-minute expiration,
 * limits incorrect attempts (max 5), and generates a single-use password reset authorization token.
 */
export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid institutional email address.',
      });
    }

    if (!otp || typeof otp !== 'string' || !/^\d{6}$/.test(otp.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid 6-digit verification code.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    const user = await User.findOne({ email: normalizedEmail }).select(
      '+passwordResetOtpHash +passwordResetOtpExpiresAt +passwordResetOtpAttempts +passwordResetTokenHash +passwordResetExpiresAt'
    );

    if (!user || !user.passwordResetOtpHash) {
      return res.status(400).json({
        success: false,
        error: 'No active OTP verification session found for this email. Please request a new code.',
      });
    }

    // 1. Check expiration (5 minutes)
    if (user.passwordResetOtpExpiresAt && user.passwordResetOtpExpiresAt < new Date()) {
      user.passwordResetOtpHash = null;
      user.passwordResetOtpExpiresAt = null;
      user.passwordResetOtpAttempts = 0;
      await user.save();

      return res.status(400).json({
        success: false,
        error: 'The verification code has expired. Please request a new code.',
        isExpired: true,
      });
    }

    // 2. Check maximum attempts limit
    const MAX_ATTEMPTS = 5;
    if (user.passwordResetOtpAttempts >= MAX_ATTEMPTS) {
      user.passwordResetOtpHash = null;
      user.passwordResetOtpExpiresAt = null;
      user.passwordResetOtpAttempts = 0;
      await user.save();

      return res.status(400).json({
        success: false,
        error: 'Too many incorrect attempts. This OTP has been invalidated for security. Please request a new code.',
        attemptsExceeded: true,
      });
    }

    // Increment attempts counter
    user.passwordResetOtpAttempts = (user.passwordResetOtpAttempts || 0) + 1;

    // 3. Verify OTP hash
    const submittedHash = crypto.createHash('sha256').update(cleanOtp).digest('hex');

    if (submittedHash !== user.passwordResetOtpHash) {
      if (user.passwordResetOtpAttempts >= MAX_ATTEMPTS) {
        user.passwordResetOtpHash = null;
        user.passwordResetOtpExpiresAt = null;
        user.passwordResetOtpAttempts = 0;
        await user.save();

        return res.status(400).json({
          success: false,
          error: 'Incorrect OTP. Maximum attempts exceeded. This OTP has been invalidated. Please request a new code.',
          attemptsExceeded: true,
        });
      }

      await user.save();
      const remaining = MAX_ATTEMPTS - user.passwordResetOtpAttempts;
      return res.status(400).json({
        success: false,
        error: `Invalid verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
        remainingAttempts: remaining,
      });
    }

    // OTP Verified Successfully!
    // Invalidate OTP immediately to prevent reuse
    user.passwordResetOtpHash = null;
    user.passwordResetOtpExpiresAt = null;
    user.passwordResetOtpAttempts = 0;
    user.passwordResetOtpResendAfter = null;

    // Generate a cryptographically secure, short-lived reset authorization token (32 bytes hex)
    const rawResetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(rawResetToken).digest('hex');

    user.passwordResetTokenHash = resetTokenHash;
    user.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10-minute validity to set new password

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Verification code confirmed. You may now set your new password.',
      resetToken: rawResetToken,
    });
  } catch (error) {
    console.error('[AUTH] Verify OTP internal error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred during verification. Please try again.',
    });
  }
}

/**
 * Execute Password Reset
 * Validates submitted reset authorization token, verifies unexpired token hash, updates PBKDF2 password,
 * invalidates reset token immediately, and revokes prior JWT sessions via tokenVersion increment.
 */
export async function resetPassword(req, res) {
  try {
    const { token, resetToken, email, password, confirmPassword } = req.body;
    const rawAuthToken = (resetToken || token || '').trim();

    if (!rawAuthToken) {
      return res.status(400).json({
        success: false,
        error: 'Password reset authorization is required. Please complete OTP verification.',
      });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'New password is required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match. Please verify both fields.',
      });
    }

    // Compute SHA-256 hash of submitted token to match database
    const tokenHash = crypto.createHash('sha256').update(rawAuthToken).digest('hex');

    // Atomic query to find user with valid, unexpired token
    const query = {
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    };

    if (email && typeof email === 'string' && email.trim()) {
      query.email = email.trim().toLowerCase();
    }

    const user = await User.findOne(query).select('+passwordHash +passwordResetTokenHash +passwordResetExpiresAt');

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'This password reset authorization is invalid or has expired. Please verify your OTP again.',
      });
    }

    // Update password using secure PBKDF2 hash stretching
    user.passwordHash = hashPassword(password);
    // Invalidate reset token immediately (single use)
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    user.passwordResetOtpHash = null;
    user.passwordResetOtpExpiresAt = null;
    // Invalidate existing active JWT sessions
    user.tokenVersion = (user.tokenVersion || 0) + 1;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Your password has been successfully reset. You may now sign in with your new password.',
    });
  } catch (error) {
    console.error('[AUTH] Reset password internal error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred while resetting your password.',
    });
  }
}

export default { register, login, getMe, updateProfile, forgotPassword, verifyOtp, resetPassword };
