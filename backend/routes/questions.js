const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const auth = require("../middleware/auth");

// Ask a question
router.post("/", auth, questionController.createQuestion);

// Get all questions (with filters, pagination)
router.get("/", questionController.getQuestions);

// Get all tags
router.get("/tags/all", questionController.getTags);

// Get single question
router.get("/:id", questionController.getQuestionById);

// Update question
router.put("/:id", auth, questionController.updateQuestion);

// Delete question
router.delete("/:id", auth, questionController.deleteQuestion);

module.exports = router;
