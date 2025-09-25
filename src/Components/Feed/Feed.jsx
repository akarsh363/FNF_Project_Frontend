// // // src/Components/Feed/Feed.jsx
// // import React, { useEffect, useState, useCallback } from "react";
// // import { useNavigate, Link, useLocation } from "react-router-dom";
// // import { clearToken, fetchMe } from "../../Services/AuthService";
// // import { repostPost } from "../../Services/repostService";
// // import "./Feed.css";
// // import CommentsSection from "../CommentsSection/CommentsSection";

// // // API base (env var or fallback)
// // const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5294";

// // export default function Feed() {
// //   const [user, setUser] = useState(null);
// //   const [posts, setPosts] = useState([]); // normalized posts
// //   const [loading, setLoading] = useState(true);
// //   const [repostingIds, setRepostingIds] = useState([]); // track reposts in-flight
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   // try to read preloaded state from navigation (set during login)
// //   const preloadedUser = location.state?.preloadedUser ?? null;
// //   const preloadedPostsRaw = location.state?.preloadedPostsRaw ?? null;

// //   // Helper: get token from localStorage (tries multiple common keys)
// //   const getTokenFromStorage = () => {
// //     return (
// //       localStorage.getItem("authToken") ||
// //       localStorage.getItem("token") ||
// //       localStorage.getItem("accessToken") ||
// //       null
// //     );
// //   };

// //   // ---- loadPosts (fixed, returns normalized posts array) ----
// //   const loadPosts = useCallback(async () => {
// //     try {
// //       const token = getTokenFromStorage();
// //       const headers = { "Content-Type": "application/json" };
// //       if (token) headers.Authorization = `Bearer ${token}`;

// //       const res = await fetch(`${API_BASE}/api/Posts`, {
// //         method: "GET",
// //         headers,
// //       });

// //       if (res.status === 401) {
// //         clearToken();
// //         navigate("/login", { replace: true });
// //         return [];
// //       }

// //       if (!res.ok) {
// //         const txt = await res.text();
// //         console.warn("Failed to load posts, status:", res.status, "body:", txt);
// //         return [];
// //       }

// //       const data = await res.json();
// //       const arr = Array.isArray(data) ? data : data?.posts ?? [];
// //       return normalizePostsArray(arr);
// //     } catch (err) {
// //       console.warn("loadPosts error:", err);
// //       return [];
// //     }
// //   }, [navigate]);

// //   // helper to convert raw server posts array -> normalized structure Feed expects
// //   function normalizePostsArray(arr) {
// //     return (arr || []).map((p, idx) => {
// //       const title = p.title ?? p.Title ?? "";
// //       const rawBody = p.body ?? p.Body ?? "";
// //       let elements = [];
// //       try {
// //         const parsed = rawBody ? JSON.parse(rawBody) : [];
// //         if (Array.isArray(parsed)) {
// //           elements = parsed.map((el, i) => ({
// //             id: el.id ?? `${p.postId ?? p.PostId ?? idx}-${i}`,
// //             type: (el.type ?? "text").toString().toLowerCase(),
// //             content: el.content ?? el.body ?? "",
// //             imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
// //             imageName: el.imageName ?? "",
// //           }));
// //         } else {
// //           elements = [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
// //         }
// //       } catch {
// //         elements = [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
// //       }

// //       const likeCount = p.upvoteCount ?? p.UpvoteCount ?? p.likeCount ?? p.LikeCount ?? 0;
// //       const dislikeCount = p.downvoteCount ?? p.DownvoteCount ?? p.dislikeCount ?? p.DislikeCount ?? 0;
// //       const userVote = p.userVote ?? p.UserVote ?? 0;

// //       return {
// //         id: p.postId ?? p.PostId ?? `${idx}-${Date.now()}`,
// //         title,
// //         elements,
// //         createdAt: p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
// //         authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
// //         likeCount,
// //         dislikeCount,
// //         userVote,
// //         raw: p,
// //       };
// //     });
// //   }

// //   // ---- init (uses preloaded state if available, otherwise fetches in parallel) ----
// //   useEffect(() => {
// //     async function init() {
// //       setLoading(true);

// //       // If router passed preloaded state from Login, use it immediately
// //       if (preloadedUser || preloadedPostsRaw) {
// //         try {
// //           if (preloadedUser) setUser(preloadedUser);
// //           if (preloadedPostsRaw) {
// //             const normalized = Array.isArray(preloadedPostsRaw)
// //               ? normalizePostsArray(Array.isArray(preloadedPostsRaw) ? preloadedPostsRaw : preloadedPostsRaw.posts ?? [])
// //               : [];
// //             setPosts(normalized);
// //           }
// //         } finally {
// //           setLoading(false);
// //           return;
// //         }
// //       }

