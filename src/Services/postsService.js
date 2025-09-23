// // // import api from "./api";

// // // export async function createPostMultipart(elements = [], titleOrOpts = "") {
// // //   const form = new FormData();

// // //   // normalize opts
// // //   let title = "";
// // //   let extraImages = []; // array of { id, file }
// // //   let extraAttachments = []; // array of File

// // //   if (typeof titleOrOpts === "string") {
// // //     title = titleOrOpts;
// // //   } else if (titleOrOpts && typeof titleOrOpts === "object") {
// // //     title = titleOrOpts.title || "";
// // //     extraImages = Array.isArray(titleOrOpts.images) ? titleOrOpts.images : [];
// // //     extraAttachments = Array.isArray(titleOrOpts.attachments)
// // //       ? titleOrOpts.attachments
// // //       : [];
// // //   }

// // //   // Build Body (markdown-like) same style as your previous implementation
// // //   const parts = elements.map((el) => {
// // //     if (!el) return "";
// // //     if (el.type === "text") {
// // //       return `${el.content ?? ""}\n\n`;
// // //     } else if (el.type === "code") {
// // //       return "```\n" + (el.content ?? "") + "\n```\n\n";
// // //     } else if (el.type === "image") {
// // //       // we keep image placeholder in body; actual file is attached below
// // //       return `![${el.imageName || "image"}]()\n\n`;
// // //     }
// // //     return "";
// // //   });

// // //   const bodyText = parts.join("").trim();

// // //   // Always append Title and both Body forms
// // //   form.append("Title", title ?? "");
// // //   form.append("Body", bodyText ?? "");
// // //   // Add structured body as JSON for server-side parsing if desired
// // //   try {
// // //     form.append("BodyJson", JSON.stringify(elements ?? []));
// // //   } catch (err) {
// // //     // fallback: don't block posting if JSON stringify fails
// // //     console.warn("Failed to stringify elements for BodyJson:", err);
// // //   }

// // //   // Append files found inside elements (image element files)
// // //   let fileCount = 0;
// // //   elements.forEach((el) => {
// // //     if (el && el.type === "image" && el.imageFile instanceof File) {
// // //       // include element id in filename to help server map file->element if needed
// // //       const filename =
// // //         el.imageName || el.imageFile.name || `image-${fileCount}`;
// // //       form.append(
// // //         "Attachments",
// // //         el.imageFile,
// // //         `${el.id || `img${fileCount}`}-${filename}`
// // //       );
// // //       fileCount++;
// // //     }
// // //   });

// // //   // Append files passed explicitly in opts.images (array of {id, file})
// // //   extraImages.forEach((img, idx) => {
// // //     if (img && img.file instanceof File) {
// // //       const fname = img.file.name || `image-extra-${idx}`;
// // //       form.append(
// // //         "Attachments",
// // //         img.file,
// // //         `${img.id || `img-extra-${idx}`}-${fname}`
// // //       );
// // //     }
// // //   });

// // //   // Append attachments passed explicitly
// // //   extraAttachments.forEach((f, idx) => {
// // //     if (f instanceof File) {
// // //       form.append("Attachments", f, f.name || `attachment-${idx}`);
// // //     }
// // //   });

// // //   // If you need to include DeptId, TagIds, etc., append here.
// // //   // e.g. form.append("DeptId", deptIdValue);

// // //   // Send to backend. IMPORTANT: do NOT set Content-Type header here.
// // //   const res = await api.request("/api/Posts", {
// // //     method: "POST",
// // //     body: form,
// // //   });

// // //   return res;
// // // }

// // // export default {
// // //   createPostMultipart,
// // // };
// // import api from "./api";

// // export async function createPostMultipart(elements = [], titleOrOpts = "") {
// //   const form = new FormData();

// //   // normalize opts
// //   let title = "";
// //   let extraImages = []; // array of { id, file }
// //   let extraAttachments = []; // array of File

