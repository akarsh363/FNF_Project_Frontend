// // // // // // // // src/Components/Feed/Feed.jsx
// // // // // // // import React, { useEffect, useState, useCallback } from "react";
// // // // // // // import { useNavigate, Link, useLocation } from "react-router-dom";
// // // // // // // import { clearToken, fetchMe, getToken as getStoredToken } from "../../Services/AuthService";
// // // // // // // import { repostPost } from "../../Services/repostService";
// // // // // // // import "./Feed.css";
// // // // // // // import CommentsSection from "../CommentsSection/CommentsSection";
// // // // // // // import TagChips from "../Tags/TagChips";              // <-- ADD THIS IMPORT

// // // // // // // const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5294";

// // // // // // // export default function Feed() {
// // // // // // //   const [user, setUser] = useState(null);
// // // // // // //   const [posts, setPosts] = useState([]);
// // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // //   const [repostingIds, setRepostingIds] = useState([]);
// // // // // // //   const navigate = useNavigate();
// // // // // // //   const location = useLocation();

// // // // // // //   const preloadedUser = location.state?.preloadedUser ?? null;
// // // // // // //   const preloadedPostsRaw = location.state?.preloadedPostsRaw ?? null;

// // // // // // //   const loadPosts = useCallback(async () => {
// // // // // // //     try {
// // // // // // //       const token = getStoredToken();
// // // // // // //       const headers = { "Content-Type": "application/json" };
// // // // // // //       if (token) headers.Authorization = `Bearer ${token}`;

// // // // // // //       const res = await fetch(`${API_BASE}/api/Posts`, { method: "GET", headers });

// // // // // // //       if (res.status === 401) {
// // // // // // //         clearToken();
// // // // // // //         navigate("/login", { replace: true });
// // // // // // //         return [];
// // // // // // //       }
// // // // // // //       if (!res.ok) {
// // // // // // //         const txt = await res.text();
// // // // // // //         console.warn("Failed to load posts, status:", res.status, "body:", txt);
// // // // // // //         return [];
// // // // // // //       }

// // // // // // //       const data = await res.json();
// // // // // // //       const arr = Array.isArray(data) ? data : data?.posts ?? [];
// // // // // // //       return normalizePostsArray(arr);
// // // // // // //     } catch (err) {
// // // // // // //       console.warn("loadPosts error:", err);
// // // // // // //       return [];
// // // // // // //     }
// // // // // // //   }, [navigate]);

// // // // // // //   // ---- normalize server -> UI shape (INCLUDES TAGS) ----
// // // // // // //   function normalizePostsArray(arr) {
// // // // // // //     return (arr || []).map((p, idx) => {
// // // // // // //       const title = p.title ?? p.Title ?? "";

// // // // // // //       // Elements
// // // // // // //       const rawBody = p.body ?? p.Body ?? "";
// // // // // // //       let elements = [];
// // // // // // //       try {
// // // // // // //         const parsed = rawBody ? JSON.parse(rawBody) : [];
// // // // // // //         elements = Array.isArray(parsed)
// // // // // // //           ? parsed.map((el, i) => ({
// // // // // // //               id: el.id ?? `${p.postId ?? p.PostId ?? idx}-${i}`,
// // // // // // //               type: (el.type ?? "text").toString().toLowerCase(),
// // // // // // //               content: el.content ?? el.body ?? "",
// // // // // // //               imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
// // // // // // //               imageName: el.imageName ?? "",
// // // // // // //             }))
// // // // // // //           : [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
// // // // // // //       } catch {
// // // // // // //         elements = [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
// // // // // // //       }

// // // // // // //       // ✅ Tags (tolerate many API shapes)
// // // // // // //       const tags =
// // // // // // //         p.tags ??
// // // // // // //         p.Tags ??
// // // // // // //         (p.postTags ?? p.PostTags)?.map((pt) => {
// // // // // // //           const tag = pt.tag ?? pt.Tag;
// // // // // // //           return {
// // // // // // //             TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
// // // // // // //             TagName: tag?.tagName ?? tag?.TagName ?? pt.tagName ?? pt.TagName,
// // // // // // //             DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
// // // // // // //           };
// // // // // // //         }) ??
// // // // // // //         [];

// // // // // // //       const likeCount = p.upvoteCount ?? p.UpvoteCount ?? p.likeCount ?? p.LikeCount ?? 0;
// // // // // // //       const dislikeCount = p.downvoteCount ?? p.DownvoteCount ?? p.dislikeCount ?? p.DislikeCount ?? 0;
// // // // // // //       const userVote = p.userVote ?? p.UserVote ?? 0;

// // // // // // //       return {
// // // // // // //         id: p.postId ?? p.PostId ?? `${idx}-${Date.now()}`,
// // // // // // //         title,
// // // // // // //         elements,
// // // // // // //         tags, // <-- keep normalized tags
// // // // // // //         createdAt: p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
// // // // // // //         authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
// // // // // // //         likeCount,
// // // // // // //         dislikeCount,
// // // // // // //         userVote,
// // // // // // //         raw: p,
// // // // // // //       };
// // // // // // //     });
// // // // // // //   }

// // // // // // //   useEffect(() => {
// // // // // // //     async function init() {
// // // // // // //       setLoading(true);

// // // // // // //       if (preloadedUser || preloadedPostsRaw) {
// // // // // // //         try {
// // // // // // //           if (preloadedUser) setUser(preloadedUser);
// // // // // // //           if (preloadedPostsRaw) {
// // // // // // //             const normalized = Array.isArray(preloadedPostsRaw)
// // // // // // //               ? normalizePostsArray(preloadedPostsRaw)
// // // // // // //               : normalizePostsArray(preloadedPostsRaw.posts ?? []);
// // // // // // //             setPosts(normalized);
// // // // // // //           }
// // // // // // //         } finally {
// // // // // // //           setLoading(false);
// // // // // // //           return;
// // // // // // //         }
// // // // // // //       }

// // // // // // //       try {
// // // // // // //         const [me, postsList] = await Promise.all([fetchMe().catch(() => null), loadPosts()]);
// // // // // // //         if (!me) {
// // // // // // //           clearToken();
// // // // // // //           navigate("/login", { replace: true });
// // // // // // //           return;
// // // // // // //         }
// // // // // // //         setUser(me);
// // // // // // //         setPosts(postsList);
// // // // // // //       } catch (err) {
// // // // // // //         console.error("Init failed:", err);
// // // // // // //         clearToken();
// // // // // // //         navigate("/login", { replace: true });
// // // // // // //       } finally {
// // // // // // //         setLoading(false);
// // // // // // //       }
// // // // // // //     }
// // // // // // //     init();
// // // // // // //   }, [navigate, loadPosts, preloadedUser, preloadedPostsRaw]);

// // // // // // //   // ... keep the rest of your handlers (voteOnPost, handleRepost, etc.) unchanged ...

// // // // // // //   if (loading) return <div className="loading">Loading...</div>;

// // // // // // //   const formatTimestamp = (ts) => {
// // // // // // //     const d = new Date(ts);
// // // // // // //     return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div className="feed-page">
// // // // // // //       <header className="feed-header">
// // // // // // //         <div className="brand">FNF Feed</div>
// // // // // // //         <div className="user-actions">
// // // // // // //           {user && <span className="user-name">Hi, {user.fullName ?? user.FullName ?? user.email}</span>}
// // // // // // //           <Link to="/post/new" className="btn-newpost">➕ New Post</Link>
// // // // // // //           <button onClick={() => { clearToken(); navigate("/login", { replace: true }); }} className="btn-logout">
// // // // // // //             Logout
// // // // // // //           </button>
// // // // // // //         </div>
// // // // // // //       </header>

// // // // // // //       <main className="feed-main">
// // // // // // //         {posts.length === 0 ? (
// // // // // // //           <div className="no-posts">No posts yet.</div>
// // // // // // //         ) : (
// // // // // // //           posts.map((p) => (
// // // // // // //             <article key={`${p.id}`} className="post-item">
// // // // // // //               <header className="post-header">
// // // // // // //                 <h2 className="post-title">{p.title || "Untitled Post"}</h2>
// // // // // // //                 <div className="post-meta">
// // // // // // //                   <span className="author">👤 <strong>{p.authorName}</strong></span>
// // // // // // //                   <span className="timestamp">📅 {formatTimestamp(p.createdAt)}</span>
// // // // // // //                 </div>
// // // // // // //               </header>

// // // // // // //               <div className="post-content">
// // // // // // //                 {(p.elements || []).map((el) => {
// // // // // // //                   if (el.type === "text") return <div key={el.id} className="post-text"><p>{el.content}</p></div>;
// // // // // // //                   if (el.type === "code") return <div key={el.id} className="post-code"><pre><code>{el.content}</code></pre></div>;
// // // // // // //                   if (el.type === "image") {
// // // // // // //                     const src = el.imagePreview || el.url;
// // // // // // //                     if (!src) return null;
// // // // // // //                     return (
// // // // // // //                       <div key={el.id} className="post-image">
// // // // // // //                         <img src={src} alt={el.imageName || "image"} className="feed-image" />
// // // // // // //                       </div>
// // // // // // //                     );
// // // // // // //                   }
// // // // // // //                   return null;
// // // // // // //                 })}
// // // // // // //               </div>

// // // // // // //               {/* ✅ RENDER TAGS UNDER EACH POST */}
// // // // // // //               <TagChips tags={p.tags} />

// // // // // // //               {/* keep your action buttons and comments */}
// // // // // // //               {/* ... */}
// // // // // // //               <div style={{ marginTop: 12 }}>
// // // // // // //                 <CommentsSection postId={p.id} />
// // // // // // //               </div>
// // // // // // //             </article>
// // // // // // //           ))
// // // // // // //         )}
// // // // // // //       </main>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }


// // // // // // import React, { useEffect, useState, useCallback } from "react";
// // // // // // import { useNavigate, useLocation } from "react-router-dom";
// // // // // // import { clearToken, fetchMe, getToken as getStoredToken } from "../../Services/AuthService";
// // // // // // import { repostPost } from "../../Services/repostService";
// // // // // // import { deletePostAsManager } from "../../Services/postsService";
// // // // // // import "./Feed.css";
// // // // // // import CommentsSection from "../CommentsSection/CommentsSection";
// // // // // // import TagChips from "../Tags/TagChips";

// // // // // // const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API || "http://localhost:5294";

// // // // // // export default function Feed() {
// // // // // //   const [user, setUser] = useState(null);
// // // // // //   const [posts, setPosts] = useState([]);
// // // // // //   const [loading, setLoading] = useState(true);
// // // // // //   const [repostingIds, setRepostingIds] = useState([]);
// // // // // //   const navigate = useNavigate();
// // // // // //   const location = useLocation();

// // // // // //   const preloadedUser = location.state?.preloadedUser ?? null;
// // // // // //   const preloadedPostsRaw = location.state?.preloadedPostsRaw ?? null;

