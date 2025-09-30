// // // // // import React, { useEffect, useState, useCallback, useMemo } from "react";
// // // // // import { useNavigate, useLocation } from "react-router-dom";
// // // // // import { clearToken, fetchMe, getToken as getStoredToken } from "../../Services/AuthService";
// // // // // import { repostPost } from "../../Services/repostService";
// // // // // import { votePost, deletePostAsManager } from "../../Services/postsService";
// // // // // import "./Feed.css";
// // // // // import CommentsSection from "../CommentsSection/CommentsSection";
// // // // // import TagChips from "../Tags/TagChips";

// // // // // /**
// // // // //  * Frontend-only soft-delete strategy:
// // // // //  * - When a manager "deletes" a post we remove it from the feed state
// // // // //  * - We record a commit in localStorage under key "localPostCommits"
// // // // //  * - "My Posts" UI should read localPostCommits and render deleted-post entries
// // // // //  */

// // // // // const API_BASE =
// // // // //   import.meta.env.VITE_API_BASE_URL ||
// // // // //   import.meta.env.VITE_API ||
// // // // //   "http://localhost:5294";

// // // // // const LOCAL_COMMITS_KEY = "localPostCommits";

// // // // // export default function Feed() {
// // // // //   const [user, setUser] = useState(null);
// // // // //   const [posts, setPosts] = useState([]);
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [repostingIds, setRepostingIds] = useState([]);

// // // // //   const navigate = useNavigate();
// // // // //   const location = useLocation();

// // // // //   const urlParams = new URLSearchParams(location.search);
// // // // //   const qParam = (urlParams.get("q") || "").toLowerCase();
// // // // //   const deptParam = urlParams.get("dept") || "all";

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
// // // // //       if (!res.ok) return [];
// // // // //       const data = await res.json();
// // // // //       const arr = Array.isArray(data) ? data : data?.posts ?? [];
// // // // //       return normalizePostsArray(arr);
// // // // //     } catch {
// // // // //       return [];
// // // // //     }
// // // // //   }, [navigate]);

// // // // //   function toElements(rawBody, idSeed) {
// // // // //     let elements = [];
// // // // //     try {
// // // // //       const parsed = rawBody ? JSON.parse(rawBody) : [];
// // // // //       elements = Array.isArray(parsed)
// // // // //         ? parsed.map((el, i) => ({
// // // // //             id: el.id ?? `${idSeed}-${i}`,
// // // // //             type: (el.type ?? "text").toString().toLowerCase(),
// // // // //             content: el.content ?? el.body ?? "",
// // // // //             imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
// // // // //             imageName: el.imageName ?? "",
// // // // //           }))
// // // // //         : [{ id: `${idSeed}-single`, type: "text", content: String(rawBody || "") }];
// // // // //     } catch {
// // // // //       elements = [{ id: `${idSeed}-single`, type: "text", content: String(rawBody || "") }];
// // // // //     }
// // // // //     return elements;
// // // // //   }

// // // // //   /**
// // // // //    * normalizePostsArray
// // // // //    * - robustly detect reposts
// // // // //    * - ensure React key `id` is unique even if postId duplicates (original + repost share numeric postId)
// // // // //    *   -> include createdAt timestamp for uniqueness when present (especially for repost rows).
// // // // //    */
// // // // //   function normalizePostsArray(arr) {
// // // // //     return (arr || []).map((p, idx) => {
// // // // //       const postId = Number(p.postId ?? p.PostId ?? 0);
// // // // //       const title = p.title ?? p.Title ?? "";
// // // // //       const rawBody = p.body ?? p.Body ?? "";
// // // // //       const createdAtRaw = p.createdAt ?? p.CreatedAt ?? null;
// // // // //       const createdAtIso = createdAtRaw ? new Date(createdAtRaw).toISOString() : null;

// // // // //       const elements = toElements(rawBody, postId || idx);

// // // // //       const tags =
// // // // //         p.tags ?? p.Tags ?? (p.postTags ?? p.PostTags)?.map((pt) => {
// // // // //           const tag = pt.tag ?? pt.Tag;
// // // // //           return {
// // // // //             TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
// // // // //             TagName: tag?.tagName ?? tag?.TagName ?? pt.tagName ?? pt.TagName,
// // // // //             DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
// // // // //           };
// // // // //         }) ?? [];

// // // // //       const deptId = Number(
// // // // //         p.deptId ??
// // // // //           p.DeptId ??
// // // // //           p.dept?.deptId ??
// // // // //           p.Dept?.DeptId ??
// // // // //           p.departmentId ??
// // // // //           p.DepartmentId ??
// // // // //           0
// // // // //       );

// // // // //       const departmentName = p.departmentName ?? p.DepartmentName ?? p?.Dept?.DeptName ?? "";

// // // // //       // robust repost detection (explicit flag or title prefix)
// // // // //       const isRepostFlag = Boolean(
// // // // //         p.isRepost ??
// // // // //         p.IsRepost ??
// // // // //         (typeof title === "string" && title.trim().toLowerCase().startsWith("[repost"))
// // // // //       );

// // // // //       // stable created fallback if missing
// // // // //       const stableCreated = createdAtIso ?? `${idx}-${Date.now()}`;

// // // // //       // unique UI id: include createdAt for repost rows
// // // // //       const uiId = isRepostFlag
// // // // //         ? `post-${postId || "0"}-repost-${stableCreated}`
// // // // //         : `post-${postId || `${idx}-${stableCreated}`}-orig`;

// // // // //       return {
// // // // //         id: uiId,
// // // // //         postId,
// // // // //         deptId,
// // // // //         title,
// // // // //         elements,
// // // // //         tags,
// // // // //         createdAt: createdAtIso ?? new Date().toISOString(),
// // // // //         authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
// // // // //         departmentName,
// // // // //         likeCount: p.upvoteCount ?? p.UpvoteCount ?? 0,
// // // // //         dislikeCount: p.downvoteCount ?? p.DownvoteCount ?? 0,
// // // // //         userVote: p.userVote ?? p.UserVote ?? 0,
// // // // //         raw: p,
// // // // //         isRepost: isRepostFlag,
// // // // //       };
// // // // //     });
// // // // //   }

// // // // //   useEffect(() => {
// // // // //     (async () => {
// // // // //       setLoading(true);
// // // // //       try {
// // // // //         const [me, postsList] = await Promise.all([fetchMe().catch(() => null), loadPosts()]);
// // // // //         if (!me) {
// // // // //           clearToken();
// // // // //           navigate("/login", { replace: true });
// // // // //           return;
// // // // //         }
// // // // //         setUser(me);

// // // // //         // Filter out locally deleted posts on initial load
// // // // //         const localDeletedIds = getLocalCommits().map((c) => c.postId);
// // // // //         const filtered = (postsList || []).filter((p) => !localDeletedIds.includes(p.postId));
// // // // //         setPosts(filtered);

// // // // //         const depts = Array.from(new Set((filtered || []).map((x) => x.departmentName).filter(Boolean))).sort();
// // // // //         try { localStorage.setItem("deptOptions", JSON.stringify(depts)); } catch {}
// // // // //       } catch {
// // // // //         clearToken();
// // // // //         navigate("/login", { replace: true });
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //       }
// // // // //     })();
// // // // //   }, [navigate, loadPosts]);

// // // // //   function currentUserDeptId() {
// // // // //     return Number(
// // // // //       user?.departmentId ??
// // // // //         user?.DepartmentId ??
// // // // //         user?.deptId ??
// // // // //         user?.Department?.DeptId ??
// // // // //         user?.department?.id ??
// // // // //         0
// // // // //     );
// // // // //   }

// // // // //   const isManager = () => String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

// // // // //   /**
// // // // //    * canDeletePostFor: Original intent preserved (manager + same dept id).
// // // // //    * Fallback: if numeric deptId is missing on post, compare departmentName case-insensitively.
// // // // //    * This fixes the common situation where API returns departmentName but not deptId.
// // // // //    */
// // // // //   function canDeletePostFor(p) {
// // // // //     if (!isManager()) return false;

// // // // //     const myDept = currentUserDeptId();

// // // // //     // try numeric comparison first
// // // // //     const postDeptNumeric = Number(p.deptId ?? p.DeptId ?? p.raw?.deptId ?? 0);
// // // // //     if (myDept && postDeptNumeric) {
// // // // //       return Number(myDept) === Number(postDeptNumeric);
// // // // //     }

// // // // //     // fallback to department name comparison (case-insensitive)
// // // // //     const myDeptName = String(user?.departmentName ?? user?.DepartmentName ?? user?.department?.name ?? "").trim().toLowerCase();
// // // // //     const postDeptName = String(p.departmentName ?? p.DepartmentName ?? p.raw?.departmentName ?? "").trim().toLowerCase();

// // // // //     // debug: remove/comment this line in production if you don't want console output
// // // // //     console.debug("canDeletePostFor", { isManager: true, myDept, postDeptNumeric, myDeptName, postDeptName });

// // // // //     if (myDeptName && postDeptName) {
// // // // //       return myDeptName === postDeptName;
// // // // //     }

// // // // //     return false;
// // // // //   }

// // // // //   /* ======================================================
// // // // //      local-commit helpers (kept in-file for simplicity)
// // // // //   ====================================================== */
// // // // //   function getLocalCommits() {
// // // // //     try {
// // // // //       const raw = localStorage.getItem(LOCAL_COMMITS_KEY);
// // // // //       if (!raw) return [];
// // // // //       return JSON.parse(raw);
// // // // //     } catch {
// // // // //       return [];
// // // // //     }
// // // // //   }

// // // // //   function saveLocalCommits(arr) {
// // // // //     try {
// // // // //       localStorage.setItem(LOCAL_COMMITS_KEY, JSON.stringify(arr || []));
// // // // //     } catch {}
// // // // //   }

// // // // //   function addLocalCommit(commit) {
// // // // //     const arr = getLocalCommits();
// // // // //     arr.unshift(commit);
// // // // //     saveLocalCommits(arr);
// // // // //   }

// // // // //   /* ======================================================
// // // // //      HANDLE DELETE (soft-local)
// // // // //   ====================================================== */
// // // // //   async function handleDelete(p) {
// // // // //     // if user is not a manager, tell them they cannot delete
// // // // //     if (!isManager()) {
// // // // //       alert("Only managers can delete posts");
// // // // //       return;
// // // // //     }

// // // // //     const reason = prompt("Enter reason for deleting this post (required):");
// // // // //     if (!reason || !reason.trim()) return;

// // // // //     try {
// // // // //       // call backend so Commits are recorded there (and backend can handle FK/cascade appropriately)
// // // // //       await deletePostAsManager(p.postId, reason);

// // // // //       // also keep local commit to hide the post for this browser
// // // // //       const managerId = Number(user?.userId ?? user?.UserId ?? user?.id ?? 0);
// // // // //       const managerName = user?.fullName ?? user?.FullName ?? user?.name ?? user?.Name ?? "(manager)";
// // // // //       const commit = {
// // // // //         postId: p.postId,
// // // // //         postTitle: p.title || "(untitled)",
// // // // //         authorName: p.authorName || "(unknown)",
// // // // //         managerId,
// // // // //         managerName,
// // // // //         reason: String(reason).trim(),
// // // // //         createdAt: new Date().toISOString()
// // // // //       };

