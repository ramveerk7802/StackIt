import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";
import TagInput from "../components/TagInput";
import api from "../utils/api";
import "../styles/AskQuestion.css";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!localStorage.getItem("token")) {
      setError("You must be logged in to ask a question.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/questions", { title, description, tags });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit question");
    }
    setLoading(false);
  };

  return (
    <div className="ask-container">
      <h2>Ask a Question</h2>
      <form className="ask-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label>Description</label>
        <RichTextEditor value={description} onChange={setDescription} />
        <label>Tags</label>
        <TagInput value={tags} onChange={setTags} />
        {error && <div className="ask-error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AskQuestion;
