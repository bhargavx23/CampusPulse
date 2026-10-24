/**
 * CampusPulse Notification Service
 * Connected to backend /api/notifications API with local caching.
 */
import { api } from './apiClient.js';

const NOTIFICATION_STORAGE_KEY = 'campuspulse_notifications_v1';

let memoryNotifications = [];

function isStorageAvailable() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function loadNotifications() {
  if (!isStorageAvailable()) return memoryNotifications;
  try {
    const raw = window.localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed reading notifications from storage', err);
  }
  return memoryNotifications;
}

function saveNotifications(items) {
  memoryNotifications = items;
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed saving notifications', err);
  }
}

export const notificationService = {
  fetchNotifications: async () => {
    try {
      const res = await api.get('/notifications');
      if (res && res.notifications) {
        saveNotifications(res.notifications);
        return res.notifications;
      }
    } catch (err) {
      console.warn('Backend fetchNotifications failed, using local cache:', err.message);
    }
    return loadNotifications();
  },

  getNotifications: (studentEmail) => {
    let list = loadNotifications();
    if (studentEmail) {
      list = list.filter(
        (n) => !n.studentEmail || n.studentEmail.toLowerCase() === studentEmail.toLowerCase()
      );
    }
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  },

  getUnreadCount: (studentEmail) => {
    const list = notificationService.getNotifications(studentEmail);
    return list.filter((n) => !n.isRead).length;
  },

  markAsRead: async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (err) {
      console.warn('Backend markAsRead failed:', err.message);
    }
    const list = loadNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    saveNotifications(updated);
    return updated;
  },

  markAllAsRead: async (studentEmail) => {
    try {
      await api.put('/notifications/read-all');
    } catch (err) {
      console.warn('Backend markAllAsRead failed:', err.message);
    }
    const list = loadNotifications();
    const updated = list.map((n) => {
      if (!studentEmail || (n.studentEmail && n.studentEmail.toLowerCase() === studentEmail.toLowerCase())) {
        return { ...n, isRead: true };
      }
      return n;
    });
    saveNotifications(updated);
    return updated;
  },

  addNotification: ({ title, message, complaintId, studentEmail, type = 'info' }) => {
    const list = loadNotifications();
    const newNotif = {
      id: `notif_${Date.now()}`,
      studentEmail: studentEmail ? studentEmail.toLowerCase() : '',
      title,
      message,
      complaintId: complaintId || null,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newNotif);
    saveNotifications(list);
    return newNotif;
  },
};

export default notificationService;
