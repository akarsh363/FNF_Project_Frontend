// // // import React, { useEffect, useState } from "react";
// // // import { getMyPosts, getPostById } from "../../Services/postsService";
// // // import { Link } from "react-router-dom";
// // // import TagChips from "../Tags/TagChips";
// // // import "./MyPosts.css";

// // // const LOCAL_COMMITS_KEY = "localPostCommits";

// // // const isImagePath = (p) =>
// // //   typeof p === "string" && /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(p);

// // // function parseElements(rawBody, fallbackId) {
// // //   try {
// // //     const parsed =
// // //       typeof rawBody === "string" ? JSON.parse(rawBody || "[]") : rawBody || [];
// // //     if (Array.isArray(parsed)) {
// // //       return parsed.map((el, i) => ({
// // //         id: el.id ?? `${fallbackId}-${i}`,
// // //         type: String(el.type ?? "text").toLowerCase(),
// // //         content: el.content ?? el.body ?? "",
// // //         imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
// // //         imageName: el.imageName ?? "",
// // //       }));
// // //     }
// // //   } catch {}
// // //   return rawBody
// // //     ? [{ id: `${fallbackId}-single`, type: "text", content: String(rawBody) }]
// // //     : [];
// // // }

// // // function getLocalCommits() {
// // //   try {
// // //     const raw = localStorage.getItem(LOCAL_COMMITS_KEY);
// // //     if (!raw) return [];
// // //     return JSON.parse(raw);
// // //   } catch {
// // //     return [];
// // //   }
// // // }

// // // function removeLocalCommitByPostId(postId) {
// // //   try {
// // //     const arr = getLocalCommits().filter((c) => c.postId !== postId);
// // //     localStorage.setItem(LOCAL_COMMITS_KEY, JSON.stringify(arr));
// // //   } catch {}
// // // }

// // // export default function MyPosts() {
// // //   const [items, setItems] = useState(null);

// // //   useEffect(() => {
// // //     (async () => {
// // //       try {
// // //         // 1) get lightweight list (includes reposts now, thanks to backend update)
// // //         const mine = await getMyPosts();
// // //         const list = Array.isArray(mine) ? mine : [];

// // //         // 2) hydrate each with full details (Body, Attachments, Tags)
// // //         const full = await Promise.all(
// // //           list.map(async (p) => {
// // //             const id = p.postId ?? p.PostId;
// // //             let d = null;
// // //             try {
// // //               d = await getPostById(id);
// // //             } catch {
// // //               return {
// // //                 id,
// // //                 postId: id,
// // //                 title: p.title ?? p.Title ?? "",
// // //                 createdAt:
// // //                   p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
// // //                 elements: [],
// // //                 tags: [],
// // //                 attachments: [],
// // //                 raw: p,
// // //               };
// // //             }

// // //             if (!d) {
// // //               return {
// // //                 id,
// // //                 postId: id,
// // //                 title: p.title ?? p.Title ?? "",
// // //                 createdAt:
// // //                   p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
// // //                 elements: [],
// // //                 tags: [],
// // //                 attachments: [],
// // //                 raw: p,
// // //               };
// // //             }

// // //             const body = d.body ?? d.Body ?? "";
// // //             const elements = parseElements(body, id);

// // //             const tags =
// // //               d.tags ??
// // //               d.Tags ??
// // //               (d.postTags ?? d.PostTags)?.map((pt) => {
// // //                 const tag = pt.tag ?? pt.Tag;
// // //                 return {
// // //                   TagId:
// // //                     pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
// // //                   TagName:
// // //                     tag?.tagName ??
// // //                     tag?.TagName ??
// // //                     pt.tagName ??
// // //                     pt.TagName,
// // //                   DeptId:
// // //                     tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
// // //                 };
// // //               }) ??
// // //               [];

// // //             const attachments = d.attachments ?? d.Attachments ?? [];

// // //             return {
// // //               id,
// // //               postId: id,
// // //               title: d.title ?? d.Title ?? "",
// // //               createdAt:
// // //                 d.createdAt ?? d.CreatedAt ?? new Date().toISOString(),
// // //               elements,
// // //               tags,
// // //               attachments,
// // //               raw: d,
// // //               isRepost:
// // //                 Boolean(d.isRepost || d.IsRepost) ||
// // //                 (typeof (d.title ?? "") === "string" &&
// // //                   d.title.trim().toLowerCase().startsWith("[repost")),
// // //             };
// // //           })
// // //         );

// // //         // 3) merge in any local commits
// // //         const commits = getLocalCommits();
// // //         const commitEntries = commits
// // //           .filter((c) => !!c && c.postId != null)
// // //           .map((c) => ({
// // //             id: `commit-${c.postId}-${c.createdAt || "local"}`,
// // //             postId: c.postId,
// // //             title: `(Hidden) ${c.postTitle || "(untitled)"}`,
// // //             createdAt: c.createdAt || new Date().toISOString(),
// // //             elements: [],
// // //             tags: [],
// // //             attachments: [],
// // //             raw: { deletedCommit: c },
// // //             isLocalCommit: true,
// // //           }));

