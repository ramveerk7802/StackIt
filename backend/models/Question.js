const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String, required: true }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
  votes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      value: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", questionSchema);
