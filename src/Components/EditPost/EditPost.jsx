// // import React, { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import Navbar from "../Navbar/Navbar";
// // // import { getPostById, updatePostMultipart } from "../../Services/postsService";
// // import TagsPicker from "../Tags/TagsPicker";
// // import { getPostById, updatePostMultipart } from "../../Services/postsService";


// // export default function EditPost() {
// //   const { id } = useParams();
// //   const navigate = useNavigate();

// //   const [loading, setLoading] = useState(true);
// //   const [title, setTitle] = useState("");
// //   const [elements, setElements] = useState([]);
// //   const [selectedTagIds, setSelectedTagIds] = useState([]);

// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const p = await getPostById(id);
// //         if (!p) {
// //           alert("Post not found or deleted");
// //           navigate("/my-posts", { replace: true });
// //           return;
// //         }
// //         setTitle(p.title || "");
// //         try {
// //           const parsed = p.body || p.Body;
// //           const els = typeof parsed === "string" ? JSON.parse(parsed || "[]") : parsed || [];
// //           setElements(Array.isArray(els) ? els : []);
// //         } catch {
// //           setElements([]);
// //         }
// //         const tagIds =
// //           p.tags?.map((t) => t.tagId || t.TagId).filter((x) => x != null) ||
// //           p.postTags?.map((pt) => pt.tagId || pt.TagId) ||
// //           [];
// //         setSelectedTagIds(tagIds);
// //       } catch (e) {
// //         console.error(e);
// //         alert(e.message || "Failed to load post");
// //         navigate("/my-posts", { replace: true });
// //       } finally {
// //         setLoading(false);
// //       }
// //     })();
// //   }, [id, navigate]);

// //   async function onSave(e) {
// //     e.preventDefault();
// //     try {
// //       await updatePostMultipart(id, { title, elements, tagIds: selectedTagIds });
// //       alert("Saved");
// //       navigate("/my-posts", { replace: true });
// //     } catch (e2) {
// //       alert(e2.message || "Update failed");
// //     }
// //   }

// //   if (loading) return <div className="loading">Loading…</div>;

// //   return (
// //     <div className="page">
// //       <Navbar />
// //       <div className="container">
// //         <h1>Edit Post</h1>
// //         <form onSubmit={onSave}>
// //           <label className="block mb-2 text-sm font-semibold">Title</label>
// //           <input
// //             value={title}
// //             onChange={(e) => setTitle(e.target.value)}
// //             className="post-title-input"
// //             placeholder="Title"
// //             maxLength={200}
// //           />

// //           <label className="block mb-2 text-sm font-semibold" style={{ marginTop: 12 }}>Body (JSON blocks)</label>
// //           <textarea
// //             value={JSON.stringify(elements, null, 2)}
// //             onChange={(e) => {
// //               try {
// //                 const val = JSON.parse(e.target.value);
// //                 if (Array.isArray(val)) setElements(val);
// //               } catch {
// //                 // ignore until valid JSON
// //               }
// //             }}
// //             rows={14}
// //             style={{ width: "100%", fontFamily: "monospace" }}
// //           />

// //           <section style={{ marginTop: 12 }}>
// //             <label className="block mb-2 text-sm">Tags</label>
// //             <TagsPicker
// //               mode="mine"
// //               multiple
// //               value={selectedTagIds}
// //               onChange={setSelectedTagIds}
// //             />
// //           </section>

// //           <div style={{ marginTop: 12 }}>
// //             <button type="submit" className="btn">💾 Save</button>
// //             <button type="button" className="btn" onClick={() => navigate("/my-posts")}>Cancel</button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getPostById, updatePostMultipart } from "../../Services/postsService";
// import TagsPicker from "../Tags/TagsPicker";
// import "./EditPost.css"; // optional; safe to omit if you don't have it

// const makeId = (prefix = "el") =>
//   `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// export default function EditPost() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const editorRef = useRef(null);
//   const imageFilesRef = useRef(new Map());   // image element id -> File
//   const attachmentsRef = useRef([]);         // extra attachments added while editing

//   const [loading, setLoading] = useState(true);
//   const [title, setTitle] = useState("");
//   const [selectedTagIds, setSelectedTagIds] = useState([]);