// // // // // //   const loadPosts = useCallback(async () => {
// // // // // //     try {
// // // // // //       const headers = { "Content-Type": "application/json" };
// // // // // //       const token = getStoredToken();
// // // // // //       if (token) headers.Authorization = `Bearer ${token}`;
// // // // // //       const res = await fetch(`${API_BASE}/api/Posts`, { method: "GET", headers });
// // // // // //       if (res.status === 401) { clearToken(); navigate("/login", { replace: true }); return []; }
// // // // // //       if (!res.ok) { console.warn("Failed to load posts:", res.status); return []; }
// // // // // //       const data = await res.json();
// // // // // //       const arr = Array.isArray(data) ? data : data?.posts ?? [];
// // // // // //       return normalizePostsArray(arr);
// // // // // //     } catch (err) { console.warn("loadPosts error:", err); return []; }
// // // // // //   }, [navigate]);

// // // // // //   function normalizePostsArray(arr) {
// // // // // //     return (arr || []).map((p, idx) => {
// // // // // //       const title = p.title ?? p.Title ?? "";
// // // // // //       const rawBody = p.body ?? p.Body ?? "";
// // // // // //       let elements = [];
// // // // // //       try {
// // // // // //         const parsed = rawBody ? JSON.parse(rawBody) : [];
// // // // // //         elements = Array.isArray(parsed)
// // // // // //           ? parsed.map((el, i) => ({
// // // // // //               id: el.id ?? `${p.postId ?? p.PostId ?? idx}-${i}`,
// // // // // //               type: (el.type ?? "text").toString().toLowerCase(),
// // // // // //               content: el.content ?? el.body ?? "",
// // // // // //               imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
// // // // // //               imageName: el.imageName ?? "",
// // // // // //             }))
// // // // // //           : [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
// // // // // //       } catch {
// // // // // //         elements = [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
// // // // // //       }

// // // // // //       const tags =
// // // // // //         p.tags ??
// // // // // //         p.Tags ??
// // // // // //         (p.postTags ?? p.PostTags)?.map((pt) => {
// // // // // //           const tag = pt.tag ?? pt.Tag;
// // // // // //           return {
// // // // // //             TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
// // // // // //             TagName: tag?.tagName ?? tag?.TagName ?? pt.tagName ?? pt.TagName,
// // // // // //             DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
// // // // // //           };
// // // // // //         }) ?? [];

// // // // // //       const likeCount = p.upvoteCount ?? p.UpvoteCount ?? 0;
// // // // // //       const dislikeCount = p.downvoteCount ?? p.DownvoteCount ?? 0;
// // // // // //       const userVote = p.userVote ?? p.UserVote ?? 0;

// // // // // //       return {
// // // // // //         id: p.postId ?? p.PostId ?? `${idx}-${Date.now()}`,
// // // // // //         title,
// // // // // //         elements,
// // // // // //         tags,
// // // // // //         createdAt: p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
// // // // // //         authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
// // // // // //         likeCount,
// // // // // //         dislikeCount,
// // // // // //         userVote,
// // // // // //         raw: p,
// // // // // //       };
// // // // // //     });
// // // // // //   }

// // // // // //   useEffect(() => {
// // // // // //     (async () => {
// // // // // //       setLoading(true);
// // // // // //       if (preloadedUser || preloadedPostsRaw) {
// // // // // //         try {
// // // // // //           if (preloadedUser) setUser(preloadedUser);
// // // // // //           if (preloadedPostsRaw) {
// // // // // //             const normalized = Array.isArray(preloadedPostsRaw)
// // // // // //               ? normalizePostsArray(preloadedPostsRaw)
// // // // // //               : normalizePostsArray(preloadedPostsRaw.posts ?? []);
// // // // // //             setPosts(normalized);
// // // // // //           }
// // // // // //         } finally { setLoading(false); }
// // // // // //         return;
// // // // // //       }

// // // // // //       try {
// // // // // //         const [me, postsList] = await Promise.all([fetchMe().catch(() => null), loadPosts()]);
// // // // // //         if (!me) { clearToken(); navigate("/login", { replace: true }); return; }
// // // // // //         setUser(me); setPosts(postsList);
// // // // // //       } catch (err) {
// // // // // //         clearToken(); navigate("/login", { replace: true });
// // // // // //       } finally { setLoading(false); }
// // // // // //     })();
// // // // // //   }, [navigate, loadPosts, preloadedUser, preloadedPostsRaw]);

// // // // // //   // show delete button to ANY Manager; server will enforce same-dept requirement
// // // // // //   const canDeletePost = () => String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

// // // // // //   async function handleDelete(p) {
// // // // // //     const reason = prompt("Enter reason for deleting this post (required):");
// // // // // //     if (!reason || !reason.trim()) return;
// // // // // //     try {
// // // // // //       await deletePostAsManager(p.id, reason.trim());
// // // // // //       setPosts((prev) => prev.filter((x) => x.id !== p.id));
// // // // // //       alert("Deleted.");
// // // // // //     } catch (e) {
// // // // // //       alert(e.message || "Delete failed");
// // // // // //     }
// // // // // //   }

// // // // // //   if (loading) return <div className="loading">Loading...</div>;

// // // // // //   const fmt = (ts) => {
// // // // // //     const d = new Date(ts);
// // // // // //     return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// // // // // //   };

// // // // // //   return (
// // // // // //     <main className="feed-main" style={{ padding: 16 }}>
// // // // // //       {posts.length === 0 ? (
// // // // // //         <div className="no-posts">No posts yet.</div>
// // // // // //       ) : (
// // // // // //         posts.map((p) => (
// // // // // //           <article key={`${p.id}`} className="post-item">
// // // // // //             <header className="post-header">
// // // // // //               <h2 className="post-title">{p.title || "Untitled Post"}</h2>
// // // // // //               <div className="post-meta">
// // // // // //                 <span className="author">👤 <strong>{p.authorName}</strong></span>
// // // // // //                 <span className="timestamp">📅 {fmt(p.createdAt)}</span>
// // // // // //               </div>
// // // // // //             </header>

// // // // // //             <div className="post-content">
// // // // // //               {(p.elements || []).map((el) => {
// // // // // //                 if (el.type === "text") return <div key={el.id} className="post-text"><p>{el.content}</p></div>;
// // // // // //                 if (el.type === "code") return <div key={el.id} className="post-code"><pre><code>{el.content}</code></pre></div>;
// // // // // //                 if (el.type === "image") {
// // // // // //                   const src = el.imagePreview || el.url; if (!src) return null;
// // // // // //                   return <div key={el.id} className="post-image"><img src={src} alt={el.imageName || "image"} className="feed-image" /></div>;
// // // // // //                 }
// // // // // //                 return null;
// // // // // //               })}
// // // // // //             </div>

// // // // // //             <TagChips tags={p.tags} />

// // // // // //             <div className="post-actions" style={{ marginTop: 8, display: "flex", gap: 8 }}>
// // // // // //               <button
// // // // // //                 disabled={repostingIds.includes(p.id)}
// // // // // //                 onClick={async () => {
// // // // // //                   try { setRepostingIds((s) => [...s, p.id]); await repostPost(p.id); alert("Reposted!"); }
// // // // // //                   catch (e) { alert(e.message || "Repost failed"); }
// // // // // //                   finally { setRepostingIds((s) => s.filter((x) => x !== p.id)); }
// // // // // //                 }}
// // // // // //                 className="btn"
// // // // // //               >
// // // // // //                 🔁 Repost
// // // // // //               </button>

// // // // // //               {canDeletePost() && (
// // // // // //                 <button className="btn danger" onClick={() => handleDelete(p)}>🗑️ Delete</button>
// // // // // //               )}
// // // // // //             </div>

// // // // // //             <div style={{ marginTop: 12 }}>
// // // // // //               <CommentsSection postId={p.id} />
// // // // // //             </div>
// // // // // //           </article>
// // // // // //         ))
// // // // // //       )}
// // // // // //     </main>
// // // // // //   );
// // // // // // }

// // // // // import React, { useEffect, useState, useCallback, useMemo } from "react";
// // // // // import { useNavigate, useLocation } from "react-router-dom";
// // // // // import { clearToken, fetchMe, getToken as getStoredToken } from "../../Services/AuthService";
// // // // // import { repostPost } from "../../Services/repostService";
// // // // // import { deletePostAsManager } from "../../Services/postsService";
// // // // // import "./Feed.css";
// // // // // import CommentsSection from "../CommentsSection/CommentsSection";
// // // // // import TagChips from "../Tags/TagChips";

// // // // // const API_BASE =
// // // // //   import.meta.env.VITE_API_BASE_URL ||
// // // // //   import.meta.env.VITE_API ||
// // // // //   "http://localhost:5294";

// // // // // export default function Feed() {
// // // // //   const [user, setUser] = useState(null);
// // // // //   const [posts, setPosts] = useState([]);
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [repostingIds, setRepostingIds] = useState([]);

// // // // //   // NEW: search + department filter state
// // // // //   const [query, setQuery] = useState("");
// // // // //   const [deptFilter, setDeptFilter] = useState("all");
// // // // //   const [deptOptions, setDeptOptions] = useState(["all"]);

// // // // //   const navigate = useNavigate();
// // // // //   const location = useLocation();

// // // // //   const preloadedUser = location.state?.preloadedUser ?? null;
// // // // //   const preloadedPostsRaw = location.state?.preloadedPostsRaw ?? null;

// // // // //   const loadPosts = useCallback(async () => {
// // // // //     try {
// // // // //       const headers = { "Content-Type": "application/json" };
// // // // //       const token = getStoredToken();
// // // // //       if (token) headers.Authorization = `Bearer ${token}`;
// // // // //       const res = await fetch(`${API_BASE}/api/Posts`, { method: "GET", headers });
// // // // //       if (res.status === 401) {
// // // // //         clearToken();
// // // // //         navigate("/login", { replace: true });
// // // // //         return [];
// // // // //       }
// // // // //       if (!res.ok) {
// // // // //         console.warn("Failed to load posts:", res.status);
// // // // //         return [];
// // // // //       }
// // // // //       const data = await res.json();
// // // // //       const arr = Array.isArray(data) ? data : data?.posts ?? [];
// // // // //       return normalizePostsArray(arr);
// // // // //     } catch (err) {
// // // // //       console.warn("loadPosts error:", err);
// // // // //       return [];
// // // // //     }
// // // // //   }, [navigate]);

