const Answer = require("../models/Answer");
const Question = require("../models/Question");

// Add an answer to a question
exports.addAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content)
      return res.status(400).json({ message: "Content is required" });
    const question = await Question.findById(req.params.questionId);
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    const answer = await Answer.create({
      questionId: question._id,
      content,
      author: req.user._id,
    });
    question.answers.push(answer._id);
    await question.save();
    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Edit an answer (owner only)
exports.editAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });
    if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    answer.content = req.body.content || answer.content;
    await answer.save();
    res.json(answer);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an answer (owner or admin)
exports.deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });
    if (
      answer.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Question.findByIdAndUpdate(answer.questionId, {
      $pull: { answers: answer._id },
    });
    await answer.deleteOne();
    res.json({ message: "Answer deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Vote on an answer (upvote/downvote)
exports.voteAnswer = async (req, res) => {
  try {
    const { value } = req.body; // value: 1 (upvote) or -1 (downvote)
    if (![1, -1].includes(value))
      return res.status(400).json({ message: "Invalid vote value" });
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });
    // Only one vote per user
    const existingVote = answer.votes.find(
      (v) => v.user.toString() === req.user._id.toString()
    );
    if (existingVote) {
      existingVote.value = value;
    } else {
      answer.votes.push({ user: req.user._id, value });
    }
    await answer.save();
    res.json({ votes: answer.votes });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Accept an answer (question owner only)
exports.acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });
    const question = await Question.findById(answer.questionId);
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    // Unaccept all other answers
    await Answer.updateMany(
      { questionId: question._id },
      { isAccepted: false }
    );
    answer.isAccepted = true;
    await answer.save();
    res.json({ message: "Answer accepted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