//   // -------------------- editor helpers (same as PostEditor) --------------------
//   function createLineDiv(text = "", type = "text") {
//     const d = document.createElement("div");
//     d.className = "editor-line";
//     d.setAttribute("data-type", type);
//     d.setAttribute("data-id", makeId(type === "code" ? "code" : "ln"));
//     d.contentEditable = "true";
//     d.innerText = text;
//     d.addEventListener("keydown", onLineKeyDown);
//     d.addEventListener("focus", () => d.classList.add("focused"));
//     d.addEventListener("blur", () => d.classList.remove("focused"));
//     if (type === "code") d.classList.add("code-line");
//     return d;
//   }

//   function createImageLine(imgSrc, file = null, name = "") {
//     const d = document.createElement("div");
//     d.className = "editor-line image-line";
//     d.setAttribute("data-type", "image");
//     const id = makeId("img");
//     d.setAttribute("data-id", id);

//     const wrapper = document.createElement("div");
//     wrapper.className = "image-wrapper";

//     const img = document.createElement("img");
//     img.className = "inline-image";
//     img.src = imgSrc;
//     img.alt = name || "image";

//     const rm = document.createElement("button");
//     rm.className = "inline-remove-btn";
//     rm.innerText = "✕";
//     rm.title = "Remove image";
//     rm.addEventListener("click", (e) => {
//       e.stopPropagation();
//       const parent = d.parentNode;
//       if (!parent) return;
//       if (file) imageFilesRef.current.delete(id);
//       parent.removeChild(d);
//       setTimeout(() => {
//         const nextText = parent.querySelector(".editor-line[data-type='text']");
//         if (nextText) placeCaretAtEnd(nextText);
//       }, 0);
//     });

//     wrapper.appendChild(img);
//     wrapper.appendChild(rm);
//     d.appendChild(wrapper);
//     d.contentEditable = "false";
//     return { node: d, id };
//   }

//   function placeCaretAtEnd(el) {
//     if (!el) return;
//     el.focus();
//     const range = document.createRange();
//     range.selectNodeContents(el);
//     range.collapse(false);
//     const sel = window.getSelection();
//     sel.removeAllRanges();
//     sel.addRange(range);
//   }

//   function getCurrentLineDiv() {
//     const sel = document.getSelection();
//     if (!sel || !sel.anchorNode) return null;
//     let node = sel.anchorNode;
//     while (node && node !== editorRef.current) {
//       if (node.nodeType === 1 && node.classList && node.classList.contains("editor-line")) return node;
//       node = node.parentNode;
//     }
//     if (document.activeElement?.classList?.contains("editor-line")) return document.activeElement;
//     return editorRef.current?.firstChild || null;
//   }

//   function onLineKeyDown(e) {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       const cur = e.currentTarget;
//       const next = createLineDiv("");
//       cur.parentNode.insertBefore(next, cur.nextSibling);
//       setTimeout(() => placeCaretAtEnd(next), 0);
//     }
//     if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
//       document.execCommand("bold"); e.preventDefault();
//     }
//     if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
//       document.execCommand("italic"); e.preventDefault();
//     }
//   }

//   function applyInline(format) {
//     if (format === "bold") document.execCommand("bold");
//     if (format === "italic") document.execCommand("italic");
//     const line = getCurrentLineDiv();
//     if (line) placeCaretAtEnd(line);
//   }

//   function toggleCodeForCurrentLine() {
//     const line = getCurrentLineDiv();
//     if (!line) return;
//     const curType = line.getAttribute("data-type");
//     if (curType === "code") {
//       line.setAttribute("data-type", "text");
//       line.classList.remove("code-line");
//       line.contentEditable = "true";
//     } else if (curType === "image") {
//       return;
//     } else {
//       line.setAttribute("data-type", "code");
//       line.classList.add("code-line");
//       line.contentEditable = "true";
//     }
//     placeCaretAtEnd(line);
//   }

//   function insertNodeAfter(node) {
//     const cur = getCurrentLineDiv();
//     const parent = editorRef.current;
//     if (!parent) return;
//     if (!cur) {
//       parent.appendChild(node);
//       const textAfter = createLineDiv("");
//       parent.appendChild(textAfter);
//       setTimeout(() => placeCaretAtEnd(textAfter), 0);
//       return;
//     }
//     cur.parentNode.insertBefore(node, cur.nextSibling);
//     const textEl = createLineDiv("");
//     node.parentNode.insertBefore(textEl, node.nextSibling);
//     setTimeout(() => placeCaretAtEnd(textEl), 0);
//   }

