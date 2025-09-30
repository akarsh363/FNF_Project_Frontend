// // // // // // import { request as apiRequest } from "./api";
// // // // // // import { getToken } from "./AuthService"; // your AuthService functions use localStorage key "token"

// // // // // // const API_BASE = (import.meta.env.VITE_API || "http://localhost:5294").replace(
// // // // // //   /\/+$/,
// // // // // //   ""
// // // // // // );

// // // // // // /**
// // // // // //  * Create post with multipart/form-data.
// // // // // //  * - elements: array of blocks (text/code/image...), images should be elements with imageFile field.
// // // // // //  * - title, deptId, tagIds, userId
// // // // // //  *
// // // // // //  * Returns parsed server response on success, throws Error on fa  ilure.
// // // // // //  */
// // // // // // export async function createPostMultipart(
// // // // // //   elements,
// // // // // //   title,
// // // // // //   deptId = 0,
// // // // // //   tagIds = [],
// // // // // //   userId = 0
// // // // // // ) {
// // // // // //   // Build FormData
// // // // // //   const formData = new FormData();
// // // // // //   formData.append("Title", title ?? "");
// // // // // //   formData.append("Body", JSON.stringify(elements ?? []));
// // // // // //   formData.append("DeptId", String(deptId ?? 0));
// // // // // //   formData.append("UserId", String(userId ?? 0));

// // // // // //   if (Array.isArray(tagIds)) {
// // // // // //     tagIds.forEach((t) => formData.append("TagIds", String(t)));
// // // // // //   }

// // // // // //   // Attach image files (server expects "Attachments" or adjust to your backend)
// // // // // //   if (Array.isArray(elements)) {
// // // // // //     elements.forEach((el) => {
// // // // // //       if (el && el.type === "image" && el.imageFile) {
// // // // // //         // "Attachments" key should match your backend DTO property name
// // // // // //         const filename =
// // // // // //           el.imageName || (el.imageFile && el.imageFile.name) || "image.jpg";
// // // // // //         formData.append("Attachments", el.imageFile, filename);
// // // // // //       }
// // // // // //     });
// // // // // //   }

// // // // // //   const url = `${API_BASE}/api/Posts`;

// // // // // //   // Prepare headers: do NOT set Content-Type for multipart
// // // // // //   const headers = {};
// // // // // //   const token = getToken();
// // // // // //   if (token) headers.Authorization = `Bearer ${token}`;

// // // // // //   try {
// // // // // //     // Use fetch directly so we can read non-JSON responses consistently, or you can use apiRequest if it supports FormData.
// // // // // //     const res = await fetch(url, {
// // // // // //       method: "POST",
// // // // // //       headers,
// // // // // //       body: formData,
// // // // // //       // credentials as needed: include or same-origin — adjust if backend uses cookies
// // // // // //       credentials: "include",
// // // // // //     });

// // // // // //     const contentType = res.headers.get("content-type") || "";
// // // // // //     let body;
// // // // // //     try {
// // // // // //       body = contentType.includes("application/json")
// // // // // //         ? await res.json()
// // // // // //         : await res.text();
// // // // // //     } catch (e) {
// // // // // //       body = await res.text().catch(() => null);
// // // // // //     }

// // // // // //     if (!res.ok) {
// // // // // //       const serverMsg =
// // // // // //         typeof body === "string"
// // // // // //           ? body
// // // // // //           : body && typeof body === "object"
// // // // // //           ? JSON.stringify(body)
// // // // // //           : "";
// // // // // //       const msg = `Request failed ${res.status} ${res.statusText}. ${serverMsg}`;
// // // // // //       console.error(
// // // // // //         "createPostMultipart response error:",
// // // // // //         res.status,
// // // // // //         res.statusText,
// // // // // //         body
// // // // // //       );
// // // // // //       const err = new Error(msg);
// // // // // //       err.status = res.status;
// // // // // //       err.response = body;
// // // // // //       throw err;
// // // // // //     }

// // // // // //     return body;
// // // // // //   } catch (err) {
// // // // // //     console.error("Network error calling createPostMultipart:", err);
// // // // // //     // Repackage/network error so caller's catch sees a sensible message
// // // // // //     throw new Error(err.message || "Network error");
// // // // // //   }
// // // // // // }

// // // // // // export default { createPostMultipart };

// // // // // import { request as apiRequest } from "./api";
// // // // // import { getToken } from "./AuthService";

// // // // // const API_BASE = (
// // // // //   import.meta.env.VITE_API_BASE_URL ||
// // // // //   import.meta.env.VITE_API ||
// // // // //   "http://localhost:5294"
// // // // // ).replace(/\/+$/, "");

// // // // // /** Create post (multipart/form-data) */
// // // // // export async function createPostMultipart(
// // // // //   elements,
// // // // //   title,
// // // // //   deptId = 0,
// // // // //   tagIds = [],
// // // // //   userId = 0
// // // // // ) {
// // // // //   const formData = new FormData();
// // // // //   formData.append("Title", title ?? "");
// // // // //   formData.append("Body", JSON.stringify(elements ?? []));
// // // // //   formData.append("DeptId", String(deptId ?? 0));
// // // // //   formData.append("UserId", String(userId ?? 0));

// // // // //   if (Array.isArray(tagIds))
// // // // //     tagIds.forEach((t) => formData.append("TagIds", String(t)));

// // // // //   if (Array.isArray(elements)) {
// // // // //     elements.forEach((el) => {
// // // // //       if (el && el.type === "image" && el.imageFile) {
// // // // //         const filename = el.imageName || el.imageFile?.name || "image.jpg";
// // // // //         formData.append("Attachments", el.imageFile, filename);
// // // // //       }
// // // // //     });
// // // // //   }