// //       // otherwise do parallel fetch of me + posts
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
// //       } catch (err) {
// //         console.error("Init failed:", err);
// //         clearToken();
// //         navigate("/login", { replace: true });
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     init();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [navigate, loadPosts, preloadedUser, preloadedPostsRaw]);

// //   function handleLogout() {
// //     clearToken();
// //     navigate("/login", { replace: true });
// //   }

// //   const formatTimestamp = (timestamp) => {
// //     const d = new Date(timestamp);
// //     return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// //   };

// //   // Vote a post (same optimistic update + reconcile logic)
// //   const voteOnPost = async (postId, voteType) => {
// //     const token = getTokenFromStorage();
// //     if (!token) {
// //       alert("Please log in to vote.");
// //       return;
// //     }

// //     // Optimistic update
// //     setPosts((prev) =>
// //       prev.map((p) => {
// //         if (p.id !== postId) return p;
// //         const prevUser = p.userVote || 0;
// //         const intended = voteType.toLowerCase() === "upvote" ? 1 : -1;
// //         let newUserVote;
// //         if (prevUser === intended) newUserVote = 0; // toggle off
// //         else newUserVote = intended; // set or switch

// //         const likeDelta = (newUserVote === 1 ? 1 : 0) - (prevUser === 1 ? 1 : 0);
// //         const dislikeDelta = (newUserVote === -1 ? 1 : 0) - (prevUser === -1 ? 1 : 0);

// //         return {
// //           ...p,
// //           likeCount: Math.max(0, (p.likeCount || 0) + likeDelta),
// //           dislikeCount: Math.max(0, (p.dislikeCount || 0) + dislikeDelta),
// //           userVote: newUserVote,
// //         };
// //       })
// //     );

// //     try {
// //       const res = await fetch(`${API_BASE}/api/Votes/post/${postId}`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${getTokenFromStorage()}`,
// //         },
// //         body: JSON.stringify({ voteType }),
// //       });

// //       if (!res.ok) {
// //         console.error("Vote failed:", res.status);
// //         setPosts(await loadPosts()); // revert by reloading
// //         alert("Failed to register vote. Please try again.");
// //         return;
// //       }

// //       const data = await res.json();

// //       // Reconcile with server result
// //       setPosts((prev) =>
// //         prev.map((p) =>
// //           p.id === postId
// //             ? {
// //                 ...p,
// //                 likeCount: data.likeCount ?? p.likeCount,
// //                 dislikeCount: data.dislikeCount ?? p.dislikeCount,
// //                 userVote: data.userVote ?? p.userVote,
// //               }
// //             : p
// //         )
// //       );
// //     } catch (err) {
// //       console.error("Vote request error:", err);
// //       setPosts(await loadPosts()); // revert
// //       alert("Network error while voting. Please try again.");
// //     }
// //   };

// //   // ---- Repost handler ----
// //   const handleRepost = async (postId) => {
// //     const token = getTokenFromStorage();
// //     if (!token) {
// //       alert("Please log in to repost.");
// //       return;
// //     }

// //     if (repostingIds.includes(postId)) return; // already in-flight

// //     setRepostingIds((s) => [...s, postId]);
// //     try {
// //       await repostPost(postId);
// //       // refresh posts from server to get authoritative state
// //       const refreshed = await loadPosts();
// //       setPosts(refreshed);
// //       // lightweight feedback
// //       alert("Reposted successfully");
// //     } catch (err) {
// //       console.error("Repost failed:", err);

// //       // Friendly, informative message extraction:
// //       let serverMsg = null;
// //       try {
// //         if (err && err.response) {
// //           serverMsg = err.response;
// //         } else if (err && err.message) {
// //           serverMsg = err.message;
// //         }
// //       } catch (e) {
// //         serverMsg = String(err);
// //       }

// //       let friendly = "Failed to repost";
// //       if (serverMsg) {
// //         if (typeof serverMsg === "string") friendly = serverMsg;
// //         else if (serverMsg.title) friendly = serverMsg.title;
// //         else if (serverMsg.message) friendly = serverMsg.message;
// //         else if (serverMsg.error) friendly = serverMsg.error;
// //         else if (serverMsg.errors) friendly = JSON.stringify(serverMsg.errors);
// //         else friendly = JSON.stringify(serverMsg);
// //       } else if (err && err.message) {
// //         friendly = err.message;
// //       }

// //       alert("Repost failed: " + friendly);
// //     } finally {
// //       setRepostingIds((s) => s.filter((id) => id !== postId));
// //     }
// //   };

// //   // Render helpers (unchanged)
// //   const getPostTitle = (post) => {
// //     if (!post) return "Untitled Post";
// //     if (typeof post.title === "string" && post.title.trim()) return post.title;

