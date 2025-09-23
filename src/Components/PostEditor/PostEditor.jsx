// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { createPostMultipart } from "../../Services/postsService";
// import "./PostEditor.css";

// const makeId = (prefix = "el") =>
//   `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// export default function PostEditor() {
//   const editorRef = useRef(null);
//   const navigate = useNavigate();

//   // Title state
//   const [title, setTitle] = useState("");

//   // file/attachment storage (refs used to avoid re-renders)
//   const imageFilesRef = useRef(new Map()); // elementId -> File
//   const attachmentsRef = useRef([]); // File[]

//   useEffect(() => {
//     const ed = editorRef.current;
//     if (ed && ed.childNodes.length === 0) {
//       ed.appendChild(createLineDiv(""));
//       placeCaretAtEnd(ed.firstChild);
//     }
//   }, []);

//   // ---- DOM helpers ----
//   function createLineDiv(text = "") {
//     const d = document.createElement("div");
//     d.className = "editor-line";
//     d.setAttribute("data-type", "text");
//     d.setAttribute("data-id", makeId("ln"));
//     d.contentEditable = "true";
//     d.innerText = text;
//     d.addEventListener("keydown", onLineKeyDown);
//     d.addEventListener("focus", () => d.classList.add("focused"));
//     d.addEventListener("blur", () => d.classList.remove("focused"));
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

//   function onLineKeyDown(e) {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       const cur = e.currentTarget;
//       const next = createLineDiv("");
//       cur.parentNode.insertBefore(next, cur.nextSibling);
//       setTimeout(() => placeCaretAtEnd(next), 0);
//     }
//     if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
//       document.execCommand("bold");
//       e.preventDefault();
//     }
//     if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
//       document.execCommand("italic");
//       e.preventDefault();
//     }
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
//     if (document.activeElement && document.activeElement.classList && document.activeElement.classList.contains("editor-line"))
//       return document.activeElement;
//     return editorRef.current?.firstChild || null;
//   }

//   // ---- toolbar actions ----
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
//       placeCaretAtEnd(line);
//     } else if (curType === "image") {
//       return;
//     } else {
//       line.setAttribute("data-type", "code");
//       line.classList.add("code-line");
//       line.contentEditable = "true";
//       placeCaretAtEnd(line);
//     }
//   }

//   // ---- image / attachment handlers ----
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

//   // ---- submit ----
//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (!title || title.trim() === "") {
//       alert("Please add Title");
//       return;
//     }

//     const ed = editorRef.current;
//     if (!ed) return;

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

//     if (elements.length === 0 && attachmentsRef.current.length === 0) {
//       alert("Please add content or attachments before posting.");
//       return;
//     }

//     const imageFiles = [];
//     for (const [id, file] of imageFilesRef.current.entries()) {
//       imageFiles.push({ id, file });
//     }
//     const attachments = [...attachmentsRef.current];

//     try {
//       console.log("Submitting post:", { title, elements, attachments, imageFiles });

//       const res = await createPostMultipart(elements, {
//         title,
//         images: imageFiles,
//         attachments,
//       });

//       console.log("createPostMultipart returned:", res);

//       const status = res?.status ?? (res && res.ok ? (res.ok ? 200 : 0) : undefined);
//       const data = res?.data ?? res;

//       if (status === 200 || status === 201 || (data && typeof data === "object")) {
//         alert("Posted successfully");
//         navigate("/feed", { replace: true });
//       } else {
//         console.warn("Unexpected API response:", { status, data, res });
//         alert("Failed to submit post: unexpected response from server");
//       }
//     } catch (err) {
//       console.error("Post failed (caught):", err);
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         (typeof err === "string" ? err : "Unknown error");
//       alert("Failed to submit post: " + msg);
//     }
//   }

//   // small render helper for attachment chips
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

//   return (
//     <div className="post-editor-inline">
//       <div className="title-row">
//         <input
//           className="post-title-input"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           maxLength={200}
//         />
//       </div>

//       <div className="toolbar">
//         <button type="button" className="toolbtn" title="Bold (Ctrl/Cmd+B)" onMouseDown={(e) => { e.preventDefault(); applyInline("bold"); }}>
//           <b>B</b>
//         </button>

//         <button type="button" className="toolbtn" title="Italic (Ctrl/Cmd+I)" onMouseDown={(e) => { e.preventDefault(); applyInline("italic"); }}>
//           <i>I</i>
//         </button>

//         <button type="button" className="toolbtn" title="Toggle Code Snippet (current line)" onMouseDown={(e) => { e.preventDefault(); toggleCodeForCurrentLine(); }}>
//           {"</>"}
//         </button>

//         <label className="toolbtn file-label" title="Insert image (file)">
//           📷
//           <input type="file" accept="image/*" onChange={(e) => handleImageFile(e.target.files?.[0])} style={{ display: "none" }} />
//         </label>

//         <button className="toolbtn" title="Insert image (URL)" onClick={handleImageUrl}>🌐</button>

//         <label className="toolbtn file-label" title="Add attachment">
//           📎
//           <input type="file" onChange={(e) => handleAttachmentFile(e.target.files?.[0])} style={{ display: "none" }} />
//         </label>
//       </div>

//       <form onSubmit={handleSubmit}>
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

//         <div className="editor-footer">
//           <button type="submit" className="post-btn">🚀 Post</button>
//         </div>
//       </form>
//     </div>
//   );
// }

// src/Components/PostEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPostMultipart } from "../../Services/postsService";
import "./PostEditor.css";

