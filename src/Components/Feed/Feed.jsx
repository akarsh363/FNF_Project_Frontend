// import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { clearToken, fetchMe, getToken as getStoredToken } from "../../Services/AuthService";
// import { repostPost } from "../../Services/repostService";
// import { votePost, deletePostAsManager } from "../../Services/postsService";
// import api from "../../Services/api"; // using new requestWithCache
// import "./Feed.css";
// import CommentsSection from "../CommentsSection/CommentsSection";
// import TagChips from "../Tags/TagChips";

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL ||
//   import.meta.env.VITE_API ||
//   "http://localhost:5294";

// const LOCAL_COMMITS_KEY = "localPostCommits";
// const LOCAL_FEED_POSTS_KEY = "feedPosts";

// const PAGE_SIZE = 20; // number of posts to render initially and per "page"

// export default function Feed() {
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]); // full list (normalized)
//   const [loading, setLoading] = useState(true);
//   const [repostingIds, setRepostingIds] = useState([]);

//   const [renderCount, setRenderCount] = useState(PAGE_SIZE); // number rendered
//   const loadMoreRef = useRef(null);

//   const navigate = useNavigate();
//   const location = useLocation();

//   // read URL params (existing behavior)
//   const urlParams = new URLSearchParams(location.search);
//   const qParam = (urlParams.get("q") || "").toLowerCase();
//   const deptParam = urlParams.get("dept") || "all";

//   // --- UI state for search/dept controls
//   const [searchQ, setSearchQ] = useState(qParam || "");
//   const [deptOptions, setDeptOptions] = useState(["all"]);
//   const [selectedDept, setSelectedDept] = useState(deptParam || "all");
//   const debounceRef = useRef(null);

//   // ---------- API loaders using caching ----------
//   const loadPostsRaw = useCallback(async () => {
//     // Use api.requestWithCache with a reasonable TTL (e.g. 30s) — safe and non-invasive.
//     // We prefer the endpoint path only; the backend will return same shape as before.
//     try {
//       const data = await api.requestWithCache("/api/Posts", { method: "GET" }, { ttl: 30, cacheKey: "/api/Posts" });
//       const arr = Array.isArray(data) ? data : data?.posts ?? [];
//       return arr;
//     } catch (e) {
//       // on error return empty array — feed logic handles it
//       return [];
//     }
//   }, []);

//   const loadMeCached = useCallback(async () => {
//     // cache me for 60s locally to avoid repeated heavy hits
//     try {
//       const data = await api.requestWithCache("/api/Auth/me", { method: "GET" }, { ttl: 60, cacheKey: "/api/Auth/me" });
//       return data;
//     } catch {
//       return null;
//     }
//   }, []);

//   // ---------- tag normalization helpers (keeps TagChips happy) ----------
//   function normalizeTagEntry(t, idx = 0) {
//     if (t == null) return null;
//     if (typeof t === "string") {
//       const name = t.trim();
//       if (!name) return null;
//       return name;
//     }
//     if (typeof t === "number") return String(t);

//     const tagId = t?.TagId ?? t?.tagId ?? t?.Id ?? t?.id ?? null;
//     const tagName = t?.TagName ?? t?.tagName ?? t?.name ?? t?.Name ?? null;
//     if (tagName || tagId != null) {
//       return { tagId: tagId ?? null, tagName: String(tagName ?? (tagId != null ? String(tagId) : "")) };
//     }
//     const inner = t.tag ?? t.Tag ?? t;
//     const innerId = inner?.TagId ?? inner?.tagId ?? inner?.id ?? null;
//     const innerName = inner?.TagName ?? inner?.tagName ?? inner?.name ?? null;
//     if (innerName || innerId != null) {
//       return { tagId: innerId ?? null, tagName: String(innerName ?? (innerId != null ? String(innerId) : "")) };
//     }
//     try {
//       const s = JSON.stringify(t);
//       if (s && s !== "{}") return s;
//     } catch {}
//     return null;
//   }

