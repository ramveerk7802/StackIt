import React from "react";
import "../styles/NotificationDropdown.css";

const mockNotifications = [
  { id: 1, message: "Someone answered your question", isRead: false },
  { id: 2, message: "Someone commented on your answer", isRead: false },
  { id: 3, message: "UserA mentioned you in a comment", isRead: true },
];

const NotificationDropdown = ({ open }) => {
  if (!open) return null;
  return (
    <div className="notification-dropdown">
      <div className="dropdown-header">Notifications</div>
      {mockNotifications.length === 0 ? (
        <div className="dropdown-empty">No notifications</div>
      ) : (
        mockNotifications.map((n) => (
          <div
            key={n.id}
            className={`dropdown-item${n.isRead ? "" : " unread"}`}
          >
            {n.message}
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationDropdown;
