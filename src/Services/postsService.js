// import { request as apiRequest } from "./api";
// import { getToken } from "./AuthService"; // your AuthService functions use localStorage key "token"

// const API_BASE = (import.meta.env.VITE_API || "http://localhost:5294").replace(
//   /\/+$/,
//   ""
// );

// /**
//  * Create post with multipart/form-data.
//  * - elements: array of blocks (text/code/image...), images should be elements with imageFile field.
//  * - title, deptId, tagIds, userId
//  *
//  * Returns parsed server response on success, throws Error on fa  ilure.
//  */
// export async function createPostMultipart(
//   elements,
//   title,
//   deptId = 0,
//   tagIds = [],
//   userId = 0
// ) {
//   // Build FormData
//   const formData = new FormData();
//   formData.append("Title", title ?? "");
//   formData.append("Body", JSON.stringify(elements ?? []));
//   formData.append("DeptId", String(deptId ?? 0));
//   formData.append("UserId", String(userId ?? 0));

//   if (Array.isArray(tagIds)) {
//     tagIds.forEach((t) => formData.append("TagIds", String(t)));
//   }

//   // Attach image files (server expects "Attachments" or adjust to your backend)
//   if (Array.isArray(elements)) {
//     elements.forEach((el) => {
//       if (el && el.type === "image" && el.imageFile) {
//         // "Attachments" key should match your backend DTO property name
//         const filename =
//           el.imageName || (el.imageFile && el.imageFile.name) || "image.jpg";
//         formData.append("Attachments", el.imageFile, filename);
//       }
//     });
//   }

//   const url = `${API_BASE}/api/Posts`;

//   // Prepare headers: do NOT set Content-Type for multipart
//   const headers = {};
//   const token = getToken();
//   if (token) headers.Authorization = `Bearer ${token}`;

//   try {
//     // Use fetch directly so we can read non-JSON responses consistently, or you can use apiRequest if it supports FormData.
//     const res = await fetch(url, {
//       method: "POST",
//       headers,
//       body: formData,
//       // credentials as needed: include or same-origin — adjust if backend uses cookies
//       credentials: "include",
//     });

//     const contentType = res.headers.get("content-type") || "";
//     let body;
//     try {
//       body = contentType.includes("application/json")
//         ? await res.json()
//         : await res.text();
//     } catch (e) {
//       body = await res.text().catch(() => null);
//     }

//     if (!res.ok) {
//       const serverMsg =
//         typeof body === "string"
//           ? body
//           : body && typeof body === "object"
//           ? JSON.stringify(body)
//           : "";
//       const msg = `Request failed ${res.status} ${res.statusText}. ${serverMsg}`;
//       console.error(
//         "createPostMultipart response error:",
//         res.status,
//         res.statusText,
//         body
//       );
//       const err = new Error(msg);
//       err.status = res.status;
//       err.response = body;
//       throw err;
//     }

//     return body;
//   } catch (err) {
//     console.error("Network error calling createPostMultipart:", err);
//     // Repackage/network error so caller's catch sees a sensible message
//     throw new Error(err.message || "Network error");
//   }
// }

// export default { createPostMultipart };

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

/** 🔹 Get a single post by id (needed by EditPost.jsx) */
export async function getPostById(id) {
  if (id == null) throw new Error("post id required");
  return apiRequest(`/api/Posts/${id}`, { method: "GET" });
}

/** 🔹 Update a post using multipart (title/body/tags) */
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

export default {
  createPostMultipart,
  getMyPosts,
  getPostById,
  updatePostMultipart,
  deletePostAsManager,
};