// // // // //       addLocalCommit(commit);
// // // // //       setPosts((prev) => prev.filter((x) => x.postId !== p.postId));

// // // // //       alert("Post deleted (hidden) successfully.");
// // // // //     } catch (err) {
// // // // //       console.error(err);
// // // // //       alert(err?.message || "Failed to delete post");
// // // // //     }
// // // // //   }

// // // // //   function handleVote(postId, value) {
// // // // //     votePost(postId, value)
// // // // //       .then((r) => {
// // // // //         setPosts((prev) =>
// // // // //           prev.map((p) =>
// // // // //             p.postId === postId
// // // // //               ? {
// // // // //                   ...p,
// // // // //                   likeCount: r?.likeCount ?? p.likeCount,
// // // // //                   dislikeCount: r?.dislikeCount ?? p.dislikeCount,
// // // // //                   userVote: r?.userVote ?? p.userVote,
// // // // //                 }
// // // // //               : p
// // // // //           )
// // // // //         );
// // // // //       })
// // // // //       .catch((e) => alert(e.message || "Vote failed"));
// // // // //   }

// // // // //   const filteredPosts = useMemo(() => {
// // // // //     const q = (qParam || "").trim();
// // // // //     const dept = (deptParam || "all").toLowerCase();
// // // // //     return posts.filter((p) => {
// // // // //       if (dept !== "all" && (p.departmentName || "").toLowerCase() !== dept) return false;
// // // // //       if (!q) return true;
// // // // //       const inTitle = (p.title || "").toLowerCase().includes(q);
// // // // //       const inText = (p.elements || []).some(
// // // // //         (el) => el.type === "text" && (el.content || "").toLowerCase().includes(q)
// // // // //       );
// // // // //       return inTitle || inText;
// // // // //     });
// // // // //   }, [posts, qParam, deptParam]);

// // // // //   if (loading) return <div className="loading">Loading...</div>;

// // // // //   const fmt = (ts) => {
// // // // //     const d = new Date(ts);
// // // // //     return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// // // // //   };

// // // // //   // ensure prepend-created repost uses same id scheme as normalizePostsArray
// // // // //   function convertDtoToUiPost(dto) {
// // // // //     const postId = Number(dto.postId ?? dto.PostId ?? 0);
// // // // //     const createdAtIso = dto.createdAt ? new Date(dto.createdAt).toISOString() : new Date().toISOString();
// // // // //     const uiId = `post-${postId || "0"}-repost-${createdAtIso}`;

// // // // //     const elements = toElements(dto.body ?? dto.Body ?? "", postId || "r");
// // // // //     const deptId = Number(dto.deptId ?? dto.DeptId ?? dto.dept?.deptId ?? dto.Dept?.DeptId ?? 0);

// // // // //     return {
// // // // //       id: uiId,
// // // // //       postId,
// // // // //       deptId,
// // // // //       title: dto.title ?? "",
// // // // //       elements,
// // // // //       tags: dto.tags ?? [],
// // // // //       createdAt: dto.createdAt ?? new Date().toISOString(),
// // // // //       authorName: dto.authorName ?? "Unknown",
// // // // //       departmentName: dto.departmentName ?? "",
// // // // //       likeCount: dto.upvoteCount ?? dto.UpvoteCount ?? 0,
// // // // //       dislikeCount: dto.downvoteCount ?? dto.DownvoteCount ?? 0,
// // // // //       userVote: 0,
// // // // //       raw: dto,
// // // // //       isRepost: true,
// // // // //     };
// // // // //   }

// // // // //   return (
// // // // //     <div className="feed-page">
// // // // //       <main className="feed-main" style={{ padding: 16 }}>
// // // // //         {filteredPosts.length === 0 ? (
// // // // //           <div className="no-posts">No matching posts.</div>
// // // // //         ) : (
// // // // //           filteredPosts.map((p) => (
// // // // //             <article key={p.id} className="post-item">
// // // // //               <header className="post-header">
// // // // //                 <h2 className="post-title">{p.title || "Untitled Post"}</h2>
// // // // //                 <div className="post-meta">
// // // // //                   <span className="author">👤 <strong>{p.authorName}</strong></span>
// // // // //                   <span className="timestamp">📅 {fmt(p.createdAt)}</span>
// // // // //                   {p.departmentName ? <span className="dept">🏢 {p.departmentName}</span> : null}
// // // // //                   {p.isRepost ? <span className="badge" style={{ marginLeft: 8 }}>🔁 Repost</span> : null}
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
// // // // //                         <pre><code>{el.content}</code></pre>
// // // // //                       </div>
// // // // //                     );
// // // // //                   if (el.type === "image") {
// // // // //                     const src = el.imagePreview || el.url;
// // // // //                     if (!src) return null;
// // // // //                     return (
// // // // //                       <div key={el.id} className="post-image">
// // // // //                         <img src={src} alt={el.imageName || "image"} className="feed-image" loading="lazy" />
// // // // //                       </div>
// // // // //                     );
// // // // //                   }
// // // // //                   return null;
// // // // //                 })}
// // // // //               </div>

// // // // //               <TagChips tags={p.tags} />

// // // // //               <div className="post-actions" style={{ marginTop: 8, display: "flex", gap: 8 }}>
// // // // //                 <button
// // // // //                   className="btn"
// // // // //                   aria-label="Like"
// // // // //                   onClick={() => handleVote(p.postId, +1)}
// // // // //                   style={p.userVote === 1 ? { borderColor: "#2563eb", background: "#eff6ff" } : null}
// // // // //                 >
// // // // //                   👍 {p.likeCount ?? 0}
// // // // //                 </button>

// // // // //                 <button
// // // // //                   className="btn"
// // // // //                   aria-label="Dislike"
// // // // //                   onClick={() => handleVote(p.postId, -1)}
// // // // //                   style={p.userVote === -1 ? { borderColor: "#ef4444", background: "#fef2f2" } : null}
// // // // //                 >
// // // // //                   👎 {p.dislikeCount ?? 0}
// // // // //                 </button>

// // // // //                 <button
// // // // //                   disabled={repostingIds.includes(p.postId)}
// // // // //                   onClick={async () => {
// // // // //                     try {
// // // // //                       setRepostingIds((s) => [...s, p.postId]);
// // // // //                       const res = await repostPost(p.postId);
// // // // //                       const repostUi = convertDtoToUiPost(res);
// // // // //                       setPosts((prev) => [repostUi, ...prev]);
// // // // //                       alert("Reposted!");
// // // // //                     } catch (e) {
// // // // //                       console.error("Repost failed", e.response ?? e.message ?? e);
// // // // //                       const msg = e.response?.error || e.response?.message || e.message || "Repost failed";
// // // // //                       alert(msg);
// // // // //                     } finally {
// // // // //                       setRepostingIds((s) => s.filter((x) => x !== p.postId));
// // // // //                     }
// // // // //                   }}
// // // // //                   className="btn"
// // // // //                 >
// // // // //                   🔁 Repost
// // // // //                 </button>

// // // // //                 {canDeletePostFor(p) && (
// // // // //                   <button className="btn danger" onClick={() => handleDelete(p)}>
// // // // //                     🗑️ Delete
// // // // //                   </button>
// // // // //                 )}
// // // // //               </div>

// // // // //               <div style={{ marginTop: 12 }}>
// // // // //                 <CommentsSection postId={p.postId} />
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
// // // // import { votePost, deletePostAsManager } from "../../Services/postsService";
// // // // import "./Feed.css";
// // // // import CommentsSection from "../CommentsSection/CommentsSection";
// // // // import TagChips from "../Tags/TagChips";

// // // // /**
// // // //  * Frontend-only soft-delete strategy:
// // // //  * - When a manager "deletes" a post we remove it from the feed state
// // // //  * - We record a commit in localStorage under key "localPostCommits"
// // // //  * - "My Posts" UI should read localPostCommits and render deleted-post entries
// // // //  */

// // // // const API_BASE =
// // // //   import.meta.env.VITE_API_BASE_URL ||
// // // //   import.meta.env.VITE_API ||
// // // //   "http://localhost:5294";

// // // // const LOCAL_COMMITS_KEY = "localPostCommits";

// // // // export default function Feed() {
// // // //   const [user, setUser] = useState(null);
// // // //   const [posts, setPosts] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [repostingIds, setRepostingIds] = useState([]);

// // // //   const navigate = useNavigate();
// // // //   const location = useLocation();

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
// // // //       if (!res.ok) return [];
// // // //       const data = await res.json();
// // // //       const arr = Array.isArray(data) ? data : data?.posts ?? [];
// // // //       return normalizePostsArray(arr);
// // // //     } catch {
// // // //       return [];
// // // //     }
// // // //   }, [navigate]);

// // // //   function toElements(rawBody, idSeed) {
// // // //     let elements = [];
// // // //     try {
// // // //       const parsed = rawBody ? JSON.parse(rawBody) : [];
// // // //       elements = Array.isArray(parsed)
// // // //         ? parsed.map((el, i) => ({
// // // //             id: el.id ?? `${idSeed}-${i}`,
// // // //             type: (el.type ?? "text").toString().toLowerCase(),
// // // //             content: el.content ?? el.body ?? "",
// // // //             imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
// // // //             imageName: el.imageName ?? "",
// // // //           }))
// // // //         : [{ id: `${idSeed}-single`, type: "text", content: String(rawBody || "") }];
// // // //     } catch {
// // // //       elements = [{ id: `${idSeed}-single`, type: "text", content: String(rawBody || "") }];
// // // //     }
// // // //     return elements;
// // // //   }

// // // //   /**
// // // //    * normalizePostsArray
// // // //    * - robustly detect reposts
// // // //    * - ensure React key `id` is unique even if postId duplicates (original + repost share numeric postId)
// // // //    *   -> include createdAt timestamp for uniqueness when present (especially for repost rows).
// // // //    */
// // // //   function normalizePostsArray(arr) {
// // // //     return (arr || []).map((p, idx) => {
// // // //       const postId = Number(p.postId ?? p.PostId ?? 0);
// // // //       const title = p.title ?? p.Title ?? "";
// // // //       const rawBody = p.body ?? p.Body ?? "";
// // // //       const createdAtRaw = p.createdAt ?? p.CreatedAt ?? null;
// // // //       const createdAtIso = createdAtRaw ? new Date(createdAtRaw).toISOString() : null;

// // // //       const elements = toElements(rawBody, postId || idx);

// // // //       const tags =
// // // //         p.tags ?? p.Tags ?? (p.postTags ?? p.PostTags)?.map((pt) => {
// // // //           const tag = pt.tag ?? pt.Tag;
// // // //           return {
// // // //             TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
// // // //             TagName: tag?.tagName ?? tag?.TagName ?? pt.tagName ?? pt.TagName,
// // // //             DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
// // // //           };
// // // //         }) ?? [];

// // // //       const deptId = Number(
// // // //         p.deptId ??
// // // //           p.DeptId ??
// // // //           p.dept?.deptId ??
// // // //           p.Dept?.DeptId ??
// // // //           p.departmentId ??
// // // //           p.DepartmentId ??
// // // //           0
// // // //       );