// // // // //   const res = await fetch(`${API_BASE}/api/Posts`, {
// // // // //     method: "POST",
// // // // //     headers: { Authorization: `Bearer ${getToken() || ""}` },
// // // // //     body: formData,
// // // // //     credentials: "include",
// // // // //   });

// // // // //   const ct = res.headers.get("content-type") || "";
// // // // //   const data = ct.includes("application/json")
// // // // //     ? await res.json()
// // // // //     : await res.text().catch(() => null);
// // // // //   if (!res.ok) {
// // // // //     const msg = typeof data === "string" ? data : JSON.stringify(data || {});
// // // // //     throw new Error(`Request failed ${res.status} ${res.statusText}. ${msg}`);
// // // // //   }
// // // // //   return data;
// // // // // }

// // // // // /** Get ONLY the current user's posts */
// // // // // export async function getMyPosts() {
// // // // //   return apiRequest("/api/Posts/mine", { method: "GET" });
// // // // // }

// // // // // /** 🔹 Get a single post by id (needed by EditPost.jsx) */
// // // // // export async function getPostById(id) {
// // // // //   if (id == null) throw new Error("post id required");
// // // // //   return apiRequest(`/api/Posts/${id}`, { method: "GET" });
// // // // // }

// // // // // /** 🔹 Update a post using multipart (title/body/tags) */
// // // // // export async function updatePostMultipart(
// // // // //   postId,
// // // // //   { title, elements, tagIds = [] }
// // // // // ) {
// // // // //   const formData = new FormData();
// // // // //   if (title != null) formData.append("Title", title);
// // // // //   if (elements != null) formData.append("Body", JSON.stringify(elements));
// // // // //   if (Array.isArray(tagIds))
// // // // //     tagIds.forEach((t) => formData.append("TagIds", String(t)));

// // // // //   const res = await fetch(`${API_BASE}/api/Posts/${postId}`, {
// // // // //     method: "PUT",
// // // // //     headers: { Authorization: `Bearer ${getToken() || ""}` },
// // // // //     body: formData,
// // // // //     credentials: "include",
// // // // //   });

// // // // //   const ct = res.headers.get("content-type") || "";
// // // // //   const data = ct.includes("application/json")
// // // // //     ? await res.json()
// // // // //     : await res.text();
// // // // //   if (!res.ok)
// // // // //     throw new Error(
// // // // //       typeof data === "string" ? data : data?.error || "Update failed"
// // // // //     );
// // // // //   return data;
// // // // // }

// // // // // /** Manager-only delete with reason */
// // // // // export async function deletePostAsManager(postId, reason) {
// // // // //   const res = await fetch(`${API_BASE}/api/Posts/${postId}`, {
// // // // //     method: "DELETE",
// // // // //     headers: {
// // // // //       "Content-Type": "application/json",
// // // // //       Authorization: `Bearer ${getToken() || ""}`,
// // // // //     },
// // // // //     body: JSON.stringify({ reason: String(reason || "") }),
// // // // //     credentials: "include",
// // // // //   });
// // // // //   if (!res.ok) {
// // // // //     const txt = await res.text().catch(() => "");
// // // // //     throw new Error(txt || `Delete failed (${res.status})`);
// // // // //   }
// // // // //   return true;
// // // // // }

// // // // // export default {
// // // // //   createPostMultipart,
// // // // //   getMyPosts,
// // // // //   getPostById,
// // // // //   updatePostMultipart,
// // // // //   deletePostAsManager,
// // // // // };

// // // // import { request as apiRequest } from "./api";
// // // // import { getToken } from "./AuthService";

// // // // const API_BASE = (
// // // //   import.meta.env.VITE_API_BASE_URL ||
// // // //   import.meta.env.VITE_API ||
// // // //   "http://localhost:5294"
// // // // ).replace(/\/+$/, "");

// // // // /** Create post (multipart/form-data) */
// // // // export async function createPostMultipart(
// // // //   elements,
// // // //   title,
// // // //   deptId = 0,
// // // //   tagIds = [],
// // // //   userId = 0
// // // // ) {
// // // //   const formData = new FormData();
// // // //   formData.append("Title", title ?? "");
// // // //   formData.append("Body", JSON.stringify(elements ?? []));
// // // //   formData.append("DeptId", String(deptId ?? 0));
// // // //   formData.append("UserId", String(userId ?? 0));

// // // //   if (Array.isArray(tagIds))
// // // //     tagIds.forEach((t) => formData.append("TagIds", String(t)));

// // // //   if (Array.isArray(elements)) {
// // // //     elements.forEach((el) => {
// // // //       if (el && el.type === "image" && el.imageFile) {
// // // //         const filename = el.imageName || el.imageFile?.name || "image.jpg";
// // // //         formData.append("Attachments", el.imageFile, filename);
// // // //       }
// // // //     });
// // // //   }

// // // //   const res = await fetch(`${API_BASE}/api/Posts`, {
// // // //     method: "POST",
// // // //     headers: { Authorization: `Bearer ${getToken() || ""}` },
// // // //     body: formData,
// // // //     credentials: "include",
// // // //   });

// // // //   const ct = res.headers.get("content-type") || "";
// // // //   const data = ct.includes("application/json")
// // // //     ? await res.json()
// // // //     : await res.text().catch(() => null);
// // // //   if (!res.ok) {
// // // //     const msg = typeof data === "string" ? data : JSON.stringify(data || {});
// // // //     throw new Error(`Request failed ${res.status} ${res.statusText}. ${msg}`);
// // // //   }
// // // //   return data;
// // // // }

// // // // /** Get ONLY the current user's posts */
// // // // export async function getMyPosts() {
// // // //   return apiRequest("/api/Posts/mine", { method: "GET" });
// // // // }

