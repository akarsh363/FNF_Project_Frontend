// // src/Components/Feed/Feed.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { clearToken, fetchMe, getToken as getStoredToken } from "../../Services/AuthService";
// import { repostPost } from "../../Services/repostService";
// import "./Feed.css";
// import CommentsSection from "../CommentsSection/CommentsSection";
// import TagChips from "../Tags/TagChips";              // <-- ADD THIS IMPORT

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5294";

// export default function Feed() {
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [repostingIds, setRepostingIds] = useState([]);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const preloadedUser = location.state?.preloadedUser ?? null;
//   const preloadedPostsRaw = location.state?.preloadedPostsRaw ?? null;

//   const loadPosts = useCallback(async () => {
//     try {
//       const token = getStoredToken();
//       const headers = { "Content-Type": "application/json" };
//       if (token) headers.Authorization = `Bearer ${token}`;

//       const res = await fetch(`${API_BASE}/api/Posts`, { method: "GET", headers });

//       if (res.status === 401) {
//         clearToken();
//         navigate("/login", { replace: true });
//         return [];
//       }
//       if (!res.ok) {
//         const txt = await res.text();
//         console.warn("Failed to load posts, status:", res.status, "body:", txt);
//         return [];
//       }

//       const data = await res.json();
//       const arr = Array.isArray(data) ? data : data?.posts ?? [];
//       return normalizePostsArray(arr);
//     } catch (err) {
//       console.warn("loadPosts error:", err);
//       return [];
//     }
//   }, [navigate]);

//   // ---- normalize server -> UI shape (INCLUDES TAGS) ----
//   function normalizePostsArray(arr) {
//     return (arr || []).map((p, idx) => {
//       const title = p.title ?? p.Title ?? "";

//       // Elements
//       const rawBody = p.body ?? p.Body ?? "";
//       let elements = [];
//       try {
//         const parsed = rawBody ? JSON.parse(rawBody) : [];
//         elements = Array.isArray(parsed)
//           ? parsed.map((el, i) => ({
//               id: el.id ?? `${p.postId ?? p.PostId ?? idx}-${i}`,
//               type: (el.type ?? "text").toString().toLowerCase(),
//               content: el.content ?? el.body ?? "",
//               imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
//               imageName: el.imageName ?? "",
//             }))
//           : [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
//       } catch {
//         elements = [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
//       }

//       // ✅ Tags (tolerate many API shapes)
//       const tags =
//         p.tags ??
//         p.Tags ??
//         (p.postTags ?? p.PostTags)?.map((pt) => {
//           const tag = pt.tag ?? pt.Tag;
//           return {
//             TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
//             TagName: tag?.tagName ?? tag?.TagName ?? pt.tagName ?? pt.TagName,
//             DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
//           };
//         }) ??
//         [];

//       const likeCount = p.upvoteCount ?? p.UpvoteCount ?? p.likeCount ?? p.LikeCount ?? 0;
//       const dislikeCount = p.downvoteCount ?? p.DownvoteCount ?? p.dislikeCount ?? p.DislikeCount ?? 0;
//       const userVote = p.userVote ?? p.UserVote ?? 0;

//       return {
//         id: p.postId ?? p.PostId ?? `${idx}-${Date.now()}`,
//         title,
//         elements,
//         tags, // <-- keep normalized tags
//         createdAt: p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
//         authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
//         likeCount,
//         dislikeCount,
//         userVote,
//         raw: p,
//       };
//     });
//   }

//   useEffect(() => {
//     async function init() {
//       setLoading(true);

//       if (preloadedUser || preloadedPostsRaw) {
//         try {
//           if (preloadedUser) setUser(preloadedUser);
//           if (preloadedPostsRaw) {
//             const normalized = Array.isArray(preloadedPostsRaw)
//               ? normalizePostsArray(preloadedPostsRaw)
//               : normalizePostsArray(preloadedPostsRaw.posts ?? []);
//             setPosts(normalized);
//           }
//         } finally {
//           setLoading(false);
//           return;
//         }
//       }

