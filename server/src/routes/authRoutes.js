import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  forgotPasswordLimiter,
  verifyOtpLimiter,
  resetPasswordLimiter,
} from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/resend-otp', forgotPasswordLimiter, forgotPassword);
router.post('/verify-otp', verifyOtpLimiter, verifyOtp);
router.post('/reset-password', resetPasswordLimiter, resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