// // // // /** Get a single post by id */
// // // // export async function getPostById(id) {
// // // //   if (id == null) throw new Error("post id required");
// // // //   return apiRequest(`/api/Posts/${id}`, { method: "GET" });
// // // // }

// // // // /** Update a post using multipart (title/body/tags) */
// // // // export async function updatePostMultipart(
// // // //   postId,
// // // //   { title, elements, tagIds = [] }
// // // // ) {
// // // //   const formData = new FormData();
// // // //   if (title != null) formData.append("Title", title);
// // // //   if (elements != null) formData.append("Body", JSON.stringify(elements));
// // // //   if (Array.isArray(tagIds))
// // // //     tagIds.forEach((t) => formData.append("TagIds", String(t)));

// // // //   const res = await fetch(`${API_BASE}/api/Posts/${postId}`, {
// // // //     method: "PUT",
// // // //     headers: { Authorization: `Bearer ${getToken() || ""}` },
// // // //     body: formData,
// // // //     credentials: "include",
// // // //   });

// // // //   const ct = res.headers.get("content-type") || "";
// // // //   const data = ct.includes("application/json")
// // // //     ? await res.json()
// // // //     : await res.text();
// // // //   if (!res.ok)
// // // //     throw new Error(
// // // //       typeof data === "string" ? data : data?.error || "Update failed"
// // // //     );
// // // //   return data;
// // // // }

// // // // /** Manager-only delete with reason */
// // // // export async function deletePostAsManager(postId, reason) {
// // // //   const res = await fetch(`${API_BASE}/api/Posts/${postId}`, {
// // // //     method: "DELETE",
// // // //     headers: {
// // // //       "Content-Type": "application/json",
// // // //       Authorization: `Bearer ${getToken() || ""}`,
// // // //     },
// // // //     body: JSON.stringify({ reason: String(reason || "") }),
// // // //     credentials: "include",
// // // //   });
// // // //   if (!res.ok) {
// // // //     const txt = await res.text().catch(() => "");
// // // //     throw new Error(txt || `Delete failed (${res.status})`);
// // // //   }
// // // //   return true;
// // // // }

// // // // /** 👍/👎 Vote on a post.
// // // //  * value:  1 = like, -1 = dislike, 0 = clear vote
// // // //  * Returns updated PostResponseDto (if backend sends it), or true.
// // // //  */
// // // // export async function votePost(postId, value) {
// // // //   const res = await fetch(`${API_BASE}/api/Posts/${postId}/vote`, {
// // // //     method: "POST",
// // // //     headers: {
// // // //       "Content-Type": "application/json",
// // // //       Authorization: `Bearer ${getToken() || ""}`,
// // // //     },
// // // //     body: JSON.stringify({ value }), // server expects { value: 1 | -1 | 0 }
// // // //     credentials: "include",
// // // //   });

// // // //   const ct = res.headers.get("content-type") || "";
// // // //   const data = ct.includes("application/json")
// // // //     ? await res.json().catch(() => null)
// // // //     : await res.text().catch(() => null);

// // // //   if (!res.ok) {
// // // //     const msg =
// // // //       (data && (data.error || data.message || data.title)) ||
// // // //       `Vote failed (${res.status})`;
// // // //     throw new Error(msg);
// // // //   }
// // // //   return data || true;
// // // // }

// // // // export default {
// // // //   createPostMultipart,
// // // //   getMyPosts,
// // // //   getPostById,
// // // //   updatePostMultipart,
// // // //   deletePostAsManager,
// // // //   votePost,
// // // // };

// // // import { request as apiRequest } from "./api";
// // // import { getToken } from "./AuthService";

// // // const API_BASE = (
// // //   import.meta.env.VITE_API_BASE_URL ||
// // //   import.meta.env.VITE_API ||
// // //   "http://localhost:5294"
// // // ).replace(/\/+$/, "");

// // // /** Create post (multipart/form-data) */
// // // export async function createPostMultipart(
// // //   elements,
// // //   title,
// // //   deptId = 0,
// // //   tagIds = [],
// // //   userId = 0
// // // ) {
// // //   const formData = new FormData();
// // //   formData.append("Title", title ?? "");
// // //   formData.append("Body", JSON.stringify(elements ?? []));
// // //   formData.append("DeptId", String(deptId ?? 0));
// // //   formData.append("UserId", String(userId ?? 0));

// // //   if (Array.isArray(tagIds))
// // //     tagIds.forEach((t) => formData.append("TagIds", String(t)));

// // //   if (Array.isArray(elements)) {
// // //     elements.forEach((el) => {
// // //       if (el && el.type === "image" && el.imageFile) {
// // //         const filename = el.imageName || el.imageFile?.name || "image.jpg";
// // //         formData.append("Attachments", el.imageFile, filename);
// // //       }
// // //     });
// // //   }

// // //   const res = await fetch(`${API_BASE}/api/Posts`, {
// // //     method: "POST",
// // //     headers: { Authorization: `Bearer ${getToken() || ""}` },
// // //     body: formData,
// // //     credentials: "include",
// // //   });

// // //   const ct = res.headers.get("content-type") || "";
// // //   const data = ct.includes("application/json")
// // //     ? await res.json()
// // //     : await res.text().catch(() => null);
// // //   if (!res.ok) {
// // //     const msg = typeof data === "string" ? data : JSON.stringify(data || {});
// // //     throw new Error(`Request failed ${res.status} ${res.statusText}. ${msg}`);
// // //   }
// // //   return data;
// // // }

// // // /** Get ONLY the current user's posts */
// // // export async function getMyPosts() {
// // //   return apiRequest("/api/Posts/mine", { method: "GET" });
// // // }

// // // /** Get a single post by id */
// // // export async function getPostById(id) {
// // //   if (id == null) throw new Error("post id required");
// // //   return apiRequest(`/api/Posts/${id}`, { method: "GET" });
// // // }