//       try {
//         const [me, postsList] = await Promise.all([fetchMe().catch(() => null), loadPosts()]);
//         if (!me) {
//           clearToken();
//           navigate("/login", { replace: true });
//           return;
//         }
//         setUser(me);
//         setPosts(postsList);
//       } catch (err) {
//         console.error("Init failed:", err);
//         clearToken();
//         navigate("/login", { replace: true });
//       } finally {
//         setLoading(false);
//       }
//     }
//     init();
//   }, [navigate, loadPosts, preloadedUser, preloadedPostsRaw]);

//   // ... keep the rest of your handlers (voteOnPost, handleRepost, etc.) unchanged ...

//   if (loading) return <div className="loading">Loading...</div>;

//   const formatTimestamp = (ts) => {
//     const d = new Date(ts);
//     return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   return (
//     <div className="feed-page">
//       <header className="feed-header">
//         <div className="brand">FNF Feed</div>
//         <div className="user-actions">
//           {user && <span className="user-name">Hi, {user.fullName ?? user.FullName ?? user.email}</span>}
//           <Link to="/post/new" className="btn-newpost">➕ New Post</Link>
//           <button onClick={() => { clearToken(); navigate("/login", { replace: true }); }} className="btn-logout">
//             Logout
//           </button>
//         </div>
//       </header>

//       <main className="feed-main">
//         {posts.length === 0 ? (
//           <div className="no-posts">No posts yet.</div>
//         ) : (
//           posts.map((p) => (
//             <article key={`${p.id}`} className="post-item">
//               <header className="post-header">
//                 <h2 className="post-title">{p.title || "Untitled Post"}</h2>
//                 <div className="post-meta">
//                   <span className="author">👤 <strong>{p.authorName}</strong></span>
//                   <span className="timestamp">📅 {formatTimestamp(p.createdAt)}</span>
//                 </div>
//               </header>

//               <div className="post-content">
//                 {(p.elements || []).map((el) => {
//                   if (el.type === "text") return <div key={el.id} className="post-text"><p>{el.content}</p></div>;
//                   if (el.type === "code") return <div key={el.id} className="post-code"><pre><code>{el.content}</code></pre></div>;
//                   if (el.type === "image") {
//                     const src = el.imagePreview || el.url;
//                     if (!src) return null;
//                     return (
//                       <div key={el.id} className="post-image">
//                         <img src={src} alt={el.imageName || "image"} className="feed-image" />
//                       </div>
//                     );
//                   }
//                   return null;
//                 })}
//               </div>

//               {/* ✅ RENDER TAGS UNDER EACH POST */}
//               <TagChips tags={p.tags} />

//               {/* keep your action buttons and comments */}
//               {/* ... */}
//               <div style={{ marginTop: 12 }}>
//                 <CommentsSection postId={p.id} />
//               </div>
//             </article>
//           ))
//         )}
//       </main>
//     </div>
//   );
// }


import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { clearToken, fetchMe, getToken as getStoredToken } from "../../Services/AuthService";
import { repostPost } from "../../Services/repostService";
import { deletePostAsManager } from "../../Services/postsService";
import "./Feed.css";
import CommentsSection from "../CommentsSection/CommentsSection";
import TagChips from "../Tags/TagChips";

const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API || "http://localhost:5294";

