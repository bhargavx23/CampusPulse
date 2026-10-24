import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  Check,
  ExternalLink,
  Inbox,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  EmptyState,
} from '../../components/ui';

export function StudentNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user?.email) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    const list = notificationService.getNotifications(user.email);
    setNotifications(list);

    const fresh = await notificationService.fetchNotifications();
    if (fresh) {
      setNotifications(notificationService.getNotifications(user.email));
    }
  };

  const handleMarkAsRead = async (id) => {
    await notificationService.markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead(user.email);
    loadNotifications();
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-workspace-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-sora text-2xl font-bold text-workspace-textPrimary">
              Notifications & Alerts
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-slate-900">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="font-sans text-sm text-workspace-textSecondary mt-0.5">
            Real-time status announcements and technician assignments for your campus tickets.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <Card className="border-workspace-border shadow-soft">
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="p-8 sm:p-12">
              <EmptyState
                icon={<Bell className="w-8 h-8 text-slate-400" />}
                title="All caught up!"
                description="You have no notifications right now. Department status updates on your filed complaints will appear here."
              />
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors ${
                    item.isRead ? 'bg-white' : 'bg-blue-50/40'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        item.type === 'resolved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : item.type === 'in-progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-manrope text-sm font-semibold text-slate-900">
                          {item.title}
                        </h4>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary-600" aria-label="Unread notification" />
                        )}
                      </div>

                      <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.message}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                        <span>{formatDate(item.createdAt)}</span>
                        {item.complaintId && (
                          <>
                            <span>·</span>
                            <Link
                              to={`/student/complaints/${item.complaintId}`}
                              className="font-mono font-semibold text-primary-600 hover:underline"
                            >
                              View #{item.complaintId}
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mark as read button if unread */}
                  {!item.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(item.id)}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-700 shrink-0 self-end sm:self-start transition-colors"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default StudentNotificationsPage;
