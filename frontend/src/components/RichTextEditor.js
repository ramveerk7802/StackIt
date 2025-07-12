import React from "react";
import "../styles/RichTextEditor.css";

const RichTextEditorComponent = ({ value, onChange }) => (
  <textarea
    className="rich-text-editor"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={6}
    placeholder="Write here..."
  />
);

export default RichTextEditorComponent;
