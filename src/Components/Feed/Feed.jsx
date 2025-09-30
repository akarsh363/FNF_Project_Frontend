// src/Components/Feed/Feed.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { clearToken, fetchMe, getToken as getStoredToken } from "../../Services/AuthService";
import { repostPost } from "../../Services/repostService";
import { deletePostAsManager, votePost } from "../../Services/postsService";
import "./Feed.css";
import CommentsSection from "../CommentsSection/CommentsSection";
import TagChips from "../Tags/TagChips";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API ||
  "http://localhost:5294";

export default function Feed() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repostingIds, setRepostingIds] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);
  const qParam = (urlParams.get("q") || "").toLowerCase();
  const deptParam = urlParams.get("dept") || "all";

  const loadPosts = useCallback(async () => {
    try {
      const headers = { "Content-Type": "application/json" };
      const token = getStoredToken();
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/Posts`, { method: "GET", headers });
      if (res.status === 401) {
        clearToken();
        navigate("/login", { replace: true });
        return [];
      }
      if (!res.ok) return [];
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data?.posts ?? [];
      return normalizePostsArray(arr);
    } catch {
      return [];
    }
  }, [navigate]);

  function toElements(rawBody, idSeed) {
    let elements = [];
    try {
      const parsed = rawBody ? JSON.parse(rawBody) : [];
      elements = Array.isArray(parsed)
        ? parsed.map((el, i) => ({
            id: el.id ?? `${idSeed}-${i}`,
            type: (el.type ?? "text").toString().toLowerCase(),
            content: el.content ?? el.body ?? "",
            imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
            imageName: el.imageName ?? "",
          }))
        : [{ id: `${idSeed}-single`, type: "text", content: String(rawBody || "") }];
    } catch {
      elements = [{ id: `${idSeed}-single`, type: "text", content: String(rawBody || "") }];
    }
    return elements;
  }

  function normalizePostsArray(arr) {
    return (arr || []).map((p, idx) => {
      const postId = Number(p.postId ?? p.PostId ?? 0);
      const title = p.title ?? p.Title ?? "";
      const rawBody = p.body ?? p.Body ?? "";
      const elements = toElements(rawBody, postId || idx);

      const tags =
        p.tags ?? p.Tags ?? (p.postTags ?? p.PostTags)?.map((pt) => {
          const tag = pt.tag ?? pt.Tag;
          return {
            TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
            TagName: tag?.tagName ?? tag?.TagName ?? pt.tagName ?? pt.TagName,
            DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
          };
        }) ?? [];

      const departmentName = p.departmentName ?? p.DepartmentName ?? p?.Dept?.DeptName ?? "";

      return {
        // IMPORTANT: use a React key id distinct from numeric postId
        id: `post-${postId || `${idx}-${Date.now()}`}`,
        postId, // <--- keep numeric for API calls (comments/votes/delete)
        title,
        elements,
        tags,
        createdAt: p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
        authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
        departmentName,
        likeCount: p.upvoteCount ?? p.UpvoteCount ?? 0,
        dislikeCount: p.downvoteCount ?? p.DownvoteCount ?? 0,
        userVote: p.userVote ?? p.UserVote ?? 0,
        raw: p,
        isRepost: Boolean(p.isRepost ?? p.IsRepost ?? false),
      };
    });
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [me, postsList] = await Promise.all([fetchMe().catch(() => null), loadPosts()]);
        if (!me) {
          clearToken();
          navigate("/login", { replace: true });
          return;
        }
        setUser(me);
        setPosts(postsList);
        const depts = Array.from(new Set((postsList || []).map((x) => x.departmentName).filter(Boolean))).sort();
        try { localStorage.setItem("deptOptions", JSON.stringify(depts)); } catch {}
      } catch {
        clearToken();
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, loadPosts]);

  const canDeletePost = () => String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

  async function handleDelete(p) {
    const reason = prompt("Enter reason for deleting this post (required):");
    if (!reason || !reason.trim()) return;
    try {
      await deletePostAsManager(p.postId, reason.trim()); // use numeric postId
      setPosts((prev) => prev.filter((x) => x.postId !== p.postId));
      alert("Deleted.");
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  }

  function handleVote(postId, value) {
    votePost(postId, value)
      .then((r) => {
        setPosts((prev) =>
          prev.map((p) =>
            p.postId === postId
              ? {
                  ...p,
                  likeCount: r?.likeCount ?? p.likeCount,
                  dislikeCount: r?.dislikeCount ?? p.dislikeCount,
                  userVote: r?.userVote ?? p.userVote,
                }
              : p
          )
        );
      })
      .catch((e) => alert(e.message || "Vote failed"));
  }

  const filteredPosts = useMemo(() => {
    const q = (qParam || "").trim();
    const dept = (deptParam || "all").toLowerCase();
    return posts.filter((p) => {
      if (dept !== "all" && (p.departmentName || "").toLowerCase() !== dept) return false;
      if (!q) return true;
      const inTitle = (p.title || "").toLowerCase().includes(q);
      const inText = (p.elements || []).some(
        (el) => el.type === "text" && (el.content || "").toLowerCase().includes(q)
      );
      return inTitle || inText;
    });
  }, [posts, qParam, deptParam]);

  if (loading) return <div className="loading">Loading...</div>;

  const fmt = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Convert server PostResponseDto -> UI post (for reposts). Keeps numeric postId, unique string id for React.
  function convertDtoToUiPost(dto) {
    const postId = Number(dto.postId ?? dto.PostId ?? 0);
    const elements = toElements(dto.body ?? dto.Body ?? "", postId || "r");

    const createdMillis = dto.createdAt ? new Date(dto.createdAt).getTime() : Date.now();
    const uniqueId = `repost-${postId}-${createdMillis}`; // React key only

    return {
      id: uniqueId,        // React key (string, unique)
      postId,              // numeric post id for API routes (comments/votes/delete)
      title: dto.title ?? "",
      elements,
      tags: dto.tags ?? [],
      createdAt: dto.createdAt ?? new Date().toISOString(),
      authorName: dto.authorName ?? "Unknown",
      departmentName: dto.departmentName ?? "",
      likeCount: dto.upvoteCount ?? dto.UpvoteCount ?? 0,
      dislikeCount: dto.downvoteCount ?? dto.DownvoteCount ?? 0,
      userVote: 0,
      raw: dto,
      isRepost: true,
    };
  }

  return (
    <div className="feed-page">
      <main className="feed-main" style={{ padding: 16 }}>
        {filteredPosts.length === 0 ? (
          <div className="no-posts">No matching posts.</div>
        ) : (
          filteredPosts.map((p) => (
            <article key={p.id} className="post-item">
              <header className="post-header">
                <h2 className="post-title">{p.title || "Untitled Post"}</h2>
                <div className="post-meta">
                  <span className="author">👤 <strong>{p.authorName}</strong></span>
                  <span className="timestamp">📅 {fmt(p.createdAt)}</span>
                  {p.departmentName ? <span className="dept">🏢 {p.departmentName}</span> : null}
                  {p.isRepost ? <span className="badge" style={{ marginLeft: 8 }}>🔁 Repost</span> : null}
                </div>
              </header>

              <div className="post-content">
                {(p.elements || []).map((el) => {
                  if (el.type === "text")
                    return (
                      <div key={el.id} className="post-text">
                        <p>{el.content}</p>
                      </div>
                    );
                  if (el.type === "code")
                    return (
                      <div key={el.id} className="post-code">
                        <pre><code>{el.content}</code></pre>
                      </div>
                    );
                  if (el.type === "image") {
                    const src = el.imagePreview || el.url;
                    if (!src) return null;
                    return (
                      <div key={el.id} className="post-image">
                        <img src={src} alt={el.imageName || "image"} className="feed-image" loading="lazy" />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              <TagChips tags={p.tags} />

              <div className="post-actions" style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button
                  className="btn"
                  aria-label="Like"
                  onClick={() => handleVote(p.postId, +1)} // use numeric postId
                  style={p.userVote === 1 ? { borderColor: "#2563eb", background: "#eff6ff" } : null}
                >
                  👍 {p.likeCount ?? 0}
                </button>

                <button
                  className="btn"
                  aria-label="Dislike"
                  onClick={() => handleVote(p.postId, -1)} // use numeric postId
                  style={p.userVote === -1 ? { borderColor: "#ef4444", background: "#fef2f2" } : null}
                >
                  👎 {p.dislikeCount ?? 0}
                </button>

                <button
                  disabled={repostingIds.includes(p.postId)}
                  onClick={async () => {
                    try {
                      setRepostingIds((s) => [...s, p.postId]);
                      const res = await repostPost(p.postId);
                      console.log("repost response:", res);

                      // Prepend the repost UI entry (keeps numeric postId for APIs)
                      const repostUi = convertDtoToUiPost(res);
                      setPosts((prev) => [repostUi, ...prev]);

                      alert("Reposted!");
                    } catch (e) {
                      console.error("Repost failed", e.response ?? e.message ?? e);
                      const msg = e.response?.error || e.response?.message || e.message || "Repost failed";
                      alert(msg);
                    } finally {
                      setRepostingIds((s) => s.filter((x) => x !== p.postId));
                    }
                  }}
                  className="btn"
                >
                  🔁 Repost
                </button>

                {canDeletePost() && !p.isRepost && (
                  <button className="btn danger" onClick={() => handleDelete(p)}>
                    🗑️ Delete
                  </button>
                )}
              </div>

              <div style={{ marginTop: 12 }}>
                {/* Always pass numeric postId to CommentsSection */}
                <CommentsSection postId={p.postId} />
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
}