// //     if (post.title && typeof post.title === "object") {
// //       const t = post.title.title ?? post.title.Title ?? post.title.name ?? post.title.Name;
// //       if (typeof t === "string" && t.trim()) return t;
// //     }

// //     const raw = post.raw ?? {};
// //     if (typeof raw.title === "string" && raw.title.trim()) return raw.title;
// //     if (typeof raw.Title === "string" && raw.Title.trim()) return raw.Title;
// //     if (typeof raw.post === "object") {
// //       const nested = raw.post;
// //       if (typeof nested.title === "string" && nested.title.trim()) return nested.title;
// //       if (typeof nested.Title === "string" && nested.Title.trim()) return nested.Title;
// //     }

// //     const firstText = (post.elements || []).find((el) => el.type === "text" && el.content && String(el.content).trim());
// //     if (firstText) {
// //       const txt = String(firstText.content).trim();
// //       return txt.length > 60 ? txt.slice(0, 60) + "..." : txt;
// //     }

// //     return "Untitled Post";
// //   };

// //   const renderElements = (elements) =>
// //     (elements || []).map((el) => {
// //       if (el.type === "text") return <div key={el.id} className="post-text"><p>{el.content}</p></div>;
// //       if (el.type === "code") return <div key={el.id} className="post-code"><pre><code>{el.content}</code></pre></div>;
// //       if (el.type === "image") {
// //         const src = el.imagePreview || el.url || (el.rawElement && (el.rawElement.filePath ?? el.rawElement.FilePath));
// //         if (!src) return null;
// //         return (
// //           <div key={el.id} className="post-image">
// //             <img src={src} alt={el.imageName || "image"} className="feed-image" />
// //           </div>
// //         );
// //       }
// //       return null;
// //     });

// //   if (loading) return <div className="loading">Loading...</div>;

// //   return (
// //     <div className="feed-page">
// //       <header className="feed-header">
// //         <div className="brand">FNF Feed</div>
// //         <div className="user-actions">
// //           {user && <span className="user-name">Hi, {user.fullName ?? user.FullName ?? user.email}</span>}
// //           <Link to="/post/new" className="btn-newpost">➕ New Post</Link>
// //           <button onClick={handleLogout} className="btn-logout">Logout</button>
// //         </div>
// //       </header>

// //       <main className="feed-main">
// //         {posts.length === 0 ? (
// //           <div className="no-posts">No posts yet.</div>
// //         ) : (
// //           posts.map((p) => (
// //             <article key={`${p.id}`} className="post-item">
// //               <header className="post-header">
// //                 <h2 className="post-title">{getPostTitle(p)}</h2>
// //                 <div className="post-meta">
// //                   <span className="author">👤 <strong>{p.authorName}</strong></span>
// //                   <span className="timestamp">📅 {formatTimestamp(p.createdAt)}</span>
// //                 </div>
// //               </header>

// //               <div className="post-content">{renderElements(p.elements)}</div>

// //               <footer className="post-actions">
// //                 <button
// //                   className="action-btn like-btn"
// //                   onClick={() => voteOnPost(p.id, "Upvote")}
// //                   disabled={p.userVote === 1}
// //                   title={p.userVote === 1 ? "You liked this" : "Like"}
// //                 >
// //                   👍 {p.likeCount ?? 0}
// //                 </button>

// //                 <button
// //                   className="action-btn dislike-btn"
// //                   onClick={() => voteOnPost(p.id, "Downvote")}
// //                   disabled={p.userVote === -1}
// //                   title={p.userVote === -1 ? "You disliked this" : "Dislike"}
// //                 >
// //                   👎 {p.dislikeCount ?? 0}
// //                 </button>

// //                 <button
// //                   className="action-btn reply-btn"
// //                   onClick={() => {
// //                     const el = document.getElementById(`comments-post-${p.id}`);
// //                     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
// //                   }}
// //                 >
// //                   💬 Reply
// //                 </button>

// //                 <button className="action-btn share-btn">🔗 Share</button>

// //                 <button
// //                   className="action-btn repost-btn"
// //                   onClick={() => handleRepost(p.id)}
// //                   disabled={repostingIds.includes(p.id)}
// //                   title={repostingIds.includes(p.id) ? "Reposting..." : "Repost"}
// //                 >
// //                   🔁 Repost
// //                 </button>
// //               </footer>

// //               <div id={`comments-post-${p.id}`} style={{ marginTop: 12 }}>
// //                 <CommentsSection postId={p.id} />
// //               </div>
// //             </article>
// //           ))
// //         )}
// //       </main>
// //     </div>
// //   );
// // }


// // src/Components/Feed/Feed.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { clearToken, fetchMe, getToken as getStoredToken } from "../../Services/AuthService";
// import { repostPost } from "../../Services/repostService";
// import "./Feed.css";
// import CommentsSection from "../CommentsSection/CommentsSection";

