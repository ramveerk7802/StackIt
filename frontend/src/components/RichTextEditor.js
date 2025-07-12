import React from "react";
import "../styles/RichTextEditor.css";

const RichTextEditor = ({ value, onChange }) => {
  return (
    <textarea
      className="rich-text-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={6}
      placeholder="Write your question details here..."
    />
  );
};

export default RichTextEditor;