// // // // //   function normalizePostsArray(arr) {
// // // // //     return (arr || []).map((p, idx) => {
// // // // //       const title = p.title ?? p.Title ?? "";
// // // // //       const rawBody = p.body ?? p.Body ?? "";
// // // // //       let elements = [];
// // // // //       try {
// // // // //         const parsed = rawBody ? JSON.parse(rawBody) : [];
// // // // //         elements = Array.isArray(parsed)
// // // // //           ? parsed.map((el, i) => ({
// // // // //               id: el.id ?? `${p.postId ?? p.PostId ?? idx}-${i}`,
// // // // //               type: (el.type ?? "text").toString().toLowerCase(),
// // // // //               content: el.content ?? el.body ?? "",
// // // // //               imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
// // // // //               imageName: el.imageName ?? "",
// // // // //             }))
// // // // //           : [
// // // // //               {
// // // // //                 id: `${p.postId ?? idx}-single`,
// // // // //                 type: "text",
// // // // //                 content: String(rawBody || ""),
// // // // //               },
// // // // //             ];
// // // // //       } catch {
// // // // //         elements = [
// // // // //           {
// // // // //             id: `${p.postId ?? idx}-single`,
// // // // //             type: "text",
// // // // //             content: String(rawBody || ""),
// // // // //           },
// // // // //         ];
// // // // //       }

// // // // //       const tags =
// // // // //         p.tags ??
// // // // //         p.Tags ??
// // // // //         (p.postTags ?? p.PostTags)?.map((pt) => {
// // // // //           const tag = pt.tag ?? pt.Tag;
// // // // //           return {
// // // // //             TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
// // // // //             TagName: tag?.tagName ?? tag?.TagName ?? pt.tagName ?? pt.TagName,
// // // // //             DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
// // // // //           };
// // // // //         }) ??
// // // // //         [];

// // // // //       const likeCount = p.upvoteCount ?? p.UpvoteCount ?? 0;
// // // // //       const dislikeCount = p.downvoteCount ?? p.DownvoteCount ?? 0;
// // // // //       const userVote = p.userVote ?? p.UserVote ?? 0;

// // // // //       // NEW: capture department name from common shapes
// // // // //       const departmentName =
// // // // //         p.departmentName ??
// // // // //         p.DepartmentName ??
// // // // //         p?.Dept?.DeptName ??
// // // // //         "";

// // // // //       return {
// // // // //         id: p.postId ?? p.PostId ?? `${idx}-${Date.now()}`,
// // // // //         title,
// // // // //         elements,
// // // // //         tags,
// // // // //         createdAt:
// // // // //           p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
// // // // //         authorName:
// // // // //           p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
// // // // //         departmentName,
// // // // //         likeCount,
// // // // //         dislikeCount,
// // // // //         userVote,
// // // // //         raw: p,
// // // // //       };
// // // // //     });
// // // // //   }

// // // // //   useEffect(() => {
// // // // //     (async () => {
// // // // //       setLoading(true);

// // // // //       // If preloaded from navigation state
// // // // //       if (preloadedUser || preloadedPostsRaw) {
// // // // //         try {
// // // // //           if (preloadedUser) setUser(preloadedUser);
// // // // //           if (preloadedPostsRaw) {
// // // // //             const normalized = Array.isArray(preloadedPostsRaw)
// // // // //               ? normalizePostsArray(preloadedPostsRaw)
// // // // //               : normalizePostsArray(preloadedPostsRaw.posts ?? []);
// // // // //             setPosts(normalized);

// // // // //             // build dept list
// // // // //             const depts = Array.from(
// // // // //               new Set(normalized.map((x) => x.departmentName).filter(Boolean))
// // // // //             ).sort();
// // // // //             setDeptOptions(["all", ...depts]);
// // // // //           }
// // // // //         } finally {
// // // // //           setLoading(false);
// // // // //         }
// // // // //         return;
// // // // //       }

// // // // //       try {
// // // // //         const [me, postsList] = await Promise.all([
// // // // //           fetchMe().catch(() => null),
// // // // //           loadPosts(),
// // // // //         ]);
// // // // //         if (!me) {
// // // // //           clearToken();
// // // // //           navigate("/login", { replace: true });
// // // // //           return;
// // // // //         }
// // // // //         setUser(me);
// // // // //         setPosts(postsList);

// // // // //         // build dept list
// // // // //         const depts = Array.from(
// // // // //           new Set((postsList || []).map((x) => x.departmentName).filter(Boolean))
// // // // //         ).sort();
// // // // //         setDeptOptions(["all", ...depts]);
// // // // //       } catch (err) {
// // // // //         clearToken();
// // // // //         navigate("/login", { replace: true });
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //       }
// // // // //     })();
// // // // //   }, [navigate, loadPosts, preloadedUser, preloadedPostsRaw]);

// // // // //   // show delete button to ANY Manager; server will enforce same-dept requirement
// // // // //   const canDeletePost = () =>
// // // // //     String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

// // // // //   async function handleDelete(p) {
// // // // //     const reason = prompt("Enter reason for deleting this post (required):");
// // // // //     if (!reason || !reason.trim()) return;
// // // // //     try {
// // // // //       await deletePostAsManager(p.id, reason.trim());
// // // // //       setPosts((prev) => prev.filter((x) => x.id !== p.id));
// // // // //       alert("Deleted.");
// // // // //     } catch (e) {
// // // // //       alert(e.message || "Delete failed");
// // // // //     }
// // // // //   }

// // // // //   // NEW: filtered list derived from query + deptFilter
// // // // //   const filteredPosts = useMemo(() => {
// // // // //     const q = (query || "").trim().toLowerCase();
// // // // //     const dept = deptFilter;

// // // // //     return posts.filter((p) => {
// // // // //       if (dept !== "all" && (p.departmentName || "").toLowerCase() !== dept.toLowerCase()) {
// // // // //         return false;
// // // // //       }
// // // // //       if (!q) return true;

// // // // //       const inTitle = (p.title || "").toLowerCase().includes(q);
// // // // //       const inText = (p.elements || []).some(
// // // // //         (el) => el.type === "text" && (el.content || "").toLowerCase().includes(q)
// // // // //       );
// // // // //       return inTitle || inText;
// // // // //     });
// // // // //   }, [posts, query, deptFilter]);

// // // // //   if (loading) return <div className="loading">Loading...</div>;

// // // // //   const fmt = (ts) => {
// // // // //     const d = new Date(ts);
// // // // //     return (
// // // // //       d.toLocaleDateString() +
// // // // //       " " +
// // // // //       d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
// // // // //     );
// // // // //   };

// // // // //   return (
// // // // //     <div className="feed-page">
// // // // //       {/* 🔎 toolbar just under the hamburger */}
// // // // //       <div className="feed-toolbar">
// // // // //         <input
// // // // //           className="feed-search"
// // // // //           type="search"
// // // // //           placeholder="Search posts (title or text)…"
// // // // //           value={query}
// // // // //           onChange={(e) => setQuery(e.target.value)}
// // // // //         />
// // // // //         <select
// // // // //           className="feed-dept"
// // // // //           value={deptFilter}
// // // // //           onChange={(e) => setDeptFilter(e.target.value)}
// // // // //           title="Filter by department"
// // // // //         >
// // // // //           {deptOptions.map((opt) => (
// // // // //             <option key={opt} value={opt}>
// // // // //               {opt === "all" ? "All Departments" : opt}
// // // // //             </option>
// // // // //           ))}
// // // // //         </select>
// // // // //       </div>

// // // // //       <main className="feed-main" style={{ padding: 16 }}>
// // // // //         {filteredPosts.length === 0 ? (
// // // // //           <div className="no-posts">No matching posts.</div>
// // // // //         ) : (
// // // // //           filteredPosts.map((p) => (
// // // // //             <article key={`${p.id}`} className="post-item">
// // // // //               <header className="post-header">
// // // // //                 <h2 className="post-title">{p.title || "Untitled Post"}</h2>
// // // // //                 <div className="post-meta">
// // // // //                   <span className="author">
// // // // //                     👤 <strong>{p.authorName}</strong>
// // // // //                   </span>
// // // // //                   <span className="timestamp">📅 {fmt(p.createdAt)}</span>
// // // // //                   {p.departmentName ? (
// // // // //                     <span className="dept">🏢 {p.departmentName}</span>
// // // // //                   ) : null}
// // // // //                 </div>
// // // // //               </header>

// // // // //               <div className="post-content">
// // // // //                 {(p.elements || []).map((el) => {
// // // // //                   if (el.type === "text")
// // // // //                     return (
// // // // //                       <div key={el.id} className="post-text">
// // // // //                         <p>{el.content}</p>
// // // // //                       </div>
// // // // //                     );
// // // // //                   if (el.type === "code")
// // // // //                     return (
// // // // //                       <div key={el.id} className="post-code">
// // // // //                         <pre>
// // // // //                           <code>{el.content}</code>
// // // // //                         </pre>
// // // // //                       </div>
// // // // //                     );
// // // // //                   if (el.type === "image") {
// // // // //                     const src = el.imagePreview || el.url;
// // // // //                     if (!src) return null;
// // // // //                     return (
// // // // //                       <div key={el.id} className="post-image">
// // // // //                         <img
// // // // //                           src={src}
// // // // //                           alt={el.imageName || "image"}
// // // // //                           className="feed-image"
// // // // //                           loading="lazy"
// // // // //                         />
// // // // //                       </div>
// // // // //                     );
// // // // //                   }
// // // // //                   return null;
// // // // //                 })}
// // // // //               </div>

// // // // //               <TagChips tags={p.tags} />

// // // // //               <div
// // // // //                 className="post-actions"
// // // // //                 style={{ marginTop: 8, display: "flex", gap: 8 }}
// // // // //               >
// // // // //                 <button
// // // // //                   disabled={repostingIds.includes(p.id)}
// // // // //                   onClick={async () => {
// // // // //                     try {
// // // // //                       setRepostingIds((s) => [...s, p.id]);
// // // // //                       await repostPost(p.id);
// // // // //                       alert("Reposted!");
// // // // //                     } catch (e) {
// // // // //                       alert(e.message || "Repost failed");
// // // // //                     } finally {
// // // // //                       setRepostingIds((s) => s.filter((x) => x !== p.id));
// // // // //                     }
// // // // //                   }}
// // // // //                   className="btn"
// // // // //                 >
// // // // //                   🔁 Repost
// // // // //                 </button>

// // // // //                 {canDeletePost() && (
// // // // //                   <button
// // // // //                     className="btn danger"
// // // // //                     onClick={() => handleDelete(p)}
// // // // //                   >
// // // // //                     🗑️ Delete
// // // // //                   </button>
// // // // //                 )}
// // // // //               </div>

// // // // //               <div style={{ marginTop: 12 }}>
// // // // //                 <CommentsSection postId={p.id} />
// // // // //               </div>
// // // // //             </article>
// // // // //           ))
// // // // //         )}
// // // // //       </main>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // import React, { useEffect, useState, useCallback, useMemo } from "react";
// // // // import { useNavigate, useLocation } from "react-router-dom";
// // // // import { clearToken, fetchMe, getToken as getStoredToken } from "../../Services/AuthService";
// // // // import { repostPost } from "../../Services/repostService";
// // // // import { deletePostAsManager } from "../../Services/postsService";
// // // // import "./Feed.css";
// // // // import CommentsSection from "../CommentsSection/CommentsSection";
// // // // import TagChips from "../Tags/TagChips";