// // API base (env var or fallback)
// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5294";

// export default function Feed() {
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]); // normalized posts
//   const [loading, setLoading] = useState(true);
//   const [repostingIds, setRepostingIds] = useState([]); // track reposts in-flight
//   const navigate = useNavigate();
//   const location = useLocation();

//   // try to read preloaded state from navigation (set during login)
//   const preloadedUser = location.state?.preloadedUser ?? null;
//   const preloadedPostsRaw = location.state?.preloadedPostsRaw ?? null;

//   // ---- loadPosts (fixed, returns normalized posts array) ----
//   const loadPosts = useCallback(async () => {
//     try {
//       const token = getStoredToken();
//       const headers = { "Content-Type": "application/json" };
//       if (token) headers.Authorization = `Bearer ${token}`;

//       const res = await fetch(`${API_BASE}/api/Posts`, {
//         method: "GET",
//         headers,
//       });

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

//   // helper to convert raw server posts array -> normalized structure Feed expects
//   function normalizePostsArray(arr) {
//     return (arr || []).map((p, idx) => {
//       const title = p.title ?? p.Title ?? "";
//       const rawBody = p.body ?? p.Body ?? "";
//       let elements = [];
//       try {
//         const parsed = rawBody ? JSON.parse(rawBody) : [];
//         if (Array.isArray(parsed)) {
//           elements = parsed.map((el, i) => ({
//             id: el.id ?? `${p.postId ?? p.PostId ?? idx}-${i}`,
//             type: (el.type ?? "text").toString().toLowerCase(),
//             content: el.content ?? el.body ?? "",
//             imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
//             imageName: el.imageName ?? "",
//           }));
//         } else {
//           elements = [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
//         }
//       } catch {
//         elements = [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
//       }

//       const likeCount = p.upvoteCount ?? p.UpvoteCount ?? p.likeCount ?? p.LikeCount ?? 0;
//       const dislikeCount = p.downvoteCount ?? p.DownvoteCount ?? p.dislikeCount ?? p.DislikeCount ?? 0;
//       const userVote = p.userVote ?? p.UserVote ?? 0;

//       return {
//         id: p.postId ?? p.PostId ?? `${idx}-${Date.now()}`,
//         title,
//         elements,
//         createdAt: p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
//         authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
//         likeCount,
//         dislikeCount,
//         userVote,
//         raw: p,
//       };
//     });
//   }

//   // ---- init (uses preloaded state if available, otherwise fetches in parallel) ----
//   useEffect(() => {
//     async function init() {
//       setLoading(true);

//       // If router passed preloaded state from Login, use it immediately
//       if (preloadedUser || preloadedPostsRaw) {
//         try {
//           if (preloadedUser) setUser(preloadedUser);
//           if (preloadedPostsRaw) {
//             const normalized = Array.isArray(preloadedPostsRaw)
//               ? normalizePostsArray(Array.isArray(preloadedPostsRaw) ? preloadedPostsRaw : preloadedPostsRaw.posts ?? [])
//               : [];
//             setPosts(normalized);
//           }
//         } finally {
//           setLoading(false);
//           return;
//         }
//       }

//       // otherwise do parallel fetch of me + posts
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
//       } catch (err) {
//         console.error("Init failed:", err);
//         clearToken();
//         navigate("/login", { replace: true });
//       } finally {
//         setLoading(false);
//       }
//     }

//     init();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [navigate, loadPosts, preloadedUser, preloadedPostsRaw]);

//   function handleLogout() {
//     clearToken();
//     navigate("/login", { replace: true });
//   }

//   const formatTimestamp = (timestamp) => {
//     const d = new Date(timestamp);
//     return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   // Vote a post (same optimistic update + reconcile logic)
//   const voteOnPost = async (postId, voteType) => {
//     const token = getStoredToken();
//     if (!token) {
//       alert("Please log in to vote.");
//       return;
//     }

//     // Optimistic update
//     setPosts((prev) =>
//       prev.map((p) => {
//         if (p.id !== postId) return p;
//         const prevUser = p.userVote || 0;
//         const intended = voteType.toLowerCase() === "upvote" ? 1 : -1;
//         let newUserVote;
//         if (prevUser === intended) newUserVote = 0; // toggle off
//         else newUserVote = intended; // set or switch

//         const likeDelta = (newUserVote === 1 ? 1 : 0) - (prevUser === 1 ? 1 : 0);
//         const dislikeDelta = (newUserVote === -1 ? 1 : 0) - (prevUser === -1 ? 1 : 0);