// // // /** Update a post using multipart (title/body/tags) */
// // // export async function updatePostMultipart(
// // //   postId,
// // //   { title, elements, tagIds = [] }
// // // ) {
// // //   const formData = new FormData();
// // //   if (title != null) formData.append("Title", title);
// // //   if (elements != null) formData.append("Body", JSON.stringify(elements));
// // //   if (Array.isArray(tagIds))
// // //     tagIds.forEach((t) => formData.append("TagIds", String(t)));

// // //   const res = await fetch(`${API_BASE}/api/Posts/${postId}`, {
// // //     method: "PUT",
// // //     headers: { Authorization: `Bearer ${getToken() || ""}` },
// // //     body: formData,
// // //     credentials: "include",
// // //   });

// // //   const ct = res.headers.get("content-type") || "";
// // //   const data = ct.includes("application/json")
// // //     ? await res.json()
// // //     : await res.text();
// // //   if (!res.ok)
// // //     throw new Error(
// // //       typeof data === "string" ? data : data?.error || "Update failed"
// // //     );
// // //   return data;
// // // }

// // // /** Manager-only delete with reason */
// // // export async function deletePostAsManager(postId, reason) {
// // //   const res = await fetch(`${API_BASE}/api/Posts/${postId}`, {
// // //     method: "DELETE",
// // //     headers: {
// // //       "Content-Type": "application/json",
// // //       Authorization: `Bearer ${getToken() || ""}`,
// // //     },
// // //     body: JSON.stringify({ reason: String(reason || "") }),
// // //     credentials: "include",
// // //   });
// // //   if (!res.ok) {
// // //     const txt = await res.text().catch(() => "");
// // //     throw new Error(txt || `Delete failed (${res.status})`);
// // //   }
// // //   return true;
// // // }

// // // /* ------------------------------------------------------------------
// // //    VOTING — matches your backend first:
// // //    POST /api/Votes/post/{postId}   (with body {value} OR ?value=)
// // //    (We keep extra fallbacks so this keeps working if server evolves.)
// // // ------------------------------------------------------------------- */
// // // export async function votePost(postId, value) {
// // //   // normalize to -1, 0, +1
// // //   const v = value > 0 ? 1 : value < 0 ? -1 : 0;

// // //   const token = getToken() || "";
// // //   const auth = { Authorization: `Bearer ${token}` };

// // //   const attempts = [];

// // //   // 1) Your documented endpoints FIRST
// // //   // JSON body
// // //   attempts.push({
// // //     method: "POST",
// // //     url: `${API_BASE}/api/Votes/post/${postId}`,
// // //     headers: { "Content-Type": "application/json", ...auth },
// // //     body: JSON.stringify({ value: v }),
// // //   });
// // //   // Query param
// // //   attempts.push({
// // //     method: "POST",
// // //     url: `${API_BASE}/api/Votes/post/${postId}?value=${encodeURIComponent(v)}`,
// // //     headers: { ...auth },
// // //   });

// // //   // 2) Other common patterns as fallbacks
// // //   const jsonHeaders = { "Content-Type": "application/json", ...auth };
// // //   [
// // //     {
// // //       url: `${API_BASE}/api/Posts/${postId}/vote`,
// // //       body: JSON.stringify({ value: v }),
// // //       methods: ["POST", "PUT"],
// // //     },
// // //     {
// // //       url: `${API_BASE}/api/Posts/vote`,
// // //       body: JSON.stringify({ postId, value: v }),
// // //       methods: ["POST", "PUT"],
// // //     },
// // //     {
// // //       url: `${API_BASE}/api/Votes`,
// // //       body: JSON.stringify({ postId, value: v }),
// // //       methods: ["POST"],
// // //     },
// // //     {
// // //       url: `${API_BASE}/api/Posts/${postId}/reaction`,
// // //       body: JSON.stringify({ value: v }),
// // //       methods: ["POST"],
// // //     },
// // //   ].forEach(({ url, body, methods }) =>
// // //     methods.forEach((m) =>
// // //       attempts.push({ method: m, url, headers: jsonHeaders, body })
// // //     )
// // //   );

// // //   // Verb-style endpoints
// // //   if (v === 1) {
// // //     attempts.push(
// // //       {
// // //         method: "POST",
// // //         url: `${API_BASE}/api/Posts/${postId}/like`,
// // //         headers: auth,
// // //       },
// // //       {
// // //         method: "PUT",
// // //         url: `${API_BASE}/api/Posts/${postId}/like`,
// // //         headers: auth,
// // //       }
// // //     );
// // //   } else if (v === -1) {
// // //     attempts.push(
// // //       {
// // //         method: "POST",
// // //         url: `${API_BASE}/api/Posts/${postId}/dislike`,
// // //         headers: auth,
// // //       },
// // //       {
// // //         method: "PUT",
// // //         url: `${API_BASE}/api/Posts/${postId}/dislike`,
// // //         headers: auth,
// // //       }
// // //     );
// // //   } else {
// // //     attempts.push(
// // //       {
// // //         method: "POST",
// // //         url: `${API_BASE}/api/Posts/${postId}/clear`,
// // //         headers: auth,
// // //       },
// // //       {
// // //         method: "DELETE",
// // //         url: `${API_BASE}/api/Posts/${postId}/like`,
// // //         headers: auth,
// // //       },
// // //       {
// // //         method: "DELETE",
// // //         url: `${API_BASE}/api/Posts/${postId}/dislike`,
// // //         headers: auth,
// // //       }
// // //     );
// // //   }

// // //   const errors = [];
// // //   for (const a of attempts) {
// // //     try {
// // //       const res = await fetch(a.url, {
// // //         method: a.method,
// // //         headers: a.headers,
// // //         body: a.body,
// // //         credentials: "include",
// // //       });