// // // // const API_BASE =
// // // //   import.meta.env.VITE_API_BASE_URL ||
// // // //   import.meta.env.VITE_API ||
// // // //   "http://localhost:5294";

// // // // export default function Feed() {
// // // //   const [user, setUser] = useState(null);
// // // //   const [posts, setPosts] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [repostingIds, setRepostingIds] = useState([]);
// // // //   const [deptOptions, setDeptOptions] = useState(["all"]); // list of department names

// // // //   const navigate = useNavigate();
// // // //   const location = useLocation();

// // // //   // read current filter from URL so it persists across navigation/refresh
// // // //   const urlParams = new URLSearchParams(location.search);
// // // //   const qParam = (urlParams.get("q") || "").toLowerCase();
// // // //   const deptParam = urlParams.get("dept") || "all";

// // // //   // local state mirrors URL for controlled inputs
// // // //   const [query, setQuery] = useState(qParam);
// // // //   const [deptFilter, setDeptFilter] = useState(deptParam);

// // // //   // keep inputs in sync if user navigates with back/forward
// // // //   useEffect(() => {
// // // //     setQuery(qParam);
// // // //     setDeptFilter(deptParam || "all");
// // // //   }, [qParam, deptParam]);

// // // //   const loadPosts = useCallback(async () => {
// // // //     try {
// // // //       const headers = { "Content-Type": "application/json" };
// // // //       const token = getStoredToken();
// // // //       if (token) headers.Authorization = `Bearer ${token}`;
// // // //       const res = await fetch(`${API_BASE}/api/Posts`, { method: "GET", headers });
// // // //       if (res.status === 401) {
// // // //         clearToken();
// // // //         navigate("/login", { replace: true });
// // // //         return [];
// // // //       }
// // // //       if (!res.ok) {
// // // //         console.warn("Failed to load posts:", res.status);
// // // //         return [];
// // // //       }
// // // //       const data = await res.json();
// // // //       const arr = Array.isArray(data) ? data : data?.posts ?? [];
// // // //       return normalizePostsArray(arr);
// // // //     } catch (err) {
// // // //       console.warn("loadPosts error:", err);
// // // //       return [];
// // // //     }
// // // //   }, [navigate]);

// // // //   function normalizePostsArray(arr) {
// // // //     return (arr || []).map((p, idx) => {
// // // //       const title = p.title ?? p.Title ?? "";
// // // //       const rawBody = p.body ?? p.Body ?? "";
// // // //       let elements = [];
// // // //       try {
// // // //         const parsed = rawBody ? JSON.parse(rawBody) : [];
// // // //         elements = Array.isArray(parsed)
// // // //           ? parsed.map((el, i) => ({
// // // //               id: el.id ?? `${p.postId ?? p.PostId ?? idx}-${i}`,
// // // //               type: (el.type ?? "text").toString().toLowerCase(),
// // // //               content: el.content ?? el.body ?? "",
// // // //               imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
// // // //               imageName: el.imageName ?? "",
// // // //             }))
// // // //           : [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
// // // //       } catch {
// // // //         elements = [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
// // // //       }

// // // //       const tags =
// // // //         p.tags ??
// // // //         p.Tags ??
// // // //         (p.postTags ?? p.PostTags)?.map((pt) => {
// // // //           const tag = pt.tag ?? pt.Tag;
// // // //           return {
// // // //             TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
// // // //             TagName: tag?.tagName ?? tag?.TagName ?? pt.tagName ?? pt.TagName,
// // // //             DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
// // // //           };
// // // //         }) ??
// // // //         [];

// // // //       const likeCount = p.upvoteCount ?? p.UpvoteCount ?? 0;
// // // //       const dislikeCount = p.downvoteCount ?? p.DownvoteCount ?? 0;
// // // //       const userVote = p.userVote ?? p.UserVote ?? 0;

// // // //       // read department name from common shapes
// // // //       const departmentName =
// // // //         p.departmentName ??
// // // //         p.DepartmentName ??
// // // //         p?.Dept?.DeptName ??
// // // //         "";

// // // //       return {
// // // //         id: p.postId ?? p.PostId ?? `${idx}-${Date.now()}`,
// // // //         title,
// // // //         elements,
// // // //         tags,
// // // //         createdAt: p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
// // // //         authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
// // // //         departmentName,
// // // //         likeCount,
// // // //         dislikeCount,
// // // //         userVote,
// // // //         raw: p,
// // // //       };
// // // //     });
// // // //   }

// // // //   useEffect(() => {
// // // //     (async () => {
// // // //       setLoading(true);
// // // //       try {
// // // //         const [me, postsList] = await Promise.all([
// // // //           fetchMe().catch(() => null),
// // // //           loadPosts(),
// // // //         ]);
// // // //         if (!me) {
// // // //           clearToken();
// // // //           navigate("/login", { replace: true });
// // // //           return;
// // // //         }
// // // //         setUser(me);
// // // //         setPosts(postsList);

// // // //         // Build unique department list for dropdown
// // // //         const depts = Array.from(
// // // //           new Set((postsList || []).map((x) => x.departmentName).filter(Boolean))
// // // //         ).sort();
// // // //         setDeptOptions(["all", ...depts]);
// // // //       } catch (err) {
// // // //         clearToken();
// // // //         navigate("/login", { replace: true });
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     })();
// // // //   }, [navigate, loadPosts]);

// // // //   // Manager can see delete; server still enforces same-dept rule
// // // //   const canDeletePost = () =>
// // // //     String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

// // // //   async function handleDelete(p) {
// // // //     const reason = prompt("Enter reason for deleting this post (required):");
// // // //     if (!reason || !reason.trim()) return;
// // // //     try {
// // // //       await deletePostAsManager(p.id, reason.trim());
// // // //       setPosts((prev) => prev.filter((x) => x.id !== p.id));
// // // //       alert("Deleted.");
// // // //     } catch (e) {
// // // //       alert(e.message || "Delete failed");
// // // //     }
// // // //   }

// // // //   // Apply filtering
// // // //   const filteredPosts = useMemo(() => {
// // // //     const q = query.toLowerCase().trim();
// // // //     const dept = (deptFilter || "all").toLowerCase();

// // // //     return posts.filter((p) => {
// // // //       // dept filter
// // // //       if (dept !== "all" && (p.departmentName || "").toLowerCase() !== dept) {
// // // //         return false;
// // // //       }
// // // //       // search filter
// // // //       if (!q) return true;
// // // //       const inTitle = (p.title || "").toLowerCase().includes(q);
// // // //       const inText = (p.elements || []).some(
// // // //         (el) => el.type === "text" && (el.content || "").toLowerCase().includes(q)
// // // //       );
// // // //       return inTitle || inText;
// // // //     });
// // // //   }, [posts, query, deptFilter]);

// // // //   // write filters back to URL so they persist
// // // //   function updateURL(nextQ, nextDept) {
// // // //     const p = new URLSearchParams(location.search);
// // // //     if (nextQ) p.set("q", nextQ);
// // // //     else p.delete("q");
// // // //     if (nextDept && nextDept !== "all") p.set("dept", nextDept);
// // // //     else p.delete("dept");
// // // //     navigate({ pathname: location.pathname, search: p.toString() }, { replace: true });
// // // //   }

// // // //   if (loading) return <div className="loading">Loading...</div>;

// // // //   const fmt = (ts) => {
// // // //     const d = new Date(ts);
// // // //     return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// // // //   };

// // // //   return (
// // // //     <div className="feed-page">

// // // //       {/* INLINE TOOLBAR — always visible on the Feed */}
// // // //       <div className="feed-toolbar-inline">
// // // //         <input
// // // //           className="feed-toolbar-search"
// // // //           type="search"
// // // //           placeholder="Search posts (title or text)…"
// // // //           value={query}
// // // //           onChange={(e) => {
// // // //             const v = e.target.value;
// // // //             setQuery(v);
// // // //             updateURL(v, deptFilter);
// // // //           }}
// // // //         />
// // // //         <select
// // // //           className="feed-toolbar-dept"
// // // //           value={deptFilter}
// // // //           onChange={(e) => {
// // // //             const v = e.target.value;
// // // //             setDeptFilter(v);
// // // //             updateURL(query, v);
// // // //           }}
// // // //           title="Filter by department"
// // // //         >
// // // //           {deptOptions.map((opt) => (
// // // //             <option key={opt} value={opt}>
// // // //               {opt === "all" ? "All Departments" : opt}
// // // //             </option>
// // // //           ))}
// // // //         </select>
// // // //       </div>

// // // //       <main className="feed-main" style={{ padding: 16 }}>
// // // //         {filteredPosts.length === 0 ? (
// // // //           <div className="no-posts">No matching posts.</div>
// // // //         ) : (
// // // //           filteredPosts.map((p) => (
// // // //             <article key={`${p.id}`} className="post-item">
// // // //               <header className="post-header">
// // // //                 <h2 className="post-title">{p.title || "Untitled Post"}</h2>
// // // //                 <div className="post-meta">
// // // //                   <span className="author">👤 <strong>{p.authorName}</strong></span>
// // // //                   <span className="timestamp">📅 {fmt(p.createdAt)}</span>
// // // //                   {p.departmentName ? <span className="dept">🏢 {p.departmentName}</span> : null}
// // // //                 </div>
// // // //               </header>

// // // //               <div className="post-content">
// // // //                 {(p.elements || []).map((el) => {
// // // //                   if (el.type === "text")
// // // //                     return (
// // // //                       <div key={el.id} className="post-text">
// // // //                         <p>{el.content}</p>
// // // //                       </div>
// // // //                     );
// // // //                   if (el.type === "code")
// // // //                     return (
// // // //                       <div key={el.id} className="post-code">
// // // //                         <pre><code>{el.content}</code></pre>
// // // //                       </div>
// // // //                     );
// // // //                   if (el.type === "image") {
// // // //                     const src = el.imagePreview || el.url;
// // // //                     if (!src) return null;
// // // //                     return (
// // // //                       <div key={el.id} className="post-image">
// // // //                         <img
// // // //                           src={src}
// // // //                           alt={el.imageName || "image"}
// // // //                           className="feed-image"
// // // //                           loading="lazy"
// // // //                         />
// // // //                       </div>
// // // //                     );
// // // //                   }
// // // //                   return null;
// // // //                 })}
// // // //               </div>

// // // //               <TagChips tags={p.tags} />