//         return {
//           ...p,
//           likeCount: Math.max(0, (p.likeCount || 0) + likeDelta),
//           dislikeCount: Math.max(0, (p.dislikeCount || 0) + dislikeDelta),
//           userVote: newUserVote,
//         };
//       })
//     );

//     try {
//       const res = await fetch(`${API_BASE}/api/Votes/post/${postId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getStoredToken()}`,
//         },
//         body: JSON.stringify({ voteType }),
//       });

//       if (!res.ok) {
//         console.error("Vote failed:", res.status);
//         setPosts(await loadPosts()); // revert by reloading
//         alert("Failed to register vote. Please try again.");
//         return;
//       }

//       const data = await res.json();

//       // Reconcile with server result
//       setPosts((prev) =>
//         prev.map((p) =>
//           p.id === postId
//             ? {
//                 ...p,
//                 likeCount: data.likeCount ?? p.likeCount,
//                 dislikeCount: data.dislikeCount ?? p.dislikeCount,
//                 userVote: data.userVote ?? p.userVote,
//               }
//             : p
//         )
//       );
//     } catch (err) {
//       console.error("Vote request error:", err);
//       setPosts(await loadPosts()); // revert
//       alert("Network error while voting. Please try again.");
//     }
//   };

//   // ---- Repost handler ----
//   const handleRepost = async (postId) => {
//     const token = getStoredToken();
//     if (!token) {
//       alert("Please log in to repost.");
//       return;
//     }

//     if (repostingIds.includes(postId)) return; // already in-flight

//     setRepostingIds((s) => [...s, postId]);
//     try {
//       await repostPost(postId);
//       // refresh posts from server to get authoritative state
//       const refreshed = await loadPosts();
//       setPosts(refreshed);
//       // lightweight feedback
//       alert("Reposted successfully");
//     } catch (err) {
//       console.error("Repost failed:", err);

//       // Friendly, informative message extraction:
//       let serverMsg = null;
//       try {
//         if (err && err.response) {
//           serverMsg = err.response;
//         } else if (err && err.message) {
//           serverMsg = err.message;
//         }
//       } catch (e) {
//         serverMsg = String(err);
//       }

//       let friendly = "Failed to repost";
//       if (serverMsg) {
//         if (typeof serverMsg === "string") friendly = serverMsg;
//         else if (serverMsg.title) friendly = serverMsg.title;
//         else if (serverMsg.message) friendly = serverMsg.message;
//         else if (serverMsg.error) friendly = serverMsg.error;
//         else if (serverMsg.errors) friendly = JSON.stringify(serverMsg.errors);
//         else friendly = JSON.stringify(serverMsg);
//       } else if (err && err.message) {
//         friendly = err.message;
//       }

//       alert("Repost failed: " + friendly);
//     } finally {
//       setRepostingIds((s) => s.filter((id) => id !== postId));
//     }
//   };

//   // Render helpers (unchanged)
//   const getPostTitle = (post) => {
//     if (!post) return "Untitled Post";
//     if (typeof post.title === "string" && post.title.trim()) return post.title;

//     if (post.title && typeof post.title === "object") {
//       const t = post.title.title ?? post.title.Title ?? post.title.name ?? post.title.Name;
//       if (typeof t === "string" && t.trim()) return t;
//     }

//     const raw = post.raw ?? {};
//     if (typeof raw.title === "string" && raw.title.trim()) return raw.title;
//     if (typeof raw.Title === "string" && raw.Title.trim()) return raw.Title;
//     if (typeof raw.post === "object") {
//       const nested = raw.post;
//       if (typeof nested.title === "string" && nested.title.trim()) return nested.title;
//       if (typeof nested.Title === "string" && nested.Title.trim()) return nested.Title;
//     }

//     const firstText = (post.elements || []).find((el) => el.type === "text" && el.content && String(el.content).trim());
//     if (firstText) {
//       const txt = String(firstText.content).trim();
//       return txt.length > 60 ? txt.slice(0, 60) + "..." : txt;
//     }

//     return "Untitled Post";
//   };

//   const renderElements = (elements) =>
//     (elements || []).map((el) => {
//       if (el.type === "text") return <div key={el.id} className="post-text"><p>{el.content}</p></div>;
//       if (el.type === "code") return <div key={el.id} className="post-code"><pre><code>{el.content}</code></pre></div>;
//       if (el.type === "image") {
//         const src = el.imagePreview || el.url || (el.rawElement && (el.rawElement.filePath ?? el.rawElement.FilePath));
//         if (!src) return null;
//         return (
//           <div key={el.id} className="post-image">
//             <img src={src} alt={el.imageName || "image"} className="feed-image" />
//           </div>
//         );
//       }
//       return null;
//     });

//   if (loading) return <div className="loading">Loading...</div>;

