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

// /**
//  * Robust repost detection helper: checks common shapes (flag + title prefix)
//  */
// function isRepostDto(p) {
//   if (!p) return false;
//   if (p.isRepost || p.IsRepost || p.is_repost) return true;
//   const title = (p.title ?? p.Title ?? "").toString();
//   return title.trim().toLowerCase().startsWith("[repost");
// }

// export default function MyPosts() {
//   const [items, setItems] = useState(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         // 1) get lightweight list (no body/attachments)
//         const mine = await getMyPosts();
//         const list = Array.isArray(mine) ? mine : [];

//         // 2) For each list item:
//         //    - If it's a repost row returned by the API, keep it AS-IS (do not re-hydrate),
//         //      because the lightweight repost contains repost.CreatedAt and repost title.
//         //    - Otherwise, hydrate via getPostById (so bodies/attachments load).
//         const hydrated = await Promise.all(
//           list.map(async (p) => {
//             const id = p.postId ?? p.PostId;

//             // If the list row indicates a repost, preserve it (don't re-fetch original).
//             if (isRepostDto(p)) {
//               const createdAt = p.createdAt ?? p.CreatedAt ?? new Date().toISOString();
//               // The lightweight repost might not include full body/attachments; that's okay.
//               const body = p.body ?? p.Body ?? "";
//               const elements = parseElements(body, id);

//               const tags =
//                 p.tags ??
//                 p.Tags ??
//                 (p.postTags ?? p.PostTags)?.map((pt) => {
//                   const tag = pt.tag ?? pt.Tag;
//                   return {
//                     TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
//                     TagName:
//                       tag?.tagName ??
//                       tag?.TagName ??
//                       pt.tagName ??
//                       pt.TagName,
//                     DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
//                   };
//                 }) ??
//                 [];

//               const attachments = p.attachments ?? p.Attachments ?? [];

//               return {
//                 id: `post-${id || "0"}-repost-${new Date(createdAt).toISOString()}`,
//                 postId: id,
//                 title: p.title ?? p.Title ?? `(Repost of ${id})`,
//                 createdAt,
//                 elements,
//                 tags,
//                 attachments,
//                 raw: p,
//                 // mark as repost so UI can add badge
//                 isRepost: true,
//               };
//             }

//             // Not a repost: hydrate using getPostById to retrieve full details.
//             try {
//               const d = await getPostById(id);
//               // If server hides the post, getPostById may return null or throw;
//               // allow caller to handle omitted posts (we'll filter nulls below).
//               if (!d) return null;

//               const body = d.body ?? d.Body ?? "";
//               const elements = parseElements(body, id);

//               const tags =
//                 d.tags ??
//                 d.Tags ??
//                 (d.postTags ?? d.PostTags)?.map((pt) => {
//                   const tag = pt.tag ?? pt.Tag;
//                   return {
//                     TagId:
//                       pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
//                     TagName:
//                       tag?.tagName ??
//                       tag?.TagName ??
//                       pt.tagName ??
//                       pt.TagName,
//                     DeptId:
//                       tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
//                   };
//                 }) ??
//                 [];

//               const attachments = d.attachments ?? d.Attachments ?? [];

//               return {
//                 id: `post-${id || "0"}-orig-${d.createdAt ?? d.CreatedAt ?? new Date().toISOString()}`,
//                 postId: id,
//                 title: d.title ?? d.Title ?? "",
//                 createdAt: d.createdAt ?? d.CreatedAt ?? new Date().toISOString(),
//                 elements,
//                 tags,
//                 attachments,
//                 raw: d,
//                 isRepost: Boolean(d.isRepost || d.IsRepost),
//               };
//             } catch {
//               // If hydrate fails (hidden/deleted server-side), skip the post.
//               return null;
//             }
//           })
//         );

//         // filter out posts that were skipped (null)
//         const full = (hydrated || []).filter(Boolean);