// // // //       const departmentName = p.departmentName ?? p.DepartmentName ?? p?.Dept?.DeptName ?? "";

// // // //       // robust repost detection (explicit flag or title prefix)
// // // //       const isRepostFlag = Boolean(
// // // //         p.isRepost ??
// // // //         p.IsRepost ??
// // // //         (typeof title === "string" && title.trim().toLowerCase().startsWith("[repost"))
// // // //       );

// // // //       // stable created fallback if missing
// // // //       const stableCreated = createdAtIso ?? `${idx}-${Date.now()}`;

// // // //       // unique UI id: include createdAt for repost rows
// // // //       const uiId = isRepostFlag
// // // //         ? `post-${postId || "0"}-repost-${stableCreated}`
// // // //         : `post-${postId || `${idx}-${stableCreated}`}-orig`;

// // // //       return {
// // // //         id: uiId,
// // // //         postId,
// // // //         deptId,
// // // //         title,
// // // //         elements,
// // // //         tags,
// // // //         createdAt: createdAtIso ?? new Date().toISOString(),
// // // //         authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
// // // //         departmentName,
// // // //         likeCount: p.upvoteCount ?? p.UpvoteCount ?? 0,
// // // //         dislikeCount: p.downvoteCount ?? p.DownvoteCount ?? 0,
// // // //         userVote: p.userVote ?? p.UserVote ?? 0,
// // // //         raw: p,
// // // //         isRepost: isRepostFlag,
// // // //       };
// // // //     });
// // // //   }

// // // //   useEffect(() => {
// // // //     (async () => {
// // // //       setLoading(true);
// // // //       try {
// // // //         const [me, postsList] = await Promise.all([fetchMe().catch(() => null), loadPosts()]);
// // // //         if (!me) {
// // // //           clearToken();
// // // //           navigate("/login", { replace: true });
// // // //           return;
// // // //         }
// // // //         setUser(me);

// // // //         // Filter out locally deleted posts on initial load
// // // //         const localDeletedIds = getLocalCommits().map((c) => c.postId);
// // // //         const filtered = (postsList || []).filter((p) => !localDeletedIds.includes(p.postId));
// // // //         setPosts(filtered);

// // // //         const depts = Array.from(new Set((filtered || []).map((x) => x.departmentName).filter(Boolean))).sort();
// // // //         try { localStorage.setItem("deptOptions", JSON.stringify(depts)); } catch {}
// // // //       } catch {
// // // //         clearToken();
// // // //         navigate("/login", { replace: true });
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     })();
// // // //   }, [navigate, loadPosts]);

// // // //   function currentUserDeptId() {
// // // //     return Number(
// // // //       user?.departmentId ??
// // // //         user?.DepartmentId ??
// // // //         user?.deptId ??
// // // //         user?.Department?.DeptId ??
// // // //         user?.department?.id ??
// // // //         0
// // // //     );
// // // //   }

// // // //   const isManager = () => String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

// // // //   /**
// // // //    * canDeletePostFor: Original intent preserved (manager + same dept id).
// // // //    * Fallback: if numeric deptId is missing on post, compare departmentName case-insensitively.
// // // //    * This fixes the common situation where API returns departmentName but not deptId.
// // // //    */
// // // //   function canDeletePostFor(p) {
// // // //     if (!isManager()) return false;

// // // //     const myDept = currentUserDeptId();

// // // //     // try numeric comparison first
// // // //     const postDeptNumeric = Number(p.deptId ?? p.DeptId ?? p.raw?.deptId ?? 0);
// // // //     if (myDept && postDeptNumeric) {
// // // //       return Number(myDept) === Number(postDeptNumeric);
// // // //     }

// // // //     // fallback to department name comparison (case-insensitive)
// // // //     const myDeptName = String(user?.departmentName ?? user?.DepartmentName ?? user?.department?.name ?? "").trim().toLowerCase();
// // // //     const postDeptName = String(p.departmentName ?? p.DepartmentName ?? p.raw?.departmentName ?? "").trim().toLowerCase();

// // // //     // debug: remove/comment this line in production if you don't want console output
// // // //     console.debug("canDeletePostFor", { isManager: true, myDept, postDeptNumeric, myDeptName, postDeptName });

// // // //     if (myDeptName && postDeptName) {
// // // //       return myDeptName === postDeptName;
// // // //     }

// // // //     return false;
// // // //   }

// // // //   /* ======================================================
// // // //      local-commit helpers (kept in-file for simplicity)
// // // //   ====================================================== */
// // // //   function getLocalCommits() {
// // // //     try {
// // // //       const raw = localStorage.getItem(LOCAL_COMMITS_KEY);
// // // //       if (!raw) return [];
// // // //       return JSON.parse(raw);
// // // //     } catch {
// // // //       return [];
// // // //     }
// // // //   }

// // // //   function saveLocalCommits(arr) {
// // // //     try {
// // // //       localStorage.setItem(LOCAL_COMMITS_KEY, JSON.stringify(arr || []));
// // // //     } catch {}
// // // //   }

// // // //   function addLocalCommit(commit) {
// // // //     const arr = getLocalCommits();
// // // //     arr.unshift(commit);
// // // //     saveLocalCommits(arr);
// // // //   }

// // // //   /* ======================================================
// // // //      HANDLE DELETE (soft-local)
// // // //   ====================================================== */
// // // //   async function handleDelete(p) {
// // // //     // if user is not a manager, tell them they cannot delete
// // // //     if (!isManager()) {
// // // //       alert("Only managers can delete posts");
// // // //       return;
// // // //     }

// // // //     const reason = prompt("Enter reason for deleting this post (required):");
// // // //     if (!reason || !reason.trim()) return;

// // // //     try {
// // // //       // call backend so Commits are recorded there (and backend can handle FK/cascade appropriately)
// // // //       await deletePostAsManager(p.postId, reason);

// // // //       // also keep local commit to hide the post for this browser
// // // //       const managerId = Number(user?.userId ?? user?.UserId ?? user?.id ?? 0);
// // // //       const managerName = user?.fullName ?? user?.FullName ?? user?.name ?? user?.Name ?? "(manager)";
// // // //       const commit = {
// // // //         postId: p.postId,
// // // //         postTitle: p.title || "(untitled)",
// // // //         authorName: p.authorName || "(unknown)",
// // // //         managerId,
// // // //         managerName,
// // // //         reason: String(reason).trim(),
// // // //         createdAt: new Date().toISOString()
// // // //       };

// // // //       addLocalCommit(commit);
// // // //       setPosts((prev) => prev.filter((x) => x.postId !== p.postId));

// // // //       alert("Post deleted (hidden) successfully.");
// // // //     } catch (err) {
// // // //       console.error(err);
// // // //       alert(err?.message || "Failed to delete post");
// // // //     }
// // // //   }

// // // //   function handleVote(postId, value) {
// // // //     votePost(postId, value)
// // // //       .then((r) => {
// // // //         setPosts((prev) =>
// // // //           prev.map((p) =>
// // // //             p.postId === postId
// // // //               ? {
// // // //                   ...p,
// // // //                   likeCount: r?.likeCount ?? p.likeCount,
// // // //                   dislikeCount: r?.dislikeCount ?? p.dislikeCount,
// // // //                   userVote: r?.userVote ?? p.userVote,
// // // //                 }
// // // //               : p
// // // //           )
// // // //         );
// // // //       })
// // // //       .catch((e) => alert(e.message || "Vote failed"));
// // // //   }

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

// // // //   if (loading) return <div className="loading">Loading...</div>;

// // // //   const fmt = (ts) => {
// // // //     const d = new Date(ts);
// // // //     return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// // // //   };

// // // //   // ensure prepend-created repost uses same id scheme as normalizePostsArray
// // // //   function convertDtoToUiPost(dto) {
// // // //     const postId = Number(dto.postId ?? dto.PostId ?? 0);
// // // //     const createdAtIso = dto.createdAt ? new Date(dto.createdAt).toISOString() : new Date().toISOString();
// // // //     const uiId = `post-${postId || "0"}-repost-${createdAtIso}`;

// // // //     const elements = toElements(dto.body ?? dto.Body ?? "", postId || "r");
// // // //     const deptId = Number(dto.deptId ?? dto.DeptId ?? dto.dept?.deptId ?? dto.Dept?.DeptId ?? 0);

// // // //     return {
// // // //       id: uiId,
// // // //       postId,
// // // //       deptId,
// // // //       title: dto.title ?? "",
// // // //       elements,
// // // //       tags: dto.tags ?? [],
// // // //       createdAt: dto.createdAt ?? new Date().toISOString(),
// // // //       authorName: dto.authorName ?? "Unknown",
// // // //       departmentName: dto.departmentName ?? "",
// // // //       likeCount: dto.upvoteCount ?? dto.UpvoteCount ?? 0,
// // // //       dislikeCount: dto.downvoteCount ?? dto.DownvoteCount ?? 0,
// // // //       userVote: 0,
// // // //       raw: dto,
// // // //       isRepost: true,
// // // //     };
// // // //   }

// // // //   return (
// // // //     <div className="feed-page">
// // // //       <main className="feed-main" style={{ padding: 16 }}>
// // // //         {filteredPosts.length === 0 ? (
// // // //           <div className="no-posts">No matching posts.</div>
// // // //         ) : (
// // // //           filteredPosts.map((p) => (
// // // //             <article key={p.id} className="post-item">
// // // //               <header className="post-header">
// // // //                 <h2 className="post-title">{p.title || "Untitled Post"}</h2>
// // // //                 <div className="post-meta">
// // // //                   {/* <<< only change: minimal <img> line with onError to stop blinking; everything else left as-is */}
// // // //                   {(() => {
// // // //                     const profileSrc =
// // // //                       p.raw?.profileUrl ??
// // // //                       p.raw?.authorProfileUrl ??
// // // //                       p.raw?.author?.profileUrl ??
// // // //                       p.raw?.userProfileUrl ??
// // // //                       p.raw?.profile?.url ??
// // // //                       null;

// // // //                     // If there is a profileSrc, render the <img> (with onError protective handler).
// // // //                     // If profileSrc is null, render nothing here (we do not inject new placeholders or alter layout).
// // // //                     if (profileSrc) {
// // // //                       return (
// // // //                         <img
// // // //                           src={profileSrc}
// // // //                           alt="profile"
// // // //                           className="avatar"
// // // //                           onError={(e) => {
// // // //                             e.currentTarget.onerror = null;
// // // //                             e.currentTarget.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
// // // //                           }}
// // // //                         />
// // // //                       );
// // // //                     }
// // // //                     return null;
// // // //                   })()}

// // // //                   <span className="author">👤 <strong>{p.authorName}</strong></span>
// // // //                   <span className="timestamp">📅 {fmt(p.createdAt)}</span>
// // // //                   {p.departmentName ? <span className="dept">🏢 {p.departmentName}</span> : null}
// // // //                   {p.isRepost ? <span className="badge" style={{ marginLeft: 8 }}>🔁 Repost</span> : null}
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
// // // //                         <img src={src} alt={el.imageName || "image"} className="feed-image" loading="lazy" />
// // // //                       </div>
// // // //                     );
// // // //                   }
// // // //                   return null;
// // // //                 })}
// // // //               </div>