// // // //               <div className="post-actions" style={{ marginTop: 8, display: "flex", gap: 8 }}>
// // // //                 <button
// // // //                   disabled={repostingIds.includes(p.id)}
// // // //                   onClick={async () => {
// // // //                     try {
// // // //                       setRepostingIds((s) => [...s, p.id]);
// // // //                       await repostPost(p.id);
// // // //                       alert("Reposted!");
// // // //                     } catch (e) {
// // // //                       alert(e.message || "Repost failed");
// // // //                     } finally {
// // // //                       setRepostingIds((s) => s.filter((x) => x !== p.id));
// // // //                     }
// // // //                   }}
// // // //                   className="btn"
// // // //                 >
// // // //                   🔁 Repost
// // // //                 </button>

// // // //                 {canDeletePost() && (
// // // //                   <button className="btn danger" onClick={() => handleDelete(p)}>🗑️ Delete</button>
// // // //                 )}
// // // //               </div>

// // // //               <div style={{ marginTop: 12 }}>
// // // //                 <CommentsSection postId={p.id} />
// // // //               </div>
// // // //             </article>
// // // //           ))
// // // //         )}
// // // //       </main>
// // // //     </div>
// // // //   );
// // // // }


// // // // import React, { useEffect, useState, useCallback, useMemo } from "react";
// // // // import { useNavigate, useLocation } from "react-router-dom";
// // // // import { clearToken, fetchMe, getToken as getStoredToken } from "../../Services/AuthService";
// // // // import { repostPost } from "../../Services/repostService";
// // // // import { deletePostAsManager } from "../../Services/postsService";
// // // // import "./Feed.css";
// // // // import CommentsSection from "../CommentsSection/CommentsSection";
// // // // import TagChips from "../Tags/TagChips";

// // // // const API_BASE =
// // // //   import.meta.env.VITE_API_BASE_URL ||
// // // //   import.meta.env.VITE_API ||
// // // //   "http://localhost:5294";

// // // // export default function Feed() {
// // // //   const [user, setUser] = useState(null);
// // // //   const [posts, setPosts] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [repostingIds, setRepostingIds] = useState([]);

// // // //   const navigate = useNavigate();
// // // //   const location = useLocation();

// // // //   // read filters from URL (set by Navbar)
// // // //   const urlParams = new URLSearchParams(location.search);
// // // //   const qParam = (urlParams.get("q") || "").toLowerCase();
// // // //   const deptParam = urlParams.get("dept") || "all";

// // // //   const loadPosts = useCallback(async () => {
// // // //     try {
// // // //       const headers = { "Content-Type": "application/json" };
// // // //       const token = getStoredToken();
// // // //       if (token) headers.Authorization = `Bearer ${token}`;
// // // //       const res = await fetch(`${API_BASE}/api/Posts`, { method: "GET", headers });
// // // //       if (res.status === 401) {
// // // //         clearToken();
// // // //         navigate("/login", { replace: true });
// // // //         return [];
// // // //       }
// // // //       if (!res.ok) {
// // // //         console.warn("Failed to load posts:", res.status);
// // // //         return [];
// // // //       }
// // // //       const data = await res.json();
// // // //       const arr = Array.isArray(data) ? data : data?.posts ?? [];
// // // //       return normalizePostsArray(arr);
// // // //     } catch (err) {
// // // //       console.warn("loadPosts error:", err);
// // // //       return [];
// // // //     }
// // // //   }, [navigate]);

// // // //   function normalizePostsArray(arr) {
// // // //     return (arr || []).map((p, idx) => {
// // // //       const title = p.title ?? p.Title ?? "";
// // // //       const rawBody = p.body ?? p.Body ?? "";
// // // //       let elements = [];
// // // //       try {
// // // //         const parsed = rawBody ? JSON.parse(rawBody) : [];
// // // //         elements = Array.isArray(parsed)
// // // //           ? parsed.map((el, i) => ({
// // // //               id: el.id ?? `${p.postId ?? p.PostId ?? idx}-${i}`,
// // // //               type: (el.type ?? "text").toString().toLowerCase(),
// // // //               content: el.content ?? el.body ?? "",
// // // //               imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
// // // //               imageName: el.imageName ?? "",
// // // //             }))
// // // //           : [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
// // // //       } catch {
// // // //         elements = [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
// // // //       }

// // // //       const tags =
// // // //         p.tags ??
// // // //         p.Tags ??
// // // //         (p.postTags ?? p.PostTags)?.map((pt) => {
// // // //           const tag = pt.tag ?? pt.Tag;
// // // //           return {
// // // //             TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
// // // //             TagName: tag?.tagName ?? tag?.TagName ?? pt.tagName ?? pt.TagName,
// // // //             DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
// // // //           };
// // // //         }) ?? [];

// // // //       const likeCount = p.upvoteCount ?? p.UpvoteCount ?? 0;
// // // //       const dislikeCount = p.downvoteCount ?? p.DownvoteCount ?? 0;
// // // //       const userVote = p.userVote ?? p.UserVote ?? 0;

// // // //       const departmentName =
// // // //         p.departmentName ??
// // // //         p.DepartmentName ??
// // // //         p?.Dept?.DeptName ??
// // // //         "";

// // // //       return {
// // // //         id: p.postId ?? p.PostId ?? `${idx}-${Date.now()}`,
// // // //         title,
// // // //         elements,
// // // //         tags,
// // // //         createdAt: p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
// // // //         authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
// // // //         departmentName,
// // // //         likeCount,
// // // //         dislikeCount,
// // // //         userVote,
// // // //         raw: p,
// // // //       };
// // // //     });
// // // //   }

// // // //   useEffect(() => {
// // // //     (async () => {
// // // //       setLoading(true);
// // // //       try {
// // // //         const [me, postsList] = await Promise.all([
// // // //           fetchMe().catch(() => null),
// // // //           loadPosts(),
// // // //         ]);
// // // //         if (!me) {
// // // //           clearToken();
// // // //           navigate("/login", { replace: true });
// // // //           return;
// // // //         }
// // // //         setUser(me);
// // // //         setPosts(postsList);

// // // //         // Build unique department list and share with Navbar
// // // //         const depts = Array.from(
// // // //           new Set((postsList || []).map((x) => x.departmentName).filter(Boolean))
// // // //         ).sort();
// // // //         try {
// // // //           localStorage.setItem("deptOptions", JSON.stringify(depts));
// // // //         } catch {}
// // // //       } catch (err) {
// // // //         clearToken();
// // // //         navigate("/login", { replace: true });
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     })();
// // // //   }, [navigate, loadPosts]);

// // // //   // filters coming from URL (set by Navbar)
// // // //   const filteredPosts = useMemo(() => {
// // // //     const q = (qParam || "").trim();
// // // //     const dept = (deptParam || "all").toLowerCase();

// // // //     return posts.filter((p) => {
// // // //       if (dept !== "all" && (p.departmentName || "").toLowerCase() !== dept) return false;
// // // //       if (!q) return true;
// // // //       const inTitle = (p.title || "").toLowerCase().includes(q);
// // // //       const inText = (p.elements || []).some(
// // // //         (el) => el.type === "text" && (el.content || "").toLowerCase().includes(q)
// // // //       );
// // // //       return inTitle || inText;
// // // //     });
// // // //   }, [posts, qParam, deptParam]);

// // // //   // Manager can see delete; server still enforces same-dept rule
// // // //   const canDeletePost = () =>
// // // //     String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

// // // //   async function handleDelete(p) {
// // // //     const reason = prompt("Enter reason for deleting this post (required):");
// // // //     if (!reason || !reason.trim()) return;
// // // //     try {
// // // //       await deletePostAsManager(p.id, reason.trim());
// // // //       setPosts((prev) => prev.filter((x) => x.id !== p.id));
// // // //       alert("Deleted.");
// // // //     } catch (e) {
// // // //       alert(e.message || "Delete failed");
// // // //     }
// // // //   }

// // // //   if (loading) return <div className="loading">Loading...</div>;

// // // //   const fmt = (ts) => {
// // // //     const d = new Date(ts);
// // // //     return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// // // //   };

// // // //   return (
// // // //     <div className="feed-page">
// // // //       {/* No toolbar here anymore — it's in Navbar to sit beside the hamburger */}
// // // //       <main className="feed-main" style={{ padding: 16 }}>
// // // //         {filteredPosts.length === 0 ? (
// // // //           <div className="no-posts">No matching posts.</div>
// // // //         ) : (
// // // //           filteredPosts.map((p) => (
// // // //             <article key={`${p.id}`} className="post-item">
// // // //               <header className="post-header">
// // // //                 <h2 className="post-title">{p.title || "Untitled Post"}</h2>
// // // //                 <div className="post-meta">
// // // //                   <span className="author">👤 <strong>{p.authorName}</strong></span>
// // // //                   <span className="timestamp">📅 {fmt(p.createdAt)}</span>
// // // //                   {p.departmentName ? <span className="dept">🏢 {p.departmentName}</span> : null}
// // // //                 </div>
// // // //               </header>

// // // //               <div className="post-content">
// // // //                 {(p.elements || []).map((el) => {
// // // //                   if (el.type === "text")
// // // //                     return (
// // // //                       <div key={el.id} className="post-text">
// // // //                         <p>{el.content}</p>
// // // //                       </div>
// // // //                     );
// // // //                   if (el.type === "code")
// // // //                     return (
// // // //                       <div key={el.id} className="post-code">
// // // //                         <pre><code>{el.content}</code></pre>
// // // //                       </div>
// // // //                     );
// // // //                   if (el.type === "image") {
// // // //                     const src = el.imagePreview || el.url;
// // // //                     if (!src) return null;
// // // //                     return (
// // // //                       <div key={el.id} className="post-image">
// // // //                         <img
// // // //                           src={src}
// // // //                           alt={el.imageName || "image"}
// // // //                           className="feed-image"
// // // //                           loading="lazy"
// // // //                         />
// // // //                       </div>
// // // //                     );
// // // //                   }
// // // //                   return null;
// // // //                 })}
// // // //               </div>

// // // //               <TagChips tags={p.tags} />

// // // //               <div className="post-actions" style={{ marginTop: 8, display: "flex", gap: 8 }}>
// // // //                 <button
// // // //                   disabled={repostingIds.includes(p.id)}
// // // //                   onClick={async () => {
// // // //                     try {
// // // //                       setRepostingIds((s) => [...s, p.id]);
// // // //                       await repostPost(p.id);
// // // //                       alert("Reposted!");
// // // //                     } catch (e) {
// // // //                       alert(e.message || "Repost failed");
// // // //                     } finally {
// // // //                       setRepostingIds((s) => s.filter((x) => x !== p.id));
// // // //                     }
// // // //                   }}
// // // //                   className="btn"
// // // //                 >
// // // //                   🔁 Repost
// // // //                 </button>

// // // //                 {canDeletePost() && (
// // // //                   <button className="btn danger" onClick={() => handleDelete(p)}>🗑️ Delete</button>
// // // //                 )}
// // // //               </div>

