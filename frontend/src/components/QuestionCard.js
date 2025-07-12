import React from "react";
import { Link } from "react-router-dom";
import "../styles/QuestionCard.css";

const QuestionCard = ({ question }) => {
  return (
    <div className="question-card">
      <Link to={`/questions/${question._id}`} className="question-title">
        {question.title}
      </Link>
      <div className="question-tags">
        {question.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <div className="question-desc">{question.description}</div>
      <div className="question-meta">
        <span className="question-user">{question.author.username}</span>
        <span className="question-answers">
          {question.answers.length} answers
        </span>
      </div>
    </div>
  );
};

export default QuestionCard;