//   function extractTagsFromPost(p) {
//     const out = [];
//     if (Array.isArray(p.tags) && p.tags.length) {
//       p.tags.forEach((t, i) => { const n = normalizeTagEntry(t,i); if (n!=null) out.push(n); });
//       return out;
//     }
//     if (Array.isArray(p.Tags) && p.Tags.length) {
//       p.Tags.forEach((t, i) => { const n = normalizeTagEntry(t,i); if (n!=null) out.push(n); });
//       return out;
//     }
//     if (Array.isArray(p.postTags) && p.postTags.length) {
//       p.postTags.forEach((pt, i) => {
//         const c = pt.tag ?? pt.Tag ?? pt;
//         const n = normalizeTagEntry(c, i); if (n!=null) out.push(n);
//       });
//       return out;
//     }
//     if (Array.isArray(p.PostTags) && p.PostTags.length) {
//       p.PostTags.forEach((pt, i) => {
//         const c = pt.tag ?? pt.Tag ?? pt;
//         const n = normalizeTagEntry(c, i); if (n!=null) out.push(n);
//       });
//       return out;
//     }
//     if (typeof p.tags === "string" && p.tags.trim()) {
//       p.tags.split(",").forEach((s,i) => { const n = normalizeTagEntry(s.trim(), i); if (n!=null) out.push(n); });
//       return out;
//     }
//     if (typeof p.Tags === "string" && p.Tags.trim()) {
//       p.Tags.split(",").forEach((s,i) => { const n = normalizeTagEntry(s.trim(), i); if (n!=null) out.push(n); });
//       return out;
//     }
//     if (p.tag) { const n = normalizeTagEntry(p.tag,0); if (n!=null) out.push(n); }
//     if (p.Tag) { const n = normalizeTagEntry(p.Tag,0); if (n!=null) out.push(n); }
//     return out;
//   }

//   function mapTagsForTagChips(tags) {
//     if (!Array.isArray(tags) || tags.length === 0) return [];
//     return tags.map((t) => {
//       if (typeof t === "string") return t;
//       const id = t?.tagId ?? t?.TagId ?? null;
//       const name = t?.tagName ?? t?.TagName ?? t?.name ?? null;
//       if (name) return { tagId: id ?? null, tagName: String(name) };
//       try { return JSON.stringify(t); } catch { return String(t); }
//     }).filter(Boolean);
//   }

//   // ---------- posts normalization (keeps your original logic but integrates tag extraction) ----------
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
//       const postId = Number(p.postId ?? p.PostId ?? p.PostID ?? 0);
//       const title = p.title ?? p.Title ?? "";
//       const rawBody = p.body ?? p.Body ?? "";
//       const createdAtRaw = p.createdAt ?? p.CreatedAt ?? p.created_at ?? null;
//       const createdAtIso = createdAtRaw ? new Date(createdAtRaw).toISOString() : null;

//       const elements = toElements(rawBody, postId || idx);

//       const tags = extractTagsFromPost(p) || [];

//       const deptId = Number(
//         p.deptId ??
//         p.DeptId ??
//         p.dept?.deptId ??
//         p.Dept?.DeptId ??
//         p.departmentId ??
//         p.DepartmentId ??
//         0
//       );

//       const departmentName = p.departmentName ?? p.DepartmentName ?? (p.Dept && p.Dept.DeptName) ?? "";

//       const isRepostFlag = Boolean(
//         p.isRepost ?? p.IsRepost ?? (typeof title === "string" && title.trim().toLowerCase().startsWith("[repost"))
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
//         likeCount: p.upvoteCount ?? p.UpvoteCount ?? p.LikeCount ?? 0,
//         dislikeCount: p.downvoteCount ?? p.DownvoteCount ?? 0,
//         userVote: p.userVote ?? p.UserVote ?? 0,
//         raw: p,
//         isRepost: isRepostFlag,
//       };
//     });
//   }

//   // sync search + dept UI state when URL changes (so back/forward work)
//   useEffect(() => {
//     setSearchQ(qParam || "");
//     setSelectedDept(deptParam || "all");
//   }, [qParam, deptParam]);

//   // read dept options from localStorage (or derive from posts)
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("deptOptions");
//       const arr = raw ? JSON.parse(raw) : null;
//       if (Array.isArray(arr) && arr.length) {
//         const unique = ["all", ...Array.from(new Set(arr)).filter(Boolean)];
//         setDeptOptions(unique);
//       } else {
//         const depts = Array.from(new Set((posts || []).map((x) => x.departmentName).filter(Boolean))).sort();
//         setDeptOptions(["all", ...depts]);
//       }
//     } catch {
//       const depts = Array.from(new Set((posts || []).map((x) => x.departmentName).filter(Boolean))).sort();
//       setDeptOptions(["all", ...depts]);
//     }
//   }, [posts]);