// // //         const existingIds = new Set(full.map((f) => Number(f.postId)));
// // //         const unseenCommits = commitEntries.filter(
// // //           (ce) => !existingIds.has(Number(ce.postId))
// // //         );

// // //         const merged = [...full, ...unseenCommits].sort((a, b) => {
// // //           const ta = new Date(a.createdAt).getTime();
// // //           const tb = new Date(b.createdAt).getTime();
// // //           return tb - ta;
// // //         });

// // //         setItems(merged);
// // //       } catch (err) {
// // //         console.error("Failed to load my posts", err);
// // //         setItems([]);
// // //       }
// // //     })();
// // //   }, []);

// // //   if (items === null) return <div className="loading">Loading…</div>;
// // //   if (!items.length)
// // //     return <div className="no-posts">You don’t have any posts yet.</div>;

// // //   const fmt = (ts) => new Date(ts).toLocaleString();

// // //   function handleRestoreCommit(postId) {
// // //     if (!confirm("Restore this post locally (undo the hide)?")) return;
// // //     try {
// // //       removeLocalCommitByPostId(postId);
// // //       setItems((prev) =>
// // //         prev.filter((it) => !(it.isLocalCommit && it.postId === postId))
// // //       );
// // //       alert("Restored locally.");
// // //     } catch (e) {
// // //       console.error(e);
// // //       alert("Failed to restore (see console).");
// // //     }
// // //   }

// // //   return (
// // //     <div className="container my-posts-page" style={{ padding: 16 }}>
// // //       <h1 className="myposts-title">My Posts</h1>

// // //       <ul
// // //         className="myposts-list"
// // //         style={{ listStyle: "none", padding: 0, margin: 0 }}
// // //       >
// // //         {items.map((p) => {
// // //           const isCommit = Boolean(
// // //             p.isLocalCommit || (p.raw && p.raw.deletedCommit)
// // //           );
// // //           const commit = p.raw && p.raw.deletedCommit ? p.raw.deletedCommit : null;

// // //           const isRepost =
// // //             Boolean(p.isRepost || p.raw?.isRepost || p.raw?.IsRepost) ||
// // //             (typeof p.title === "string" &&
// // //               p.title.trim().toLowerCase().startsWith("[repost"));

// // //           return (
// // //             <li
// // //               key={p.id}
// // //               className="post-card"
// // //               style={{
// // //                 marginBottom: 16,
// // //                 padding: 12,
// // //                 border: "1px solid #eee",
// // //                 borderRadius: 8,
// // //                 background: isCommit ? "#fff7f0" : "transparent",
// // //               }}
// // //             >
// // //               <header
// // //                 className="post-card__header"
// // //                 style={{
// // //                   marginBottom: 8,
// // //                   display: "flex",
// // //                   justifyContent: "space-between",
// // //                   alignItems: "flex-start",
// // //                 }}
// // //               >
// // //                 <div>
// // //                   <div
// // //                     className="post-card__title"
// // //                     style={{
// // //                       fontWeight: 700,
// // //                       fontSize: 18,
// // //                       display: "flex",
// // //                       alignItems: "center",
// // //                       gap: 8,
// // //                     }}
// // //                   >
// // //                     <span>{p.title || "Untitled Post"}</span>
// // //                     {isRepost ? (
// // //                       <span style={{ fontSize: 14, opacity: 0.85 }}>
// // //                         🔁 Repost
// // //                       </span>
// // //                     ) : null}
// // //                   </div>
// // //                   <div className="post-card__meta" style={{ opacity: 0.7 }}>
// // //                     {isCommit ? (
// // //                       <span>
// // //                         <strong>Hidden by manager:</strong>{" "}
// // //                         {commit ? `${commit.managerName}` : "Manager"} —{" "}
// // //                         {commit ? commit.reason : ""}
// // //                         <div style={{ fontSize: 12, marginTop: 4 }}>
// // //                           {commit ? `At ${fmt(commit.createdAt)}` : ""}
// // //                         </div>
// // //                       </span>
// // //                     ) : (
// // //                       <>Created: {fmt(p.createdAt)}</>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               </header>

// // //               {/* Body */}
// // //               <div
// // //                 className="post-card__body"
// // //                 style={{ display: "grid", gap: 8, marginTop: 8 }}
// // //               >
// // //                 {(p.elements || []).map((el) => {
// // //                   if (el.type === "text")
// // //                     return (
// // //                       <p
// // //                         key={el.id}
// // //                         className="post-text"
// // //                         style={{ margin: 0, whiteSpace: "pre-wrap" }}
// // //                       >
// // //                         {el.content}
// // //                       </p>
// // //                     );
// // //                   if (el.type === "code")
// // //                     return (
// // //                       <pre
// // //                         key={el.id}
// // //                         className="code-block"
// // //                         style={{
// // //                           margin: 0,
// // //                           background: "#0f172a0d",
// // //                           padding: 8,
// // //                           borderRadius: 6,
// // //                           overflow: "auto",
// // //                         }}
// // //                       >
// // //                         <code>{el.content}</code>
// // //                       </pre>
// // //                     );
// // //                   if (el.type === "image") {
// // //                     const src = el.imagePreview || el.url;
// // //                     if (!src) return null;
// // //                     return (
// // //                       <img
// // //                         key={el.id}
// // //                         className="post-image"
// // //                         src={src}
// // //                         alt={el.imageName || "image"}
// // //                         style={{ maxWidth: "100%", borderRadius: 6 }}
// // //                         loading="lazy"
// // //                       />
// // //                     );
// // //                   }
// // //                   return null;
// // //                 })}
// // //               </div>

