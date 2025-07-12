import React, { useRef, useEffect, useState } from "react";
import "../styles/RichTextEditor.css";

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedText, setSelectedText] = useState("");

  // Common emojis
  const emojis = ["😊", "👍", "❤️", "🔥", "💡", "🎉", "🚀", "⭐", "💻", "📚", "❓", "✅", "❌", "⚠️", "💯", "🎯"];

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    updateValue();
  };

  const updateValue = () => {
    if (onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const insertEmoji = (emoji) => {
    document.execCommand("insertText", false, emoji);
    setShowEmojiPicker(false);
    editorRef.current.focus();
    updateValue();
  };

  const insertLink = () => {
    if (linkUrl) {
      const selection = window.getSelection();
      if (selection.toString()) {
        document.execCommand("createLink", false, linkUrl);
      } else {
        document.execCommand("insertHTML", false, `<a href="${linkUrl}" target="_blank">${linkUrl}</a>`);
      }
      setLinkUrl("");
      setShowLinkDialog(false);
      editorRef.current.focus();
      updateValue();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = `<img src="${event.target.result}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`;
        document.execCommand("insertHTML", false, img);
        updateValue();
      };
      reader.readAsDataURL(file);
    }
  };

  const getSelectedText = () => {
    const selection = window.getSelection();
    return selection.toString();
  };

  return (
    <div className="rich-text-editor-container">
      <div className="toolbar">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => execCommand("bold")}
          title="Bold"
          className="toolbar-btn"
        >
          <i className="fas fa-bold"></i>
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          title="Italic"
          className="toolbar-btn"
        >
          <i className="fas fa-italic"></i>
        </button>
        <button
          type="button"
          onClick={() => execCommand("strikeThrough")}
          title="Strikethrough"
          className="toolbar-btn"
        >
          <i className="fas fa-strikethrough"></i>
        </button>

        <div className="toolbar-separator"></div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          title="Bullet List"
          className="toolbar-btn"
        >
          <i className="fas fa-list-ul"></i>
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          title="Numbered List"
          className="toolbar-btn"
        >
          <i className="fas fa-list-ol"></i>
        </button>

        <div className="toolbar-separator"></div>

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => execCommand("justifyLeft")}
          title="Align Left"
          className="toolbar-btn"
        >
          <i className="fas fa-align-left"></i>
        </button>
        <button
          type="button"
          onClick={() => execCommand("justifyCenter")}
          title="Align Center"
          className="toolbar-btn"
        >
          <i className="fas fa-align-center"></i>
        </button>
        <button
          type="button"
          onClick={() => execCommand("justifyRight")}
          title="Align Right"
          className="toolbar-btn"
        >
          <i className="fas fa-align-right"></i>
        </button>

        <div className="toolbar-separator"></div>

        {/* Emoji */}
        <div className="emoji-container">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Insert Emoji"
            className="toolbar-btn"
          >
            <i className="far fa-smile"></i>
          </button>
          {showEmojiPicker && (
            <div className="emoji-picker">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="emoji-btn"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Link */}
        <button
          type="button"
          onClick={() => {
            setSelectedText(getSelectedText());
            setShowLinkDialog(true);
          }}
          title="Insert Link"
          className="toolbar-btn"
        >
          <i className="fas fa-link"></i>
        </button>

        {/* Image Upload */}
        <label className="toolbar-btn" title="Upload Image">
          <i className="fas fa-image"></i>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <div
        ref={editorRef}
        className="rich-text-editor"
        contentEditable
        onInput={updateValue}
        onPaste={handlePaste}
        onBlur={updateValue}
        placeholder="Write your question description here..."
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="link-dialog-overlay">
          <div className="link-dialog">
            <h3>Insert Link</h3>
            <input
              type="url"
              placeholder="Enter URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="link-input"
            />
            <div className="link-dialog-buttons">
              <button
                type="button"
                onClick={insertLink}
                className="link-btn primary"
              >
                Insert
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLinkDialog(false);
                  setLinkUrl("");
                }}
                className="link-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