//   return (
//     <div className="feed-page">
//       <header className="feed-header">
//         <div className="brand">FNF Feed</div>
//         <div className="user-actions">
//           {user && <span className="user-name">Hi, {user.fullName ?? user.FullName ?? user.email}</span>}
//           <Link to="/post/new" className="btn-newpost">➕ New Post</Link>
//           <button onClick={handleLogout} className="btn-logout">Logout</button>
//         </div>
//       </header>

//       <main className="feed-main">
//         {posts.length === 0 ? (
//           <div className="no-posts">No posts yet.</div>
//         ) : (
//           posts.map((p) => (
//             <article key={`${p.id}`} className="post-item">
//               <header className="post-header">
//                 <h2 className="post-title">{getPostTitle(p)}</h2>
//                 <div className="post-meta">
//                   <span className="author">👤 <strong>{p.authorName}</strong></span>
//                   <span className="timestamp">📅 {formatTimestamp(p.createdAt)}</span>
//                 </div>
//               </header>

//               <div className="post-content">{renderElements(p.elements)}</div>

//               <footer className="post-actions">
//                 <button
//                   className="action-btn like-btn"
//                   onClick={() => voteOnPost(p.id, "Upvote")}
//                   disabled={p.userVote === 1}
//                   title={p.userVote === 1 ? "You liked this" : "Like"}
//                 >
//                   👍 {p.likeCount ?? 0}
//                 </button>

//                 <button
//                   className="action-btn dislike-btn"
//                   onClick={() => voteOnPost(p.id, "Downvote")}
//                   disabled={p.userVote === -1}
//                   title={p.userVote === -1 ? "You disliked this" : "Dislike"}
//                 >
//                   👎 {p.dislikeCount ?? 0}
//                 </button>

//                 <button
//                   className="action-btn reply-btn"
//                   onClick={() => {
//                     const el = document.getElementById(`comments-post-${p.id}`);
//                     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
//                   }}
//                 >
//                   💬 Reply
//                 </button>

//                 <button className="action-btn share-btn">🔗 Share</button>

//                 <button
//                   className="action-btn repost-btn"
//                   onClick={() => handleRepost(p.id)}
//                   disabled={repostingIds.includes(p.id)}
//                   title={repostingIds.includes(p.id) ? "Reposting..." : "Repost"}
//                 >
//                   🔁 Repost
//                 </button>
//               </footer>

//               <div id={`comments-post-${p.id}`} style={{ marginTop: 12 }}>
//                 <CommentsSection postId={p.id} />
//               </div>
//             </article>
//           ))
//         )}
//       </main>
//     </div>
//   );
// }


// src/Components/Feed/Feed.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { clearToken, fetchMe, getToken as getStoredToken } from "../../Services/AuthService";
import { repostPost } from "../../Services/repostService";
import "./Feed.css";
import CommentsSection from "../CommentsSection/CommentsSection";

// API base (env var or fallback)
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5294";

