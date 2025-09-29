// import React, { useEffect, useState } from "react";
// import { getMyPosts } from "../Services/postsService";
// import { Link } from "react-router-dom";
// import MyPosts from "./Components/MyPosts/MyPosts";

// export default function MyPosts() {
//   const [posts, setPosts] = useState(null);
//   useEffect(() => { (async ()=> { try{ const list = await getMyPosts(); setPosts(Array.isArray(list)?list:[]); } catch { setPosts([]); } })(); }, []);
//   if (posts === null) return <div className="loading">Loading...</div>;
//   if (!posts.length) return <div className="no-posts">You don’t have any posts yet.</div>;

//   const fmt = (ts) => new Date(ts).toLocaleString();

//   return (
//     <div className="container">
//       <h1>My Posts</h1>
//       <ul className="list">
//         {posts.map((p) => (
//           <li key={p.postId} className="card">
//             <div className="row">
//               <div className="grow">
//                 <div className="title">{p.title}</div>
//                 <div className="meta">Created: {fmt(p.createdAt)}</div>
//               </div>
//               <div className="actions">
//                 <Link className="btn" to={`/post/edit/${p.postId}`}>Edit</Link>
//               </div>
//             </div>
//           </li>
//         ))}
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

export default function MyPosts() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // 1) get lightweight list (no body/attachments)
        const mine = await getMyPosts();
        const list = Array.isArray(mine) ? mine : [];

        // 2) hydrate each with full details (Body, Attachments, Tags)
        const full = await Promise.all(
          list.map(async (p) => {
            const id = p.postId ?? p.PostId;
            let d = null;
            try {
              d = await getPostById(id);
            } catch {
              // fall back to list item if full fetch fails
              return {
                id,
                title: p.title ?? p.Title ?? "",
                createdAt: p.createdAt ?? p.CreatedAt ?? new Date().toISOString(),
                elements: [],
                tags: [],
                attachments: [],
              };
            }

            const body = d.body ?? d.Body ?? "";
            const elements = parseElements(body, id);

            const tags =
              d.tags ??
              d.Tags ??
              (d.postTags ?? d.PostTags)?.map((pt) => {
                const tag = pt.tag ?? pt.Tag;
                return {
                  TagId: pt.tagId ?? pt.TagId ?? tag?.tagId ?? tag?.TagId,
                  TagName: tag?.tagName ?? tag?.TagName ?? pt.tagName ?? pt.TagName,
                  DeptId: tag?.deptId ?? tag?.DeptId ?? pt.deptId ?? pt.DeptId,
                };
              }) ??
              [];

            const attachments =
              d.attachments ?? d.Attachments ?? []; // array of { filePath } or string

            return {
              id,
              title: d.title ?? d.Title ?? "",
              createdAt: d.createdAt ?? d.CreatedAt ?? new Date().toISOString(),
              elements,
              tags,
              attachments,
            };
          })
        );

        setItems(full);
      } catch {
        setItems([]);
      }
    })();
  }, []);

  if (items === null) return <div className="loading">Loading…</div>;
  if (!items.length) return <div className="no-posts">You don’t have any posts yet.</div>;

  const fmt = (ts) => new Date(ts).toLocaleString();

  return (
    <div className="container" style={{ padding: 16 }}>
      <h1>My Posts</h1>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((p) => (
          <li key={p.id} style={{ marginBottom: 16, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <header style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{p.title || "Untitled Post"}</div>
              <div style={{ opacity: 0.7 }}>Created: {fmt(p.createdAt)}</div>
            </header>

            {/* Body blocks */}
            <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
              {(p.elements || []).map((el) => {
                if (el.type === "text")
                  return <p key={el.id} style={{ margin: 0, whiteSpace: "pre-wrap" }}>{el.content}</p>;
                if (el.type === "code")
                  return (
                    <pre key={el.id} style={{ margin: 0, background: "#0f172a0d", padding: 8, borderRadius: 6, overflow: "auto" }}>
                      <code>{el.content}</code>
                    </pre>
                  );
                if (el.type === "image") {
                  const src = el.imagePreview || el.url;
                  if (!src) return null;
                  return <img key={el.id} src={src} alt={el.imageName || "image"} style={{ maxWidth: "100%", borderRadius: 6 }} />;
                }
                return null;
              })}
            </div>

            {/* Attachments */}
            {Array.isArray(p.attachments) && p.attachments.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Attachments</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {p.attachments.map((a, i) => {
                    const url = typeof a === "string" ? a : a?.filePath || a?.FilePath || "";
                    if (!url) return null;
                    if (isImagePath(url)) {
                      return (
                        <a key={i} href={url} target="_blank" rel="noreferrer" style={{ display: "inline-block" }}>
                          <img src={url} alt={`attachment-${i}`} style={{ height: 96, width: "auto", borderRadius: 6, objectFit: "cover", border: "1px solid #eee" }} />
                        </a>
                      );
                    }
                    const name = (typeof a === "object" ? (a.fileName || a.FileName) : null) || url.split("/").pop();
                    return (
                      <a key={i} href={url} target="_blank" rel="noreferrer" style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 6 }}>
                        📎 {name}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ marginTop: 10 }}>
              <TagChips tags={p.tags} />
            </div>

            <div style={{ marginTop: 12 }}>
              <Link className="btn" to={`/post/edit/${p.id}`}>Edit</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

