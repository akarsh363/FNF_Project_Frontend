import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPostMultipart } from "../../Services/postsService";
import "./PostEditor.css";

const makeId = (prefix = "el-") =>
  `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export default function PostEditor() {
  const [elements, setElements] = useState([
    { id: makeId(), type: "text", content: "" },
  ]);
  const navigate = useNavigate();

  const addCodeSnippet = () => {
    setElements((prev) => [
      ...prev,
      { id: makeId(), type: "code", content: "// Your code here" },
      { id: makeId(), type: "text", content: "" },
    ]);
  };

  const addImageUpload = () => {
    setElements((prev) => [
      ...prev,
      {
        id: makeId(),
        type: "image",
        content: "",
        imageFile: null,
        imagePreview: null,
        imageName: "",
      },
      { id: makeId(), type: "text", content: "" },
    ]);
  };

  const updateElement = (id, content) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, content } : el))
    );
  };

  const handleImageUpload = (id, file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setElements((prev) =>
          prev.map((el) =>
            el.id === id
              ? {
                  ...el,
                  imageFile: file,
                  imagePreview: e.target.result,
                  imageName: file.name,
                }
              : el
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const removeElement = (elementId) => {
    setElements((prev) => prev.filter((el) => el.id !== elementId));
  };

  const handleSubmit = async () => {
    try {
      const hasContent = elements.some(
        (el) => (el.content && el.content.trim()) || el.imageFile
      );
      if (!hasContent) {
        alert("Please add some content or an image before posting.");
        return;
      }

      // Extract a title: use first line of first text block
      const firstText = elements.find(
        (el) => el.type === "text" && el.content && el.content.trim()
      );
      const titleGuess = firstText
        ? firstText.content.split("\n")[0].slice(0, 120)
        : "Untitled Post";

      const response = await createPostMultipart(elements, titleGuess);
      console.log("API response:", response);

      // Cache locally for continuity
      const existingPosts = JSON.parse(localStorage.getItem("feedPosts") || "[]");
      existingPosts.unshift({
        id: response.postId || Date.now(),
        timestamp: response.createdAt || new Date().toISOString(),
        title: response.title,
        body: response.body,
      });
      localStorage.setItem("feedPosts", JSON.stringify(existingPosts));

      alert("Post submitted successfully!");
      navigate("/feed", {
        state: { message: "Your post was submitted successfully!", newPost: response },
      });
    } catch (err) {
      console.error("Error submitting post:", err);
      if (err?.status === 401) {
        alert("You must be logged in to post.");
        navigate("/login");
      } else {
        alert("Failed to submit post. Saved locally.");
        const existingPosts = JSON.parse(localStorage.getItem("feedPosts") || "[]");
        existingPosts.unshift({
          id: Date.now(),
          timestamp: new Date().toISOString(),
          title: "Local Draft",
          body: JSON.stringify(elements),
        });
        localStorage.setItem("feedPosts", JSON.stringify(existingPosts));
        navigate("/feed", {
          state: { message: "Saved locally because API failed" },
        });
      }
    }
  };

  const getCodeSnippetNumber = (currentId) =>
    elements.filter((el) => el.type === "code").findIndex((el) => el.id === currentId) + 1;

  const getImageNumber = (currentId) =>
    elements.filter((el) => el.type === "image").findIndex((el) => el.id === currentId) + 1;

  return (
    <div className="post-editor">
      <div className="editor-header">
        <h1>Ask a Question</h1>
        <Link to="/feed" className="back-link">
          ← Back to Feed
        </Link>
      </div>

      <div className="editor-container">
        <div className="toolbar">
          <button className="toolbar-btn code-btn" onClick={addCodeSnippet}>
            📄 Add Code Snippet
          </button>
          <button className="toolbar-btn image-btn" onClick={addImageUpload}>
            🖼️ Attach Image
          </button>
        </div>

        <div className="content-sections">
          {elements.map((element, index) => (
            <div key={element.id} className="content-section">
              {element.type === "text" ? (
                <textarea
                  value={element.content}
                  onChange={(e) => updateElement(element.id, e.target.value)}
                  placeholder={
                    index === 0 ? "Enter your question here..." : "Continue typing..."
                  }
                  rows={6}
                  className="editor-textarea"
                />
              ) : element.type === "code" ? (
                <div className="code-block-card">
                  <div className="code-block-header">
                    <span className="block-title">
                      💻 Code Snippet {getCodeSnippetNumber(element.id)}
                    </span>
                    <button
                      onClick={() => removeElement(element.id)}
                      className="remove-btn"
                    >
                      ✕
                    </button>
                  </div>
                  <textarea
                    value={element.content}
                    onChange={(e) => updateElement(element.id, e.target.value)}
                    placeholder="Enter your code here..."
                    rows={10}
                    className="code-textarea"
                  />
                </div>
              ) : (
                <div className="image-block-card">
                  <div className="image-block-header">
                    <span className="block-title">
                      🖼️ Image {getImageNumber(element.id)}
                    </span>
                    <button
                      onClick={() => removeElement(element.id)}
                      className="remove-btn"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="image-upload-area">
                    {!element.imagePreview ? (
                      <div className="upload-placeholder">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(element.id, e.target.files[0])
                          }
                          className="file-input"
                          id={`file-input-${element.id}`}
                        />
                        <label
                          htmlFor={`file-input-${element.id}`}
                          className="file-label"
                        >
                          <div className="upload-icon">📁</div>
                          <p className="upload-text">Click to select an image</p>
                          <small className="upload-subtext">
                            Supports JPG, PNG, GIF, etc.
                          </small>
                        </label>
                      </div>
                    ) : (
                      <div className="image-preview">
                        <img
                          src={element.imagePreview}
                          alt="Preview"
                          className="preview-image"
                        />
                        <div className="image-info">
                          <p className="image-name">📷 {element.imageName}</p>
                          <button
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = (e) =>
                                handleImageUpload(element.id, e.target.files[0]);
                              input.click();
                            }}
                            className="change-image-btn"
                          >
                            Change Image
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="editor-footer">
          <div className="help-text">
            <small>
              💡 Type your question, add code snippets and images wherever needed.
            </small>
          </div>

          <div className="action-buttons">
            <button
              onClick={() =>
                setElements([{ id: makeId(), type: "text", content: "" }])
              }
              className="btn secondary-btn"
            >
              🗑️ Clear All
            </button>
            <button
              onClick={handleSubmit}
              disabled={elements.every(
                (el) => !(el.content && el.content.trim()) && !el.imageFile
              )}
              className="btn primary-btn"
            >
              🚀 Post Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
