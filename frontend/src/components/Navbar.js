import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import "../styles/Navbar.css";

const mockNotifications = [
  { id: 1, message: "Someone answered your question", isRead: false },
  { id: 2, message: "Someone commented on your answer", isRead: false },
  { id: 3, message: "UserA mentioned you in a comment", isRead: true },
];

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          StackIt
        </Link>
        <button className="navbar-ask-btn" onClick={() => navigate("/ask")}>
          Ask New Question
        </button>
      </div>
      <div className="navbar-center">
        <select className="navbar-filter">
          <option>Newest</option>
          <option>Unanswered</option>
          <option>More</option>
        </select>
        <input className="navbar-search" type="text" placeholder="Search" />
      </div>
      <div className="navbar-right" style={{ position: "relative" }}>
        <button
          className="navbar-bell"
          title="Notifications"
          onClick={() => setDropdownOpen((o) => !o)}
        >
          🔔
          {unreadCount > 0 && (
            <span className="navbar-bell-badge">{unreadCount}</span>
          )}
        </button>
        <NotificationDropdown open={dropdownOpen} />
        {user ? (
          <div className="navbar-profile">
            <span>{user.username}</span>
            <button onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <button className="navbar-login" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