// // // //               <TagChips tags={p.tags} />

// // // //               <div className="post-actions" style={{ marginTop: 8, display: "flex", gap: 8 }}>
// // // //                 <button
// // // //                   className="btn"
// // // //                   aria-label="Like"
// // // //                   onClick={() => handleVote(p.postId, +1)}
// // // //                   style={p.userVote === 1 ? { borderColor: "#2563eb", background: "#eff6ff" } : null}
// // // //                 >
// // // //                   👍 {p.likeCount ?? 0}
// // // //                 </button>

// // // //                 <button
// // // //                   className="btn"
// // // //                   aria-label="Dislike"
// // // //                   onClick={() => handleVote(p.postId, -1)}
// // // //                   style={p.userVote === -1 ? { borderColor: "#ef4444", background: "#fef2f2" } : null}
// // // //                 >
// // // //                   👎 {p.dislikeCount ?? 0}
// // // //                 </button>

// // // //                 <button
// // // //                   disabled={repostingIds.includes(p.postId)}
// // // //                   onClick={async () => {
// // // //                     try {
// // // //                       setRepostingIds((s) => [...s, p.postId]);
// // // //                       const res = await repostPost(p.postId);
// // // //                       const repostUi = convertDtoToUiPost(res);
// // // //                       setPosts((prev) => [repostUi, ...prev]);
// // // //                       alert("Reposted!");
// // // //                     } catch (e) {
// // // //                       console.error("Repost failed", e.response ?? e.message ?? e);
// // // //                       const msg = e.response?.error || e.response?.message || e.message || "Repost failed";
// // // //                       alert(msg);
// // // //                     } finally {
// // // //                       setRepostingIds((s) => s.filter((x) => x !== p.postId));
// // // //                     }
// // // //                   }}
// // // //                   className="btn"
// // // //                 >
// // // //                   🔁 Repost
// // // //                 </button>

// // // //                 {canDeletePostFor(p) && (
// // // //                   <button className="btn danger" onClick={() => handleDelete(p)}>
// // // //                     🗑️ Delete
// // // //                   </button>
// // // //                 )}
// // // //               </div>

// // // //               <div style={{ marginTop: 12 }}>
// // // //                 <CommentsSection postId={p.postId} />
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
// // // import { votePost, deletePostAsManager } from "../../Services/postsService";
// // // import "./Feed.css";
// // // import CommentsSection from "../CommentsSection/CommentsSection";
// // // import TagChips from "../Tags/TagChips";

// // // /**
// // //  * Frontend-only soft-delete strategy:
// // //  * - When a manager "deletes" a post we remove it from the feed state
// // //  * - We record a commit in localStorage under key "localPostCommits"
// // //  * - "My Posts" UI should read localPostCommits and render deleted-post entries
// // //  */

// // // const API_BASE =
// // //   import.meta.env.VITE_API_BASE_URL ||
// // //   import.meta.env.VITE_API ||
// // //   "http://localhost:5294";

// // // const LOCAL_COMMITS_KEY = "localPostCommits";

// // // export default function Feed() {
// // //   const [user, setUser] = useState(null);
// // //   const [posts, setPosts] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [repostingIds, setRepostingIds] = useState([]);

// // //   const navigate = useNavigate();
// // //   const location = useLocation();

// // //   // ---------- START minimal blink-fix effect ----------
// // //   // This effect is intentionally tiny and non-invasive:
// // //   // - It patches any <img class="avatar"> with empty/broken src to a transparent GIF
// // //   // - It attaches a safe onerror handler to stop retries/blinking
// // //   // - Observes DOM additions so newly mounted avatars are patched too
// // //   useEffect(() => {
// // //     const TRANSPARENT_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

// // //     function safeFixImg(img) {
// // //       try {
// // //         if (!img) return;
// // //         // If src is missing/empty, set to transparent so browser won't retry
// // //         const srcVal = img.getAttribute && img.getAttribute("src");
// // //         if (!srcVal || String(srcVal).trim() === "") {
// // //           img.src = TRANSPARENT_GIF;
// // //           return;
// // //         }
// // //         // Attach a one-time onerror to replace with transparent gif if loading fails
// // //         if (!img._blinkFixAttached) {
// // //           img._blinkFixAttached = true;
// // //           img.onerror = function () {
// // //             try {
// // //               img.onerror = null;
// // //               img.src = TRANSPARENT_GIF;
// // //             } catch (e) {
// // //               /* swallow */
// // //             }
// // //           };
// // //         }
// // //       } catch (e) {
// // //         // swallow errors — do not affect app flow
// // //       }
// // //     }

// // //     // Initial pass for avatars already in DOM
// // //     try {
// // //       const existing = Array.from(document.querySelectorAll("img.avatar"));
// // //       existing.forEach(safeFixImg);
// // //     } catch (e) {}

// // //     // Observe future DOM additions (e.g., reposts, lazy-rendered posts)
// // //     const observer = new MutationObserver((mutations) => {
// // //       for (const m of mutations) {
// // //         if (!m.addedNodes) continue;
// // //         m.addedNodes.forEach((node) => {
// // //           try {
// // //             if (!node) return;
// // //             if (node.nodeType !== 1) return;
// // //             const el = /** @type {Element} */ (node);
// // //             if (el.matches && el.matches("img.avatar")) {
// // //               safeFixImg(el);
// // //             } else if (el.querySelectorAll) {
// // //               const inner = el.querySelectorAll("img.avatar");
// // //               if (inner && inner.length) Array.from(inner).forEach(safeFixImg);
// // //             }
// // //           } catch (err) {
// // //             /* swallow */
// // //           }
// // //         });
// // //       }
// // //     });

// // //     observer.observe(document.body, { childList: true, subtree: true });

// // //     return () => observer.disconnect();
// // //   }, []);
// // //   // ---------- END blink-fix effect ----------

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

// // //   function toElements(rawBody, idSeed) {
// // //     let elements = [];
// // //     try {
// // //       const parsed = rawBody ? JSON.parse(rawBody) : [];
// // //       elements = Array.isArray(parsed)
// // //         ? parsed.map((el, i) => ({
// // //             id: el.id ?? `${idSeed}-${i}`,
// // //             type: (el.type ?? "text").toString().toLowerCase(),
// // //             content: el.content ?? el.body ?? "",
// // //             imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
// // //             imageName: el.imageName ?? "",
// // //           }))
// // //         : [{ id: `${idSeed}-single`, type: "text", content: String(rawBody || "") }];
// // //     } catch {
// // //       elements = [{ id: `${idSeed}-single`, type: "text", content: String(rawBody || "") }];
// // //     }
// // //     return elements;
// // //   }

// // //   /**
// // //    * normalizePostsArray
// // //    * - robustly detect reposts
// // //    * - ensure React key `id` is unique even if postId duplicates (original + repost share numeric postId)
// // //    *   -> include createdAt timestamp for uniqueness when present (especially for repost rows).
// // //    */
// // //   function normalizePostsArray(arr) {
// // //     return (arr || []).map((p, idx) => {
// // //       const postId = Number(p.postId ?? p.PostId ?? 0);
// // //       const title = p.title ?? p.Title ?? "";
// // //       const rawBody = p.body ?? p.Body ?? "";
// // //       const createdAtRaw = p.createdAt ?? p.CreatedAt ?? null;
// // //       const createdAtIso = createdAtRaw ? new Date(createdAtRaw).toISOString() : null;

// // //       const elements = toElements(rawBody, postId || idx);

// // //       const tags =
// // //         p.tags ?? p.Tags ?? (p.postTags ?? p.PostTags)?.map((pt) => {
// // //           const tag = pt.tag ?? pt.Tag;
// // //           return {
// // //             TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
// // //             TagName: tag?.tagName ?? tag?.TagName ?? pt.tagName ?? pt.TagName,
// // //             DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
// // //           };
// // //         }) ?? [];

// // //       const deptId = Number(
// // //         p.deptId ??
// // //           p.DeptId ??
// // //           p.dept?.deptId ??
// // //           p.Dept?.DeptId ??
// // //           p.departmentId ??
// // //           p.DepartmentId ??
// // //           0
// // //       );

// // //       const departmentName = p.departmentName ?? p.DepartmentName ?? p?.Dept?.DeptName ?? "";

// // //       // robust repost detection (explicit flag or title prefix)
// // //       const isRepostFlag = Boolean(
// // //         p.isRepost ??
// // //         p.IsRepost ??
// // //         (typeof title === "string" && title.trim().toLowerCase().startsWith("[repost"))
// // //       );

// // //       // stable created fallback if missing
// // //       const stableCreated = createdAtIso ?? `${idx}-${Date.now()}`;

// // //       // unique UI id: include createdAt for repost rows
// // //       const uiId = isRepostFlag
// // //         ? `post-${postId || "0"}-repost-${stableCreated}`
// // //         : `post-${postId || `${idx}-${stableCreated}`}-orig`;

// // //       return {
// // //         id: uiId,
// // //         postId,
// // //         deptId,
// // //         title,
// // //         elements,
// // //         tags,
// // //         createdAt: createdAtIso ?? new Date().toISOString(),
// // //         authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
// // //         departmentName,
// // //         likeCount: p.upvoteCount ?? p.UpvoteCount ?? 0,
// // //         dislikeCount: p.downvoteCount ?? p.DownvoteCount ?? 0,
// // //         userVote: p.userVote ?? p.UserVote ?? 0,
// // //         raw: p,
// // //         isRepost: isRepostFlag,
// // //       };
// // //     });
// // //   }

// // //   useEffect(() => {
// // //     (async () => {
// // //       setLoading(true);
// // //       try {
// // //         const [me, postsList] = await Promise.all([fetchMe().catch(() => null), loadPosts()]);
// // //         if (!me) {
// // //           clearToken();
// // //           navigate("/login", { replace: true });
// // //           return;
// // //         }
// // //         setUser(me);

// // //         // Filter out locally deleted posts on initial load
// // //         const localDeletedIds = getLocalCommits().map((c) => c.postId);
// // //         const filtered = (postsList || []).filter((p) => !localDeletedIds.includes(p.postId));
// // //         setPosts(filtered);

// // //         const depts = Array.from(new Set((filtered || []).map((x) => x.departmentName).filter(Boolean))).sort();
// // //         try { localStorage.setItem("deptOptions", JSON.stringify(depts)); } catch {}
// // //       } catch {
// // //         clearToken();
// // //         navigate("/login", { replace: true });
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     })();
// // //   }, [navigate, loadPosts]);

// // //   function currentUserDeptId() {
// // //     return Number(
// // //       user?.departmentId ??
// // //         user?.DepartmentId ??
// // //         user?.deptId ??
// // //         user?.Department?.DeptId ??
// // //         user?.department?.id ??
// // //         0
// // //     );
// // //   }

// // //   const isManager = () => String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

// // //   /**
// // //    * canDeletePostFor: Original intent preserved (manager + same dept id).
// // //    * Fallback: if numeric deptId is missing on post, compare departmentName case-insensitively.
// // //    * This fixes the common situation where API returns departmentName but not deptId.
// // //    */
// // //   function canDeletePostFor(p) {
// // //     if (!isManager()) return false;

// // //     const myDept = currentUserDeptId();