//   function handleImageFile(file) {
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const { node, id } = createImageLine(e.target.result, file, file.name);
//       insertNodeAfter(node);
//       imageFilesRef.current.set(id, file);
//     };
//     reader.readAsDataURL(file);
//   }

//   function handleImageUrl() {
//     const url = prompt("Paste image URL");
//     if (!url) return;
//     const { node } = createImageLine(url, null, url);
//     insertNodeAfter(node);
//   }

//   function handleAttachmentFile(file) {
//     if (!file) return;
//     attachmentsRef.current = [...attachmentsRef.current, file];
//     editorRef.current?.classList.toggle("attachments-updated");
//     setTimeout(() => editorRef.current?.classList.toggle("attachments-updated"), 10);
//   }

//   function removeAttachmentAt(index) {
//     attachmentsRef.current = attachmentsRef.current.filter((_, i) => i !== index);
//     editorRef.current?.classList.toggle("attachments-updated");
//     setTimeout(() => editorRef.current?.classList.toggle("attachments-updated"), 10);
//   }

//   // -------------------- load existing post --------------------
//   useEffect(() => {
//     (async () => {
//       try {
//         const p = await getPostById(id);
//         if (!p) {
//           alert("Post not found or deleted");
//           navigate("/my-posts", { replace: true });
//           return;
//         }
//         setTitle(p.title || "");

//         // tags
//         const tagIds =
//           p.tags?.map((t) => t.tagId || t.TagId).filter((x) => x != null) ||
//           p.postTags?.map((pt) => pt.tagId || pt.TagId) ||
//           [];
//         setSelectedTagIds(tagIds);

//         // build editor DOM from saved Body JSON
//         const body = p.body ?? p.Body ?? "[]";
//         let els = [];
//         try {
//           const parsed = typeof body === "string" ? JSON.parse(body) : body;
//           els = Array.isArray(parsed) ? parsed : [];
//         } catch { els = []; }

//         const ed = editorRef.current;
//         ed.innerHTML = "";

//         if (els.length === 0) {
//           ed.appendChild(createLineDiv(""));
//         } else {
//           els.forEach((el) => {
//             const t = String(el.type ?? "text").toLowerCase();
//             if (t === "image") {
//               const src = el.imagePreview || el.url || el.src;
//               if (src) {
//                 const { node } = createImageLine(src, null, el.imageName || "");
//                 ed.appendChild(node);
//                 ed.appendChild(createLineDiv(""));
//               }
//             } else if (t === "code") {
//               const content = (el.content ?? "").toString();
//               const lines = content.split("\n");
//               lines.forEach((line) => ed.appendChild(createLineDiv(line, "code")));
//               ed.appendChild(createLineDiv(""));
//             } else {
//               const content = (el.content ?? "").toString();
//               const lines = content.split("\n");
//               lines.forEach((line) => ed.appendChild(createLineDiv(line, "text")));
//               ed.appendChild(createLineDiv(""));
//             }
//           });
//         }
//         // focus end
//         setTimeout(() => placeCaretAtEnd(ed.lastChild), 0);
//       } catch (e) {
//         console.error(e);
//         alert(e.message || "Failed to load post");
//         navigate("/my-posts", { replace: true });
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id, navigate]);

//   // -------------------- gather + save --------------------
//   function gatherElementsFromEditor() {
//     const ed = editorRef.current;
//     const groups = [];
//     let current = null;

//     ed.childNodes.forEach((node) => {
//       if (node.nodeType !== 1) return;
//       const type = node.getAttribute("data-type") || "text";

//       if (type === "image") {
//         if (current) {
//           groups.push(current);
//           current = null;
//         }
//         const imgId = node.getAttribute("data-id");
//         const img = node.querySelector("img");
//         const src = img?.src || "";
//         groups.push({ type: "image", id: imgId, src });
//         return;
//       }