// // // //               <div style={{ marginTop: 12 }}>
// // // //                 <CommentsSection postId={p.id} />
// // // //               </div>
// // // //             </article>
// // // //           ))
// // // //         )}
// // // //       </main>
// // // //     </div>
// // // //   );
// // // // }

// // // import React, { useEffect, useState, useCallback, useMemo } from "react";
// // // import { useNavigate, useLocation } from "react-router-dom";
// // // import { clearToken, fetchMe, getToken as getStoredToken } from "../../Services/AuthService";
// // // import { repostPost } from "../../Services/repostService";
// // // import { deletePostAsManager } from "../../Services/postsService";
// // // import "./Feed.css";
// // // import CommentsSection from "../CommentsSection/CommentsSection";
// // // import TagChips from "../Tags/TagChips";

// // // const API_BASE =
// // //   import.meta.env.VITE_API_BASE_URL ||
// // //   import.meta.env.VITE_API ||
// // //   "http://localhost:5294";

// // // export default function Feed() {
// // //   const [user, setUser] = useState(null);
// // //   const [posts, setPosts] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [repostingIds, setRepostingIds] = useState([]);

// // //   const navigate = useNavigate();
// // //   const location = useLocation();

// // //   // Read filters from URL (Navbar writes them)
// // //   const urlParams = new URLSearchParams(location.search);
// // //   const qParam = (urlParams.get("q") || "").toLowerCase();
// // //   const deptParam = urlParams.get("dept") || "all";

// // //   const loadPosts = useCallback(async () => {
// // //     try {
// // //       const headers = { "Content-Type": "application/json" };
// // //       const token = getStoredToken();
// // //       if (token) headers.Authorization = `Bearer ${token}`;
// // //       const res = await fetch(`${API_BASE}/api/Posts`, { method: "GET", headers });
// // //       if (res.status === 401) {
// // //         clearToken();
// // //         navigate("/login", { replace: true });
// // //         return [];
// // //       }
// // //       if (!res.ok) return [];
// // //       const data = await res.json();
// // //       const arr = Array.isArray(data) ? data : data?.posts ?? [];
// // //       return normalizePostsArray(arr);
// // //     } catch {
// // //       return [];
// // //     }
// // //   }, [navigate]);

// // //   function normalizePostsArray(arr) {
// // //     return (arr || []).map((p, idx) => {
// // //       const title = p.title ?? p.Title ?? "";
// // //       const rawBody = p.body ?? p.Body ?? "";
// // //       let elements = [];
// // //       try {
// // //         const parsed = rawBody ? JSON.parse(rawBody) : [];
// // //         elements = Array.isArray(parsed)
// // //           ? parsed.map((el, i) => ({
// // //               id: el.id ?? `${p.postId ?? p.PostId ?? idx}-${i}`,
// // //               type: (el.type ?? "text").toString().toLowerCase(),
// // //               content: el.content ?? el.body ?? "",
// // //               imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
// // //               imageName: el.imageName ?? "",
// // //             }))
// // //           : [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
// // //       } catch {
// // //         elements = [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
// // //       }

// // //       const tags =
// // //         p.tags ??
// // //         p.Tags ??
// // //         (p.postTags ?? p.PostTags)?.map((pt) => {
// // //           const tag = pt.tag ?? pt.Tag;
// // //           return {
// // //             TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
// // //             TagName: tag?.tagName ?? tag?.TagName ?? pt.tagName ?? pt.TagName,
// // //             DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
// // //           };
// // //         }) ?? [];

// // //       const departmentName =
// // //         p.departmentName ??
// // //         p.DepartmentName ??
// // //         p?.Dept?.DeptName ?? "";

// // //       return {
// // //         id: p.postId ?? p.PostId ?? `${idx}-${Date.now()}`,
// // //         title,
// // //         elements,
// // //         tags,
// // //         createdAt: p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
// // //         authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
// // //         departmentName,
// // //         likeCount: p.upvoteCount ?? p.UpvoteCount ?? 0,
// // //         dislikeCount: p.downvoteCount ?? p.DownvoteCount ?? 0,
// // //         userVote: p.userVote ?? p.UserVote ?? 0,
// // //         raw: p,
// // //       };
// // //     });
// // //   }

// // //   useEffect(() => {
// // //     (async () => {
// // //       setLoading(true);
// // //       try {
// // //         const [me, postsList] = await Promise.all([
// // //           fetchMe().catch(() => null),
// // //           loadPosts(),
// // //         ]);
// // //         if (!me) {
// // //           clearToken();
// // //           navigate("/login", { replace: true });
// // //           return;
// // //         }
// // //         setUser(me);
// // //         setPosts(postsList);

// // //         // Publish department names so Navbar can populate its dropdown
// // //         const depts = Array.from(
// // //           new Set((postsList || []).map((x) => x.departmentName).filter(Boolean))
// // //         ).sort();
// // //         try { localStorage.setItem("deptOptions", JSON.stringify(depts)); } catch {}
// // //       } catch {
// // //         clearToken();
// // //         navigate("/login", { replace: true });
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     })();
// // //   }, [navigate, loadPosts]);

// // //   const canDeletePost = () =>
// // //     String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

// // //   async function handleDelete(p) {
// // //     const reason = prompt("Enter reason for deleting this post (required):");
// // //     if (!reason || !reason.trim()) return;
// // //     try {
// // //       await deletePostAsManager(p.id, reason.trim());
// // //       setPosts((prev) => prev.filter((x) => x.id !== p.id));
// // //       alert("Deleted.");
// // //     } catch (e) {
// // //       alert(e.message || "Delete failed");
// // //     }
// // //   }

// // //   // Filter with URL params (from Navbar)
// // //   const filteredPosts = useMemo(() => {
// // //     const q = qParam.trim();
// // //     const dept = (deptParam || "all").toLowerCase();
// // //     return posts.filter((p) => {
// // //       if (dept !== "all" && (p.departmentName || "").toLowerCase() !== dept) return false;
// // //       if (!q) return true;
// // //       const inTitle = (p.title || "").toLowerCase().includes(q);
// // //       const inText = (p.elements || []).some(
// // //         (el) => el.type === "text" && (el.content || "").toLowerCase().includes(q)
// // //       );
// // //       return inTitle || inText;
// // //     });
// // //   }, [posts, qParam, deptParam]);

// // //   if (loading) return <div className="loading">Loading...</div>;

// // //   const fmt = (ts) => {
// // //     const d = new Date(ts);
// // //     return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// // //   };

// // //   return (
// // //     <div className="feed-page">
// // //       {/* No toolbar here anymore — it’s in the Navbar */}

// // //       <main className="feed-main" style={{ padding: 16 }}>
// // //         {filteredPosts.length === 0 ? (
// // //           <div className="no-posts">No matching posts.</div>
// // //         ) : (
// // //           filteredPosts.map((p) => (
// // //             <article key={`${p.id}`} className="post-item">
// // //               <header className="post-header">
// // //                 <h2 className="post-title">{p.title || "Untitled Post"}</h2>
// // //                 <div className="post-meta">
// // //                   <span className="author">👤 <strong>{p.authorName}</strong></span>
// // //                   <span className="timestamp">📅 {fmt(p.createdAt)}</span>
// // //                   {p.departmentName ? <span className="dept">🏢 {p.departmentName}</span> : null}
// // //                 </div>
// // //               </header>

// // //               <div className="post-content">
// // //                 {(p.elements || []).map((el) => {
// // //                   if (el.type === "text")
// // //                     return (
// // //                       <div key={el.id} className="post-text">
// // //                         <p>{el.content}</p>
// // //                       </div>
// // //                     );
// // //                   if (el.type === "code")
// // //                     return (
// // //                       <div key={el.id} className="post-code">
// // //                         <pre><code>{el.content}</code></pre>
// // //                       </div>
// // //                     );
// // //                   if (el.type === "image") {
// // //                     const src = el.imagePreview || el.url;
// // //                     if (!src) return null;
// // //                     return (
// // //                       <div key={el.id} className="post-image">
// // //                         <img src={src} alt={el.imageName || "image"} className="feed-image" loading="lazy" />
// // //                       </div>
// // //                     );
// // //                   }
// // //                   return null;
// // //                 })}
// // //               </div>

// // //               <TagChips tags={p.tags} />

// // //               <div className="post-actions" style={{ marginTop: 8, display: "flex", gap: 8 }}>
// // //                 <button
// // //                   disabled={repostingIds.includes(p.id)}
// // //                   onClick={async () => {
// // //                     try {
// // //                       setRepostingIds((s) => [...s, p.id]);
// // //                       await repostPost(p.id);
// // //                       alert("Reposted!");
// // //                     } catch (e) {
// // //                       alert(e.message || "Repost failed");
// // //                     } finally {
// // //                       setRepostingIds((s) => s.filter((x) => x !== p.id));
// // //                     }
// // //                   }}
// // //                   className="btn"
// // //                 >
// // //                   🔁 Repost
// // //                 </button>

// // //                 {canDeletePost() && (
// // //                   <button className="btn danger" onClick={() => handleDelete(p)}>🗑️ Delete</button>
// // //                 )}
// // //               </div>

// // //               <div style={{ marginTop: 12 }}>
// // //                 <CommentsSection postId={p.id} />
// // //               </div>
// // //             </article>
// // //           ))
// // //         )}
// // //       </main>
// // //     </div>
// // //   );
// // // }

// // import React, { useEffect, useState, useCallback, useMemo } from "react";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import { clearToken, fetchMe, getToken as getStoredToken } from "../../Services/AuthService";
// // import { repostPost } from "../../Services/repostService";
// // import { deletePostAsManager, votePost } from "../../Services/postsService";
// // import "./Feed.css";
// // import CommentsSection from "../CommentsSection/CommentsSection";
// // import TagChips from "../Tags/TagChips";

// // const API_BASE =
// //   import.meta.env.VITE_API_BASE_URL ||
// //   import.meta.env.VITE_API ||
// //   "http://localhost:5294";

// // export default function Feed() {
// //   const [user, setUser] = useState(null);
// //   const [posts, setPosts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [repostingIds, setRepostingIds] = useState([]);

// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   // Read filters from URL (Navbar writes them)
// //   const urlParams = new URLSearchParams(location.search);
// //   const qParam = (urlParams.get("q") || "").toLowerCase();
// //   const deptParam = urlParams.get("dept") || "all";

// //   const loadPosts = useCallback(async () => {
// //     try {
// //       const headers = { "Content-Type": "application/json" };
// //       const token = getStoredToken();
// //       if (token) headers.Authorization = `Bearer ${token}`;
// //       const res = await fetch(`${API_BASE}/api/Posts`, { method: "GET", headers });
// //       if (res.status === 401) {
// //         clearToken();
// //         navigate("/login", { replace: true });
// //         return [];
// //       }
// //       if (!res.ok) return [];
// //       const data = await res.json();
// //       const arr = Array.isArray(data) ? data : data?.posts ?? [];
// //       return normalizePostsArray(arr);
// //     } catch {
// //       return [];
// //     }
// //   }, [navigate]);