export default function Feed() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repostingIds, setRepostingIds] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const preloadedUser = location.state?.preloadedUser ?? null;
  const preloadedPostsRaw = location.state?.preloadedPostsRaw ?? null;

  const loadPosts = useCallback(async () => {
    try {
      const headers = { "Content-Type": "application/json" };
      const token = getStoredToken();
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/Posts`, { method: "GET", headers });
      if (res.status === 401) { clearToken(); navigate("/login", { replace: true }); return []; }
      if (!res.ok) { console.warn("Failed to load posts:", res.status); return []; }
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data?.posts ?? [];
      return normalizePostsArray(arr);
    } catch (err) { console.warn("loadPosts error:", err); return []; }
  }, [navigate]);

  function normalizePostsArray(arr) {
    return (arr || []).map((p, idx) => {
      const title = p.title ?? p.Title ?? "";
      const rawBody = p.body ?? p.Body ?? "";
      let elements = [];
      try {
        const parsed = rawBody ? JSON.parse(rawBody) : [];
        elements = Array.isArray(parsed)
          ? parsed.map((el, i) => ({
              id: el.id ?? `${p.postId ?? p.PostId ?? idx}-${i}`,
              type: (el.type ?? "text").toString().toLowerCase(),
              content: el.content ?? el.body ?? "",
              imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
              imageName: el.imageName ?? "",
            }))
          : [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
      } catch {
        elements = [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
      }

      const tags =
        p.tags ??
        p.Tags ??
        (p.postTags ?? p.PostTags)?.map((pt) => {
          const tag = pt.tag ?? pt.Tag;
          return {
            TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
            TagName: tag?.tagName ?? tag?.TagName ?? pt.tagName ?? pt.TagName,
            DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
          };
        }) ?? [];

      const likeCount = p.upvoteCount ?? p.UpvoteCount ?? 0;
      const dislikeCount = p.downvoteCount ?? p.DownvoteCount ?? 0;
      const userVote = p.userVote ?? p.UserVote ?? 0;

      return {
        id: p.postId ?? p.PostId ?? `${idx}-${Date.now()}`,
        title,
        elements,
        tags,
        createdAt: p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
        authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
        likeCount,
        dislikeCount,
        userVote,
        raw: p,
      };
    });
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (preloadedUser || preloadedPostsRaw) {
        try {
          if (preloadedUser) setUser(preloadedUser);
          if (preloadedPostsRaw) {
            const normalized = Array.isArray(preloadedPostsRaw)
              ? normalizePostsArray(preloadedPostsRaw)
              : normalizePostsArray(preloadedPostsRaw.posts ?? []);
            setPosts(normalized);
          }
        } finally { setLoading(false); }
        return;
      }

      try {
        const [me, postsList] = await Promise.all([fetchMe().catch(() => null), loadPosts()]);
        if (!me) { clearToken(); navigate("/login", { replace: true }); return; }
        setUser(me); setPosts(postsList);
      } catch (err) {
        clearToken(); navigate("/login", { replace: true });
      } finally { setLoading(false); }
    })();
  }, [navigate, loadPosts, preloadedUser, preloadedPostsRaw]);

  // show delete button to ANY Manager; server will enforce same-dept requirement
  const canDeletePost = () => String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

  async function handleDelete(p) {
    const reason = prompt("Enter reason for deleting this post (required):");
    if (!reason || !reason.trim()) return;
    try {
      await deletePostAsManager(p.id, reason.trim());
      setPosts((prev) => prev.filter((x) => x.id !== p.id));
      alert("Deleted.");
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  }

  if (loading) return <div className="loading">Loading...</div>;

  const fmt = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <main className="feed-main" style={{ padding: 16 }}>
      {posts.length === 0 ? (
        <div className="no-posts">No posts yet.</div>
      ) : (
        posts.map((p) => (
          <article key={`${p.id}`} className="post-item">
            <header className="post-header">
              <h2 className="post-title">{p.title || "Untitled Post"}</h2>
              <div className="post-meta">
                <span className="author">👤 <strong>{p.authorName}</strong></span>
                <span className="timestamp">📅 {fmt(p.createdAt)}</span>
              </div>
            </header>

            <div className="post-content">
              {(p.elements || []).map((el) => {
                if (el.type === "text") return <div key={el.id} className="post-text"><p>{el.content}</p></div>;
                if (el.type === "code") return <div key={el.id} className="post-code"><pre><code>{el.content}</code></pre></div>;
                if (el.type === "image") {
                  const src = el.imagePreview || el.url; if (!src) return null;
                  return <div key={el.id} className="post-image"><img src={src} alt={el.imageName || "image"} className="feed-image" /></div>;
                }
                return null;
              })}
            </div>

            <TagChips tags={p.tags} />

            <div className="post-actions" style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button
                disabled={repostingIds.includes(p.id)}
                onClick={async () => {
                  try { setRepostingIds((s) => [...s, p.id]); await repostPost(p.id); alert("Reposted!"); }
                  catch (e) { alert(e.message || "Repost failed"); }
                  finally { setRepostingIds((s) => s.filter((x) => x !== p.id)); }
                }}
                className="btn"
              >
                🔁 Repost
              </button>

              {canDeletePost() && (
                <button className="btn danger" onClick={() => handleDelete(p)}>🗑️ Delete</button>
              )}
            </div>

            <div style={{ marginTop: 12 }}>
              <CommentsSection postId={p.id} />
            </div>
          </article>
        ))
      )}
    </main>
  );
}

