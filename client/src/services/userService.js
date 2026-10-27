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
   * Clears stored authentication session.
   */
  logout() {
    setStoredToken(null);
  }
}

export const userService = new UserService();
export default userService;
