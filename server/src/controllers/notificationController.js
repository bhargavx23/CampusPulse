import Notification from '../models/Notification.js';

export async function getMyNotifications(req, res) {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications: notifications.map((n) => n.toJSON()),
    });
  } catch (error) {
    console.error('getMyNotifications error:', error);
    return res.status(500).json({ success: false, error: 'Server error retrieving notifications.' });
  }
}

export async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found.' });
    }

    return res.status(200).json({
      success: true,
      notification: notification.toJSON(),
    });
  } catch (error) {
    console.error('markAsRead error:', error);
    return res.status(500).json({ success: false, error: 'Server error marking notification.' });
  }
}

export async function markAllRead(req, res) {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (error) {
    console.error('markAllRead error:', error);
    return res.status(500).json({ success: false, error: 'Server error updating notifications.' });
  }
}

export default { getMyNotifications, markAsRead, markAllRead };
