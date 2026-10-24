import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'campuspulse_super_secret_jwt_key_2026';

/**
 * Protects routes by validating Bearer JWT and loading authenticated user
 */
export async function protect(req, res, next) {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication token missing. Please sign in to access this resource.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'The account associated with this token no longer exists.',
      });
    }

    // Invalidate sessions if password was reset after token issuance
    if (decoded.tokenVersion !== undefined && user.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        error: 'Your session has expired because your password was recently reset. Please sign in again.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Verification error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired session. Please sign in again.',
    });
  }
}

/**
 * Ensures authenticated user has administrative role
 */
export function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied: Institutional Administrator privileges are required for this action.',
    });
  }
  next();
}

/**
 * Ensures authenticated user is a student
 */
export function studentOnly(req, res, next) {
  if (!req.user || req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      error: 'Access denied: Only registered students can access this student endpoint.',
    });
  }
  next();
}

export default { protect, adminOnly, studentOnly };