//       const txt = (node.innerText || "").replace(/\u00A0/g, "");
//       if (!current) {
//         current = { type, id: makeId(type === "code" ? "code" : "text"), lines: [txt] };
//       } else if (current.type === type) {
//         current.lines.push(txt);
//       } else {
//         groups.push(current);
//         current = { type, id: makeId(type === "code" ? "code" : "text"), lines: [txt] };
//       }
//     });

//     if (current) groups.push(current);

//     const elements = groups
//       .map((g) => {
//         if (g.type === "image") return { id: g.id, type: "image", imagePreview: g.src, imageName: "" };
//         const content = g.lines.join("\n");
//         if (g.type === "text") {
//           if (content.trim() === "") return null;
//           return { id: g.id, type: "text", content };
//         } else if (g.type === "code") {
//           if (content.trim() === "") return null;
//           return { id: g.id, type: "code", content };
//         }
//         return null;
//       })
//       .filter(Boolean);

//     // pair image ids to files (only for images the user replaced/added from disk)
//     const withNames = elements.map((el) =>
//       el.type === "image"
//         ? { ...el, imageName: el.imageName || (imageFilesRef.current.get(el.id)?.name ?? "") }
//         : el
//     );

//     return withNames;
//   }

//   async function onSave(e) {
//     e.preventDefault();
//     const elements = gatherElementsFromEditor();
//     try {
//       await updatePostMultipart(id, {
//         title,
//         elements,
//         tagIds: selectedTagIds,
//         attachments: attachmentsRef.current, // optional extra files
//       });
//       alert("Saved");
//       navigate("/my-posts", { replace: true });
//     } catch (e2) {
//       alert(e2.message || "Update failed");
//     }
//   }

//   function renderAttachmentsChips() {
//     return (
//       <div className="attachments-row">
//         {attachmentsRef.current.map((f, i) => (
//           <div className="attachment-chip" key={i}>
//             📎 {f.name}
//             <button onClick={() => removeAttachmentAt(i)} className="chip-remove">
//               ✕
//             </button>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (loading) return <div className="loading">Loading…</div>;

//   return (
//     <div className="post-editor-inline" style={{ padding: 16 }}>
//       <h1>Edit Post</h1>

//       {/* toolbar — identical to PostEditor */}
//       <div className="title-row" style={{ marginBottom: 8 }}>
//         <input
//           className="post-title-input"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           maxLength={200}
//         />
//       </div>

//       <div className="toolbar">
//         <button
//           type="button"
//           className="toolbtn"
//           title="Bold (Ctrl/Cmd+B)"
//           onMouseDown={(e) => { e.preventDefault(); applyInline("bold"); }}
//         >
//           <b>B</b>
//         </button>

//         <button
//           type="button"
//           className="toolbtn"
//           title="Italic (Ctrl/Cmd+I)"
//           onMouseDown={(e) => { e.preventDefault(); applyInline("italic"); }}
//         >
//           <i>I</i>
//         </button>

//         <button
//           type="button"
//           className="toolbtn"
//           title="Toggle Code Snippet (current line)"
//           onMouseDown={(e) => { e.preventDefault(); toggleCodeForCurrentLine(); }}
//         >
//           {"</>"}
//         </button>

//         <label className="toolbtn file-label" title="Insert image (file)">
//           📷
//           <input type="file" accept="image/*" onChange={(e) => handleImageFile(e.target.files?.[0])} style={{ display: "none" }} />
//         </label>

//         <button className="toolbtn" title="Insert image (URL)" onClick={handleImageUrl}>
//           🌐
//         </button>

//         <label className="toolbtn file-label" title="Add attachment">
//           📎
//           <input type="file" onChange={(e) => handleAttachmentFile(e.target.files?.[0])} style={{ display: "none" }} />
//         </label>
//       </div>

//       <form onSubmit={onSave}>
//         <label className="block mb-2 text-sm font-semibold">Body</label>
//         <div
//           ref={editorRef}
//           className="inline-editor"
//           role="textbox"
//           aria-multiline="true"
//           tabIndex={0}
//           onClick={() => {
//             const el = editorRef.current;
//             if (el && el.childNodes.length === 0) {
//               el.appendChild(createLineDiv(""));
//               placeCaretAtEnd(el.firstChild);
//             }
//           }}
//         />

//         {renderAttachmentsChips()}

//         <section style={{ marginTop: 12 }}>
//           <label className="block mb-2 text-sm">Tags</label>
//           <TagsPicker mode="mine" multiple value={selectedTagIds} onChange={setSelectedTagIds} />
//         </section>

