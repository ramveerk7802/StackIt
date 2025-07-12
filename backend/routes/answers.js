const express = require("express");
const router = express.Router();
const answerController = require("../controllers/answerController");
const auth = require("../middleware/auth");

// Add answer to a question
router.post("/:questionId", auth, answerController.addAnswer);

// Edit answer
router.put("/:id", auth, answerController.editAnswer);

// Delete answer
router.delete("/:id", auth, answerController.deleteAnswer);

// Vote on answer
router.post("/:id/vote", auth, answerController.voteAnswer);

// Accept answer
router.post("/:id/accept", auth, answerController.acceptAnswer);

module.exports = router;
