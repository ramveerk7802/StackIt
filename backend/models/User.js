const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  type: String,
  message: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["guest", "user", "admin"], default: "user" },
    notifications: [notificationSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