// // //       const ct = res.headers.get("content-type") || "";
// // //       const data = ct.includes("application/json")
// // //         ? await res.json().catch(() => null)
// // //         : await res.text().catch(() => null);

// // //       if (res.ok) return data || true;

// // //       // keep trying only on obvious route/method mismatches
// // //       if ([404, 405, 415].includes(res.status)) {
// // //         errors.push(`${a.method} ${a.url} => ${res.status}`);
// // //         continue;
// // //       }
// // //       const msg =
// // //         (data && (data.error || data.message || data.title)) ||
// // //         `Vote failed (${res.status})`;
// // //       throw new Error(msg);
// // //     } catch (e) {
// // //       errors.push(`${a.method} ${a.url} => ${e.message || "error"}`);
// // //       continue;
// // //     }
// // //   }

// // //   throw new Error("Vote endpoint not found. Tried:\n" + errors.join("\n"));
// // // }

// // // export default {
// // //   createPostMultipart,
// // //   getMyPosts,
// // //   getPostById,
// // //   updatePostMultipart,
// // //   deletePostAsManager,
// // //   votePost,
// // // };

// // import { request as apiRequest } from "./api";
// // import { getToken } from "./AuthService";

// // const API_BASE = (
// //   import.meta.env.VITE_API_BASE_URL ||
// //   import.meta.env.VITE_API ||
// //   "http://localhost:5294"
// // ).replace(/\/+$/, "");

// // /* =========================
// //    Create post (multipart)
// //    ========================= */
// // export async function createPostMultipart(
// //   elements,
// //   title,
// //   deptId = 0,
// //   tagIds = [],
// //   userId = 0
// // ) {
// //   const formData = new FormData();
// //   formData.append("Title", title ?? "");
// //   formData.append("Body", JSON.stringify(elements ?? []));
// //   formData.append("DeptId", String(deptId ?? 0));
// //   formData.append("UserId", String(userId ?? 0));

// //   if (Array.isArray(tagIds)) {
// //     tagIds.forEach((t) => formData.append("TagIds", String(t)));
// //   }

// //   if (Array.isArray(elements)) {
// //     elements.forEach((el) => {
// //       if (el && el.type === "image" && el.imageFile) {
// //         const filename =
// //           el.imageName || (el.imageFile && el.imageFile.name) || "image.jpg";
// //         formData.append("Attachments", el.imageFile, filename);
// //       }
// //     });
// //   }

// //   const res = await fetch(`${API_BASE}/api/Posts`, {
// //     method: "POST",
// //     headers: { Authorization: `Bearer ${getToken() || ""}` },
// //     body: formData,
// //     credentials: "include",
// //   });

// //   const ct = res.headers.get("content-type") || "";
// //   const data = ct.includes("application/json")
// //     ? await res.json()
// //     : await res.text().catch(() => null);

// //   if (!res.ok) {
// //     const msg = typeof data === "string" ? data : JSON.stringify(data || {});
// //     throw new Error(`Request failed ${res.status} ${res.statusText}. ${msg}`);
// //   }

// //   return data;
// // }

// // /* =========================
// //    Read helpers
// //    ========================= */
// // export async function getMyPosts() {
// //   return apiRequest("/api/Posts/mine", { method: "GET" });
// // }

// // export async function getPostById(id) {
// //   if (id == null) throw new Error("post id required");
// //   return apiRequest(`/api/Posts/${id}`, { method: "GET" });
// // }

// // /* =========================
// //    Update (multipart)
// //    ========================= */
// // export async function updatePostMultipart(
// //   postId,
// //   { title, elements, tagIds = [] }
// // ) {
// //   const formData = new FormData();
// //   if (title != null) formData.append("Title", title);
// //   if (elements != null) formData.append("Body", JSON.stringify(elements));
// //   if (Array.isArray(tagIds)) {
// //     tagIds.forEach((t) => formData.append("TagIds", String(t)));
// //   }

// //   const res = await fetch(`${API_BASE}/api/Posts/${postId}`, {
// //     method: "PUT",
// //     headers: { Authorization: `Bearer ${getToken() || ""}` },
// //     body: formData,
// //     credentials: "include",
// //   });

// //   const ct = res.headers.get("content-type") || "";
// //   const data = ct.includes("application/json")
// //     ? await res.json()
// //     : await res.text();

// //   if (!res.ok) {
// //     const msg =
// //       typeof data === "string" ? data : (data && data.error) || "Update failed";
// //     throw new Error(msg);
// //   }

// //   return data;
// // }

// // /* =========================
// //    Manager delete
// //    ========================= */
// // export async function deletePostAsManager(postId, reason) {
// //   const res = await fetch(`${API_BASE}/api/Posts/${postId}`, {
// //     method: "DELETE",
// //     headers: {
// //       "Content-Type": "application/json",
// //       Authorization: `Bearer ${getToken() || ""}`,
// //     },
// //     body: JSON.stringify({ reason: String(reason || "") }),
// //     credentials: "include",
// //   });

// //   if (!res.ok) {
// //     const txt = await res.text().catch(() => "");
// //     throw new Error(txt || `Delete failed (${res.status})`);
// //   }

// //   return true;
// // }

// // /* =========================
// //    Voting
// //    Primary: POST /api/Votes/post/{postId}
// //    Body: { value: -1 | 0 | 1 }
// //    Includes safe fallbacks.
// //    ========================= */
// // export async function votePost(postId, value) {
// //   const v = value > 0 ? 1 : value < 0 ? -1 : 0;
// //   const token = getToken() || "";
// //   const auth = { Authorization: `Bearer ${token}` };

