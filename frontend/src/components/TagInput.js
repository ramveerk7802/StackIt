import React from "react";
import "../styles/TagInput.css";

const TagInput = ({ value, onChange }) => {
  const handleChange = (e) => {
    const tags = e.target.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onChange(tags);
  };
  return (
    <input
      className="tag-input"
      type="text"
      value={value.join(", ")}
      onChange={handleChange}
      placeholder="Enter tags separated by commas"
    />
  );
};

export default TagInput;