// // //               {/* Attachments */}
// // //               {Array.isArray(p.attachments) && p.attachments.length > 0 && (
// // //                 <div className="attachments" style={{ marginTop: 10 }}>
// // //                   <div
// // //                     className="attachments__title"
// // //                     style={{ fontWeight: 600, marginBottom: 6 }}
// // //                   >
// // //                     Attachments
// // //                   </div>
// // //                   <div
// // //                     className="attachments__row"
// // //                     style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
// // //                   >
// // //                     {p.attachments.map((a, i) => {
// // //                       const url =
// // //                         typeof a === "string"
// // //                           ? a
// // //                           : a?.filePath || a?.FilePath || "";
// // //                       if (!url) return null;
// // //                       if (isImagePath(url)) {
// // //                         return (
// // //                           <a
// // //                             key={i}
// // //                             href={url}
// // //                             target="_blank"
// // //                             rel="noreferrer"
// // //                             className="attachment-thumb-link"
// // //                             style={{ display: "inline-block" }}
// // //                           >
// // //                             <img
// // //                               src={url}
// // //                               alt={`attachment-${i}`}
// // //                               className="attachment-thumb"
// // //                               style={{
// // //                                 height: 96,
// // //                                 width: "auto",
// // //                                 borderRadius: 6,
// // //                                 objectFit: "cover",
// // //                                 border: "1px solid #eee",
// // //                               }}
// // //                               loading="lazy"
// // //                             />
// // //                           </a>
// // //                         );
// // //                       }
// // //                       const name =
// // //                         (typeof a === "object"
// // //                           ? a.fileName || a.FileName
// // //                           : null) || url.split("/").pop();
// // //                       return (
// // //                         <a
// // //                           key={i}
// // //                           href={url}
// // //                           target="_blank"
// // //                           rel="noreferrer"
// // //                           className="attachment-link"
// // //                           style={{
// // //                             padding: "6px 10px",
// // //                             border: "1px solid #e5e7eb",
// // //                             borderRadius: 6,
// // //                           }}
// // //                         >
// // //                           📎 {name}
// // //                         </a>
// // //                       );
// // //                     })}
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               <div className="tags-row" style={{ marginTop: 10 }}>
// // //                 <TagChips tags={p.tags} />
// // //               </div>

// // //               <div
// // //                 className="post-card__footer"
// // //                 style={{ marginTop: 12, display: "flex", gap: 8 }}
// // //               >
// // //                 {!isCommit ? (
// // //                   <Link
// // //                     className="btn btn-outline"
// // //                     to={`/post/edit/${p.postId ?? p.id}`}
// // //                   >
// // //                     Edit
// // //                   </Link>
// // //                 ) : (
// // //                   <>
// // //                     {p.isLocalCommit ? (
// // //                       <button
// // //                         className="btn"
// // //                         onClick={() => handleRestoreCommit(p.postId)}
// // //                       >
// // //                         ↺ Restore locally
// // //                       </button>
// // //                     ) : null}
// // //                     <Link
// // //                       className="btn btn-outline"
// // //                       to={`/post/${p.postId ?? p.id}`}
// // //                     >
// // //                       View
// // //                     </Link>
// // //                   </>
// // //                 )}
// // //               </div>
// // //             </li>
// // //           );
// // //         })}
// // //       </ul>
// // //     </div>
// // //   );
// // // }

// // import React, { useEffect, useState } from "react";
// // import { getMyPosts, getPostById } from "../../Services/postsService";
// // import { Link } from "react-router-dom";
// // import TagChips from "../Tags/TagChips";
// // import "./MyPosts.css";

// // const isImagePath = (p) =>
// //   typeof p === "string" && /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(p);

// // function parseElements(rawBody, fallbackId) {
// //   try {
// //     const parsed =
// //       typeof rawBody === "string" ? JSON.parse(rawBody || "[]") : rawBody || [];
// //     if (Array.isArray(parsed)) {
// //       return parsed.map((el, i) => ({
// //         id: el.id ?? `${fallbackId}-${i}`,
// //         type: String(el.type ?? "text").toLowerCase(),
// //         content: el.content ?? el.body ?? "",
// //         imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
// //         imageName: el.imageName ?? "",
// //       }));
// //     }
// //   } catch {}
// //   return rawBody
// //     ? [{ id: `${fallbackId}-single`, type: "text", content: String(rawBody) }]
// //     : [];
// // }

// // export default function MyPosts() {
// //   const [items, setItems] = useState(null);

// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         // 1) get lightweight list (no body/attachments)
// //         const mine = await getMyPosts();
// //         const list = Array.isArray(mine) ? mine : [];

