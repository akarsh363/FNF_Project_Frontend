import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { clearToken, fetchMe } from "../../Services/AuthService";
import api from "../../Services/api";
import "./Feed.css";

export default function Feed() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const me = await fetchMe();
        setUser(me);
      } catch (err) {
        clearToken();
        navigate("/login", { replace: true });
        return;
      }
      try {
        const data = await api.request("/api/Posts", { method: "GET" });
        // normalize posts into { id, title?, elements: [], createdAt }
        const mapped = (Array.isArray(data) ? data : []).map((p, idx) => {
          const title = p.title ?? p.Title ?? "";
          const rawBody = p.body ?? p.Body ?? "";
          let elements = [];
          // If server stored Body as JSON array (our PostEditor sends JSON), parse and map
          try {
            const parsed = JSON.parse(rawBody || "[]");
            if (Array.isArray(parsed)) {
              elements = parsed.map((el, i) => ({
                id: el.id ?? `${p.postId ?? p.PostId ?? idx}-${i}`,
                type: el.type ?? "text",
                content: el.content ?? el.body ?? "",
                imagePreview: el.imagePreview ?? el.src ?? null,
                imageName: el.imageName ?? "",
              }));
            } else {
              // not an array -> treat as single text element
              elements = [
                { id: `${p.postId ?? p.PostId ?? idx}-single`, type: "text", content: String(rawBody || "") },
              ];
            }
          } catch {
            elements = [
              { id: `${p.postId ?? p.PostId ?? idx}-single`, type: "text", content: String(rawBody || "") },
            ];
          }

          return {
            id: p.postId ?? p.PostId ?? `${p.createdAt ?? idx}-${idx}`,
            title,
            elements,
            createdAt: p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
            raw: p,
          };
        });

        setPosts(mapped);
      } catch (err) {
        console.warn("Failed to load posts:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [navigate]);

  function handleLogout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  const formatTimestamp = (timestamp) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getPostTitle = (post) => {
    if (post.title && post.title.trim()) return post.title;
    const firstText = post.elements.find((el) => el.type === "text" && el.content && el.content.trim());
    if (firstText) {
      const txt = firstText.content.trim();
      return txt.length > 60 ? txt.slice(0, 60) + "..." : txt;
    }
    return "Untitled Post";
  };

  const renderElements = (elements) =>
    elements.map((el) => {
      if (el.type === "text") return <div key={el.id} className="post-text"><p>{el.content}</p></div>;
      if (el.type === "code") return <div key={el.id} className="post-code"><pre><code>{el.content}</code></pre></div>;
      if (el.type === "image") return el.imagePreview ? <div key={el.id} className="post-image"><img src={el.imagePreview} alt={el.imageName || "img"} className="feed-image" /></div> : null;
      return null;
    });

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="feed-page">
      <header className="feed-header">
        <div className="brand">FNF Feed</div>
        <div className="user-actions">
          {user && <span className="user-name">Hi, {user.fullName || user.email}</span>}
          <Link to="/post/new" className="btn-newpost">➕ New Post</Link>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <main className="feed-main">
        {posts.length === 0 ? (
          <div className="no-posts">No posts yet.</div>
        ) : (
          posts.map((p) => (
            <article key={`${p.id}`} className="post-item">
              <header className="post-header">
                <h2 className="post-title">{getPostTitle(p)}</h2>
                <div className="post-meta">
                  <span className="author">👤 <strong>{p.raw?.authorName ?? p.raw?.AuthorName ?? "Anonymous"}</strong></span>
                  <span className="timestamp">📅 {formatTimestamp(p.createdAt)}</span>
                </div>
              </header>

              <div className="post-content">{renderElements(p.elements)}</div>

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