// // //     // try numeric comparison first
// // //     const postDeptNumeric = Number(p.deptId ?? p.DeptId ?? p.raw?.deptId ?? 0);
// // //     if (myDept && postDeptNumeric) {
// // //       return Number(myDept) === Number(postDeptNumeric);
// // //     }

// // //     // fallback to department name comparison (case-insensitive)
// // //     const myDeptName = String(user?.departmentName ?? user?.DepartmentName ?? user?.department?.name ?? "").trim().toLowerCase();
// // //     const postDeptName = String(p.departmentName ?? p.DepartmentName ?? p.raw?.departmentName ?? "").trim().toLowerCase();

// // //     // debug: remove/comment this line in production if you don't want console output
// // //     console.debug("canDeletePostFor", { isManager: true, myDept, postDeptNumeric, myDeptName, postDeptName });

// // //     if (myDeptName && postDeptName) {
// // //       return myDeptName === postDeptName;
// // //     }

// // //     return false;
// // //   }

// // //   /* ======================================================
// // //      local-commit helpers (kept in-file for simplicity)
// // //   ====================================================== */
// // //   function getLocalCommits() {
// // //     try {
// // //       const raw = localStorage.getItem(LOCAL_COMMITS_KEY);
// // //       if (!raw) return [];
// // //       return JSON.parse(raw);
// // //     } catch {
// // //       return [];
// // //     }
// // //   }

// // //   function saveLocalCommits(arr) {
// // //     try {
// // //       localStorage.setItem(LOCAL_COMMITS_KEY, JSON.stringify(arr || []));
// // //     } catch {}
// // //   }

// // //   function addLocalCommit(commit) {
// // //     const arr = getLocalCommits();
// // //     arr.unshift(commit);
// // //     saveLocalCommits(arr);
// // //   }

// // //   /* ======================================================
// // //      HANDLE DELETE (soft-local)
// // //   ====================================================== */
// // //   async function handleDelete(p) {
// // //     // if user is not a manager, tell them they cannot delete
// // //     if (!isManager()) {
// // //       alert("Only managers can delete posts");
// // //       return;
// // //     }

// // //     const reason = prompt("Enter reason for deleting this post (required):");
// // //     if (!reason || !reason.trim()) return;

// // //     try {
// // //       // call backend so Commits are recorded there (and backend can handle FK/cascade appropriately)
// // //       await deletePostAsManager(p.postId, reason);

// // //       // also keep local commit to hide the post for this browser
// // //       const managerId = Number(user?.userId ?? user?.UserId ?? user?.id ?? 0);
// // //       const managerName = user?.fullName ?? user?.FullName ?? user?.name ?? user?.Name ?? "(manager)";
// // //       const commit = {
// // //         postId: p.postId,
// // //         postTitle: p.title || "(untitled)",
// // //         authorName: p.authorName || "(unknown)",
// // //         managerId,
// // //         managerName,
// // //         reason: String(reason).trim(),
// // //         createdAt: new Date().toISOString()
// // //       };

// // //       addLocalCommit(commit);
// // //       setPosts((prev) => prev.filter((x) => x.postId !== p.postId));

// // //       alert("Post deleted (hidden) successfully.");
// // //     } catch (err) {
// // //       console.error(err);
// // //       alert(err?.message || "Failed to delete post");
// // //     }
// // //   }

// // //   function handleVote(postId, value) {
// // //     votePost(postId, value)
// // //       .then((r) => {
// // //         setPosts((prev) =>
// // //           prev.map((p) =>
// // //             p.postId === postId
// // //               ? {
// // //                   ...p,
// // //                   likeCount: r?.likeCount ?? p.likeCount,
// // //                   dislikeCount: r?.dislikeCount ?? p.dislikeCount,
// // //                   userVote: r?.userVote ?? p.userVote,
// // //                 }
// // //               : p
// // //           )
// // //         );
// // //       })
// // //       .catch((e) => alert(e.message || "Vote failed"));
// // //   }

// // //   const filteredPosts = useMemo(() => {
// // //     const q = (qParam || "").trim();
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

// // //   // ensure prepend-created repost uses same id scheme as normalizePostsArray
// // //   function convertDtoToUiPost(dto) {
// // //     const postId = Number(dto.postId ?? dto.PostId ?? 0);
// // //     const createdAtIso = dto.createdAt ? new Date(dto.createdAt).toISOString() : new Date().toISOString();
// // //     const uiId = `post-${postId || "0"}-repost-${createdAtIso}`;

// // //     const elements = toElements(dto.body ?? dto.Body ?? "", postId || "r");
// // //     const deptId = Number(dto.deptId ?? dto.DeptId ?? dto.dept?.deptId ?? dto.Dept?.DeptId ?? 0);

// // //     return {
// // //       id: uiId,
// // //       postId,
// // //       deptId,
// // //       title: dto.title ?? "",
// // //       elements,
// // //       tags: dto.tags ?? [],
// // //       createdAt: dto.createdAt ?? new Date().toISOString(),
// // //       authorName: dto.authorName ?? "Unknown",
// // //       departmentName: dto.departmentName ?? "",
// // //       likeCount: dto.upvoteCount ?? dto.UpvoteCount ?? 0,
// // //       dislikeCount: dto.downvoteCount ?? dto.DownvoteCount ?? 0,
// // //       userVote: 0,
// // //       raw: dto,
// // //       isRepost: true,
// // //     };
// // //   }

// // //   return (
// // //     <div className="feed-page">
// // //       <main className="feed-main" style={{ padding: 16 }}>
// // //         {filteredPosts.length === 0 ? (
// // //           <div className="no-posts">No matching posts.</div>
// // //         ) : (
// // //           filteredPosts.map((p) => (
// // //             <article key={p.id} className="post-item">
// // //               <header className="post-header">
// // //                 <h2 className="post-title">{p.title || "Untitled Post"}</h2>
// // //                 <div className="post-meta">
// // //                   {/* <<< no layout changes here; this file is unchanged except for blink-fix effect above */}
// // //                   {(() => {
// // //                     const profileSrc =
// // //                       p.raw?.profileUrl ??
// // //                       p.raw?.authorProfileUrl ??
// // //                       p.raw?.author?.profileUrl ??
// // //                       p.raw?.userProfileUrl ??
// // //                       p.raw?.profile?.url ??
// // //                       null;

// // //                     if (profileSrc) {
// // //                       return (
// // //                         <img
// // //                           src={profileSrc}
// // //                           alt="profile"
// // //                           className="avatar"
// // //                         />
// // //                       );
// // //                     }
// // //                     return null;
// // //                   })()}

// // //                   <span className="author">👤 <strong>{p.authorName}</strong></span>
// // //                   <span className="timestamp">📅 {fmt(p.createdAt)}</span>
// // //                   {p.departmentName ? <span className="dept">🏢 {p.departmentName}</span> : null}
// // //                   {p.isRepost ? <span className="badge" style={{ marginLeft: 8 }}>🔁 Repost</span> : null}
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
// // //                   className="btn"
// // //                   aria-label="Like"
// // //                   onClick={() => handleVote(p.postId, +1)}
// // //                   style={p.userVote === 1 ? { borderColor: "#2563eb", background: "#eff6ff" } : null}
// // //                 >
// // //                   👍 {p.likeCount ?? 0}
// // //                 </button>

// // //                 <button
// // //                   className="btn"
// // //                   aria-label="Dislike"
// // //                   onClick={() => handleVote(p.postId, -1)}
// // //                   style={p.userVote === -1 ? { borderColor: "#ef4444", background: "#fef2f2" } : null}
// // //                 >
// // //                   👎 {p.dislikeCount ?? 0}
// // //                 </button>

// // //                 <button
// // //                   disabled={repostingIds.includes(p.postId)}
// // //                   onClick={async () => {
// // //                     try {
// // //                       setRepostingIds((s) => [...s, p.postId]);
// // //                       const res = await repostPost(p.postId);
// // //                       const repostUi = convertDtoToUiPost(res);
// // //                       setPosts((prev) => [repostUi, ...prev]);
// // //                       alert("Reposted!");
// // //                     } catch (e) {
// // //                       console.error("Repost failed", e.response ?? e.message ?? e);
// // //                       const msg = e.response?.error || e.response?.message || e.message || "Repost failed";
// // //                       alert(msg);
// // //                     } finally {
// // //                       setRepostingIds((s) => s.filter((x) => x !== p.postId));
// // //                     }
// // //                   }}
// // //                   className="btn"
// // //                 >
// // //                   🔁 Repost
// // //                 </button>

// // //                 {canDeletePostFor(p) && (
// // //                   <button className="btn danger" onClick={() => handleDelete(p)}>
// // //                     🗑️ Delete
// // //                   </button>
// // //                 )}
// // //               </div>

// // //               <div style={{ marginTop: 12 }}>
// // //                 <CommentsSection postId={p.postId} />
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
// // import { votePost, deletePostAsManager } from "../../Services/postsService";
// // import "./Feed.css";
// // import CommentsSection from "../CommentsSection/CommentsSection";
// // import TagChips from "../Tags/TagChips";

// // /**
// //  * Frontend-only soft-delete strategy:
// //  * - When a manager "deletes" a post we remove it from the feed state
// //  * - We record a commit in localStorage under key "localPostCommits"
// //  * - "My Posts" UI should read localPostCommits and render deleted-post entries
// //  */

// // const API_BASE =
// //   import.meta.env.VITE_API_BASE_URL ||
// //   import.meta.env.VITE_API ||
// //   "http://localhost:5294";

// // const LOCAL_COMMITS_KEY = "localPostCommits";

// // export default function Feed() {
// //   const [user, setUser] = useState(null);
// //   const [posts, setPosts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [repostingIds, setRepostingIds] = useState([]);

// //   const navigate = useNavigate();
// //   const location = useLocation();

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

// //   function toElements(rawBody, idSeed) {
// //     let elements = [];
// //     try {
// //       const parsed = rawBody ? JSON.parse(rawBody) : [];
// //       elements = Array.isArray(parsed)
// //         ? parsed.map((el, i) => ({
// //             id: el.id ?? `${idSeed}-${i}`,
// //             type: (el.type ?? "text").toString().toLowerCase(),
// //             content: el.content ?? el.body ?? "",
// //             imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
// //             imageName: el.imageName ?? "",
// //           }))
// //         : [{ id: `${idSeed}-single`, type: "text", content: String(rawBody || "") }];
// //     } catch {
// //       elements = [{ id: `${idSeed}-single`, type: "text", content: String(rawBody || "") }];
// //     }
// //     return elements;
// //   }

// //   /**
// //    * normalizePostsArray
// //    * - robustly detect reposts
// //    * - ensure React key `id` is unique even if postId duplicates (original + repost share numeric postId)
// //    *   -> include createdAt timestamp for uniqueness when present (especially for repost rows).
// //    */
// //   function normalizePostsArray(arr) {
// //     return (arr || []).map((p, idx) => {
// //       const postId = Number(p.postId ?? p.PostId ?? 0);
// //       const title = p.title ?? p.Title ?? "";
// //       const rawBody = p.body ?? p.Body ?? "";
// //       const createdAtRaw = p.createdAt ?? p.CreatedAt ?? null;
// //       const createdAtIso = createdAtRaw ? new Date(createdAtRaw).toISOString() : null;