// //         // 2) hydrate each with full details (Body, Attachments, Tags)
// //         const hydrated = await Promise.all(
// //           list.map(async (p) => {
// //             const id = p.postId ?? p.PostId;
// //             let d = null;
// //             try {
// //               d = await getPostById(id);
// //             } catch {
// //               // If the server hides the post (GetPostById returns 404 or throws),
// //               // we skip it entirely so the user doesn't see deleted posts.
// //               return null;
// //             }

// //             // If d is falsy (hidden) — skip the post.
// //             if (!d) return null;

// //             const body = d.body ?? d.Body ?? "";
// //             const elements = parseElements(body, id);

// //             const tags =
// //               d.tags ??
// //               d.Tags ??
// //               (d.postTags ?? d.PostTags)?.map((pt) => {
// //                 const tag = pt.tag ?? pt.Tag;
// //                 return {
// //                   TagId:
// //                     pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
// //                   TagName:
// //                     tag?.tagName ??
// //                     tag?.TagName ??
// //                     pt.tagName ??
// //                     pt.TagName,
// //                   DeptId:
// //                     tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
// //                 };
// //               }) ??
// //               [];

// //             const attachments = d.attachments ?? d.Attachments ?? []; // array of { filePath } or string

// //             return {
// //               id,
// //               postId: id,
// //               title: d.title ?? d.Title ?? "",
// //               createdAt:
// //                 d.createdAt ?? d.CreatedAt ?? new Date().toISOString(),
// //               elements,
// //               tags,
// //               attachments,
// //               raw: d,
// //             };
// //           })
// //         );

// //         // filter out posts that were skipped (null)
// //         const full = (hydrated || []).filter(Boolean);

// //         // Sort newest first and set items
// //         const sorted = full.sort((a, b) => {
// //           const ta = new Date(a.createdAt).getTime();
// //           const tb = new Date(b.createdAt).getTime();
// //           return tb - ta;
// //         });

// //         setItems(sorted);
// //       } catch (err) {
// //         console.error("Failed to load my posts", err);
// //         setItems([]);
// //       }
// //     })();
// //   }, []);

// //   if (items === null) return <div className="loading">Loading…</div>;
// //   if (!items.length)
// //     return <div className="no-posts">You don’t have any posts yet.</div>;

// //   const fmt = (ts) => new Date(ts).toLocaleString();

// //   return (
// //     <div className="container my-posts-page" style={{ padding: 16 }}>
// //       <h1 className="myposts-title">My Posts</h1>

// //       <ul className="myposts-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
// //         {items.map((p) => {
// //           // detect reposts (cover a few casing shapes and title prefix fallback)
// //           const isRepost =
// //             Boolean(p.isRepost || p.raw?.isRepost || p.raw?.IsRepost) ||
// //             (typeof p.title === "string" && p.title.trim().toLowerCase().startsWith("[repost"));

// //           return (
// //             <li
// //               key={p.id}
// //               className="post-card"
// //               style={{
// //                 marginBottom: 16,
// //                 padding: 12,
// //                 border: "1px solid #eee",
// //                 borderRadius: 8,
// //               }}
// //             >
// //               <header className="post-card__header" style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
// //                 <div>
// //                   <div className="post-card__title" style={{ fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
// //                     <span>{p.title || "Untitled Post"}</span>
// //                     {isRepost ? <span style={{ fontSize: 14, opacity: 0.85 }}>🔁 Repost</span> : null}
// //                   </div>
// //                   <div className="post-card__meta" style={{ opacity: 0.7 }}>
// //                     <>Created: {fmt(p.createdAt)}</>
// //                   </div>
// //                 </div>
// //               </header>

// //               {/* Body blocks */}
// //               <div
// //                 className="post-card__body"
// //                 style={{ display: "grid", gap: 8, marginTop: 8 }}
// //               >
// //                 {(p.elements || []).map((el) => {
// //                   if (el.type === "text")
// //                     return (
// //                       <p
// //                         key={el.id}
// //                         className="post-text"
// //                         style={{ margin: 0, whiteSpace: "pre-wrap" }}
// //                       >
// //                         {el.content}
// //                       </p>
// //                     );
// //                   if (el.type === "code")
// //                     return (
// //                       <pre
// //                         key={el.id}
// //                         className="code-block"
// //                         style={{
// //                           margin: 0,
// //                           background: "#0f172a0d",
// //                           padding: 8,
// //                           borderRadius: 6,
// //                           overflow: "auto",
// //                         }}
// //                       >
// //                         <code>{el.content}</code>
// //                       </pre>
// //                     );
// //                   if (el.type === "image") {
// //                     const src = el.imagePreview || el.url;
// //                     if (!src) return null;
// //                     return (
// //                       <img
// //                         key={el.id}
// //                         className="post-image"
// //                         src={src}
// //                         alt={el.imageName || "image"}
// //                         style={{ maxWidth: "100%", borderRadius: 6 }}
// //                         loading="lazy"
// //                       />
// //                     );
// //                   }
// //                   return null;
// //                 })}
// //               </div>