// //   async function doFetch(url, opts) {
// //     const res = await fetch(url, { credentials: "include", ...opts });
// //     const ct = res.headers.get("content-type") || "";
// //     const data = ct.includes("application/json")
// //       ? await res.json().catch(() => null)
// //       : await res.text().catch(() => null);
// //     return { res, data };
// //   }

// //   // 1) Documented endpoint with JSON body
// //   {
// //     const { res, data } = await doFetch(
// //       `${API_BASE}/api/Votes/post/${postId}`,
// //       {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json", ...auth },
// //         body: JSON.stringify({ value: v }),
// //       }
// //     );
// //     if (res.ok) return data || true;
// //     if (![404, 405, 415].includes(res.status)) {
// //       const msg =
// //         (data && (data.error || data.message || data.title)) ||
// //         `Vote failed (${res.status})`;
// //       throw new Error(msg);
// //     }
// //   }

// //   // 2) Same route but with query param (for 415 cases)
// //   {
// //     const { res, data } = await doFetch(
// //       `${API_BASE}/api/Votes/post/${postId}?value=${encodeURIComponent(v)}`,
// //       { method: "POST", headers: { ...auth } }
// //     );
// //     if (res.ok) return data || true;
// //     if (![404, 405].includes(res.status)) {
// //       const msg =
// //         (data && (data.error || data.message || data.title)) ||
// //         `Vote failed (${res.status})`;
// //       throw new Error(msg);
// //     }
// //   }

// //   // 3) Generic /api/Votes with JSON { postId, value }
// //   {
// //     const { res, data } = await doFetch(`${API_BASE}/api/Votes`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json", ...auth },
// //       body: JSON.stringify({ postId, value: v }),
// //     });
// //     if (res.ok) return data || true;
// //     if (![404, 405].includes(res.status)) {
// //       const msg =
// //         (data && (data.error || data.message || data.title)) ||
// //         `Vote failed (${res.status})`;
// //       throw new Error(msg);
// //     }
// //   }

// //   // 4) Fallback on Posts controller: /api/Posts/{id}/vote
// //   {
// //     const { res, data } = await doFetch(
// //       `${API_BASE}/api/Posts/${postId}/vote`,
// //       {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json", ...auth },
// //         body: JSON.stringify({ value: v }),
// //       }
// //     );
// //     if (res.ok) return data || true;
// //     if (![404, 405].includes(res.status)) {
// //       const msg =
// //         (data && (data.error || data.message || data.title)) ||
// //         `Vote failed (${res.status})`;
// //       throw new Error(msg);
// //     }
// //   }

// //   // 5) Verb-style final fallbacks
// //   if (v === 1) {
// //     const { res, data } = await doFetch(
// //       `${API_BASE}/api/Posts/${postId}/like`,
// //       {
// //         method: "POST",
// //         headers: { ...auth },
// //       }
// //     );
// //     if (res.ok) return data || true;
// //   } else if (v === -1) {
// //     const { res, data } = await doFetch(
// //       `${API_BASE}/api/Posts/${postId}/dislike`,
// //       {
// //         method: "POST",
// //         headers: { ...auth },
// //       }
// //     );
// //     if (res.ok) return data || true;
// //   } else {
// //     // clear (delete like/dislike)
// //     let out = await doFetch(`${API_BASE}/api/Posts/${postId}/like`, {
// //       method: "DELETE",
// //       headers: { ...auth },
// //     });
// //     if (out.res.ok) return out.data || true;

// //     out = await doFetch(`${API_BASE}/api/Posts/${postId}/dislike`, {
// //       method: "DELETE",
// //       headers: { ...auth },
// //     });
// //     if (out.res.ok) return out.data || true;
// //   }

// //   throw new Error("Vote endpoint not found on server.");
// // }

// // /* =========================
// //    Default export (named map)
// //    ========================= */
// // export default {
// //   createPostMultipart,
// //   getMyPosts,
// //   getPostById,
// //   updatePostMultipart,
// //   deletePostAsManager,
// //   votePost,
// // };

// import { request as apiRequest } from "./api";
// import { getToken } from "./AuthService";

// const API_BASE = (
//   import.meta.env.VITE_API_BASE_URL ||
//   import.meta.env.VITE_API ||
//   "http://localhost:5294"
// ).replace(/\/+$/, "");

// /* =========================
//    Create post (multipart)
//    ========================= */
// export async function createPostMultipart(
//   elements,
//   title,
//   deptId = 0,
//   tagIds = [],
//   userId = 0
// ) {
//   const formData = new FormData();
//   formData.append("Title", title ?? "");
//   formData.append("Body", JSON.stringify(elements ?? []));
//   formData.append("DeptId", String(deptId ?? 0));
//   formData.append("UserId", String(userId ?? 0));

//   if (Array.isArray(tagIds)) {
//     tagIds.forEach((t) => formData.append("TagIds", String(t)));
//   }

//   if (Array.isArray(elements)) {
//     elements.forEach((el) => {
//       if (el && el.type === "image" && el.imageFile) {
//         const filename =
//           el.imageName || (el.imageFile && el.imageFile.name) || "image.jpg";
//         formData.append("Attachments", el.imageFile, filename);
//       }
//     });
//   }

//   const res = await fetch(`${API_BASE}/api/Posts`, {
//     method: "POST",
//     headers: { Authorization: `Bearer ${getToken() || ""}` },
//     body: formData,
//     credentials: "include",
//   });

//   const ct = res.headers.get("content-type") || "";
//   const data = ct.includes("application/json")
//     ? await res.json()
//     : await res.text().catch(() => null);

//   if (!res.ok) {
//     const msg = typeof data === "string" ? data : JSON.stringify(data || {});
//     throw new Error(`Request failed ${res.status} ${res.statusText}. ${msg}`);
//   }

//   return data;
// }

