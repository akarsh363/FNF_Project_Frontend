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
  // Your backend expects a DELETE on /api/Posts/{id} and reads reason from query or body.
  // We'll send body JSON (your controller reads query first, then body) — this is consistent.
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