// //               {/* Attachments */}
// //               {Array.isArray(p.attachments) && p.attachments.length > 0 && (
// //                 <div className="attachments" style={{ marginTop: 10 }}>
// //                   <div className="attachments__title" style={{ fontWeight: 600, marginBottom: 6 }}>
// //                     Attachments
// //                   </div>
// //                   <div
// //                     className="attachments__row"
// //                     style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
// //                   >
// //                     {p.attachments.map((a, i) => {
// //                       const url =
// //                         typeof a === "string"
// //                           ? a
// //                           : a?.filePath || a?.FilePath || "";
// //                       if (!url) return null;
// //                       if (isImagePath(url)) {
// //                         return (
// //                           <a
// //                             key={i}
// //                             href={url}
// //                             target="_blank"
// //                             rel="noreferrer"
// //                             className="attachment-thumb-link"
// //                             style={{ display: "inline-block" }}
// //                           >
// //                             <img
// //                               src={url}
// //                               alt={`attachment-${i}`}
// //                               className="attachment-thumb"
// //                               style={{
// //                                 height: 96,
// //                                 width: "auto",
// //                                 borderRadius: 6,
// //                                 objectFit: "cover",
// //                                 border: "1px solid #eee",
// //                               }}
// //                               loading="lazy"
// //                             />
// //                           </a>
// //                         );
// //                       }
// //                       const name =
// //                         (typeof a === "object"
// //                           ? a.fileName || a.FileName
// //                           : null) || url.split("/").pop();
// //                       return (
// //                         <a
// //                           key={i}
// //                           href={url}
// //                           target="_blank"
// //                           rel="noreferrer"
// //                           className="attachment-link"
// //                           style={{
// //                             padding: "6px 10px",
// //                             border: "1px solid #e5e7eb",
// //                             borderRadius: 6,
// //                           }}
// //                         >
// //                           📎 {name}
// //                         </a>
// //                       );
// //                     })}
// //                   </div>
// //                 </div>
// //               )}

// //               <div className="tags-row" style={{ marginTop: 10 }}>
// //                 <TagChips tags={p.tags} />
// //               </div>

// //               <div className="post-card__footer" style={{ marginTop: 12, display: "flex", gap: 8 }}>
// //                 <Link className="btn btn-outline" to={`/post/edit/${p.postId ?? p.id}`}>
// //                   Edit
// //                 </Link>
// //                 <Link className="btn btn-outline" to={`/post/${p.postId ?? p.id}`}>
// //                   View
// //                 </Link>
// //               </div>
// //             </li>
// //           );
// //         })}
// //       </ul>
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { getMyPosts, getPostById } from "../../Services/postsService";
// import { Link } from "react-router-dom";
// import TagChips from "../Tags/TagChips";
// import "./MyPosts.css";

// const isImagePath = (p) =>
//   typeof p === "string" && /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(p);

// function parseElements(rawBody, fallbackId) {
//   try {
//     const parsed =
//       typeof rawBody === "string" ? JSON.parse(rawBody || "[]") : rawBody || [];
//     if (Array.isArray(parsed)) {
//       return parsed.map((el, i) => ({
//         id: el.id ?? `${fallbackId}-${i}`,
//         type: String(el.type ?? "text").toLowerCase(),
//         content: el.content ?? el.body ?? "",
//         imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
//         imageName: el.imageName ?? "",
//       }));
//     }
//   } catch {}
//   return rawBody
//     ? [{ id: `${fallbackId}-single`, type: "text", content: String(rawBody) }]
//     : [];
// }

// export default function MyPosts() {
//   const [items, setItems] = useState(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         // 1) get lightweight list (may include repost rows)
//         const mine = await getMyPosts();
//         const list = Array.isArray(mine) ? mine : [];

//         // 2) hydrate each with full details (Body, Attachments, Tags)
//         // For repost rows returned by the "mine" endpoint:
//         //   - the PostId refers to the original post id
//         //   - the DTO contains IsRepost/CreatedAt that come from the Repost row
//         // We must preserve the repost CreatedAt and mark the row as a repost while
//         // still hydrating the original post body/attachments via GET /api/Posts/{id}.
//         const hydrated = await Promise.all(
//           list.map(async (p) => {
//             const id = p.postId ?? p.PostId;
//             // If id is falsy, skip
//             if (!id) return null;

//             // attempt to fetch full original post details
//             let d = null;
//             try {
//               d = await getPostById(id);
//             } catch {
//               // getPostById may return null or throw if original is hidden.
//               // For original posts that are hidden we want to skip them entirely
//               // (teacher should think it's deleted permanently) — so return null.
//               return null;
//             }

//             if (!d) {
//               // original hidden -> skip
//               return null;
//             }

//             // Determine whether this list row is a repost row (from /mine)
//             const rowIsRepost = Boolean(
//               p.isRepost ||
//                 p.IsRepost ||
//                 p.raw?.isRepost ||
//                 p.raw?.IsRepost ||
//                 (typeof (p.title ?? "") === "string" &&
//                   (p.title ?? "").trim().toLowerCase().startsWith("[repost"))
//             );

