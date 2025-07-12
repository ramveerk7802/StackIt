import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import api from "../utils/api";
import "../styles/Home.css";

const PAGE_SIZE = 5;

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("newest");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {
          page,
          limit: PAGE_SIZE,
          sort: filter,
        };
        if (search) params.search = search;
        const res = await api.get("/questions", { params });
        setQuestions(res.data.questions);
        setTotal(res.data.total);
      } catch (err) {
        setError("Failed to load questions");
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [page, filter, search]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="home-container">
      <div className="home-topbar">
        <button className="home-ask-btn" onClick={() => navigate("/ask")}>
          Ask New Question
        </button>
        <form className="home-filters" onSubmit={handleSearch}>
          <select
            className="navbar-filter"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="unanswered">Unanswered</option>
          </select>
          <input
            className="navbar-search"
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>
      <div className="questions-list">
        {loading && <div>Loading questions...</div>}
        {error && <div className="home-error">{error}</div>}
        {!loading && !error && questions.length === 0 && (
          <div>No questions found.</div>
        )}
        {!loading &&
          !error &&
          questions.map((q) => <QuestionCard key={q._id} question={q} />)}
      </div>
      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          {"<"}
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={n === page ? "active" : ""}
            onClick={() => setPage(n)}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Home;