// //   if (typeof titleOrOpts === "string") {
// //     title = titleOrOpts;
// //   } else if (titleOrOpts && typeof titleOrOpts === "object") {
// //     title = titleOrOpts.title || "";
// //     extraImages = Array.isArray(titleOrOpts.images) ? titleOrOpts.images : [];
// //     extraAttachments = Array.isArray(titleOrOpts.attachments)
// //       ? titleOrOpts.attachments
// //       : [];
// //   }

// //   // Build Body (markdown-like)
// //   const parts = elements.map((el) => {
// //     if (!el) return "";
// //     if (el.type === "text") {
// //       return `${el.content ?? ""}\n\n`;
// //     } else if (el.type === "code") {
// //       return "```\n" + (el.content ?? "") + "\n```\n\n";
// //     } else if (el.type === "image") {
// //       return `![${el.imageName || "image"}]()\n\n`;
// //     }
// //     return "";
// //   });

// //   const bodyText = parts.join("").trim();

// //   // Append Title and body
// //   form.append("Title", title ?? "");
// //   form.append("Body", bodyText ?? "");
// //   try {
// //     form.append("BodyJson", JSON.stringify(elements ?? []));
// //   } catch (err) {
// //     console.warn("Failed to stringify elements for BodyJson:", err);
// //   }

// //   // Append files from elements (image.element.imageFile)
// //   let fileCount = 0;
// //   elements.forEach((el) => {
// //     if (el && el.type === "image" && el.imageFile instanceof File) {
// //       const filename =
// //         el.imageName || el.imageFile.name || `image-${fileCount}`;
// //       form.append(
// //         "Attachments",
// //         el.imageFile,
// //         `${el.id || `img${fileCount}`}-${filename}`
// //       );
// //       fileCount++;
// //     }
// //   });

// //   // Append extra images (opts.images = [{id, file}])
// //   extraImages.forEach((img, idx) => {
// //     if (img && img.file instanceof File) {
// //       const fname = img.file.name || `image-extra-${idx}`;
// //       form.append(
// //         "Attachments",
// //         img.file,
// //         `${img.id || `img-extra-${idx}`}-${fname}`
// //       );
// //     }
// //   });

// //   // Append extra attachments
// //   extraAttachments.forEach((f, idx) => {
// //     if (f instanceof File) {
// //       form.append("Attachments", f, f.name || `attachment-${idx}`);
// //     }
// //   });

// //   // Send to backend. IMPORTANT: do NOT set Content-Type header here.
// //   try {
// //     const res = await api.request("/api/Posts", {
// //       method: "POST",
// //       body: form,
// //     });

// //     // If api.request returned a Response-like object (fetch-style)
// //     if (res && typeof res.status === "number") {
// //       const isOk = res.ok || (res.status >= 200 && res.status < 300);
// //       const ct =
// //         res.headers && res.headers.get
// //           ? res.headers.get("content-type") || ""
// //           : "";

// //       let data = null;
// //       if (isOk) {
// //         // try parse JSON when present, otherwise fallback to text or null
// //         if (ct.includes("application/json")) {
// //           try {
// //             data = await res.json();
// //           } catch (_) {
// //             data = null;
// //           }
// //         } else {
// //           try {
// //             const txt = await res.text();
// //             data = txt ? txt : null;
// //           } catch (_) {
// //             data = null;
// //           }
// //         }
// //         // return success object (do not throw on 2xx + empty body)
// //         return { ok: true, status: res.status, data };
// //       } else {
// //         // non-2xx -> try to extract error message and throw
// //         let errMsg = `Request failed (${res.status})`;
// //         try {
// //           if (ct.includes("application/json")) {
// //             const j = await res.json();
// //             errMsg = j && j.message ? j.message : JSON.stringify(j);
// //           } else {
// //             const t = await res.text();
// //             if (t) errMsg = t;
// //           }
// //         } catch (_) {}
// //         throw new Error(errMsg);
// //       }
// //     }

// //     // Fallback: api.request may have returned parsed JSON / object already
// //     return { ok: true, status: 200, data: res };
// //   } catch (err) {
// //     // real network / request error -> rethrow so caller sees failure
// //     throw err;
// //   }
// // }

// // export default {
// //   createPostMultipart,
// // };

// // src/Services/postsService.js
// import api from "./api";

