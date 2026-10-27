import jwt from 'jsonwebtoken';
import User, { hashPassword, VALID_BRANCHES, VALID_YEARS } from '../models/User.js';
import { JWT_SECRET } from '../middleware/auth.js';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email, tokenVersion: user.tokenVersion || 0 },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Handles Student Registration
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

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Full name must be at least 2 characters.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    if (!branch || !VALID_BRANCHES.includes(branch)) {
      return res.status(400).json({ success: false, error: 'Please select a valid academic branch from the list.' });
    }

    if (!yearOfStudy || !VALID_YEARS.includes(yearOfStudy)) {
      return res.status(400).json({ success: false, error: 'Please select a valid year of study.' });
    }

    if (!section || typeof section !== 'string' || !section.trim()) {
      return res.status(400).json({ success: false, error: 'Section is required.' });
    }

    if (!rollNumber || typeof rollNumber !== 'string' || rollNumber.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'College roll number must be at least 3 characters.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedRoll = rollNumber.trim().toUpperCase();

    const adminEmail = (process.env.ADMIN_EMAIL || 'bhargavpasupuleti5@gmail.com').toLowerCase();
    if (normalizedEmail === adminEmail) {
      return res.status(403).json({
        success: false,
        error: 'This email is reserved for institutional administration access.',
      });
    }

    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        error: `A user account with email "${normalizedEmail}" is already registered.`,
      });
    }

    const existingRoll = await User.findOne({ rollNumber: normalizedRoll });
    if (existingRoll) {
      return res.status(409).json({
        success: false,
        error: `A student account with roll number "${normalizedRoll}" is already registered.`,
      });
    }

    const passwordHash = hashPassword(password);
    const newStudent = await User.create({
      name: fullName.trim(),
      email: normalizedEmail,
      role: 'student',
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

export default { register, login, getMe, updateProfile };