//             // Preserve createdAt: prefer the repost row's createdAt if this is a repost.
//             const repostCreated = p.createdAt ?? p.CreatedAt ?? null;
//             const createdAt = rowIsRepost
//               ? repostCreated ?? d.createdAt ?? d.CreatedAt ?? new Date().toISOString()
//               : d.createdAt ?? d.CreatedAt ?? new Date().toISOString();

//             // Title: prefer the repost row's title (it may include "[Repost by ...]"),
//             // otherwise fall back to the original post title.
//             const title = (p.title ?? p.Title) || (d.title ?? d.Title) || "";

//             // Build elements from the hydrated body (original post body)
//             const body = d.body ?? d.Body ?? "";
//             const elements = parseElements(body, id);

//             // Tags: prefer full post tags from d if present
//             const tags =
//               d.tags ??
//               d.Tags ??
//               (d.postTags ?? d.PostTags)?.map((pt) => {
//                 const tag = pt.tag ?? pt.Tag;
//                 return {
//                   TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
//                   TagName:
//                     tag?.tagName ??
//                     tag?.TagName ??
//                     pt.tagName ??
//                     pt.TagName,
//                   DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
//                 };
//               }) ??
//               [];

//             const attachments = d.attachments ?? d.Attachments ?? []; // array of { filePath } or string

//             return {
//               id: `${rowIsRepost ? `repost-${id}-${createdAt}` : `post-${id}`}`,
//               postId: id,
//               title,
//               createdAt,
//               elements,
//               tags,
//               attachments,
//               raw: { listRow: p, original: d },
//               isRepost: rowIsRepost,
//             };
//           })
//         );

//         // filter out skipped (null)
//         const full = (hydrated || []).filter(Boolean);

//         // Sort newest first and set items
//         const sorted = full.sort((a, b) => {
//           const ta = new Date(a.createdAt).getTime();
//           const tb = new Date(b.createdAt).getTime();
//           return tb - ta;
//         });

//         setItems(sorted);
//       } catch (err) {
//         console.error("Failed to load my posts", err);
//         setItems([]);
//       }
//     })();
//   }, []);

//   if (items === null) return <div className="loading">Loading…</div>;
//   if (!items.length)
//     return <div className="no-posts">You don’t have any posts yet.</div>;

//   const fmt = (ts) => new Date(ts).toLocaleString();

//   return (
//     <div className="container my-posts-page" style={{ padding: 16 }}>
//       <h1 className="myposts-title">My Posts</h1>

//       <ul className="myposts-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
//         {items.map((p) => {
//           const isRepost = Boolean(p.isRepost);

//           return (
//             <li
//               key={p.id}
//               className="post-card"
//               style={{
//                 marginBottom: 16,
//                 padding: 12,
//                 border: "1px solid #eee",
//                 borderRadius: 8,
//               }}
//             >
//               <header
//                 className="post-card__header"
//                 style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
//               >
//                 <div>
//                   <div
//                     className="post-card__title"
//                     style={{ fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}
//                   >
//                     <span>{p.title || "Untitled Post"}</span>
//                     {isRepost ? <span style={{ fontSize: 14, opacity: 0.85 }}>🔁 Repost</span> : null}
//                   </div>
//                   <div className="post-card__meta" style={{ opacity: 0.7 }}>
//                     <>Created: {fmt(p.createdAt)}</>
//                   </div>
//                 </div>
//               </header>

//               {/* Body blocks */}
//               <div className="post-card__body" style={{ display: "grid", gap: 8, marginTop: 8 }}>
//                 {(p.elements || []).map((el) => {
//                   if (el.type === "text")
//                     return (
//                       <p key={el.id} className="post-text" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
//                         {el.content}
//                       </p>
//                     );
//                   if (el.type === "code")
//                     return (
//                       <pre
//                         key={el.id}
//                         className="code-block"
//                         style={{
//                           margin: 0,
//                           background: "#0f172a0d",
//                           padding: 8,
//                           borderRadius: 6,
//                           overflow: "auto",
//                         }}
//                       >
//                         <code>{el.content}</code>
//                       </pre>
//                     );
//                   if (el.type === "image") {
//                     const src = el.imagePreview || el.url;
//                     if (!src) return null;
//                     return (
//                       <img
//                         key={el.id}
//                         className="post-image"
//                         src={src}
//                         alt={el.imageName || "image"}
//                         style={{ maxWidth: "100%", borderRadius: 6 }}
//                         loading="lazy"
//                       />
//                     );
//                   }
//                   return null;
//                 })}
//               </div>