//   // update URL (keeps behavior consistent)
//   function updateUrl(nextQ, nextDept) {
//     const p = new URLSearchParams(location.search);
//     if (nextQ) p.set("q", nextQ); else p.delete("q");
//     if (nextDept && nextDept !== "all") p.set("dept", nextDept); else p.delete("dept");
//     navigate({ pathname: location.pathname, search: p.toString() }, { replace: true });
//   }

//   // debounce search input before updating the URL
//   function onSearchChange(v) {
//     setSearchQ(v);
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => {
//       updateUrl(v.trim(), selectedDept);
//     }, 300);
//   }

//   function onDeptChange(v) {
//     setSelectedDept(v);
//     updateUrl(searchQ.trim(), v);
//   }

//   useEffect(() => {
//     return () => {
//       if (debounceRef.current) clearTimeout(debounceRef.current);
//     };
//   }, []);

//   // read any newly created posts that PostEditor stored to localStorage (key: feedPosts)
//   function consumeLocalCreatedPosts() {
//     try {
//       const raw = localStorage.getItem(LOCAL_FEED_POSTS_KEY);
//       if (!raw) return [];
//       localStorage.removeItem(LOCAL_FEED_POSTS_KEY);
//       const arr = JSON.parse(raw);
//       if (!Array.isArray(arr)) return [];
//       const normalized = normalizePostsArray(arr);
//       return normalized;
//     } catch {
//       return [];
//     }
//   }

//   // initial load: fetch me + posts (cached) and set posts state
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       setLoading(true);
//       try {
//         const [me, postsArr] = await Promise.all([loadMeCached(), loadPostsRaw()]);
//         if (!me) {
//           clearToken();
//           navigate("/login", { replace: true });
//           return;
//         }
//         if (!alive) return;
//         setUser(me);

//         const normalized = normalizePostsArray(postsArr || []);
//         const localDeletedIds = getLocalCommits().map((c) => c.postId);
//         let filtered = normalized.filter((p) => !localDeletedIds.includes(p.postId));

//         // prepend newly created posts from localStorage (if any)
//         try {
//           const createdLocal = consumeLocalCreatedPosts();
//           if (Array.isArray(createdLocal) && createdLocal.length) {
//             const existingPostIds = new Set(filtered.map((x) => Number(x.postId)));
//             const toPrepend = createdLocal.filter((c) => !existingPostIds.has(Number(c.postId)));
//             if (toPrepend.length) filtered = [...toPrepend, ...filtered];
//           }
//         } catch (e) {
//           console.warn("feed: could not consume local created posts", e);
//         }

//         if (!alive) return;
//         setPosts(filtered);

//         const depts = Array.from(new Set((filtered || []).map((x) => x.departmentName).filter(Boolean))).sort();
//         try { localStorage.setItem("deptOptions", JSON.stringify(depts)); } catch {}
//       } catch (err) {
//         console.error("feed load error", err);
//         clearToken();
//         navigate("/login", { replace: true });
//       } finally {
//         if (alive) setLoading(false);
//       }
//     })();
//     return () => { alive = false; };
//   }, [navigate, loadPostsRaw, loadMeCached]);

//   function currentUserDeptId() {
//     return Number(
//       user?.departmentId ??
//       user?.DepartmentId ??
//       user?.deptId ??
//       user?.Department?.DeptId ??
//       user?.department?.id ??
//       0
//     );
//   }

//   const isManager = () => String(user?.role ?? user?.Role ?? "").toLowerCase() === "manager";

//   function canDeletePostFor(p) {
//     if (!isManager()) return false;
//     const myDept = currentUserDeptId();
//     const postDeptNumeric = Number(p.deptId ?? p.DeptId ?? p.raw?.deptId ?? 0);
//     if (myDept && postDeptNumeric) return Number(myDept) === Number(postDeptNumeric);
//     const myDeptName = String(user?.departmentName ?? user?.DepartmentName ?? user?.department?.name ?? "").trim().toLowerCase();
//     const postDeptName = String(p.departmentName ?? p.DepartmentName ?? p.raw?.departmentName ?? "").trim().toLowerCase();
//     if (myDeptName && postDeptName) return myDeptName === postDeptName;
//     return false;
//   }

//   /* local-commit helpers (kept in-file for simplicity) */
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

//   /* HANDLE DELETE (soft-local) */
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

//   // filtering uses UI state first (searchQ & selectedDept) and falls back to URL params.
//   const filteredPosts = useMemo(() => {
//     const q = ((searchQ || qParam) || "").trim().toLowerCase();
//     const dept = ((selectedDept || deptParam) || "all").toLowerCase();

//     return posts.filter((p) => {
//       if (dept !== "all" && (p.departmentName || "").toLowerCase() !== dept) return false;
//       if (!q) return true;
//       const inTitle = (p.title || "").toLowerCase().includes(q);
//       const inText = (p.elements || []).some(
//         (el) => el.type === "text" && (el.content || "").toLowerCase().includes(q)
//       );
//       return inTitle || inText;
//     });
//   }, [posts, searchQ, selectedDept, qParam, deptParam]);

//   // incremental rendering: items to show
//   const shownPosts = useMemo(() => filteredPosts.slice(0, renderCount), [filteredPosts, renderCount]);

//   // infinite scroll observer to auto load more when bottom sentinel appears
//   useEffect(() => {
//     if (!loadMoreRef.current) return;
//     const observer = new IntersectionObserver((entries) => {
//       for (const e of entries) {
//         if (e.isIntersecting) {
//           setRenderCount((r) => Math.min(filteredPosts.length, r + PAGE_SIZE));
//         }
//       }
//     }, { root: null, rootMargin: "200px", threshold: 0.1 });
//     observer.observe(loadMoreRef.current);
//     return () => observer.disconnect();
//   }, [loadMoreRef.current, filteredPosts.length]);

//   if (loading) {
//     // simple skeleton: show small boxes equal to one page
//     return (
//       <div className="feed-page">
//         <main className="feed-main" style={{ padding: 16 }}>
//           <div className="feed-controls" role="region" aria-label="Feed controls">
//             <div style={{ width: 240, height: 36, background: "#eee", borderRadius: 8 }} />
//           </div>
//           {Array.from({ length: Math.min(PAGE_SIZE, 6) }).map((_, i) => (
//             <article key={i} className="post-item" aria-hidden>
//               <div style={{ display: "flex", gap: 12 }}>
//                 <div style={{ width: 36, height: 36, borderRadius: 18, background: "#eee" }} />
//                 <div style={{ flex: 1 }}>
//                   <div style={{ width: "60%", height: 14, background: "#eee", marginBottom: 8 }} />
//                   <div style={{ width: "40%", height: 12, background: "#eee" }} />
//                 </div>
//               </div>
//               <div style={{ marginTop: 12, height: 60, background: "#fafafa", borderRadius: 8 }} />
//             </article>
//           ))}
//         </main>
//       </div>
//     );
//   }

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
//       tags: dto.tags ?? dto.Tags ?? [],
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
//         {/* ====== Controls row: search + department ====== */}
//         <div className="feed-controls" role="region" aria-label="Feed controls">
//           <div className="feed-controls-left">
//             <h3 style={{ margin: 0 }}>Feed</h3>
//           </div>

//           <div className="feed-controls-right">
//             <input
//               type="search"
//               className="feed-search-input"
//               placeholder="Search posts (title or text)…"
//               value={searchQ}
//               onChange={(e) => onSearchChange(e.target.value)}
//               aria-label="Search posts"
//             />

//             <select
//               className="feed-dept-select"
//               value={selectedDept}
//               onChange={(e) => onDeptChange(e.target.value)}
//               aria-label="Filter by department"
//             >
//               {(deptOptions || ["all"]).map((d) => (
//                 <option key={d} value={d}>
//                   {d === "all" ? "All Departments" : d}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {shownPosts.length === 0 ? (
//           <div className="no-posts">No matching posts.</div>
//         ) : (
//           shownPosts.map((p) => (
//             <article key={p.id} className="post-item">
//               <header className="post-header">
//                 <h2 className="post-title">{p.title || "Untitled Post"}</h2>
//                 <div className="post-meta">
//                   {/* Avatar (initial + optional image) */}
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

//                     return (
//                       <div className="avatar-container" aria-hidden="true" title={rawName || "User"}>
//                         <div className="avatar-initial">{initial}</div>
//                         {profileSrc ? (
//                           <img
//                             src={profileSrc}
//                             alt={`profile-${initial}`}
//                             className="avatar avatar-top"
//                             onError={(e) => {
//                               try {
//                                 e.currentTarget.style.display = "none";
//                                 e.currentTarget.onerror = null;
//                               } catch {}
//                             }}
//                           />
//                         ) : null}
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

//               {/* TagChips: we map tags into the shapes it expects */}
//               <TagChips tags={mapTagsForTagChips(p.tags)} />

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

//         {/* sentinel: when visible, more items will load via IntersectionObserver */}
//         <div ref={loadMoreRef} style={{ height: 24, visibility: (renderCount < filteredPosts.length) ? "visible" : "hidden" }}>
//           {renderCount < filteredPosts.length ? "Loading more…" : null}
//         </div>
//       </main>
//     </div>
//   );
// }

// src/Components/Feed/Feed.jsx
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { clearToken, fetchMe, getToken as getStoredToken } from "../../Services/AuthService";
import { repostPost } from "../../Services/repostService";
import { votePost, deletePostAsManager } from "../../Services/postsService";
import "./Feed.css";
import CommentsSection from "../CommentsSection/CommentsSection";
import TagChips from "../Tags/TagChips";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API ||
  "http://localhost:5294";

const LOCAL_COMMITS_KEY = "localPostCommits";
const LOCAL_FEED_POSTS_KEY = "feedPosts";

/**
 * Feed component:
 * - robust tag normalization for multiple backend shapes
 * - preserves all existing functionality
 */

export default function Feed() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repostingIds, setRepostingIds] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  // read URL params (existing behavior)
  const urlParams = new URLSearchParams(location.search);
  const qParam = (urlParams.get("q") || "").toLowerCase();
  const deptParam = urlParams.get("dept") || "all";

  // --- UI state for search/dept controls
  const [searchQ, setSearchQ] = useState(qParam || "");
  const [deptOptions, setDeptOptions] = useState(["all"]);
  const [selectedDept, setSelectedDept] = useState(deptParam || "all");
  const debounceRef = useRef(null);

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

  // ---------- tag normalization helpers ----------
  function normalizeTagEntry(t, idx = 0) {
    if (t == null) return null;

    // plain string -> keep as string
    if (typeof t === "string") {
      const name = t.trim();
      return name ? name : null;
    }

    // numeric id -> string
    if (typeof t === "number") return String(t);

    // TagDto shape { TagId, TagName, DeptId } or lowercase
    const tagId = t?.TagId ?? t?.tagId ?? t?.id ?? t?.Id ?? null;
    const tagName = t?.TagName ?? t?.tagName ?? t?.name ?? t?.Name ?? null;
    if (tagName || tagId != null) {
      return { tagId: tagId ?? null, tagName: String(tagName ?? (tagId != null ? String(tagId) : "")) };
    }

    // nested shapes { tag: {...} } or { Tag: {...} }
    const inner = t.tag ?? t.Tag ?? t;
    const innerId = inner?.TagId ?? inner?.tagId ?? inner?.id ?? null;
    const innerName = inner?.TagName ?? inner?.tagName ?? inner?.name ?? null;
    if (innerName || innerId != null) {
      return { tagId: innerId ?? null, tagName: String(innerName ?? (innerId != null ? String(innerId) : "")) };
    }

    // fallback: stringify small objects
    try {
      const s = JSON.stringify(t);
      if (s && s !== "{}") return s;
    } catch {}
    return null;
  }

  function extractTagsFromPost(p) {
    const out = [];

    if (Array.isArray(p.tags) && p.tags.length) {
      p.tags.forEach((t, i) => {
        const n = normalizeTagEntry(t, i);
        if (n != null) out.push(n);
      });
      return out;
    }

    if (Array.isArray(p.Tags) && p.Tags.length) {
      p.Tags.forEach((t, i) => {
        const n = normalizeTagEntry(t, i);
        if (n != null) out.push(n);
      });
      return out;
    }

    // postTags / PostTags may have { tag: {...} } entries or PostTag link objects
    if (Array.isArray(p.postTags) && p.postTags.length) {
      p.postTags.forEach((pt, i) => {
        const candidate = pt.tag ?? pt.Tag ?? pt;
        const n = normalizeTagEntry(candidate, i);
        if (n != null) out.push(n);
      });
      return out;
    }
    if (Array.isArray(p.PostTags) && p.PostTags.length) {
      p.PostTags.forEach((pt, i) => {
        const candidate = pt.tag ?? pt.Tag ?? pt;
        const n = normalizeTagEntry(candidate, i);
        if (n != null) out.push(n);
      });
      return out;
    }

    // comma-separated strings
    if (typeof p.tags === "string" && p.tags.trim()) {
      p.tags.split(",").forEach((s, i) => {
        const n = normalizeTagEntry(s.trim(), i);
        if (n != null) out.push(n);
      });
      return out;
    }
    if (typeof p.Tags === "string" && p.Tags.trim()) {
      p.Tags.split(",").forEach((s, i) => {
        const n = normalizeTagEntry(s.trim(), i);
        if (n != null) out.push(n);
      });
      return out;
    }

    // single tag object
    if (p.tag) {
      const n = normalizeTagEntry(p.tag);
      if (n != null) out.push(n);
    } else if (p.Tag) {
      const n = normalizeTagEntry(p.Tag);
      if (n != null) out.push(n);
    }

    return out;
  }

  function mapTagsForTagChips(tags) {
    if (!Array.isArray(tags) || tags.length === 0) return [];
    return tags
      .map((t) => {
        if (typeof t === "string") return t;
        const id = t?.tagId ?? t?.TagId ?? null;
        const name = t?.tagName ?? t?.TagName ?? t?.name ?? null;
        if (name) return { tagId: id ?? null, tagName: String(name) };
        try {
          return JSON.stringify(t);
        } catch {
          return String(t);
        }
      })
      .filter(Boolean);
  }

  // ---------- posts normalization ----------
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
      const postId = Number(p.postId ?? p.PostId ?? p.PostID ?? 0);
      const title = p.title ?? p.Title ?? "";
      const rawBody = p.body ?? p.Body ?? "";
      const createdAtRaw = p.createdAt ?? p.CreatedAt ?? p.created_at ?? null;
      const createdAtIso = createdAtRaw ? new Date(createdAtRaw).toISOString() : null;

      const elements = toElements(rawBody, postId || idx);

      const tags = extractTagsFromPost(p) || [];

      const deptId = Number(
        p.deptId ??
        p.DeptId ??
        p.dept?.deptId ??
        p.Dept?.DeptId ??
        p.departmentId ??
        p.DepartmentId ??
        0
      );

      const departmentName = p.departmentName ?? p.DepartmentName ?? (p.Dept && p.Dept.DeptName) ?? "";

      const isRepostFlag = Boolean(
        p.isRepost ?? p.IsRepost ?? (typeof title === "string" && title.trim().toLowerCase().startsWith("[repost"))
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
        tags, // normalized tags array (strings or objects)
        createdAt: createdAtIso ?? new Date().toISOString(),
        authorName: p.authorName ?? p.AuthorName ?? p.userName ?? p.UserName ?? "Anonymous",
        departmentName,
        likeCount: p.upvoteCount ?? p.UpvoteCount ?? p.LikeCount ?? 0,
        dislikeCount: p.downvoteCount ?? p.DownvoteCount ?? 0,
        userVote: p.userVote ?? p.UserVote ?? 0,
        raw: p,
        isRepost: isRepostFlag,
      };
    });
  }

  // sync search + dept UI state when URL changes (so back/forward work)
  useEffect(() => {
    setSearchQ(qParam || "");
    setSelectedDept(deptParam || "all");
  }, [qParam, deptParam]);

  // read dept options from localStorage (or derive from posts)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("deptOptions");
      const arr = raw ? JSON.parse(raw) : null;
      if (Array.isArray(arr) && arr.length) {
        const unique = ["all", ...Array.from(new Set(arr)).filter(Boolean)];
        setDeptOptions(unique);
      } else {
        const depts = Array.from(new Set((posts || []).map((x) => x.departmentName).filter(Boolean))).sort();
        setDeptOptions(["all", ...depts]);
      }
    } catch {
      const depts = Array.from(new Set((posts || []).map((x) => x.departmentName).filter(Boolean))).sort();
      setDeptOptions(["all", ...depts]);
    }
  }, [posts]);

  // update URL (keeps behavior consistent with your existing q & dept param usage)
  function updateUrl(nextQ, nextDept) {
    const p = new URLSearchParams(location.search);
    if (nextQ) p.set("q", nextQ); else p.delete("q");
    if (nextDept && nextDept !== "all") p.set("dept", nextDept); else p.delete("dept");
    navigate({ pathname: location.pathname, search: p.toString() }, { replace: true });
  }

  // debounce search input before updating the URL
  function onSearchChange(v) {
    setSearchQ(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateUrl(v.trim(), selectedDept);
    }, 300);
  }

  function onDeptChange(v) {
    setSelectedDept(v);
    updateUrl(searchQ.trim(), v);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // consume newly created posts stored by PostEditor under LOCAL_FEED_POSTS_KEY
  function consumeLocalCreatedPosts() {
    try {
      const raw = localStorage.getItem(LOCAL_FEED_POSTS_KEY);
      if (!raw) return [];
      localStorage.removeItem(LOCAL_FEED_POSTS_KEY);
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return normalizePostsArray(arr);
    } catch {
      return [];
    }
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
        let filtered = (postsList || []).filter((p) => !localDeletedIds.includes(p.postId));

        // prepend newly created posts from localStorage (if any)
        try {
          const createdLocal = consumeLocalCreatedPosts();
          if (Array.isArray(createdLocal) && createdLocal.length) {
            const existingPostIds = new Set(filtered.map((x) => Number(x.postId)));
            const toPrepend = createdLocal.filter((c) => !existingPostIds.has(Number(c.postId)));
            if (toPrepend.length) filtered = [...toPrepend, ...filtered];
          }
        } catch (e) {
          console.warn("feed: could not consume local created posts", e);
        }

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

  /* ======================================================
     local-commit helpers (kept in-file for simplicity)
  ====================================================== */
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

  /* ======================================================
     HANDLE DELETE (soft-local)
  ====================================================== */
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

  // ---- filtering uses UI state first (searchQ & selectedDept) and falls back to URL params.
  const filteredPosts = useMemo(() => {
    const q = ((searchQ || qParam) || "").trim().toLowerCase();
    const dept = ((selectedDept || deptParam) || "all").toLowerCase();

    return posts.filter((p) => {
      if (dept !== "all" && (p.departmentName || "").toLowerCase() !== dept) return false;
      if (!q) return true;
      const inTitle = (p.title || "").toLowerCase().includes(q);
      const inText = (p.elements || []).some(
        (el) => el.type === "text" && (el.content || "").toLowerCase().includes(q)
      );
      return inTitle || inText;
    });
  }, [posts, searchQ, selectedDept, qParam, deptParam]);

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
      tags: extractTagsFromPost(dto) || dto.tags || dto.Tags || [], // ensure tags available
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
        {/* ====== Controls row: search + department ====== */}
        <div className="feed-controls" role="region" aria-label="Feed controls">
          <div className="feed-controls-left">
            <h3 style={{ margin: 0 }}>Feed</h3>
          </div>

          <div className="feed-controls-right">
            <input
              type="search"
              className="feed-search-input"
              placeholder="Search posts (title or text)…"
              value={searchQ}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search posts"
            />

            <select
              className="feed-dept-select"
              value={selectedDept}
              onChange={(e) => onDeptChange(e.target.value)}
              aria-label="Filter by department"
            >
              {(deptOptions || ["all"]).map((d) => (
                <option key={d} value={d}>
                  {d === "all" ? "All Departments" : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="no-posts">No matching posts.</div>
        ) : (
          filteredPosts.map((p) => (
            <article key={p.id} className="post-item">
              <header className="post-header">
                <h2 className="post-title">{p.title || "Untitled Post"}</h2>
                <div className="post-meta">
                  {/* Avatar (initial + optional image) */}
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

                    return (
                      <div className="avatar-container" aria-hidden="true" title={rawName || "User"}>
                        <div className="avatar-initial">{initial}</div>
                        {profileSrc ? (
                          <img
                            src={profileSrc}
                            alt={`profile-${initial}`}
                            className="avatar avatar-top"
                            onError={(e) => {
                              try {
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

              {/* TagChips: we map tags into the shapes it expects */}
              <TagChips tags={mapTagsForTagChips(p.tags)} />

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