// //       const elements = toElements(rawBody, postId || idx);

// //       const tags =
// //         p.tags ?? p.Tags ?? (p.postTags ?? p.PostTags)?.map((pt) => {
// //           const tag = pt.tag ?? pt.Tag;
// //           return {
// //             TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
// //             TagName: tag?.tagName ?? tag?.TagName ?? pt.tagName ?? pt.TagName,
// //             DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
// //           };
// //         }) ?? [];

// //       const deptId = Number(
// //         p.deptId ??
// //           p.DeptId ??
// //           p.dept?.deptId ??
// //           p.Dept?.DeptId ??
// //           p.departmentId ??
// //           p.DepartmentId ??
// //           0
// //       );

// //       const departmentName = p.departmentName ?? p.DepartmentName ?? p?.Dept?.DeptName ?? "";

// //       // robust repost detection (explicit flag or title prefix)
// //       const isRepostFlag = Boolean(
// //         p.isRepost ??
// //         p.IsRepost ??
// //         (typeof title === "string" && title.trim().toLowerCase().startsWith("[repost"))
// //       );

// //       // stable created fallback if missing
// //       const stableCreated = createdAtIso ?? `${idx}-${Date.now()}`;

// //       // unique UI id: include createdAt for repost rows
// //       const uiId = isRepostFlag
// //         ? `post-${postId || "0"}-repost-${stableCreated}`
// //         : `post-${postId || `${idx}-${stableCreated}`}-orig`;

// //       return {
// //         id: uiId,
// //         postId,
// //         deptId,
// //         title,
// //         elements,
// //         tags,
// //         createdAt: createdAtIso ?? new Date().toISOString(),
// //         authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
// //         departmentName,
// //         likeCount: p.upvoteCount ?? p.UpvoteCount ?? 0,
// //         dislikeCount: p.downvoteCount ?? p.DownvoteCount ?? 0,
// //         userVote: p.userVote ?? p.UserVote ?? 0,
// //         raw: p,
// //         isRepost: isRepostFlag,
// //       };
// //     });
// //   }

// //   useEffect(() => {
// //     (async () => {
// //       setLoading(true);
// //       try {
// //         const [me, postsList] = await Promise.all([fetchMe().catch(() => null), loadPosts()]);
// //         if (!me) {
// //           clearToken();
// //           navigate("/login", { replace: true });
// //           return;
// //         }
// //         setUser(me);

// //         // Filter out locally deleted posts on initial load
// //         const localDeletedIds = getLocalCommits().map((c) => c.postId);
// //         const filtered = (postsList || []).filter((p) => !localDeletedIds.includes(p.postId));
// //         setPosts(filtered);

// //         const depts = Array.from(new Set((filtered || []).map((x) => x.departmentName).filter(Boolean))).sort();
// //         try { localStorage.setItem("deptOptions", JSON.stringify(depts)); } catch {}
// //       } catch {
// //         clearToken();
// //         navigate("/login", { replace: true });
// //       } finally {
// //         setLoading(false);
// //       }
// //     })();
// //   }, [navigate, loadPosts]);

// //   function currentUserDeptId() {
// //     return Number(
// //       user?.departmentId ??
// //         user?.DepartmentId ??
// //         user?.deptId ??
// //         user?.Department?.DeptId ??
// //         user?.department?.id ??
// //         0
// //     );
// //   }

// //   const isManager = () => String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

// //   /**
// //    * canDeletePostFor: Original intent preserved (manager + same dept id).
// //    * Fallback: if numeric deptId is missing on post, compare departmentName case-insensitively.
// //    * This fixes the common situation where API returns departmentName but not deptId.
// //    */
// //   function canDeletePostFor(p) {
// //     if (!isManager()) return false;

// //     const myDept = currentUserDeptId();

// //     // try numeric comparison first
// //     const postDeptNumeric = Number(p.deptId ?? p.DeptId ?? p.raw?.deptId ?? 0);
// //     if (myDept && postDeptNumeric) {
// //       return Number(myDept) === Number(postDeptNumeric);
// //     }

// //     // fallback to department name comparison (case-insensitive)
// //     const myDeptName = String(user?.departmentName ?? user?.DepartmentName ?? user?.department?.name ?? "").trim().toLowerCase();
// //     const postDeptName = String(p.departmentName ?? p.DepartmentName ?? p.raw?.departmentName ?? "").trim().toLowerCase();

// //     // debug: remove/comment this line in production if you don't want console output
// //     console.debug("canDeletePostFor", { isManager: true, myDept, postDeptNumeric, myDeptName, postDeptName });

// //     if (myDeptName && postDeptName) {
// //       return myDeptName === postDeptName;
// //     }

// //     return false;
// //   }

// //   /* ======================================================
// //      local-commit helpers (kept in-file for simplicity)
// //   ====================================================== */
// //   function getLocalCommits() {
// //     try {
// //       const raw = localStorage.getItem(LOCAL_COMMITS_KEY);
// //       if (!raw) return [];
// //       return JSON.parse(raw);
// //     } catch {
// //       return [];
// //     }
// //   }

// //   function saveLocalCommits(arr) {
// //     try {
// //       localStorage.setItem(LOCAL_COMMITS_KEY, JSON.stringify(arr || []));
// //     } catch {}
// //   }

// //   function addLocalCommit(commit) {
// //     const arr = getLocalCommits();
// //     arr.unshift(commit);
// //     saveLocalCommits(arr);
// //   }

// //   /* ======================================================
// //      HANDLE DELETE (soft-local)
// //   ====================================================== */
// //   async function handleDelete(p) {
// //     // if user is not a manager, tell them they cannot delete
// //     if (!isManager()) {
// //       alert("Only managers can delete posts");
// //       return;
// //     }

// //     const reason = prompt("Enter reason for deleting this post (required):");
// //     if (!reason || !reason.trim()) return;

// //     try {
// //       // call backend so Commits are recorded there (and backend can handle FK/cascade appropriately)
// //       await deletePostAsManager(p.postId, reason);

// //       // also keep local commit to hide the post for this browser
// //       const managerId = Number(user?.userId ?? user?.UserId ?? user?.id ?? 0);
// //       const managerName = user?.fullName ?? user?.FullName ?? user?.name ?? user?.Name ?? "(manager)";
// //       const commit = {
// //         postId: p.postId,
// //         postTitle: p.title || "(untitled)",
// //         authorName: p.authorName || "(unknown)",
// //         managerId,
// //         managerName,
// //         reason: String(reason).trim(),
// //         createdAt: new Date().toISOString()
// //       };

// //       addLocalCommit(commit);
// //       setPosts((prev) => prev.filter((x) => x.postId !== p.postId));

// //       alert("Post deleted (hidden) successfully.");
// //     } catch (err) {
// //       console.error(err);
// //       alert(err?.message || "Failed to delete post");
// //     }
// //   }

// //   function handleVote(postId, value) {
// //     votePost(postId, value)
// //       .then((r) => {
// //         setPosts((prev) =>
// //           prev.map((p) =>
// //             p.postId === postId
// //               ? {
// //                   ...p,
// //                   likeCount: r?.likeCount ?? p.likeCount,
// //                   dislikeCount: r?.dislikeCount ?? p.dislikeCount,
// //                   userVote: r?.userVote ?? p.userVote,
// //                 }
// //               : p
// //           )
// //         );
// //       })
// //       .catch((e) => alert(e.message || "Vote failed"));
// //   }

// //   const filteredPosts = useMemo(() => {
// //     const q = (qParam || "").trim();
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

// //   // ensure prepend-created repost uses same id scheme as normalizePostsArray
// //   function convertDtoToUiPost(dto) {
// //     const postId = Number(dto.postId ?? dto.PostId ?? 0);
// //     const createdAtIso = dto.createdAt ? new Date(dto.createdAt).toISOString() : new Date().toISOString();
// //     const uiId = `post-${postId || "0"}-repost-${createdAtIso}`;

// //     const elements = toElements(dto.body ?? dto.Body ?? "", postId || "r");
// //     const deptId = Number(dto.deptId ?? dto.DeptId ?? dto.dept?.deptId ?? dto.Dept?.DeptId ?? 0);

// //     return {
// //       id: uiId,
// //       postId,
// //       deptId,
// //       title: dto.title ?? "",
// //       elements,
// //       tags: dto.tags ?? [],
// //       createdAt: dto.createdAt ?? new Date().toISOString(),
// //       authorName: dto.authorName ?? "Unknown",
// //       departmentName: dto.departmentName ?? "",
// //       likeCount: dto.upvoteCount ?? dto.UpvoteCount ?? 0,
// //       dislikeCount: dto.downvoteCount ?? dto.DownvoteCount ?? 0,
// //       userVote: 0,
// //       raw: dto,
// //       isRepost: true,
// //     };
// //   }

// //   return (
// //     <div className="feed-page">
// //       <main className="feed-main" style={{ padding: 16 }}>
// //         {filteredPosts.length === 0 ? (
// //           <div className="no-posts">No matching posts.</div>
// //         ) : (
// //           filteredPosts.map((p) => (
// //             <article key={p.id} className="post-item">
// //               <header className="post-header">
// //                 <h2 className="post-title">{p.title || "Untitled Post"}</h2>
// //                 <div className="post-meta">
// //                   {/* avatar: show image if present, otherwise show initial (first letter of name) */}
// //                   {(() => {
// //                     const profileSrc =
// //                       p.raw?.profileUrl ??
// //                       p.raw?.authorProfileUrl ??
// //                       p.raw?.author?.profileUrl ??
// //                       p.raw?.userProfileUrl ??
// //                       p.raw?.profile?.url ??
// //                       null;

// //                     if (profileSrc) {
// //                       return (
// //                         <img
// //                           src={profileSrc}
// //                           alt="profile"
// //                           className="avatar"
// //                           onError={(e) => {
// //                             // stop retries and keep layout stable
// //                             try {
// //                               e.currentTarget.onerror = null;
// //                               e.currentTarget.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
// //                             } catch {}
// //                           }}
// //                         />
// //                       );
// //                     }

// //                     // derive a sensible initial
// //                     const rawName =
// //                       p.authorName ??
// //                       p.AuthorName ??
// //                       p.raw?.authorName ??
// //                       p.raw?.userName ??
// //                       p.raw?.name ??
// //                       "";
// //                     const initial = String(rawName || "").trim().charAt(0).toUpperCase() || "?";

// //                     // Inline styles to avoid editing CSS file — keeps layout identical
// //                     return (
// //                       <div
// //                         className="avatar initials"
// //                         aria-hidden="true"
// //                         style={{
// //                           width: 36,
// //                           height: 36,
// //                           borderRadius: "50%",
// //                           display: "inline-flex",
// //                           alignItems: "center",
// //                           justifyContent: "center",
// //                           marginRight: 8,
// //                           border: "1px solid #e5e7eb",
// //                           backgroundColor: "#e6eef8",
// //                           color: "#0f172a",
// //                           fontWeight: 600,
// //                           fontSize: "14px",
// //                           textTransform: "uppercase",
// //                           userSelect: "none",
// //                         }}
// //                       >
// //                         {initial}
// //                       </div>
// //                     );
// //                   })()}