// /* =========================
//    Read helpers
//    ========================= */
// export async function getMyPosts() {
//   return apiRequest("/api/Posts/mine", { method: "GET" });
// }

// export async function getPostById(id) {
//   if (id == null) throw new Error("post id required");
//   return apiRequest(`/api/Posts/${id}`, { method: "GET" });
// }

// /* =========================
//    Update (multipart)
//    ========================= */
// export async function updatePostMultipart(
//   postId,
//   { title, elements, tagIds = [] }
// ) {
//   const formData = new FormData();
//   if (title != null) formData.append("Title", title);
//   if (elements != null) formData.append("Body", JSON.stringify(elements));
//   if (Array.isArray(tagIds)) {
//     tagIds.forEach((t) => formData.append("TagIds", String(t)));
//   }

//   const res = await fetch(`${API_BASE}/api/Posts/${postId}`, {
//     method: "PUT",
//     headers: { Authorization: `Bearer ${getToken() || ""}` },
//     body: formData,
//     credentials: "include",
//   });

//   const ct = res.headers.get("content-type") || "";
//   const data = ct.includes("application/json")
//     ? await res.json()
//     : await res.text();

//   if (!res.ok) {
//     const msg =
//       typeof data === "string" ? data : (data && data.error) || "Update failed";
//     throw new Error(msg);
//   }

//   return data;
// }

// /* =========================
//    Manager delete
//    ========================= */
// export async function deletePostAsManager(postId, reason) {
//   const res = await fetch(`${API_BASE}/api/Posts/${postId}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken() || ""}`,
//     },
//     body: JSON.stringify({ reason: String(reason || "") }),
//     credentials: "include",
//   });

//   if (!res.ok) {
//     const txt = await res.text().catch(() => "");
//     throw new Error(txt || `Delete failed (${res.status})`);
//   }

//   return true;
// }

// /* =========================
//    Voting
//    Primary documented route:
//    POST /api/Votes/post/{postId}
//    Accepts:
//    - JSON { value: -1|0|1 }  (our first try)
//    Fallbacks added for servers that expect:
//    - ?value=1
//    - ?isUpvote=true
//    - JSON { isUpvote: true }
//    - form-urlencoded value=1
//    And a few legacy post routes if needed.
//    ========================= */
// export async function votePost(postId, value) {
//   const v = value > 0 ? 1 : value < 0 ? -1 : 0;
//   const token = getToken() || "";
//   const auth = { Authorization: `Bearer ${token}` };

//   async function doFetch(url, opts) {
//     const res = await fetch(url, { credentials: "include", ...opts });
//     const ct = res.headers.get("content-type") || "";
//     const data = ct.includes("application/json")
//       ? await res.json().catch(() => null)
//       : await res.text().catch(() => null);
//     return { res, data };
//   }

//   // Helper to decide if we should try the next shape
//   const retriable = (status) => [400, 404, 405, 415].includes(status);

//   // 1) Documented endpoint with JSON { value }
//   {
//     const { res, data } = await doFetch(
//       `${API_BASE}/api/Votes/post/${postId}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...auth },
//         body: JSON.stringify({ value: v }),
//       }
//     );
//     if (res.ok) return data || true;
//     if (!retriable(res.status)) {
//       const msg =
//         (data && (data.error || data.message || data.title)) ||
//         `Vote failed (${res.status})`;
//       throw new Error(msg);
//     }
//   }

//   // 2) Same route with query param ?value=
//   {
//     const { res, data } = await doFetch(
//       `${API_BASE}/api/Votes/post/${postId}?value=${encodeURIComponent(v)}`,
//       { method: "POST", headers: { ...auth } }
//     );
//     if (res.ok) return data || true;
//     if (!retriable(res.status)) {
//       const msg =
//         (data && (data.error || data.message || data.title)) ||
//         `Vote failed (${res.status})`;
//       throw new Error(msg);
//     }
//   }

//   // 3) Boolean variants (?isUpvote= / JSON {isUpvote:})
//   if (v !== 0) {
//     const isUpvote = v === 1;

//     // 3a) query ?isUpvote=true
//     {
//       const { res, data } = await doFetch(
//         `${API_BASE}/api/Votes/post/${postId}?isUpvote=${isUpvote}`,
//         { method: "POST", headers: { ...auth } }
//       );
//       if (res.ok) return data || true;
//       if (!retriable(res.status)) {
//         const msg =
//           (data && (data.error || data.message || data.title)) ||
//           `Vote failed (${res.status})`;
//         throw new Error(msg);
//       }
//     }

//     // 3b) JSON { isUpvote: true }
//     {
//       const { res, data } = await doFetch(
//         `${API_BASE}/api/Votes/post/${postId}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json", ...auth },
//           body: JSON.stringify({ isUpvote }),
//         }
//       );
//       if (res.ok) return data || true;
//       if (!retriable(res.status)) {
//         const msg =
//           (data && (data.error || data.message || data.title)) ||
//           `Vote failed (${res.status})`;
//         throw new Error(msg);
//       }
//     }
//   }

//   // 4) form-urlencoded value=1
//   {
//     const body = new URLSearchParams({ value: String(v) });
//     const { res, data } = await doFetch(
//       `${API_BASE}/api/Votes/post/${postId}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           ...auth,
//         },
//         body: body.toString(),
//       }
//     );
//     if (res.ok) return data || true;
//     if (!retriable(res.status)) {
//       const msg =
//         (data && (data.error || data.message || data.title)) ||
//         `Vote failed (${res.status})`;
//       throw new Error(msg);
//     }
//   }

//   // 5) Generic /api/Votes { postId, value }
//   {
//     const { res, data } = await doFetch(`${API_BASE}/api/Votes`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", ...auth },
//       body: JSON.stringify({ postId, value: v }),
//     });
//     if (res.ok) return data || true;
//     if (!retriable(res.status)) {
//       const msg =
//         (data && (data.error || data.message || data.title)) ||
//         `Vote failed (${res.status})`;
//       throw new Error(msg);
//     }
//   }