export default function Feed() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]); // normalized posts
  const [loading, setLoading] = useState(true);
  const [repostingIds, setRepostingIds] = useState([]); // track reposts in-flight
  const navigate = useNavigate();
  const location = useLocation();

  // try to read preloaded state from navigation (set during login)
  const preloadedUser = location.state?.preloadedUser ?? null;
  const preloadedPostsRaw = location.state?.preloadedPostsRaw ?? null;

  // ---- loadPosts (fixed, returns normalized posts array) ----
  const loadPosts = useCallback(async () => {
    try {
      const token = getStoredToken();
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/api/Posts`, {
        method: "GET",
        headers,
      });

      if (res.status === 401) {
        clearToken();
        navigate("/login", { replace: true });
        return [];
      }

      if (!res.ok) {
        const txt = await res.text();
        console.warn("Failed to load posts, status:", res.status, "body:", txt);
        return [];
      }

      const data = await res.json();
      const arr = Array.isArray(data) ? data : data?.posts ?? [];
      return normalizePostsArray(arr);
    } catch (err) {
      console.warn("loadPosts error:", err);
      return [];
    }
  }, [navigate]);

  // helper to convert raw server posts array -> normalized structure Feed expects
  function normalizePostsArray(arr) {
    return (arr || []).map((p, idx) => {
      const title = p.title ?? p.Title ?? "";
      const rawBody = p.body ?? p.Body ?? "";
      let elements = [];
      try {
        const parsed = rawBody ? JSON.parse(rawBody) : [];
        if (Array.isArray(parsed)) {
          elements = parsed.map((el, i) => ({
            id: el.id ?? `${p.postId ?? p.PostId ?? idx}-${i}`,
            type: (el.type ?? "text").toString().toLowerCase(),
            content: el.content ?? el.body ?? "",
            imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
            imageName: el.imageName ?? "",
          }));
        } else {
          elements = [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
        }
      } catch {
        elements = [{ id: `${p.postId ?? idx}-single`, type: "text", content: String(rawBody || "") }];
      }

      const likeCount = p.upvoteCount ?? p.UpvoteCount ?? p.likeCount ?? p.LikeCount ?? 0;
      const dislikeCount = p.downvoteCount ?? p.DownvoteCount ?? p.dislikeCount ?? p.DislikeCount ?? 0;
      const userVote = p.userVote ?? p.UserVote ?? 0;

      return {
        id: p.postId ?? p.PostId ?? `${idx}-${Date.now()}`,
        title,
        elements,
        createdAt: p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
        authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
        likeCount,
        dislikeCount,
        userVote,
        raw: p,
      };
    });
  }

  // ---- init (uses preloaded state if available, otherwise fetches in parallel) ----
  useEffect(() => {
    async function init() {
      setLoading(true);

      // If router passed preloaded state from Login, use it immediately
      if (preloadedUser || preloadedPostsRaw) {
        try {
          if (preloadedUser) setUser(preloadedUser);
          if (preloadedPostsRaw) {
            const normalized = Array.isArray(preloadedPostsRaw)
              ? normalizePostsArray(Array.isArray(preloadedPostsRaw) ? preloadedPostsRaw : preloadedPostsRaw.posts ?? [])
              : [];
            setPosts(normalized);
          }
        } finally {
          setLoading(false);
          return;
        }
      }

      // otherwise do parallel fetch of me + posts
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
      } catch (err) {
        console.error("Init failed:", err);
        clearToken();
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, loadPosts, preloadedUser, preloadedPostsRaw]);

  function handleLogout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  const formatTimestamp = (timestamp) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Vote a post (same optimistic update + reconcile logic)
  const voteOnPost = async (postId, voteType) => {
    const token = getStoredToken();
    if (!token) {
      alert("Please log in to vote.");
      return;
    }

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const prevUser = p.userVote || 0;
        const intended = voteType.toLowerCase() === "upvote" ? 1 : -1;
        let newUserVote;
        if (prevUser === intended) newUserVote = 0; // toggle off
        else newUserVote = intended; // set or switch

        const likeDelta = (newUserVote === 1 ? 1 : 0) - (prevUser === 1 ? 1 : 0);
        const dislikeDelta = (newUserVote === -1 ? 1 : 0) - (prevUser === -1 ? 1 : 0);

        return {
          ...p,
          likeCount: Math.max(0, (p.likeCount || 0) + likeDelta),
          dislikeCount: Math.max(0, (p.dislikeCount || 0) + dislikeDelta),
          userVote: newUserVote,
        };
      })
    );

    try {
      const res = await fetch(`${API_BASE}/api/Votes/post/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getStoredToken()}`,
        },
        body: JSON.stringify({ voteType }),
      });

      if (!res.ok) {
        console.error("Vote failed:", res.status);
        setPosts(await loadPosts()); // revert by reloading
        alert("Failed to register vote. Please try again.");
        return;
      }

      const data = await res.json();

      // Reconcile with server result
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                likeCount: data.likeCount ?? p.likeCount,
                dislikeCount: data.dislikeCount ?? p.dislikeCount,
                userVote: data.userVote ?? p.userVote,
              }
            : p
        )
      );
    } catch (err) {
      console.error("Vote request error:", err);
      setPosts(await loadPosts()); // revert
      alert("Network error while voting. Please try again.");
    }
  };

  // ---- Repost handler ----
  const handleRepost = async (postId) => {
    const token = getStoredToken();
    if (!token) {
      alert("Please log in to repost.");
      return;
    }

    if (!user) {
      // try to fetch me as fallback
      try {
        const me = await fetchMe();
        setUser(me);
      } catch {
        alert("Unable to determine current user. Please re-login.");
        clearToken();
        navigate("/login", { replace: true });
        return;
      }
    }

    // determine numeric user id from user object (handles various shapes)
    const possibleIds = [
      user?.userId,
      user?.UserId,
      user?.id,
      user?.Id,
      user?.user_id,
      user?.sub, // sometimes token 'sub' may be forwarded
    ];
    const firstNonNull = possibleIds.find((v) => v !== undefined && v !== null);
    const numericUserId = firstNonNull !== undefined && firstNonNull !== null ? Number(firstNonNull) : null;

    if (!numericUserId || Number.isNaN(numericUserId) || numericUserId <= 0) {
      alert("Unable to determine your user id. Please re-login.");
      clearToken();
      navigate("/login", { replace: true });
      return;
    }

    if (repostingIds.includes(postId)) return; // already in-flight

    setRepostingIds((s) => [...s, postId]);
    try {
      // pass the user's id so backend validation (if it expects client-sent UserId) succeeds
      await repostPost(postId, numericUserId);
      // refresh posts from server to get authoritative state
      const refreshed = await loadPosts();
      setPosts(refreshed);
      // lightweight feedback
      alert("Reposted successfully");
    } catch (err) {
      console.error("Repost failed:", err);

      // Friendly, informative message extraction:
      let serverMsg = null;
      try {
        if (err && err.response) {
          serverMsg = err.response;
        } else if (err && err.message) {
          serverMsg = err.message;
        }
      } catch (e) {
        serverMsg = String(err);
      }

      let friendly = "Failed to repost";
      if (serverMsg) {
        if (typeof serverMsg === "string") friendly = serverMsg;
        else if (serverMsg.title) friendly = serverMsg.title;
        else if (serverMsg.message) friendly = serverMsg.message;
        else if (serverMsg.error) friendly = serverMsg.error;
        else if (serverMsg.errors) friendly = JSON.stringify(serverMsg.errors);
        else friendly = JSON.stringify(serverMsg);
      } else if (err && err.message) {
        friendly = err.message;
      }

      alert("Repost failed: " + friendly);
    } finally {
      setRepostingIds((s) => s.filter((id) => id !== postId));
    }
  };

  // Render helpers (unchanged)
  const getPostTitle = (post) => {
    if (!post) return "Untitled Post";
    if (typeof post.title === "string" && post.title.trim()) return post.title;

    if (post.title && typeof post.title === "object") {
      const t = post.title.title ?? post.title.Title ?? post.title.name ?? post.title.Name;
      if (typeof t === "string" && t.trim()) return t;
    }

    const raw = post.raw ?? {};
    if (typeof raw.title === "string" && raw.title.trim()) return raw.title;
    if (typeof raw.Title === "string" && raw.Title.trim()) return raw.Title;
    if (typeof raw.post === "object") {
      const nested = raw.post;
      if (typeof nested.title === "string" && nested.title.trim()) return nested.title;
      if (typeof nested.Title === "string" && nested.Title.trim()) return nested.Title;
    }

    const firstText = (post.elements || []).find((el) => el.type === "text" && el.content && String(el.content).trim());
    if (firstText) {
      const txt = String(firstText.content).trim();
      return txt.length > 60 ? txt.slice(0, 60) + "..." : txt;
    }

    return "Untitled Post";
  };

  const renderElements = (elements) =>
    (elements || []).map((el) => {
      if (el.type === "text") return <div key={el.id} className="post-text"><p>{el.content}</p></div>;
      if (el.type === "code") return <div key={el.id} className="post-code"><pre><code>{el.content}</code></pre></div>;
      if (el.type === "image") {
        const src = el.imagePreview || el.url || (el.rawElement && (el.rawElement.filePath ?? el.rawElement.FilePath));
        if (!src) return null;
        return (
          <div key={el.id} className="post-image">
            <img src={src} alt={el.imageName || "image"} className="feed-image" />
          </div>
        );
      }
      return null;
    });

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="feed-page">
      <header className="feed-header">
        <div className="brand">FNF Feed</div>
        <div className="user-actions">
          {user && <span className="user-name">Hi, {user.fullName ?? user.FullName ?? user.email}</span>}
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
                  <span className="author">👤 <strong>{p.authorName}</strong></span>
                  <span className="timestamp">📅 {formatTimestamp(p.createdAt)}</span>
                </div>
              </header>

              <div className="post-content">{renderElements(p.elements)}</div>

              <footer className="post-actions">
                <button
                  className="action-btn like-btn"
                  onClick={() => voteOnPost(p.id, "Upvote")}
                  disabled={p.userVote === 1}
                  title={p.userVote === 1 ? "You liked this" : "Like"}
                >
                  👍 {p.likeCount ?? 0}
                </button>

                <button
                  className="action-btn dislike-btn"
                  onClick={() => voteOnPost(p.id, "Downvote")}
                  disabled={p.userVote === -1}
                  title={p.userVote === -1 ? "You disliked this" : "Dislike"}
                >
                  👎 {p.dislikeCount ?? 0}
                </button>

                <button
                  className="action-btn reply-btn"
                  onClick={() => {
                    const el = document.getElementById(`comments-post-${p.id}`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  💬 Reply
                </button>

                <button className="action-btn share-btn">🔗 Share</button>

                <button
                  className="action-btn repost-btn"
                  onClick={() => handleRepost(p.id)}
                  disabled={repostingIds.includes(p.id)}
                  title={repostingIds.includes(p.id) ? "Reposting..." : "Repost"}
                >
                  🔁 Repost
                </button>
              </footer>

              <div id={`comments-post-${p.id}`} style={{ marginTop: 12 }}>
                <CommentsSection postId={p.id} />
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
}
