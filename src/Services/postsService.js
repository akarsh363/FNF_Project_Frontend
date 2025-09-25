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
