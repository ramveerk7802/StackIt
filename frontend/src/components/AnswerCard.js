import React from "react";
import "../styles/AnswerCard.css";

const AnswerCard = ({ answer, onVote, onAccept, isOwner, user }) => {
  const hasVoted = answer.votes?.some((v) => v.user === user?._id);
  const userVote = answer.votes?.find((v) => v.user === user?._id)?.value;
  return (
    <div className={`answer-card${answer.isAccepted ? " accepted" : ""}`}>
      <div className="answer-content">{answer.content}</div>
      <div className="answer-meta">
        <span className="answer-user">{answer.author?.username}</span>
        <span className="answer-votes">
          ▲ {answer.votes?.reduce((sum, v) => sum + v.value, 0) || 0}
        </span>
        {user && (
          <>
            <button
              className="answer-vote-btn"
              disabled={userVote === 1}
              title={userVote === 1 ? "You upvoted" : "Upvote"}
              onClick={() => onVote(answer._id, 1)}
            >
              ▲
            </button>
            <button
              className="answer-vote-btn"
              disabled={userVote === -1}
              title={userVote === -1 ? "You downvoted" : "Downvote"}
              onClick={() => onVote(answer._id, -1)}
            >
              ▼
            </button>
          </>
        )}
        {isOwner && !answer.isAccepted && (
          <button
            className="answer-accept-btn"
            onClick={() => onAccept(answer._id)}
          >
            Accept
          </button>
        )}
        {answer.isAccepted && <span className="answer-accepted">Accepted</span>}
      </div>
    </div>
  );
};

export default AnswerCard;