//               {/* Attachments */}
//               {Array.isArray(p.attachments) && p.attachments.length > 0 && (
//                 <div className="attachments" style={{ marginTop: 10 }}>
//                   <div className="attachments__title" style={{ fontWeight: 600, marginBottom: 6 }}>
//                     Attachments
//                   </div>
//                   <div className="attachments__row" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                     {p.attachments.map((a, i) => {
//                       const url = typeof a === "string" ? a : a?.filePath || a?.FilePath || "";
//                       if (!url) return null;
//                       if (isImagePath(url)) {
//                         return (
//                           <a key={i} href={url} target="_blank" rel="noreferrer" className="attachment-thumb-link" style={{ display: "inline-block" }}>
//                             <img
//                               src={url}
//                               alt={`attachment-${i}`}
//                               className="attachment-thumb"
//                               style={{
//                                 height: 96,
//                                 width: "auto",
//                                 borderRadius: 6,
//                                 objectFit: "cover",
//                                 border: "1px solid #eee",
//                               }}
//                               loading="lazy"
//                             />
//                           </a>
//                         );
//                       }
//                       const name = (typeof a === "object" ? a.fileName || a.FileName : null) || url.split("/").pop();
//                       return (
//                         <a
//                           key={i}
//                           href={url}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="attachment-link"
//                           style={{
//                             padding: "6px 10px",
//                             border: "1px solid #e5e7eb",
//                             borderRadius: 6,
//                           }}
//                         >
//                           📎 {name}
//                         </a>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}

//               <div className="tags-row" style={{ marginTop: 10 }}>
//                 <TagChips tags={p.tags} />
//               </div>

//               <div className="post-card__footer" style={{ marginTop: 12, display: "flex", gap: 8 }}>
//                 <Link className="btn btn-outline" to={`/post/edit/${p.postId ?? p.id}`}>
//                   Edit
//                 </Link>
//                 <Link className="btn btn-outline" to={`/post/${p.postId ?? p.id}`}>
//                   View
//                 </Link>
//               </div>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { getMyPosts, getPostById } from "../../Services/postsService";
import { Link } from "react-router-dom";
import TagChips from "../Tags/TagChips";
import "./MyPosts.css";

const isImagePath = (p) =>
  typeof p === "string" && /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(p);

function parseElements(rawBody, fallbackId) {
  try {
    const parsed =
      typeof rawBody === "string" ? JSON.parse(rawBody || "[]") : rawBody || [];
    if (Array.isArray(parsed)) {
      return parsed.map((el, i) => ({
        id: el.id ?? `${fallbackId}-${i}`,
        type: String(el.type ?? "text").toLowerCase(),
        content: el.content ?? el.body ?? "",
        imagePreview: el.url ?? el.imagePreview ?? el.src ?? null,
        imageName: el.imageName ?? "",
      }));
    }
  } catch {}
  return rawBody
    ? [{ id: `${fallbackId}-single`, type: "text", content: String(rawBody) }]
    : [];
}

/**
 * Robust repost detection helper: checks common shapes (flag + title prefix)
 */
function isRepostDto(p) {
  if (!p) return false;
  if (p.isRepost || p.IsRepost || p.is_repost) return true;
  const title = (p.title ?? p.Title ?? "").toString();
  return title.trim().toLowerCase().startsWith("[repost");
}