//   // 6) Legacy fallbacks on Posts controller
//   // /api/Posts/{id}/vote
//   {
//     const { res, data } = await doFetch(
//       `${API_BASE}/api/Posts/${postId}/vote`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...auth },
//         body: JSON.stringify({ value: v }),
//       }
//     );
//     if (res.ok) return data || true;
//     if (!retriable(res.status)) {
//       const msg =
//         (data && (data.error || data.message || data.title)) ||
//         `Vote failed (${res.status})`;
//       throw new Error(msg);
//     }
//   }

//   // 7) Verb-style final fallbacks
//   if (v === 1) {
//     const { res, data } = await doFetch(
//       `${API_BASE}/api/Posts/${postId}/like`,
//       {
//         method: "POST",
//         headers: { ...auth },
//       }
//     );
//     if (res.ok) return data || true;
//   } else if (v === -1) {
//     const { res, data } = await doFetch(
//       `${API_BASE}/api/Posts/${postId}/dislike`,
//       {
//         method: "POST",
//         headers: { ...auth },
//       }
//     );
//     if (res.ok) return data || true;
//   } else {
//     // clear (delete like/dislike)
//     let out = await doFetch(`${API_BASE}/api/Posts/${postId}/like`, {
//       method: "DELETE",
//       headers: { ...auth },
//     });
//     if (out.res.ok) return out.data || true;

//     out = await doFetch(`${API_BASE}/api/Posts/${postId}/dislike`, {
//       method: "DELETE",
//       headers: { ...auth },
//     });
//     if (out.res.ok) return out.data || true;
//   }

//   throw new Error("Vote endpoint not found on server.");
// }

// /* =========================
//    Default export map
//    ========================= */
// export default {
//   createPostMultipart,
//   getMyPosts,
//   getPostById,
//   updatePostMultipart,
//   deletePostAsManager,
//   votePost,
// };

import { request as apiRequest } from "./api";
import { getToken } from "./AuthService";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API ||
  "http://localhost:5294"
).replace(/\/+$/, "");

/** Create post (multipart/form-data) */
export async function createPostMultipart(
  elements,
  title,
  deptId = 0,
  tagIds = [],
  userId = 0
) {
  const formData = new FormData();
  formData.append("Title", title ?? "");
  formData.append("Body", JSON.stringify(elements ?? []));
  formData.append("DeptId", String(deptId ?? 0));
  formData.append("UserId", String(userId ?? 0));

  if (Array.isArray(tagIds))
    tagIds.forEach((t) => formData.append("TagIds", String(t)));

  if (Array.isArray(elements)) {
    elements.forEach((el) => {
      if (el && el.type === "image" && el.imageFile) {
        const filename = el.imageName || el.imageFile?.name || "image.jpg";
        formData.append("Attachments", el.imageFile, filename);
      }
    });
  }

  const res = await fetch(`${API_BASE}/api/Posts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken() || ""}` },
    body: formData,
    credentials: "include",
  });

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json")
    ? await res.json()
    : await res.text().catch(() => null);

  if (!res.ok) {
    const msg = typeof data === "string" ? data : JSON.stringify(data || {});
    throw new Error(`Request failed ${res.status} ${res.statusText}. ${msg}`);
  }
  return data;
}

/** Get ONLY the current user's posts */
export async function getMyPosts() {
  return apiRequest("/api/Posts/mine", { method: "GET" });
}

/** Get a single post by id */
export async function getPostById(id) {
  if (id == null) throw new Error("post id required");
  return apiRequest(`/api/Posts/${id}`, { method: "GET" });
}

/** Update a post using multipart (title/body/tags) */
export async function updatePostMultipart(
  postId,
  { title, elements, tagIds = [] }
) {
  const formData = new FormData();
  if (title != null) formData.append("Title", title);
  if (elements != null) formData.append("Body", JSON.stringify(elements));
  if (Array.isArray(tagIds))
    tagIds.forEach((t) => formData.append("TagIds", String(t)));

  const res = await fetch(`${API_BASE}/api/Posts/${postId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getToken() || ""}` },
    body: formData,
    credentials: "include",
  });

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok)
    throw new Error(
      typeof data === "string" ? data : data?.error || "Update failed"
    );
  return data;
}

/** Manager-only delete with reason */
export async function deletePostAsManager(postId, reason) {
  const res = await fetch(`${API_BASE}/api/Posts/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken() || ""}`,
    },
    body: JSON.stringify({ reason: String(reason || "") }),
    credentials: "include",
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `Delete failed (${res.status})`);
  }
  return true;
}

/* ------------------------------------------------------------------
   VOTING — matches your backend (VotesController + VoteRequestDto)
   POST /api/Votes/post/{postId}  body: { voteType: "Upvote"|"Downvote" }
------------------------------------------------------------------- */
export async function votePost(postId, value) {
  if (postId == null) throw new Error("postId is required");

  let voteType = null;
  if (value > 0) voteType = "Upvote";
  else if (value < 0) voteType = "Downvote";
  else throw new Error("value must be +1 or -1");

  const res = await fetch(`${API_BASE}/api/Votes/post/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken() || ""}`,
    },
    body: JSON.stringify({ voteType }),
    credentials: "include",
  });

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const msg =
      (data && (data.error || data.message || data.title)) ||
      `Vote failed (${res.status})`;
    throw new Error(msg);
  }
  // expected: { postId, likeCount, dislikeCount, userVote }
  return data;
}

export default {
  createPostMultipart,
  getMyPosts,
  getPostById,
  updatePostMultipart,
  deletePostAsManager,
  votePost,
};
