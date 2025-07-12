import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import AnswerCard from "../components/AnswerCard";
import RichTextEditor from "../components/RichTextEditor";
import api from "../utils/api";
import "../styles/QuestionDetail.css";

const QuestionDetail = ({ user }) => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [voteError, setVoteError] = useState("");
  const [acceptError, setAcceptError] = useState("");

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/questions/${id}`);
        setQuestion(res.data);
        setAnswers(res.data.answers || []);
      } catch (err) {
        setError("Failed to load question");
      }
      setLoading(false);
    };
    fetchQuestion();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!localStorage.getItem("token")) {
      setSubmitError("You must be logged in to answer.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post(`/answers/${id}`, { content: answer });
      setAnswers([...answers, res.data]);
      setAnswer("");
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to submit answer");
    }
    setSubmitting(false);
  };

  const handleVote = async (answerId, value) => {
    setVoteError("");
    try {
      const res = await api.post(`/answers/${answerId}/vote`, { value });
      setAnswers((prev) =>
        prev.map((a) =>
          a._id === answerId ? { ...a, votes: res.data.votes } : a
        )
      );
    } catch (err) {
      setVoteError(err.response?.data?.message || "Failed to vote");
    }
  };

  const handleAccept = async (answerId) => {
    setAcceptError("");
    try {
      await api.post(`/answers/${answerId}/accept`);
      setAnswers((prev) =>
        prev.map((a) => ({ ...a, isAccepted: a._id === answerId }))
      );
    } catch (err) {
      setAcceptError(err.response?.data?.message || "Failed to accept answer");
    }
  };

  if (loading)
    return <div className="question-detail-container">Loading...</div>;
  if (error) return <div className="question-detail-container">{error}</div>;
  if (!question) return null;

  const isOwner = user && question.author && user._id === question.author._id;

  return (
    <div className="question-detail-container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> &gt;{" "}
        <span>{question.title.slice(0, 20)}...</span>
      </div>
      <div className="question-detail">
        <h2>{question.title}</h2>
        <div className="question-tags">
          {question.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="question-desc">{question.description}</div>
        <div className="question-meta">
          <span className="question-user">{question.author?.username}</span>
        </div>
      </div>
      <div className="answers-section">
        <h3>Answers</h3>
        {voteError && <div className="answer-error">{voteError}</div>}
        {acceptError && <div className="answer-error">{acceptError}</div>}
        {answers.length === 0 && <div>No answers yet.</div>}
        {answers.map((a) => (
          <AnswerCard
            key={a._id}
            answer={a}
            onVote={handleVote}
            onAccept={handleAccept}
            isOwner={isOwner}
            user={user}
          />
        ))}
      </div>
      <form className="answer-form" onSubmit={handleSubmit}>
        <label>Submit Your Answer</label>
        <RichTextEditor value={answer} onChange={setAnswer} />
        {submitError && <div className="answer-error">{submitError}</div>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default QuestionDetail;
