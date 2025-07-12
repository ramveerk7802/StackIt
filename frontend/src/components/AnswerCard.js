import React from "react";
import "../styles/AnswerCard.css";

const AnswerCard = ({
  answer,
  onVote,
  onAccept,
  isOwner,
  user,
  onLoginPrompt,
}) => {
  const userVote = answer.votes?.find((v) => v.user === user?._id)?.value;
  const handleVote = (value) => {
    if (!user) {
      onLoginPrompt();
      return;
    }
    onVote(answer._id, value);
  };
  const handleAccept = () => {
    if (!user) {
      onLoginPrompt();
      return;
    }
    onAccept(answer._id);
  };
  return (
    <div className={`answer-card${answer.isAccepted ? " accepted" : ""}`}>
      <div 
        className="answer-content" 
        dangerouslySetInnerHTML={{ __html: answer.content }}
      />
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
              onClick={() => handleVote(1)}
            >
              ▲
            </button>
            <button
              className="answer-vote-btn"
              disabled={userVote === -1}
              title={userVote === -1 ? "You downvoted" : "Downvote"}
              onClick={() => handleVote(-1)}
            >
              ▼
            </button>
          </>
        )}
        {isOwner && !answer.isAccepted && (
          <button className="answer-accept-btn" onClick={handleAccept}>
            Accept
          </button>
        )}
        {answer.isAccepted && <span className="answer-accepted">Accepted</span>}
      </div>
    </div>
  );
};

export default AnswerCard;