// /**
//  * createPostMultipart(elements, { title, images, attachments })
//  * - elements: array of { id, type, content?, imagePreview? }
//  * - images: [{ id, file }]
//  * - attachments: [File]
//  *
//  * Returns parsed server response (or throws an Error with .response on failure)
//  */
// export async function createPostMultipart(
//   elements,
//   { title, images = [], attachments = [] } = {}
// ) {
//   const form = new FormData();

//   if (typeof title !== "undefined") form.append("title", title);

//   // elements metadata as JSON string
//   form.append("elements", JSON.stringify(elements || []));

//   // Add images as multiple files (field name: image_files)
//   // Also produce image_map so server can map uploaded filenames to element ids
//   const imageMap = [];
//   for (let i = 0; i < (images || []).length; i++) {
//     const it = images[i];
//     if (!it || !it.file) continue;
//     form.append("image_files", it.file, it.file.name);
//     imageMap.push({ id: it.id, filename: it.file.name });
//   }
//   form.append("image_map", JSON.stringify(imageMap));

//   // Add attachments
//   for (let i = 0; i < (attachments || []).length; i++) {
//     const f = attachments[i];
//     if (!f) continue;
//     form.append("attachments", f, f.name);
//   }

//   return await api.request("/api/Posts", {
//     method: "POST",
//     body: form,
//   });
// }

// export default {
//   createPostMultipart,
// };

// src/Services/postsService.js
import { request as apiRequest } from "./api";
import { getToken } from "./AuthService"; // your AuthService functions use localStorage key "token"

const API_BASE = (import.meta.env.VITE_API || "http://localhost:5294").replace(
  /\/+$/,
  ""
);

/**
 * Create post with multipart/form-data.
 * - elements: array of blocks (text/code/image...), images should be elements with imageFile field.
 * - title, deptId, tagIds, userId
 *
 * Returns parsed server response on success, throws Error on failure.
 */
export async function createPostMultipart(
  elements,
  title,
  deptId = 0,
  tagIds = [],
  userId = 0
) {
  // Build FormData
  const formData = new FormData();
  formData.append("Title", title ?? "");
  formData.append("Body", JSON.stringify(elements ?? []));
  formData.append("DeptId", String(deptId ?? 0));
  formData.append("UserId", String(userId ?? 0));

  if (Array.isArray(tagIds)) {
    tagIds.forEach((t) => formData.append("TagIds", String(t)));
  }

  // Attach image files (server expects "Attachments" or adjust to your backend)
  if (Array.isArray(elements)) {
    elements.forEach((el) => {
      if (el && el.type === "image" && el.imageFile) {
        // "Attachments" key should match your backend DTO property name
        const filename =
          el.imageName || (el.imageFile && el.imageFile.name) || "image.jpg";
        formData.append("Attachments", el.imageFile, filename);
      }
    });
  }

  const url = `${API_BASE}/api/Posts`;

  // Prepare headers: do NOT set Content-Type for multipart
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    // Use fetch directly so we can read non-JSON responses consistently, or you can use apiRequest if it supports FormData.
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
      // credentials as needed: include or same-origin — adjust if backend uses cookies
      credentials: "include",
    });

    const contentType = res.headers.get("content-type") || "";
    let body;
    try {
      body = contentType.includes("application/json")
        ? await res.json()
        : await res.text();
    } catch (e) {
      body = await res.text().catch(() => null);
    }

    if (!res.ok) {
      const serverMsg =
        typeof body === "string"
          ? body
          : body && typeof body === "object"
          ? JSON.stringify(body)
          : "";
      const msg = `Request failed ${res.status} ${res.statusText}. ${serverMsg}`;
      console.error(
        "createPostMultipart response error:",
        res.status,
        res.statusText,
        body
      );
      const err = new Error(msg);
      err.status = res.status;
      err.response = body;
      throw err;
    }

    return body;
  } catch (err) {
    console.error("Network error calling createPostMultipart:", err);
    // Repackage/network error so caller's catch sees a sensible message
    throw new Error(err.message || "Network error");
  }
}

export default { createPostMultipart };