// //   function normalizePostsArray(arr) {
// //     return (arr || []).map((p, idx) => {
// //       const title = p.title ?? p.Title ?? "";
// //       const rawBody = p.body ?? p.Body ?? "";
// //       let elements = [];
// //       try {
// //         const parsed = rawBody ? JSON.parse(rawBody) : [];
// //         elements = Array.isArray(parsed)
// //           ? parsed.map((el, i) => ({
// //               id: el.id ?? `${p.postId ?? p.PostId ?? idx}-${i}`,
// //               type: (el.type ?? "text").toString().toLowerCase(),
// //               content: el.content ?? el.body ?? "",
// //               imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
// //               imageName: el.imageName ?? "",
// //             }))
// //           : [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
// //       } catch {
// //         elements = [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
// //       }

// //       const tags =
// //         p.tags ??
// //         p.Tags ??
// //         (p.postTags ?? p.PostTags)?.map((pt) => {
// //           const tag = pt.tag ?? pt.Tag;
// //           return {
// //             TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
// //             TagName: tag?.tagName ?? tag?.TagName ?? pt.tagName ?? pt.TagName,
// //             DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
// //           };
// //         }) ?? [];

// //       const departmentName =
// //         p.departmentName ??
// //         p.DepartmentName ??
// //         p?.Dept?.DeptName ?? "";

// //       return {
// //         id: p.postId ?? p.PostId ?? `${idx}-${Date.now()}`,
// //         title,
// //         elements,
// //         tags,
// //         createdAt: p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
// //         authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
// //         departmentName,
// //         likeCount: p.upvoteCount ?? p.UpvoteCount ?? 0,
// //         dislikeCount: p.downvoteCount ?? p.DownvoteCount ?? 0,
// //         userVote: p.userVote ?? p.UserVote ?? 0, // -1, 0, +1
// //         raw: p,
// //       };
// //     });
// //   }

// //   useEffect(() => {
// //     (async () => {
// //       setLoading(true);
// //       try {
// //         const [me, postsList] = await Promise.all([
// //           fetchMe().catch(() => null),
// //           loadPosts(),
// //         ]);
// //         if (!me) {
// //           clearToken();
// //           navigate("/login", { replace: true });
// //           return;
// //         }
// //         setUser(me);
// //         setPosts(postsList);

// //         // Publish department names so Navbar can populate its dropdown
// //         const depts = Array.from(
// //           new Set((postsList || []).map((x) => x.departmentName).filter(Boolean))
// //         ).sort();
// //         try { localStorage.setItem("deptOptions", JSON.stringify(depts)); } catch {}
// //       } catch {
// //         clearToken();
// //         navigate("/login", { replace: true });
// //       } finally {
// //         setLoading(false);
// //       }
// //     })();
// //   }, [navigate, loadPosts]);

// //   const canDeletePost = () =>
// //     String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

// //   async function handleDelete(p) {
// //     const reason = prompt("Enter reason for deleting this post (required):");
// //     if (!reason || !reason.trim()) return;
// //     try {
// //       await deletePostAsManager(p.id, reason.trim());
// //       setPosts((prev) => prev.filter((x) => x.id !== p.id));
// //       alert("Deleted.");
// //     } catch (e) {
// //       alert(e.message || "Delete failed");
// //     }
// //   }

// //   /** 👍/👎 voting with optimistic update */
// //   async function handleVote(postId, voteVal) {
// //     setPosts((prev) =>
// //       prev.map((p) => {
// //         if (p.id !== postId) return p;

// //         // compute optimistic numbers based on current vote
// //         const prevVote = p.userVote || 0;
// //         let like = p.likeCount || 0;
// //         let dislike = p.dislikeCount || 0;
// //         let nextVote = voteVal;

// //         if (prevVote === voteVal) {
// //           // clicking the same vote clears it
// //           nextVote = 0;
// //           if (voteVal === 1) like = Math.max(0, like - 1);
// //           if (voteVal === -1) dislike = Math.max(0, dislike - 1);
// //         } else {
// //           // switching or adding
// //           if (voteVal === 1) {
// //             like += 1;
// //             if (prevVote === -1) dislike = Math.max(0, dislike - 1);
// //           } else if (voteVal === -1) {
// //             dislike += 1;
// //             if (prevVote === 1) like = Math.max(0, like - 1);
// //           } else if (voteVal === 0) {
// //             // explicit clear (not used from UI directly)
// //             if (prevVote === 1) like = Math.max(0, like - 1);
// //             if (prevVote === -1) dislike = Math.max(0, dislike - 1);
// //           }
// //         }

// //         return { ...p, likeCount: like, dislikeCount: dislike, userVote: nextVote };
// //       })
// //     );

// //     try {
// //       const result = await votePost(postId, voteVal === (posts.find(x => x.id === postId)?.userVote) ? 0 : voteVal);
// //       // if backend returns the updated post, sync from it
// //       if (result && typeof result === "object") {
// //         setPosts((prev) =>
// //           prev.map((p) => (p.id === postId
// //             ? {
// //                 ...p,
// //                 likeCount: result.upvoteCount ?? result.likeCount ?? p.likeCount,
// //                 dislikeCount: result.downvoteCount ?? result.dislikeCount ?? p.dislikeCount,
// //                 userVote: result.userVote ?? p.userVote,
// //               }
// //             : p))
// //         );
// //       }
// //     } catch (err) {
// //       // revert on failure: reload this post from current backend list
// //       alert(err.message || "Vote failed");
// //       // simplest revert: reload all posts
// //       try {
// //         const fresh = await loadPosts();
// //         setPosts(fresh);
// //       } catch {}
// //     }
// //   }

// //   // Filter with URL params (from Navbar)
// //   const filteredPosts = useMemo(() => {
// //     const q = qParam.trim();
// //     const dept = (deptParam || "all").toLowerCase();
// //     return posts.filter((p) => {
// //       if (dept !== "all" && (p.departmentName || "").toLowerCase() !== dept) return false;
// //       if (!q) return true;
// //       const inTitle = (p.title || "").toLowerCase().includes(q);
// //       const inText = (p.elements || []).some(
// //         (el) => el.type === "text" && (el.content || "").toLowerCase().includes(q)
// //       );
// //       return inTitle || inText;
// //     });
// //   }, [posts, qParam, deptParam]);

// //   if (loading) return <div className="loading">Loading...</div>;

// //   const fmt = (ts) => {
// //     const d = new Date(ts);
// //     return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// //   };

// //   return (
// //     <div className="feed-page">
// //       <main className="feed-main" style={{ padding: 16 }}>
// //         {filteredPosts.length === 0 ? (
// //           <div className="no-posts">No matching posts.</div>
// //         ) : (
// //           filteredPosts.map((p) => (
// //             <article key={`${p.id}`} className="post-item">
// //               <header className="post-header">
// //                 <h2 className="post-title">{p.title || "Untitled Post"}</h2>
// //                 <div className="post-meta">
// //                   <span className="author">👤 <strong>{p.authorName}</strong></span>
// //                   <span className="timestamp">📅 {fmt(p.createdAt)}</span>
// //                   {p.departmentName ? <span className="dept">🏢 {p.departmentName}</span> : null}
// //                 </div>
// //               </header>

// //               <div className="post-content">
// //                 {(p.elements || []).map((el) => {
// //                   if (el.type === "text")
// //                     return (
// //                       <div key={el.id} className="post-text">
// //                         <p>{el.content}</p>
// //                       </div>
// //                     );
// //                   if (el.type === "code")
// //                     return (
// //                       <div key={el.id} className="post-code">
// //                         <pre><code>{el.content}</code></pre>
// //                       </div>
// //                     );
// //                   if (el.type === "image") {
// //                     const src = el.imagePreview || el.url;
// //                     if (!src) return null;
// //                     return (
// //                       <div key={el.id} className="post-image">
// //                         <img src={src} alt={el.imageName || "image"} className="feed-image" loading="lazy" />
// //                       </div>
// //                     );
// //                   }
// //                   return null;
// //                 })}
// //               </div>

// //               <TagChips tags={p.tags} />

// //               {/* Vote + actions */}
// //               <div className="post-actions" style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
// //                 <div className="vote-group">
// //                   <button
// //                     className={`vote-btn like ${p.userVote === 1 ? "active-like" : ""}`}
// //                     onClick={() => handleVote(p.id, 1)}
// //                     title="Like"
// //                     aria-pressed={p.userVote === 1}
// //                   >
// //                     👍 <span className="count">{p.likeCount ?? 0}</span>
// //                   </button>
// //                   <button
// //                     className={`vote-btn dislike ${p.userVote === -1 ? "active-dislike" : ""}`}
// //                     onClick={() => handleVote(p.id, -1)}
// //                     title="Dislike"
// //                     aria-pressed={p.userVote === -1}
// //                   >
// //                     👎 <span className="count">{p.dislikeCount ?? 0}</span>
// //                   </button>
// //                 </div>

// //                 <button
// //                   disabled={repostingIds.includes(p.id)}
// //                   onClick={async () => {
// //                     try {
// //                       setRepostingIds((s) => [...s, p.id]);
// //                       await repostPost(p.id);
// //                       alert("Reposted!");
// //                     } catch (e) {
// //                       alert(e.message || "Repost failed");
// //                     } finally {
// //                       setRepostingIds((s) => s.filter((x) => x !== p.id));
// //                     }
// //                   }}
// //                   className="btn"
// //                 >
// //                   🔁 Repost
// //                 </button>

// //                 {canDeletePost() && (
// //                   <button className="btn danger" onClick={() => handleDelete(p)}>🗑️ Delete</button>
// //                 )}
// //               </div>

// //               <div style={{ marginTop: 12 }}>
// //                 <CommentsSection postId={p.id} />
// //               </div>
// //             </article>
// //           ))
// //         )}
// //       </main>
// //     </div>
// //   );
// // }

// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { clearToken, fetchMe, getToken as getStoredToken } from "../../Services/AuthService";
// import { repostPost } from "../../Services/repostService";
// import { deletePostAsManager } from "../../Services/postsService";
// import { votePost } from "../../Services/postsService"; // 👈 add
// import "./Feed.css";
// import CommentsSection from "../CommentsSection/CommentsSection";
// import TagChips from "../Tags/TagChips";

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL ||
//   import.meta.env.VITE_API ||
//   "http://localhost:5294";

// export default function Feed() {
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [repostingIds, setRepostingIds] = useState([]);

//   const navigate = useNavigate();
//   const location = useLocation();