//         <div className="editor-footer" style={{ marginTop: 12 }}>
//           <button type="submit" className="post-btn">💾 Save</button>
//           <button type="button" className="btn" onClick={() => navigate("/my-posts")}>Cancel</button>
//         </div>
//       </form>
//     </div>
//   );
// }


import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePostMultipart } from "../../Services/postsService";
import TagsPicker from "../Tags/TagsPicker";
import "./EditPost.css";

const makeId = (prefix = "el") =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editorRef = useRef(null);
  const imageFilesRef = useRef(new Map()); // image element id -> File
  const attachmentsRef = useRef([]);       // extra attachments added while editing

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [initialElements, setInitialElements] = useState([]); // NEW: hydrate after DOM exists

  // ---------- editor helpers (same as PostEditor) ----------
  function createLineDiv(text = "", type = "text") {
    const d = document.createElement("div");
    d.className = "editor-line";
    d.setAttribute("data-type", type);
    d.setAttribute("data-id", makeId(type === "code" ? "code" : "ln"));
    d.contentEditable = "true";
    d.innerText = text;
    d.addEventListener("keydown", onLineKeyDown);
    d.addEventListener("focus", () => d.classList.add("focused"));
    d.addEventListener("blur", () => d.classList.remove("focused"));
    if (type === "code") d.classList.add("code-line");
    return d;
  }

  function createImageLine(imgSrc, file = null, name = "") {
    const d = document.createElement("div");
    d.className = "editor-line image-line";
    d.setAttribute("data-type", "image");
    const id = makeId("img");
    d.setAttribute("data-id", id);

    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper";

    const img = document.createElement("img");
    img.className = "inline-image";
    img.src = imgSrc;
    img.alt = name || "image";

    const rm = document.createElement("button");
    rm.className = "inline-remove-btn";
    rm.innerText = "✕";
    rm.title = "Remove image";
    rm.addEventListener("click", (e) => {
      e.stopPropagation();
      const parent = d.parentNode;
      if (!parent) return;
      if (file) imageFilesRef.current.delete(id);
      parent.removeChild(d);
      setTimeout(() => {
        const nextText = parent.querySelector(".editor-line[data-type='text']");
        if (nextText) placeCaretAtEnd(nextText);
      }, 0);
    });

    wrapper.appendChild(img);
    wrapper.appendChild(rm);
    d.appendChild(wrapper);
    d.contentEditable = "false";
    return { node: d, id };
  }

  function placeCaretAtEnd(el) {
    if (!el) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function getCurrentLineDiv() {
    const sel = document.getSelection();
    if (!sel || !sel.anchorNode) return null;
    let node = sel.anchorNode;
    while (node && node !== editorRef.current) {
      if (node.nodeType === 1 && node.classList?.contains("editor-line")) return node;
      node = node.parentNode;
    }
    if (document.activeElement?.classList?.contains("editor-line")) return document.activeElement;
    return editorRef.current?.firstChild || null;
  }

  function onLineKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const cur = e.currentTarget;
      const next = createLineDiv("");
      cur.parentNode.insertBefore(next, cur.nextSibling);
      setTimeout(() => placeCaretAtEnd(next), 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      document.execCommand("bold"); e.preventDefault();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
      document.execCommand("italic"); e.preventDefault();
    }
  }

  function applyInline(format) {
    if (format === "bold") document.execCommand("bold");
    if (format === "italic") document.execCommand("italic");
    const line = getCurrentLineDiv();
    if (line) placeCaretAtEnd(line);
  }

  function toggleCodeForCurrentLine() {
    const line = getCurrentLineDiv();
    if (!line) return;
    const curType = line.getAttribute("data-type");
    if (curType === "code") {
      line.setAttribute("data-type", "text");
      line.classList.remove("code-line");
      line.contentEditable = "true";
    } else if (curType === "image") {
      return;
    } else {
      line.setAttribute("data-type", "code");
      line.classList.add("code-line");
      line.contentEditable = "true";
    }
    placeCaretAtEnd(line);
  }

  function insertNodeAfter(node) {
    const cur = getCurrentLineDiv();
    const parent = editorRef.current;
    if (!parent) return;
    if (!cur) {
      parent.appendChild(node);
      const textAfter = createLineDiv("");
      parent.appendChild(textAfter);
      setTimeout(() => placeCaretAtEnd(textAfter), 0);
      return;
    }
    cur.parentNode.insertBefore(node, cur.nextSibling);
    const textEl = createLineDiv("");
    node.parentNode.insertBefore(textEl, node.nextSibling);
    setTimeout(() => placeCaretAtEnd(textEl), 0);
  }

  function handleImageFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const { node, id } = createImageLine(e.target.result, file, file.name);
      insertNodeAfter(node);
      imageFilesRef.current.set(id, file);
    };
    reader.readAsDataURL(file);
  }

  function handleImageUrl() {
    const url = prompt("Paste image URL");
    if (!url) return;
    const { node } = createImageLine(url, null, url);
    insertNodeAfter(node);
  }

  function handleAttachmentFile(file) {
    if (!file) return;
    attachmentsRef.current = [...attachmentsRef.current, file];
    editorRef.current?.classList.toggle("attachments-updated");
    setTimeout(() => editorRef.current?.classList.toggle("attachments-updated"), 10);
  }

  function removeAttachmentAt(index) {
    attachmentsRef.current = attachmentsRef.current.filter((_, i) => i !== index);
    editorRef.current?.classList.toggle("attachments-updated");
    setTimeout(() => editorRef.current?.classList.toggle("attachments-updated"), 10);
  }

  // ---------- 1) fetch post (no DOM writes here) ----------
  useEffect(() => {
    (async () => {
      try {
        const p = await getPostById(id);
        if (!p) {
          alert("Post not found or deleted");
          navigate("/my-posts", { replace: true });
          return;
        }
        setTitle(p.title || "");

        const tagIds =
          p.tags?.map((t) => t.tagId || t.TagId).filter((x) => x != null) ||
          p.postTags?.map((pt) => pt.tagId || pt.TagId) ||
          [];
        setSelectedTagIds(tagIds);

        const body = p.body ?? p.Body ?? "[]";
        let els = [];
        try {
          const parsed = typeof body === "string" ? JSON.parse(body) : body;
          els = Array.isArray(parsed) ? parsed : [];
        } catch { els = []; }

        setInitialElements(els);
      } catch (e) {
        console.error(e);
        alert(e.message || "Failed to load post");
        navigate("/my-posts", { replace: true });
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  // ---------- 2) once DOM is mounted, hydrate editor ----------
  useEffect(() => {
    if (loading) return;
    const ed = editorRef.current;
    if (!ed) return; // safety
    ed.innerHTML = "";

    const els = initialElements && Array.isArray(initialElements) ? initialElements : [];
    if (els.length === 0) {
      ed.appendChild(createLineDiv(""));
      return;
    }

    els.forEach((el) => {
      const t = String(el.type ?? "text").toLowerCase();
      if (t === "image") {
        const src = el.imagePreview || el.url || el.src;
        if (src) {
          const { node } = createImageLine(src, null, el.imageName || "");
          ed.appendChild(node);
          ed.appendChild(createLineDiv(""));
        }
      } else if (t === "code") {
        const content = (el.content ?? "").toString();
        const lines = content.split("\n");
        lines.forEach((line) => ed.appendChild(createLineDiv(line, "code")));
        ed.appendChild(createLineDiv(""));
      } else {
        const content = (el.content ?? "").toString();
        const lines = content.split("\n");
        lines.forEach((line) => ed.appendChild(createLineDiv(line, "text")));
        ed.appendChild(createLineDiv(""));
      }
    });

    // focus end
    setTimeout(() => placeCaretAtEnd(ed.lastChild), 0);
  }, [loading, initialElements]);

  // ---------- gather + save ----------
  function gatherElementsFromEditor() {
    const ed = editorRef.current;
    const groups = [];
    let current = null;

    ed.childNodes.forEach((node) => {
      if (node.nodeType !== 1) return;
      const type = node.getAttribute("data-type") || "text";

      if (type === "image") {
        if (current) { groups.push(current); current = null; }
        const imgId = node.getAttribute("data-id");
        const img = node.querySelector("img");
        const src = img?.src || "";
        groups.push({ type: "image", id: imgId, src });
        return;
      }

      const txt = (node.innerText || "").replace(/\u00A0/g, "");
      if (!current) {
        current = { type, id: makeId(type === "code" ? "code" : "text"), lines: [txt] };
      } else if (current.type === type) {
        current.lines.push(txt);
      } else {
        groups.push(current);
        current = { type, id: makeId(type === "code" ? "code" : "text"), lines: [txt] };
      }
    });

    if (current) groups.push(current);

    const elements = groups
      .map((g) => {
        if (g.type === "image") return { id: g.id, type: "image", imagePreview: g.src, imageName: "" };
        const content = g.lines.join("\n");
        if (g.type === "text") {
          if (content.trim() === "") return null;
          return { id: g.id, type: "text", content };
        } else if (g.type === "code") {
          if (content.trim() === "") return null;
          return { id: g.id, type: "code", content };
        }
        return null;
      })
      .filter(Boolean);

    // link image elements with any new Files added during editing
    const withNames = elements.map((el) =>
      el.type === "image"
        ? { ...el, imageName: el.imageName || (imageFilesRef.current.get(el.id)?.name ?? "") }
        : el
    );

    return withNames;
  }

  async function onSave(e) {
    e.preventDefault();
    const elements = gatherElementsFromEditor();
    try {
      await updatePostMultipart(id, {
        title,
        elements,
        tagIds: selectedTagIds,
        attachments: attachmentsRef.current,
      });
      alert("Saved");
      navigate("/my-posts", { replace: true });
    } catch (e2) {
      alert(e2.message || "Update failed");
    }
  }

  function renderAttachmentsChips() {
    return (
      <div className="attachments-row">
        {attachmentsRef.current.map((f, i) => (
          <div className="attachment-chip" key={i}>
            📎 {f.name}
            <button onClick={() => removeAttachmentAt(i)} className="chip-remove">✕</button>
          </div>
        ))}
      </div>
    );
  }

  if (loading) return <div className="loading">Loading…</div>;

  return (
    <div className="post-editor-inline" style={{ padding: 16 }}>
      <h1>Edit Post</h1>

      <div className="title-row" style={{ marginBottom: 8 }}>
        <input
          className="post-title-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
        />
      </div>

      <div className="toolbar">
        <button type="button" className="toolbtn" title="Bold (Ctrl/Cmd+B)"
          onMouseDown={(e) => { e.preventDefault(); applyInline("bold"); }}><b>B</b></button>
        <button type="button" className="toolbtn" title="Italic (Ctrl/Cmd+I)"
          onMouseDown={(e) => { e.preventDefault(); applyInline("italic"); }}><i>I</i></button>
        <button type="button" className="toolbtn" title="Toggle Code Snippet"
          onMouseDown={(e) => { e.preventDefault(); toggleCodeForCurrentLine(); }}>{"</>"}</button>
        <label className="toolbtn file-label" title="Insert image (file)">
          📷
          <input type="file" accept="image/*" onChange={(e) => handleImageFile(e.target.files?.[0])} style={{ display: "none" }} />
        </label>
        <button className="toolbtn" title="Insert image (URL)" onClick={handleImageUrl}>🌐</button>
        <label className="toolbtn file-label" title="Add attachment">
          📎
          <input type="file" onChange={(e) => handleAttachmentFile(e.target.files?.[0])} style={{ display: "none" }} />
        </label>
      </div>

      <form onSubmit={onSave}>
        <label className="block mb-2 text-sm font-semibold">Body</label>
        <div
          ref={editorRef}
          className="inline-editor"
          role="textbox"
          aria-multiline="true"
          tabIndex={0}
          onClick={() => {
            const el = editorRef.current;
            if (el && el.childNodes.length === 0) {
              el.appendChild(createLineDiv(""));
              placeCaretAtEnd(el.firstChild);
            }
          }}
        />

        {renderAttachmentsChips()}

        <section style={{ marginTop: 12 }}>
          <label className="block mb-2 text-sm">Tags</label>
          <TagsPicker mode="mine" multiple value={selectedTagIds} onChange={setSelectedTagIds} />
        </section>

        <div className="editor-footer" style={{ marginTop: 12 }}>
          <button type="submit" className="post-btn">💾 Save</button>
          <button type="button" className="btn" onClick={() => navigate("/my-posts")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