// //                   <span className="author">👤 <strong>{p.authorName}</strong></span>
// //                   <span className="timestamp">📅 {fmt(p.createdAt)}</span>
// //                   {p.departmentName ? <span className="dept">🏢 {p.departmentName}</span> : null}
// //                   {p.isRepost ? <span className="badge" style={{ marginLeft: 8 }}>🔁 Repost</span> : null}
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

// //               <div className="post-actions" style={{ marginTop: 8, display: "flex", gap: 8 }}>
// //                 <button
// //                   className="btn"
// //                   aria-label="Like"
// //                   onClick={() => handleVote(p.postId, +1)}
// //                   style={p.userVote === 1 ? { borderColor: "#2563eb", background: "#eff6ff" } : null}
// //                 >
// //                   👍 {p.likeCount ?? 0}
// //                 </button>

// //                 <button
// //                   className="btn"
// //                   aria-label="Dislike"
// //                   onClick={() => handleVote(p.postId, -1)}
// //                   style={p.userVote === -1 ? { borderColor: "#ef4444", background: "#fef2f2" } : null}
// //                 >
// //                   👎 {p.dislikeCount ?? 0}
// //                 </button>

// //                 <button
// //                   disabled={repostingIds.includes(p.postId)}
// //                   onClick={async () => {
// //                     try {
// //                       setRepostingIds((s) => [...s, p.postId]);
// //                       const res = await repostPost(p.postId);
// //                       const repostUi = convertDtoToUiPost(res);
// //                       setPosts((prev) => [repostUi, ...prev]);
// //                       alert("Reposted!");
// //                     } catch (e) {
// //                       console.error("Repost failed", e.response ?? e.message ?? e);
// //                       const msg = e.response?.error || e.response?.message || e.message || "Repost failed";
// //                       alert(msg);
// //                     } finally {
// //                       setRepostingIds((s) => s.filter((x) => x !== p.postId));
// //                     }
// //                   }}
// //                   className="btn"
// //                 >
// //                   🔁 Repost
// //                 </button>

// //                 {canDeletePostFor(p) && (
// //                   <button className="btn danger" onClick={() => handleDelete(p)}>
// //                     🗑️ Delete
// //                   </button>
// //                 )}
// //               </div>

// //               <div style={{ marginTop: 12 }}>
// //                 <CommentsSection postId={p.postId} />
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
// import { votePost, deletePostAsManager } from "../../Services/postsService";
// import "./Feed.css";
// import CommentsSection from "../CommentsSection/CommentsSection";
// import TagChips from "../Tags/TagChips";

// /**
//  * Frontend-only soft-delete strategy:
//  * - When a manager "deletes" a post we remove it from the feed state
//  * - We record a commit in localStorage under key "localPostCommits"
//  * - "My Posts" UI should read localPostCommits and render deleted-post entries
//  */

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL ||
//   import.meta.env.VITE_API ||
//   "http://localhost:5294";

// const LOCAL_COMMITS_KEY = "localPostCommits";

// export default function Feed() {
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [repostingIds, setRepostingIds] = useState([]);

//   const navigate = useNavigate();
//   const location = useLocation();

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

//   function toElements(rawBody, idSeed) {
//     let elements = [];
//     try {
//       const parsed = rawBody ? JSON.parse(rawBody) : [];
//       elements = Array.isArray(parsed)
//         ? parsed.map((el, i) => ({
//             id: el.id ?? `${idSeed}-${i}`,
//             type: (el.type ?? "text").toString().toLowerCase(),
//             content: el.content ?? el.body ?? "",
//             imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
//             imageName: el.imageName ?? "",
//           }))
//         : [{ id: `${idSeed}-single`, type: "text", content: String(rawBody || "") }];
//     } catch {
//       elements = [{ id: `${idSeed}-single`, type: "text", content: String(rawBody || "") }];
//     }
//     return elements;
//   }

//   function normalizePostsArray(arr) {
//     return (arr || []).map((p, idx) => {
//       const postId = Number(p.postId ?? p.PostId ?? 0);
//       const title = p.title ?? p.Title ?? "";
//       const rawBody = p.body ?? p.Body ?? "";
//       const createdAtRaw = p.createdAt ?? p.CreatedAt ?? null;
//       const createdAtIso = createdAtRaw ? new Date(createdAtRaw).toISOString() : null;

//       const elements = toElements(rawBody, postId || idx);

//       const tags =
//         p.tags ?? p.Tags ?? (p.postTags ?? p.PostTags)?.map((pt) => {
//           const tag = pt.tag ?? pt.Tag;
//           return {
//             TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
//             TagName: tag?.tagName ?? tag?.TagName ?? pt.tagName ?? pt.TagName,
//             DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
//           };
//         }) ?? [];

//       const deptId = Number(
//         p.deptId ??
//           p.DeptId ??
//           p.dept?.deptId ??
//           p.Dept?.DeptId ??
//           p.departmentId ??
//           p.DepartmentId ??
//           0
//       );

//       const departmentName = p.departmentName ?? p.DepartmentName ?? p?.Dept?.DeptName ?? "";

//       const isRepostFlag = Boolean(
//         p.isRepost ??
//         p.IsRepost ??
//         (typeof title === "string" && title.trim().toLowerCase().startsWith("[repost"))
//       );

//       const stableCreated = createdAtIso ?? `${idx}-${Date.now()}`;

//       const uiId = isRepostFlag
//         ? `post-${postId || "0"}-repost-${stableCreated}`
//         : `post-${postId || `${idx}-${stableCreated}`}-orig`;

//       return {
//         id: uiId,
//         postId,
//         deptId,
//         title,
//         elements,
//         tags,
//         createdAt: createdAtIso ?? new Date().toISOString(),
//         authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
//         departmentName,
//         likeCount: p.upvoteCount ?? p.UpvoteCount ?? 0,
//         dislikeCount: p.downvoteCount ?? p.DownvoteCount ?? 0,
//         userVote: p.userVote ?? p.UserVote ?? 0,
//         raw: p,
//         isRepost: isRepostFlag,
//       };
//     });
//   }

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const [me, postsList] = await Promise.all([fetchMe().catch(() => null), loadPosts()]);
//         if (!me) {
//           clearToken();
//           navigate("/login", { replace: true });
//           return;
//         }
//         setUser(me);

//         const localDeletedIds = getLocalCommits().map((c) => c.postId);
//         const filtered = (postsList || []).filter((p) => !localDeletedIds.includes(p.postId));
//         setPosts(filtered);

//         const depts = Array.from(new Set((filtered || []).map((x) => x.departmentName).filter(Boolean))).sort();
//         try { localStorage.setItem("deptOptions", JSON.stringify(depts)); } catch {}
//       } catch {
//         clearToken();
//         navigate("/login", { replace: true });
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [navigate, loadPosts]);

//   function currentUserDeptId() {
//     return Number(
//       user?.departmentId ??
//         user?.DepartmentId ??
//         user?.deptId ??
//         user?.Department?.DeptId ??
//         user?.department?.id ??
//         0
//     );
//   }

//   const isManager = () => String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

//   function canDeletePostFor(p) {
//     if (!isManager()) return false;

//     const myDept = currentUserDeptId();
//     const postDeptNumeric = Number(p.deptId ?? p.DeptId ?? p.raw?.deptId ?? 0);
//     if (myDept && postDeptNumeric) {
//       return Number(myDept) === Number(postDeptNumeric);
//     }

//     const myDeptName = String(user?.departmentName ?? user?.DepartmentName ?? user?.department?.name ?? "").trim().toLowerCase();
//     const postDeptName = String(p.departmentName ?? p.DepartmentName ?? p.raw?.departmentName ?? "").trim().toLowerCase();

//     if (myDeptName && postDeptName) {
//       return myDeptName === postDeptName;
//     }

//     return false;
//   }

//   function getLocalCommits() {
//     try {
//       const raw = localStorage.getItem(LOCAL_COMMITS_KEY);
//       if (!raw) return [];
//       return JSON.parse(raw);
//     } catch {
//       return [];
//     }
//   }

//   function saveLocalCommits(arr) {
//     try {
//       localStorage.setItem(LOCAL_COMMITS_KEY, JSON.stringify(arr || []));
//     } catch {}
//   }

//   function addLocalCommit(commit) {
//     const arr = getLocalCommits();
//     arr.unshift(commit);
//     saveLocalCommits(arr);
//   }

//   async function handleDelete(p) {
//     if (!isManager()) {
//       alert("Only managers can delete posts");
//       return;
//     }

//     const reason = prompt("Enter reason for deleting this post (required):");
//     if (!reason || !reason.trim()) return;

//     try {
//       await deletePostAsManager(p.postId, reason);

//       const managerId = Number(user?.userId ?? user?.UserId ?? user?.id ?? 0);
//       const managerName = user?.fullName ?? user?.FullName ?? user?.name ?? user?.Name ?? "(manager)";
//       const commit = {
//         postId: p.postId,
//         postTitle: p.title || "(untitled)",
//         authorName: p.authorName || "(unknown)",
//         managerId,
//         managerName,
//         reason: String(reason).trim(),
//         createdAt: new Date().toISOString()
//       };

//       addLocalCommit(commit);
//       setPosts((prev) => prev.filter((x) => x.postId !== p.postId));

//       alert("Post deleted (hidden) successfully.");
//     } catch (err) {
//       console.error(err);
//       alert(err?.message || "Failed to delete post");
//     }
//   }

//   function handleVote(postId, value) {
//     votePost(postId, value)
//       .then((r) => {
//         setPosts((prev) =>
//           prev.map((p) =>
//             p.postId === postId
//               ? {
//                   ...p,
//                   likeCount: r?.likeCount ?? p.likeCount,
//                   dislikeCount: r?.dislikeCount ?? p.dislikeCount,
//                   userVote: r?.userVote ?? p.userVote,
//                 }
//               : p
//           )
//         );
//       })
//       .catch((e) => alert(e.message || "Vote failed"));
//   }

//   const filteredPosts = useMemo(() => {
//     const q = (qParam || "").trim();
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

//   function convertDtoToUiPost(dto) {
//     const postId = Number(dto.postId ?? dto.PostId ?? 0);
//     const createdAtIso = dto.createdAt ? new Date(dto.createdAt).toISOString() : new Date().toISOString();
//     const uiId = `post-${postId || "0"}-repost-${createdAtIso}`;

//     const elements = toElements(dto.body ?? dto.Body ?? "", postId || "r");
//     const deptId = Number(dto.deptId ?? dto.DeptId ?? dto.dept?.deptId ?? dto.Dept?.DeptId ?? 0);

//     return {
//       id: uiId,
//       postId,
//       deptId,
//       title: dto.title ?? "",
//       elements,
//       tags: dto.tags ?? [],
//       createdAt: dto.createdAt ?? new Date().toISOString(),
//       authorName: dto.authorName ?? "Unknown",
//       departmentName: dto.departmentName ?? "",
//       likeCount: dto.upvoteCount ?? dto.UpvoteCount ?? 0,
//       dislikeCount: dto.downvoteCount ?? dto.DownvoteCount ?? 0,
//       userVote: 0,
//       raw: dto,
//       isRepost: true,
//     };
//   }