const makeId = (prefix = "el") =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export default function PostEditor() {
  const editorRef = useRef(null);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const imageFilesRef = useRef(new Map());
  const attachmentsRef = useRef([]);

  useEffect(() => {
    const ed = editorRef.current;
    if (ed && ed.childNodes.length === 0) {
      ed.appendChild(createLineDiv(""));
      placeCaretAtEnd(ed.firstChild);
    }
  }, []);

  function createLineDiv(text = "") {
    const d = document.createElement("div");
    d.className = "editor-line";
    d.setAttribute("data-type", "text");
    d.setAttribute("data-id", makeId("ln"));
    d.contentEditable = "true";
    d.innerText = text;
    d.addEventListener("keydown", onLineKeyDown);
    d.addEventListener("focus", () => d.classList.add("focused"));
    d.addEventListener("blur", () => d.classList.remove("focused"));
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

  function onLineKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const cur = e.currentTarget;
      const next = createLineDiv("");
      cur.parentNode.insertBefore(next, cur.nextSibling);
      setTimeout(() => placeCaretAtEnd(next), 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      document.execCommand("bold");
      e.preventDefault();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
      document.execCommand("italic");
      e.preventDefault();
    }
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
      if (node.nodeType === 1 && node.classList && node.classList.contains("editor-line")) return node;
      node = node.parentNode;
    }
    if (document.activeElement && document.activeElement.classList && document.activeElement.classList.contains("editor-line"))
      return document.activeElement;
    return editorRef.current?.firstChild || null;
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
      placeCaretAtEnd(line);
    } else if (curType === "image") {
      return;
    } else {
      line.setAttribute("data-type", "code");
      line.classList.add("code-line");
      line.contentEditable = "true";
      placeCaretAtEnd(line);
    }
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || title.trim() === "") {
      alert("Please add Title");
      return;
    }

    const ed = editorRef.current;
    if (!ed) return;

    const groups = [];
    let current = null;

    ed.childNodes.forEach((node) => {
      if (node.nodeType !== 1) return;
      const type = node.getAttribute("data-type") || "text";

      if (type === "image") {
        if (current) {
          groups.push(current);
          current = null;
        }
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

    if (elements.length === 0 && attachmentsRef.current.length === 0) {
      alert("Please add content or attachments before posting.");
      return;
    }

    const imageFiles = [];
    for (const [id, file] of imageFilesRef.current.entries()) {
      imageFiles.push({ id, file });
    }
    const attachments = [...attachmentsRef.current];

    try {
      console.log("Submitting post:", { title, elements, attachments, imageFiles });

      const res = await createPostMultipart(elements, {
        title,
        images: imageFiles,
        attachments,
      });

      console.log("createPostMultipart returned:", res);

      const status = res?.status ?? (res && res.ok ? (res.ok ? 200 : 0) : undefined);
      const data = res?.data ?? res;

      if (status === 200 || status === 201 || (data && typeof data === "object")) {
        alert("Posted successfully");
        setTitle("");
        const edEl = editorRef.current;
        if (edEl) {
          edEl.innerHTML = "";
          edEl.appendChild(createLineDiv(""));
        }
        imageFilesRef.current.clear();
        attachmentsRef.current = [];
        navigate("/feed", { replace: true });
      } else {
        console.warn("Unexpected API response:", { status, data, res });
        alert("Failed to submit post: unexpected response from server");
      }
    } catch (err) {
      console.error("Post failed (caught):", err);
      const msg =
        err?.response?.message ||
        err?.response?.error ||
        err?.message ||
        (typeof err === "string" ? err : "Unknown error");
      alert("Failed to submit post: " + msg);
    }
  }

  function renderAttachmentsChips() {
    return (
      <div className="attachments-row">
        {attachmentsRef.current.map((f, i) => (
          <div className="attachment-chip" key={i}>
            📎 {f.name}
            <button onClick={() => removeAttachmentAt(i)} className="chip-remove">
              ✕
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="post-editor-inline">
      <div className="title-row">
        <input
          className="post-title-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
        />
      </div>

      <div className="toolbar">
        <button
          type="button"
          className="toolbtn"
          title="Bold (Ctrl/Cmd+B)"
          onMouseDown={(e) => {
            e.preventDefault();
            applyInline("bold");
          }}
        >
          <b>B</b>
        </button>

        <button
          type="button"
          className="toolbtn"
          title="Italic (Ctrl/Cmd+I)"
          onMouseDown={(e) => {
            e.preventDefault();
            applyInline("italic");
          }}
        >
          <i>I</i>
        </button>

        <button
          type="button"
          className="toolbtn"
          title="Toggle Code Snippet (current line)"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleCodeForCurrentLine();
          }}
        >
          {"</>"}
        </button>

        <label className="toolbtn file-label" title="Insert image (file)">
          📷
          <input type="file" accept="image/*" onChange={(e) => handleImageFile(e.target.files?.[0])} style={{ display: "none" }} />
        </label>

        <button className="toolbtn" title="Insert image (URL)" onClick={handleImageUrl}>
          🌐
        </button>

        <label className="toolbtn file-label" title="Add attachment">
          📎
          <input type="file" onChange={(e) => handleAttachmentFile(e.target.files?.[0])} style={{ display: "none" }} />
        </label>
      </div>

      <form onSubmit={handleSubmit}>
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

        <div className="editor-footer">
          <button type="submit" className="post-btn">
            🚀 Post
          </button>
        </div>
      </form>
    </div>
  );
}
