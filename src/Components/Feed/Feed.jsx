// src/Components/Feed/Feed.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { clearToken, fetchMe } from "../../Services/AuthService";
import api from "../../Services/api";
import "./Feed.css";

export default function Feed() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const me = await fetchMe();
        if (!mounted) return;
        setUser(me);
      } catch (err) {
        clearToken();
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);
        const data = await api.request("/api/Posts", { method: "GET" });

        const mapped = (data || []).map((p, idx) => {
          // Normalize fields (server may use Title/Body or title/body)
          const rawBody = p.body ?? p.Body ?? "";
          const rawTitle = p.title ?? p.Title ?? "";

          let elements = [];
          // Try parse body as JSON array of elements (from PostEditor)
          try {
            const parsed = JSON.parse(rawBody || "[]");
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object" && parsed[0].type) {
              // parsed is an array of element objects
              elements = parsed.map((el, i) => ({
                id:
                  el.id ??
                  `${p.postId ?? p.PostId ?? idx}-${i}-${Math.floor(Math.random() * 100000)}`,
                type: el.type ?? "text",
                content: el.content ?? "",
                imagePreview: el.imagePreview ?? null,
                imageName: el.imageName ?? "",
              }));
            } else {
              // parsed is not our elements array — fallback to plain text
              elements = [
                {
                  id: `${p.postId ?? p.PostId ?? idx}-single`,
                  type: "text",
                  content: (rawTitle ? rawTitle + "\n\n" : "") + (rawBody || ""),
                },
              ];
            }
          } catch (e) {
            // Not JSON — treat as plain body text
            elements = [
              {
                id: `${p.postId ?? p.PostId ?? idx}-single`,
                type: "text",
                content: (rawTitle ? rawTitle + "\n\n" : "") + (rawBody || ""),
              },
            ];
          }

          return {
            id:
              p.postId ??
              p.PostId ??
              `${p.createdAt ?? p.CreatedAt ?? Date.now()}-${idx}-${Math.floor(Math.random() * 100000)}`,
            timestamp: p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
            elements,
          };
        });

        if (!mounted) return;
        setPosts(mapped);
        // persist for offline fallback
        localStorage.setItem("feedPosts", JSON.stringify(mapped));
      } catch (err) {
        console.warn("API load failed, falling back to localStorage", err);
        const savedPosts = JSON.parse(localStorage.getItem("feedPosts") || "[]");
        if (mounted) setPosts(savedPosts);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getPostTitle = (elements) => {
    const firstTextElement = elements.find(
      (el) => el.type === "text" && el.content && el.content.trim()
    );
    if (firstTextElement) {
      const title = firstTextElement.content.trim().substring(0, 100);
      return title.length === 100 ? title + "..." : title;
    }
    return "Untitled Post";
  };

  const renderElements = (elements) =>
    elements
      .map((element) => {
        if (!element) return null;

        if (element.type === "text") {
          return element.content && element.content.trim() ? (
            <div key={element.id} className="post-text">
              {/* Preserve newlines */}
              {element.content.split("\n").map((line, i) => (
                <p key={`${element.id}-ln-${i}`}>{line}</p>
              ))}
            </div>
          ) : null;
        }

        if (element.type === "code") {
          return element.content && element.content.trim() ? (
            <div key={element.id} className="post-code">
              <div className="code-container">
                <div className="code-header">💻 Code Snippet</div>
                <pre className="code-content">
                  <code>{element.content}</code>
                </pre>
              </div>
            </div>
          ) : null;
        }

        if (element.type === "image") {
          // If server provided URL instead of data URL, use that; otherwise use imagePreview
          const src = element.imagePreview || element.url || element.src || null;
          return src ? (
            <div key={element.id} className="post-image">
              <img
                src={src}
                alt={element.imageName || "Post image"}
                className="feed-image"
              />
              {element.imageName && (
                <p className="image-caption">📷 {element.imageName}</p>
              )}
            </div>
          ) : null;
        }

        return null;
      })
      .filter(Boolean);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-icon">⏳</div>
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="feed-page">
      <header className="feed-header">
        <div className="brand">FNF Feed</div>
        <div className="user-actions">
          {user && <span className="user-name">Hi, {user.fullName || user.email}</span>}
          <Link to="/post/new" className="btn-newpost">➕ New Post</Link>
          <button onClick={() => { clearToken(); navigate("/login", { replace: true }); }} className="btn-logout">Logout</button>
        </div>
      </header>

      {location.state?.message && (
        <div className="success-message">✅ {location.state.message}</div>
      )}

      <main className="feed-main">
        {posts.length === 0 ? (
          <div className="no-posts">
            <h2>No posts yet.</h2>
            <p>Be the first to create a post.</p>
            <button onClick={() => navigate("/post/new")} className="btn-newpost-cta">
              🚀 New Post
            </button>
          </div>
        ) : (
          posts.map((post, postIndex) => (
            <article key={post.id ?? `${post.timestamp}-${postIndex}`} className="post-item">
              <header className="post-header">
                <h2 className="post-title">{getPostTitle(post.elements)}</h2>
                <div className="post-meta">
                  <span className="author">👤 <strong>Anonymous User</strong></span>
                  <span className="timestamp">📅 {formatTimestamp(post.timestamp)}</span>
                  <span className="element-count">📊 {post.elements.filter(el => (el.content && el.content.trim()) || el.imagePreview).length} elements</span>
                </div>
              </header>

              <div className="post-content">{renderElements(post.elements)}</div>

              <footer className="post-actions">
                <button className="action-btn like-btn">👍 Like</button>
                <button className="action-btn reply-btn">💬 Reply</button>
                <button className="action-btn share-btn">🔗 Share</button>
              </footer>
            </article>
          ))
        )}
      </main>
    </div>
  );
}