//   return (
//     <div className="feed-page">
//       <main className="feed-main" style={{ padding: 16 }}>
//         {filteredPosts.length === 0 ? (
//           <div className="no-posts">No matching posts.</div>
//         ) : (
//           filteredPosts.map((p) => (
//             <article key={p.id} className="post-item">
//               <header className="post-header">
//                 <h2 className="post-title">{p.title || "Untitled Post"}</h2>
//                 <div className="post-meta">
//                   {/* avatar logic */}
//                   {(() => {
//                     const profileSrc =
//                       p.raw?.profileUrl ??
//                       p.raw?.authorProfileUrl ??
//                       p.raw?.author?.profileUrl ??
//                       p.raw?.userProfileUrl ??
//                       p.raw?.profile?.url ??
//                       null;

//                     const rawName =
//                       p.authorName ??
//                       p.AuthorName ??
//                       p.raw?.authorName ??
//                       p.raw?.userName ??
//                       p.raw?.name ??
//                       "";
//                     const initial = String((rawName || "").trim().charAt(0)).toUpperCase() || "?";

//                     if (profileSrc) {
//                       return (
//                         <img
//                           src={profileSrc}
//                           alt="profile"
//                           className="avatar"
//                           onError={(e) => {
//                             e.currentTarget.onerror = null;
//                             e.currentTarget.style.display = "none";
//                             const fallback = document.createElement("div");
//                             fallback.className = "avatar-initial";
//                             fallback.textContent = initial;
//                             e.currentTarget.parentNode.insertBefore(fallback, e.currentTarget.nextSibling);
//                           }}
//                         />
//                       );
//                     }

//                     return (
//                       <div className="avatar-initial" aria-hidden="true">
//                         {initial}
//                       </div>
//                     );
//                   })()}

//                   <span className="author">👤 <strong>{p.authorName}</strong></span>
//                   <span className="timestamp">📅 {fmt(p.createdAt)}</span>
//                   {p.departmentName ? <span className="dept">🏢 {p.departmentName}</span> : null}
//                   {p.isRepost ? <span className="badge" style={{ marginLeft: 8 }}>🔁 Repost</span> : null}
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

//               <div className="post-actions" style={{ marginTop: 8, display: "flex", gap: 8 }}>
//                 <button
//                   className="btn"
//                   aria-label="Like"
//                   onClick={() => handleVote(p.postId, +1)}
//                   style={p.userVote === 1 ? { borderColor: "#2563eb", background: "#eff6ff" } : null}
//                 >
//                   👍 {p.likeCount ?? 0}
//                 </button>

//                 <button
//                   className="btn"
//                   aria-label="Dislike"
//                   onClick={() => handleVote(p.postId, -1)}
//                   style={p.userVote === -1 ? { borderColor: "#ef4444", background: "#fef2f2" } : null}
//                 >
//                   👎 {p.dislikeCount ?? 0}
//                 </button>

//                 <button
//                   disabled={repostingIds.includes(p.postId)}
//                   onClick={async () => {
//                     try {
//                       setRepostingIds((s) => [...s, p.postId]);
//                       const res = await repostPost(p.postId);
//                       const repostUi = convertDtoToUiPost(res);
//                       setPosts((prev) => [repostUi, ...prev]);
//                       alert("Reposted!");
//                     } catch (e) {
//                       console.error("Repost failed", e.response ?? e.message ?? e);
//                       const msg = e.response?.error || e.response?.message || e.message || "Repost failed";
//                       alert(msg);
//                     } finally {
//                       setRepostingIds((s) => s.filter((x) => x !== p.postId));
//                     }
//                   }}
//                   className="btn"
//                 >
//                   🔁 Repost
//                 </button>

//                 {canDeletePostFor(p) && (
//                   <button className="btn danger" onClick={() => handleDelete(p)}>
//                     🗑️ Delete
//                   </button>
//                 )}
//               </div>

//               <div style={{ marginTop: 12 }}>
//                 <CommentsSection postId={p.postId} />
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
import { votePost, deletePostAsManager } from "../../Services/postsService";
import "./Feed.css";
import CommentsSection from "../CommentsSection/CommentsSection";
import TagChips from "../Tags/TagChips";

/**
 * Frontend-only soft-delete strategy:
 * - When a manager "deletes" a post we remove it from the feed state
 * - We record a commit in localStorage under key "localPostCommits"
 * - "My Posts" UI should read localPostCommits and render deleted-post entries
 */

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API ||
  "http://localhost:5294";

const LOCAL_COMMITS_KEY = "localPostCommits";

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
      const createdAtRaw = p.createdAt ?? p.CreatedAt ?? null;
      const createdAtIso = createdAtRaw ? new Date(createdAtRaw).toISOString() : null;

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

      const deptId = Number(
        p.deptId ??
          p.DeptId ??
          p.dept?.deptId ??
          p.Dept?.DeptId ??
          p.departmentId ??
          p.DepartmentId ??
          0
      );

      const departmentName = p.departmentName ?? p.DepartmentName ?? p?.Dept?.DeptName ?? "";

      const isRepostFlag = Boolean(
        p.isRepost ??
        p.IsRepost ??
        (typeof title === "string" && title.trim().toLowerCase().startsWith("[repost"))
      );

      const stableCreated = createdAtIso ?? `${idx}-${Date.now()}`;

      const uiId = isRepostFlag
        ? `post-${postId || "0"}-repost-${stableCreated}`
        : `post-${postId || `${idx}-${stableCreated}`}-orig`;

      return {
        id: uiId,
        postId,
        deptId,
        title,
        elements,
        tags,
        createdAt: createdAtIso ?? new Date().toISOString(),
        authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
        departmentName,
        likeCount: p.upvoteCount ?? p.UpvoteCount ?? 0,
        dislikeCount: p.downvoteCount ?? p.DownvoteCount ?? 0,
        userVote: p.userVote ?? p.UserVote ?? 0,
        raw: p,
        isRepost: isRepostFlag,
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

        const localDeletedIds = getLocalCommits().map((c) => c.postId);
        const filtered = (postsList || []).filter((p) => !localDeletedIds.includes(p.postId));
        setPosts(filtered);

        const depts = Array.from(new Set((filtered || []).map((x) => x.departmentName).filter(Boolean))).sort();
        try { localStorage.setItem("deptOptions", JSON.stringify(depts)); } catch {}
      } catch {
        clearToken();
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, loadPosts]);

  function currentUserDeptId() {
    return Number(
      user?.departmentId ??
        user?.DepartmentId ??
        user?.deptId ??
        user?.Department?.DeptId ??
        user?.department?.id ??
        0
    );
  }

  const isManager = () => String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

  function canDeletePostFor(p) {
    if (!isManager()) return false;

    const myDept = currentUserDeptId();
    const postDeptNumeric = Number(p.deptId ?? p.DeptId ?? p.raw?.deptId ?? 0);
    if (myDept && postDeptNumeric) {
      return Number(myDept) === Number(postDeptNumeric);
    }

    const myDeptName = String(user?.departmentName ?? user?.DepartmentName ?? user?.department?.name ?? "").trim().toLowerCase();
    const postDeptName = String(p.departmentName ?? p.DepartmentName ?? p.raw?.departmentName ?? "").trim().toLowerCase();

    if (myDeptName && postDeptName) {
      return myDeptName === postDeptName;
    }

    return false;
  }

  function getLocalCommits() {
    try {
      const raw = localStorage.getItem(LOCAL_COMMITS_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  function saveLocalCommits(arr) {
    try {
      localStorage.setItem(LOCAL_COMMITS_KEY, JSON.stringify(arr || []));
    } catch {}
  }

  function addLocalCommit(commit) {
    const arr = getLocalCommits();
    arr.unshift(commit);
    saveLocalCommits(arr);
  }

  async function handleDelete(p) {
    if (!isManager()) {
      alert("Only managers can delete posts");
      return;
    }

    const reason = prompt("Enter reason for deleting this post (required):");
    if (!reason || !reason.trim()) return;

    try {
      await deletePostAsManager(p.postId, reason);

      const managerId = Number(user?.userId ?? user?.UserId ?? user?.id ?? 0);
      const managerName = user?.fullName ?? user?.FullName ?? user?.name ?? user?.Name ?? "(manager)";
      const commit = {
        postId: p.postId,
        postTitle: p.title || "(untitled)",
        authorName: p.authorName || "(unknown)",
        managerId,
        managerName,
        reason: String(reason).trim(),
        createdAt: new Date().toISOString()
      };

      addLocalCommit(commit);
      setPosts((prev) => prev.filter((x) => x.postId !== p.postId));

      alert("Post deleted (hidden) successfully.");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to delete post");
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

  function convertDtoToUiPost(dto) {
    const postId = Number(dto.postId ?? dto.PostId ?? 0);
    const createdAtIso = dto.createdAt ? new Date(dto.createdAt).toISOString() : new Date().toISOString();
    const uiId = `post-${postId || "0"}-repost-${createdAtIso}`;

    const elements = toElements(dto.body ?? dto.Body ?? "", postId || "r");
    const deptId = Number(dto.deptId ?? dto.DeptId ?? dto.dept?.deptId ?? dto.Dept?.DeptId ?? 0);

    return {
      id: uiId,
      postId,
      deptId,
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

                  {/* ---------- AVATAR: initial underneath + image on top ---------- */}
                  {(() => {
                    const profileSrc =
                      p.raw?.profileUrl ??
                      p.raw?.authorProfileUrl ??
                      p.raw?.author?.profileUrl ??
                      p.raw?.userProfileUrl ??
                      p.raw?.profile?.url ??
                      null;

                    const rawName =
                      p.authorName ??
                      p.AuthorName ??
                      p.raw?.authorName ??
                      p.raw?.userName ??
                      p.raw?.name ??
                      "";
                    const initial = String((rawName || "").trim().charAt(0)).toUpperCase() || "?";

                    // container keeps initial + img stacked; img is absolutely positioned above initial
                    return (
                      <div className="avatar-container" aria-hidden="true" title={rawName || "User"}>
                        {/* initial (always present, visible if image missing/fails) */}
                        <div className="avatar-initial">{initial}</div>

                        {/* image (if profileSrc exists) - otherwise not rendered */}
                        {profileSrc ? (
                          <img
                            src={profileSrc}
                            alt={`profile-${initial}`}
                            className="avatar avatar-top"
                            onError={(e) => {
                              try {
                                // hide broken image so initial remains visible
                                e.currentTarget.style.display = "none";
                                e.currentTarget.onerror = null;
                              } catch {}
                            }}
                          />
                        ) : null}
                      </div>
                    );
                  })()}

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
                  onClick={() => handleVote(p.postId, +1)}
                  style={p.userVote === 1 ? { borderColor: "#2563eb", background: "#eff6ff" } : null}
                >
                  👍 {p.likeCount ?? 0}
                </button>

                <button
                  className="btn"
                  aria-label="Dislike"
                  onClick={() => handleVote(p.postId, -1)}
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

                {canDeletePostFor(p) && (
                  <button className="btn danger" onClick={() => handleDelete(p)}>
                    🗑️ Delete
                  </button>
                )}
              </div>

              <div style={{ marginTop: 12 }}>
                <CommentsSection postId={p.postId} />
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
}