export default function MyPosts() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // 1) get lightweight list (no body/attachments)
        const mine = await getMyPosts();
        const list = Array.isArray(mine) ? mine : [];

        // 2) For each list item:
        //    - If it's a repost row returned by the API, keep it AS-IS (do not re-hydrate),
        //      because the lightweight repost contains repost.CreatedAt and repost title.
        //    - Otherwise, hydrate via getPostById (so bodies/attachments load).
        const hydrated = await Promise.all(
          list.map(async (p) => {
            const id = p.postId ?? p.PostId;

            // If the list row indicates a repost, preserve it (don't re-fetch original).
            if (isRepostDto(p)) {
              const createdAt = p.createdAt ?? p.CreatedAt ?? new Date().toISOString();
              // The lightweight repost might not include full body/attachments; that's okay.
              const body = p.body ?? p.Body ?? "";
              const elements = parseElements(body, id);

              const tags =
                p.tags ??
                p.Tags ??
                (p.postTags ?? p.PostTags)?.map((pt) => {
                  const tag = pt.tag ?? pt.Tag;
                  return {
                    TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
                    TagName:
                      tag?.tagName ??
                      tag?.TagName ??
                      pt.tagName ??
                      pt.TagName,
                    DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
                  };
                }) ??
                [];

              const attachments = p.attachments ?? p.Attachments ?? [];

              return {
                id: `post-${id || "0"}-repost-${new Date(createdAt).toISOString()}`,
                postId: id,
                title: p.title ?? p.Title ?? `(Repost of ${id})`,
                createdAt,
                elements,
                tags,
                attachments,
                raw: p,
                // mark as repost so UI can add badge
                isRepost: true,
              };
            }

            // Not a repost: hydrate using getPostById to retrieve full details.
            try {
              const d = await getPostById(id);
              // If server hides the post, getPostById may return null or throw;
              // allow caller to handle omitted posts (we'll filter nulls below).
              if (!d) return null;

              const body = d.body ?? d.Body ?? "";
              const elements = parseElements(body, id);

              const tags =
                d.tags ??
                d.Tags ??
                (d.postTags ?? d.PostTags)?.map((pt) => {
                  const tag = pt.tag ?? pt.Tag;
                  return {
                    TagId:
                      pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
                    TagName:
                      tag?.tagName ??
                      tag?.TagName ??
                      pt.tagName ??
                      pt.TagName,
                    DeptId:
                      tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
                  };
                }) ??
                [];

              const attachments = d.attachments ?? d.Attachments ?? [];

              return {
                id: `post-${id || "0"}-orig-${d.createdAt ?? d.CreatedAt ?? new Date().toISOString()}`,
                postId: id,
                title: d.title ?? d.Title ?? "",
                createdAt: d.createdAt ?? d.CreatedAt ?? new Date().toISOString(),
                elements,
                tags,
                attachments,
                raw: d,
                isRepost: Boolean(d.isRepost || d.IsRepost),
              };
            } catch {
              // If hydrate fails (hidden/deleted server-side), skip the post.
              return null;
            }
          })
        );

        // filter out posts that were skipped (null)
        const full = (hydrated || []).filter(Boolean);

        // Sort newest-first
        full.sort((a, b) => {
          const ta = new Date(a.createdAt).getTime();
          const tb = new Date(b.createdAt).getTime();
          return tb - ta;
        });

        setItems(full);
      } catch (err) {
        console.error("Failed to load my posts", err);
        setItems([]);
      }
    })();
  }, []);

  if (items === null) return <div className="loading">Loading…</div>;
  if (!items.length)
    return <div className="no-posts">You don’t have any posts yet.</div>;

  const fmt = (ts) => new Date(ts).toLocaleString();

  return (
    <div className="container my-posts-page" style={{ padding: 16 }}>
      <h1 className="myposts-title">My Posts</h1>

      <ul className="myposts-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((p) => {
          const isRepost = Boolean(p.isRepost || p.raw?.isRepost || p.raw?.IsRepost) ||
            (typeof p.title === "string" && p.title.trim().toLowerCase().startsWith("[repost"));

          return (
            <li
              key={p.id}
              className="post-card"
              style={{
                marginBottom: 16,
                padding: 12,
                border: "1px solid #eee",
                borderRadius: 8,
              }}
            >
              <header className="post-card__header" style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div className="post-card__title" style={{ fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{p.title || "Untitled Post"}</span>
                    {isRepost ? <span style={{ fontSize: 14, opacity: 0.85 }}>🔁 Repost</span> : null}
                  </div>
                  <div className="post-card__meta" style={{ opacity: 0.7 }}>
                    <>Created: {fmt(p.createdAt)}</>
                  </div>
                </div>
              </header>

              {/* Body blocks */}
              <div
                className="post-card__body"
                style={{ display: "grid", gap: 8, marginTop: 8 }}
              >
                {(p.elements || []).map((el) => {
                  if (el.type === "text")
                    return (
                      <p
                        key={el.id}
                        className="post-text"
                        style={{ margin: 0, whiteSpace: "pre-wrap" }}
                      >
                        {el.content}
                      </p>
                    );
                  if (el.type === "code")
                    return (
                      <pre
                        key={el.id}
                        className="code-block"
                        style={{
                          margin: 0,
                          background: "#0f172a0d",
                          padding: 8,
                          borderRadius: 6,
                          overflow: "auto",
                        }}
                      >
                        <code>{el.content}</code>
                      </pre>
                    );
                  if (el.type === "image") {
                    const src = el.imagePreview || el.url;
                    if (!src) return null;
                    return (
                      <img
                        key={el.id}
                        className="post-image"
                        src={src}
                        alt={el.imageName || "image"}
                        style={{ maxWidth: "100%", borderRadius: 6 }}
                        loading="lazy"
                      />
                    );
                  }
                  return null;
                })}
              </div>

              {/* Attachments */}
              {Array.isArray(p.attachments) && p.attachments.length > 0 && (
                <div className="attachments" style={{ marginTop: 10 }}>
                  <div className="attachments__title" style={{ fontWeight: 600, marginBottom: 6 }}>
                    Attachments
                  </div>
                  <div
                    className="attachments__row"
                    style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                  >
                    {p.attachments.map((a, i) => {
                      const url =
                        typeof a === "string"
                          ? a
                          : a?.filePath || a?.FilePath || "";
                      if (!url) return null;
                      if (isImagePath(url)) {
                        return (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="attachment-thumb-link"
                            style={{ display: "inline-block" }}
                          >
                            <img
                              src={url}
                              alt={`attachment-${i}`}
                              className="attachment-thumb"
                              style={{
                                height: 96,
                                width: "auto",
                                borderRadius: 6,
                                objectFit: "cover",
                                border: "1px solid #eee",
                              }}
                              loading="lazy"
                            />
                          </a>
                        );
                      }
                      const name =
                        (typeof a === "object"
                          ? a.fileName || a.FileName
                          : null) || url.split("/").pop();
                      return (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="attachment-link"
                          style={{
                            padding: "6px 10px",
                            border: "1px solid #e5e7eb",
                            borderRadius: 6,
                          }}
                        >
                          📎 {name}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="tags-row" style={{ marginTop: 10 }}>
                <TagChips tags={p.tags} />
              </div>

              <div className="post-card__footer" style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <Link className="btn btn-outline" to={`/post/edit/${p.postId ?? p.id}`}>
                  Edit
                </Link>
                <Link className="btn btn-outline" to={`/post/${p.postId ?? p.id}`}>
                  View
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
