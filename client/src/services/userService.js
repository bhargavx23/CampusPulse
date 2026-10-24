/**
 * CampusPulse User & Academic Registry Service
 * Integrated with backend MongoDB API (/api/auth & /api/admin/students).
 */
import { api, setStoredToken } from './apiClient.js';

export const ADMIN_CONFIG = {
  email: 'bhargavpasupuleti5@gmail.com',
  name: 'Bhargav Pasupuleti',
  role: 'admin',
  department: 'Grievance Redressal & Institutional Administration',
  staffId: 'ADMIN-PORTAL-CHIEF',
};

class UserService {
  /**
   * Registers a new student account with academic verification.
   * Directly posts to the secure backend registration endpoint.
   */
  async registerStudent(data) {
    try {
      const res = await api.post('/auth/register', data);
      if (res.token) {
        setStoredToken(res.token);
      }
      return {
        success: true,
        user: res.user,
        message: res.message,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Registration failed. Please check your academic information.',
      };
    }
  }

  /**
   * Authenticates user against backend MongoDB credentials.
   * No fake fallback; invalid credentials are strictly rejected.
   */
  async authenticate(email, password) {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.token) {
        setStoredToken(res.token);
      }
      return {
        success: true,
        user: res.user,
        message: res.message,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Invalid email or password.',
      };
    }
  }

  /**
   * Retrieves verified registered students list for administrators.
   */
  async getStudents() {
    try {
      const res = await api.get('/admin/students');
      return res.students || [];
    } catch (err) {
      console.warn('Could not fetch registered students directory:', err.message);
      return [];
    }
  }

  /**
   * Updates student or administrator profile.
   */
  async updateProfile(email, updatedFields) {
    try {
      const res = await api.put('/auth/profile', updatedFields);
      return res.user;
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  }

  /**
   * Submits a password recovery request for the given email address.
   * Dispatches a 6-digit OTP code to the registered account.
   */
  async forgotPassword(email) {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return {
        success: true,
        message: res.message,
        cooldownSeconds: res.cooldownSeconds || 60,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Unable to process password reset request. Please try again.',
      };
    }
  }

  /**
   * Resends the OTP verification code to the registered email address.
   * Subject to server-enforced cooldown.
   */
  async resendOtp(email) {
    try {
      const res = await api.post('/auth/resend-otp', { email });
      return {
        success: true,
        message: res.message,
        cooldownSeconds: res.cooldownSeconds || 60,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Unable to resend OTP. Please wait before trying again.',
      };
    }
  }

  /**
   * Verifies the 6-digit OTP code and receives a short-lived reset authorization token.
   */
  async verifyOtp({ email, otp }) {
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      return {
        success: true,
        message: res.message,
        resetToken: res.resetToken,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Invalid or expired OTP. Please verify and try again.',
      };
    }
  }

  /**
   * Resets password using the cryptographic reset authorization token received upon OTP verification.
   */
  async resetPassword({ email, resetToken, token, password, confirmPassword }) {
    try {
      const res = await api.post('/auth/reset-password', {
        email,
        resetToken: resetToken || token,
        password,
        confirmPassword,
      });
      return {
        success: true,
        message: res.message,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Failed to reset password. Authorization may be invalid or expired.',
      };
    }
  }

  /**
   * Clears stored authentication session.
   */
  logout() {
    setStoredToken(null);
  }
}

export const userService = new UserService();
export default userService;
