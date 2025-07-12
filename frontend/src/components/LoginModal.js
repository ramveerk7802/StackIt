import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginModal.css";

const LoginModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  if (!open) return null;
  return (
    <div className="login-modal-backdrop">
      <div className="login-modal">
        <h3>Login Required</h3>
        <p>You must be logged in to vote or accept answers.</p>
        <div className="login-modal-actions">
          <button
            onClick={() => {
              onClose();
              navigate("/login");
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/register");
            }}
          >
            Sign Up
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