//   // filters come from URL (Navbar writes ?q=&dept=)
//   const urlParams = new URLSearchParams(location.search);
//   const qParam = (urlParams.get("q") || "").toLowerCase();
//   const deptParam = urlParams.get("dept") || "all";

//   const loadPosts = useCallback(async () => {
//     try {
//       const headers = { "Content-Type": "application/json" };
//       const token = getStoredToken();
//       if (token) headers.Authorization = `Bearer ${token}`;
//       const res = await fetch(`${API_BASE}/api/Posts`, { method: "GET", headers });
//       if (res.status === 401) {
//         clearToken();
//         navigate("/login", { replace: true });
//         return [];
//       }
//       if (!res.ok) return [];
//       const data = await res.json();
//       const arr = Array.isArray(data) ? data : data?.posts ?? [];
//       return normalizePostsArray(arr);
//     } catch {
//       return [];
//     }
//   }, [navigate]);

//   function normalizePostsArray(arr) {
//     return (arr || []).map((p, idx) => {
//       const title = p.title ?? p.Title ?? "";
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
//         }) ?? [];

//       const departmentName =
//         p.departmentName ??
//         p.DepartmentName ??
//         p?.Dept?.DeptName ??
//         "";

//       return {
//         id: p.postId ?? p.PostId ?? `${idx}-${Date.now()}`,
//         title,
//         elements,
//         tags,
//         createdAt: p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
//         authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
//         departmentName,
//         // 👇 vote-related fields expected from backend
//         likeCount: p.upvoteCount ?? p.UpvoteCount ?? 0,
//         dislikeCount: p.downvoteCount ?? p.DownvoteCount ?? 0,
//         userVote: p.userVote ?? p.UserVote ?? 0, // -1, 0, +1
//         raw: p,
//       };
//     });
//   }

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const [me, postsList] = await Promise.all([
//           fetchMe().catch(() => null),
//           loadPosts(),
//         ]);
//         if (!me) {
//           clearToken();
//           navigate("/login", { replace: true });
//           return;
//         }
//         setUser(me);
//         setPosts(postsList);

//         // publish depts to localStorage for Navbar dropdown
//         const depts = Array.from(
//           new Set((postsList || []).map((x) => x.departmentName).filter(Boolean))
//         ).sort();
//         try { localStorage.setItem("deptOptions", JSON.stringify(depts)); } catch {}
//       } catch {
//         clearToken();
//         navigate("/login", { replace: true });
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [navigate, loadPosts]);

//   const canDeletePost = () =>
//     String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

//   async function handleDelete(p) {
//     const reason = prompt("Enter reason for deleting this post (required):");
//     if (!reason || !reason.trim()) return;
//     try {
//       await deletePostAsManager(p.id, reason.trim());
//       setPosts((prev) => prev.filter((x) => x.id !== p.id));
//       alert("Deleted.");
//     } catch (e) {
//       alert(e.message || "Delete failed");
//     }
//   }

//   // 🔥 Like/Dislike handler with optimistic update
//   async function handleVote(postId, nextValue) {
//     setPosts((prev) =>
//       prev.map((p) => {
//         if (p.id !== postId) return p;
//         const current = p.userVote; // -1,0,1
//         const final = nextValue === current ? 0 : nextValue; // clicking same toggles off

//         let like = p.likeCount;
//         let dislike = p.dislikeCount;

//         // remove old vote
//         if (current === 1) like -= 1;
//         if (current === -1) dislike -= 1;
//         // apply new vote
//         if (final === 1) like += 1;
//         if (final === -1) dislike += 1;

//         return { ...p, userVote: final, likeCount: like, dislikeCount: dislike };
//       })
//     );

//     try {
//       await votePost(postId, nextValue === 0 ? 0 : nextValue);
//       // no-op on success; UI already updated
//     } catch (err) {
//       // revert if server failed
//       alert(err.message || "Vote failed");
//       setPosts((prev) =>
//         prev.map((p) => {
//           if (p.id !== postId) return p;
//           // re-fetching one post would be ideal; for now, reload list
//           return p;
//         })
//       );
//       // optional: reload posts to be exact
//       try {
//         const fresh = await loadPosts();
//         setPosts(fresh);
//       } catch {}
//     }
//   }

//   // Filter using URL params
//   const filteredPosts = useMemo(() => {
//     const q = qParam.trim();
//     const dept = (deptParam || "all").toLowerCase();
//     return posts.filter((p) => {
//       if (dept !== "all" && (p.departmentName || "").toLowerCase() !== dept) return false;
//       if (!q) return true;
//       const inTitle = (p.title || "").toLowerCase().includes(q);
//       const inText = (p.elements || []).some(
//         (el) => el.type === "text" && (el.content || "").toLowerCase().includes(q)
//       );
//       return inTitle || inText;
//     });
//   }, [posts, qParam, deptParam]);

//   if (loading) return <div className="loading">Loading...</div>;

//   const fmt = (ts) => {
//     const d = new Date(ts);
//     return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   return (
//     <div className="feed-page">
//       <main className="feed-main" style={{ padding: 16 }}>
//         {filteredPosts.length === 0 ? (
//           <div className="no-posts">No matching posts.</div>
//         ) : (
//           filteredPosts.map((p) => (
//             <article key={`${p.id}`} className="post-item">
//               <header className="post-header">
//                 <h2 className="post-title">{p.title || "Untitled Post"}</h2>
//                 <div className="post-meta">
//                   <span className="author">👤 <strong>{p.authorName}</strong></span>
//                   <span className="timestamp">📅 {fmt(p.createdAt)}</span>
//                   {p.departmentName ? <span className="dept">🏢 {p.departmentName}</span> : null}
//                 </div>
//               </header>

//               <div className="post-content">
//                 {(p.elements || []).map((el) => {
//                   if (el.type === "text")
//                     return (
//                       <div key={el.id} className="post-text">
//                         <p>{el.content}</p>
//                       </div>
//                     );
//                   if (el.type === "code")
//                     return (
//                       <div key={el.id} className="post-code">
//                         <pre><code>{el.content}</code></pre>
//                       </div>
//                     );
//                   if (el.type === "image") {
//                     const src = el.imagePreview || el.url;
//                     if (!src) return null;
//                     return (
//                       <div key={el.id} className="post-image">
//                         <img src={src} alt={el.imageName || "image"} className="feed-image" loading="lazy" />
//                       </div>
//                     );
//                   }
//                   return null;
//                 })}
//               </div>

//               <TagChips tags={p.tags} />

//               {/* 👍/👎 vote bar */}
//               <div className="vote-bar">
//                 <button
//                   className={`vote-btn ${p.userVote === 1 ? "active up" : "up"}`}
//                   onClick={() => handleVote(p.id, 1)}
//                   title="Like"
//                 >
//                   👍 <span className="count">{p.likeCount}</span>
//                 </button>
//                 <button
//                   className={`vote-btn ${p.userVote === -1 ? "active down" : "down"}`}
//                   onClick={() => handleVote(p.id, -1)}
//                   title="Dislike"
//                 >
//                   👎 <span className="count">{p.dislikeCount}</span>
//                 </button>
//               </div>

//               {/* Actions */}
//               <div className="post-actions" style={{ marginTop: 8, display: "flex", gap: 8 }}>
//                 <button
//                   disabled={repostingIds.includes(p.id)}
//                   onClick={async () => {
//                     try {
//                       setRepostingIds((s) => [...s, p.id]);
//                       await repostPost(p.id);
//                       alert("Reposted!");
//                     } catch (e) {
//                       alert(e.message || "Repost failed");
//                     } finally {
//                       setRepostingIds((s) => s.filter((x) => x !== p.id));
//                     }
//                   }}
//                   className="btn"
//                 >
//                   🔁 Repost
//                 </button>

//                 {canDeletePost() && (
//                   <button className="btn danger" onClick={() => handleDelete(p)}>🗑️ Delete</button>
//                 )}
//               </div>

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

  // Read filters from URL (Navbar writes them)
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

      const departmentName =
        p.departmentName ??
        p.DepartmentName ??
        p?.Dept?.DeptName ?? "";

      return {
        id: p.postId ?? p.PostId ?? `${idx}-${Date.now()}`,
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
      };
    });
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [me, postsList] = await Promise.all([
          fetchMe().catch(() => null),
          loadPosts(),
        ]);
        if (!me) {
          clearToken();
          navigate("/login", { replace: true });
          return;
        }
        setUser(me);
        setPosts(postsList);

        // Publish department names so Navbar can populate its dropdown
        const depts = Array.from(
          new Set((postsList || []).map((x) => x.departmentName).filter(Boolean))
        ).sort();
        try { localStorage.setItem("deptOptions", JSON.stringify(depts)); } catch {}
      } catch {
        clearToken();
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, loadPosts]);

  const canDeletePost = () =>
    String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

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

  // NEW: Like/Dislike handler (uses /api/Votes/post/{postId})
  function handleVote(postId, value) {
    // value: +1 for like, -1 for dislike
    votePost(postId, value)
      .then((r) => {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
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

  // Filter with URL params (from Navbar)
  const filteredPosts = useMemo(() => {
    const q = qParam.trim();
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

  return (
    <div className="feed-page">
      {/* No toolbar here — it lives in Navbar now */}

      <main className="feed-main" style={{ padding: 16 }}>
        {filteredPosts.length === 0 ? (
          <div className="no-posts">No matching posts.</div>
        ) : (
          filteredPosts.map((p) => (
            <article key={`${p.id}`} className="post-item">
              <header className="post-header">
                <h2 className="post-title">{p.title || "Untitled Post"}</h2>
                <div className="post-meta">
                  <span className="author">👤 <strong>{p.authorName}</strong></span>
                  <span className="timestamp">📅 {fmt(p.createdAt)}</span>
                  {p.departmentName ? <span className="dept">🏢 {p.departmentName}</span> : null}
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
                {/* 👍 Like */}
                <button
                  className="btn"
                  aria-label="Like"
                  onClick={() => handleVote(p.id, +1)}
                  style={p.userVote === 1 ? { borderColor: "#2563eb", background: "#eff6ff" } : null}
                >
                  👍 {p.likeCount ?? 0}
                </button>

                {/* 👎 Dislike */}
                <button
                  className="btn"
                  aria-label="Dislike"
                  onClick={() => handleVote(p.id, -1)}
                  style={p.userVote === -1 ? { borderColor: "#ef4444", background: "#fef2f2" } : null}
                >
                  👎 {p.dislikeCount ?? 0}
                </button>

                {/* Repost */}
                <button
                  disabled={repostingIds.includes(p.id)}
                  onClick={async () => {
                    try {
                      setRepostingIds((s) => [...s, p.id]);
                      await repostPost(p.id);
                      alert("Reposted!");
                    } catch (e) {
                      alert(e.message || "Repost failed");
                    } finally {
                      setRepostingIds((s) => s.filter((x) => x !== p.id));
                    }
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
    </div>
  );
}