//         // Sort newest-first
//         full.sort((a, b) => {
//           const ta = new Date(a.createdAt).getTime();
//           const tb = new Date(b.createdAt).getTime();
//           return tb - ta;
//         });

//         setItems(full);
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
//           const isRepost = Boolean(p.isRepost || p.raw?.isRepost || p.raw?.IsRepost) ||
//             (typeof p.title === "string" && p.title.trim().toLowerCase().startsWith("[repost"));

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
//               <header className="post-card__header" style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                 <div>
//                   <div className="post-card__title" style={{ fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
//                     <span>{p.title || "Untitled Post"}</span>
//                     {isRepost ? <span style={{ fontSize: 14, opacity: 0.85 }}>🔁 Repost</span> : null}
//                   </div>
//                   <div className="post-card__meta" style={{ opacity: 0.7 }}>
//                     <>Created: {fmt(p.createdAt)}</>
//                   </div>
//                 </div>
//               </header>

//               {/* Body blocks */}
//               <div
//                 className="post-card__body"
//                 style={{ display: "grid", gap: 8, marginTop: 8 }}
//               >
//                 {(p.elements || []).map((el) => {
//                   if (el.type === "text")
//                     return (
//                       <p
//                         key={el.id}
//                         className="post-text"
//                         style={{ margin: 0, whiteSpace: "pre-wrap" }}
//                       >
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
//                   <div
//                     className="attachments__row"
//                     style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
//                   >
//                     {p.attachments.map((a, i) => {
//                       const url =
//                         typeof a === "string"
//                           ? a
//                           : a?.filePath || a?.FilePath || "";
//                       if (!url) return null;
//                       if (isImagePath(url)) {
//                         return (
//                           <a
//                             key={i}
//                             href={url}
//                             target="_blank"
//                             rel="noreferrer"
//                             className="attachment-thumb-link"
//                             style={{ display: "inline-block" }}
//                           >
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
//                       const name =
//                         (typeof a === "object"
//                           ? a.fileName || a.FileName
//                           : null) || url.split("/").pop();
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

// src/Components/MyPosts/MyPosts.jsx
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
  const [loadError, setLoadError] = useState(null); // new: store a friendly error message

  useEffect(() => {
    (async () => {
      try {
        // Reset any previous error
        setLoadError(null);

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
        // Improved error handling: surface server message if possible
        console.error("Failed to load my posts", err, err?.response ?? null);

        // Determine best user-facing message
        let showMsg = "Failed to load my posts";
        if (err?.response) {
          const resp = err.response;
          if (typeof resp === "string") showMsg = resp;
          else if (resp?.message) showMsg = resp.message;
          else if (resp?.error) showMsg = resp.error;
          else if (resp?.errors) {
            // typical ASP.NET Core validation response structure
            const keys = Object.keys(resp.errors || {});
            if (keys.length) showMsg = `${keys[0]}: ${resp.errors[keys[0]][0]}`;
            else showMsg = JSON.stringify(resp);
          } else showMsg = JSON.stringify(resp);
        } else if (err?.message) {
          showMsg = err.message;
        }

        // Save friendly message to state so UI can display
        setLoadError(showMsg);
        // Set items to empty so UI shows "You don't have any posts yet." or error below
        setItems([]);
      }
    })();
  }, []);

  if (items === null) return <div className="loading">Loading…</div>;

  // If we have a load error, show it prominently instead of the generic empty state
  if (!items.length && loadError) {
    return (
      <div className="container my-posts-page" style={{ padding: 16 }}>
        <h1 className="myposts-title">My Posts</h1>
        <div className="error-box" style={{ padding: 12, border: "1px solid #f1c0c0", background: "#fff7f7", borderRadius: 6 }}>
          <strong style={{ color: "#9b1c1c" }}>Could not load your posts:</strong>
          <div style={{ marginTop: 8, color: "#4b1c1c", whiteSpace: "pre-wrap" }}>{loadError}</div>
          <div style={{ marginTop: 10 }}>
            <button className="btn" onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

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
