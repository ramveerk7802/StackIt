const Question = require("../models/Question");
const Answer = require("../models/Answer");

// Ask a new question
exports.createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    if (!title || !description || !tags || !tags.length) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const question = await Question.create({
      title,
      description,
      tags,
      author: req.user._id,
    });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all questions (with filters, pagination)
exports.getQuestions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      tag,
      search,
      sort = "newest",
      unanswered,
    } = req.query;
    const filter = {};
    if (tag) filter.tags = tag;
    if (unanswered) filter.answers = { $size: 0 };
    if (search) filter.title = { $regex: search, $options: "i" };
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    const questions = await Question.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("author", "username")
      .populate({ path: "answers", select: "_id" });
    const total = await Question.countDocuments(filter);
    res.json({ questions, total });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("author", "username")
      .populate({
        path: "answers",
        populate: { path: "author", select: "username" },
      });
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update question (owner or admin)
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    if (
      question.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const { title, description, tags } = req.body;
    if (title) question.title = title;
    if (description) question.description = description;
    if (tags) question.tags = tags;
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete question (owner or admin)
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    if (
      question.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Answer.deleteMany({ questionId: question._id });
    await question.deleteOne();
    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tags (distinct)
exports.getTags = async (req, res) => {
  try {
    const tags = await Question.distinct("tags");
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
