import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService, ADMIN_CONFIG } from '../services/userService';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'campuspulse_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored auth user', e);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync active user session to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync user to localStorage', e);
    }
  }, [user]);

  /**
   * Log in user with credentials against verified backend API.
   */
  const login = async (email, password) => {
    setIsLoading(true);

    try {
      const result = await userService.authenticate(email, password);
      if (!result.success) {
        throw new Error(result.error || 'Invalid credentials.');
      }

      setUser(result.user);
      setIsLoading(false);
      return result;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Register a new student account with academic verification.
   * Strictly enforces 'student' role.
   */
  const register = async (userData) => {
    setIsLoading(true);

    try {
      const result = await userService.registerStudent(userData);
      if (!result.success) {
        throw new Error(result.error || 'Registration failed.');
      }

      setUser(result.user);
      setIsLoading(false);
      return result;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Update student profile fields.
   */
  const updateProfile = async (fields) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    try {
      const updatedUser = await userService.updateProfile(user.email, fields);
      if (updatedUser) {
        setUser(updatedUser);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Sign out the active student or administrator.
   */
  const logout = () => {
    userService.logout();
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn('Error clearing auth storage', e);
    }
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    register,
    updateProfile,
    logout,
    adminEmail: ADMIN_CONFIG.email,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
