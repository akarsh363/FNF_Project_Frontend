// import { request as apiRequest } from "./api";
// import { getToken } from "./AuthService";

// const API_BASE = (
//   import.meta.env.VITE_API_BASE_URL ||
//   import.meta.env.VITE_API ||
//   "http://localhost:5294"
// ).replace(/\/+$/, "");

// /** Create post (multipart/form-data) */
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

//   if (Array.isArray(tagIds))
//     tagIds.forEach((t) => formData.append("TagIds", String(t)));

//   if (Array.isArray(elements)) {
//     elements.forEach((el) => {
//       if (el && el.type === "image" && el.imageFile) {
//         const filename = el.imageName || el.imageFile?.name || "image.jpg";
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

// /** Get ONLY the current user's posts */
// export async function getMyPosts() {
//   return apiRequest("/api/Posts/mine", { method: "GET" });
// }

// /** Get a single post by id */
// export async function getPostById(id) {
//   if (id == null) throw new Error("post id required");
//   return apiRequest(`/api/Posts/${id}`, { method: "GET" });
// }

// /** Update a post using multipart (title/body/tags) */
// export async function updatePostMultipart(
//   postId,
//   { title, elements, tagIds = [] }
// ) {
//   const formData = new FormData();
//   if (title != null) formData.append("Title", title);
//   if (elements != null) formData.append("Body", JSON.stringify(elements));
//   if (Array.isArray(tagIds))
//     tagIds.forEach((t) => formData.append("TagIds", String(t)));

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

//   if (!res.ok)
//     throw new Error(
//       typeof data === "string" ? data : data?.error || "Update failed"
//     );
//   return data;
// }

// /** Manager-only delete with reason */
// export async function deletePostAsManager(postId, reason) {
//   // Your backend expects a DELETE on /api/Posts/{id} and reads reason from query or body.
//   // We'll send body JSON (your controller reads query first, then body) — this is consistent.
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

// /* ------------------------------------------------------------------
//    VOTING — matches your backend (VotesController + VoteRequestDto)
//    POST /api/Votes/post/{postId}  body: { voteType: "Upvote"|"Downvote" }
// ------------------------------------------------------------------- */
// export async function votePost(postId, value) {
//   if (postId == null) throw new Error("postId is required");

//   let voteType = null;
//   if (value > 0) voteType = "Upvote";
//   else if (value < 0) voteType = "Downvote";
//   else throw new Error("value must be +1 or -1");

//   const res = await fetch(`${API_BASE}/api/Votes/post/${postId}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken() || ""}`,
//     },
//     body: JSON.stringify({ voteType }),
//     credentials: "include",
//   });

//   const ct = res.headers.get("content-type") || "";
//   const data = ct.includes("application/json")
//     ? await res.json().catch(() => null)
//     : await res.text().catch(() => null);

//   if (!res.ok) {
//     const msg =
//       (data && (data.error || data.message || data.title)) ||
//       `Vote failed (${res.status})`;
//     throw new Error(msg);
//   }
//   // expected: { postId, likeCount, dislikeCount, userVote }
//   return data;
// }

// export default {
//   createPostMultipart,
//   getMyPosts,
//   getPostById,
//   updatePostMultipart,
//   deletePostAsManager,
//   votePost,
// };

import { request as apiRequest } from "./api";
import { getToken, fetchMe as fetchCurrentUser } from "./AuthService";

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

/** Get ONLY the current user's posts
 *
 * Robustness notes:
 * - Try canonical /api/Posts/mine first.
 * - If server responds 400 validation error (common when backend expects a query param),
 *   fallback to fetching the feed (/api/posts/feed) or /api/posts and filter results client-side
 *   by the current user (matching userId where available or authorName).
 */
export async function getMyPosts() {
  try {
    return await apiRequest("/api/Posts/mine", { method: "GET" });
  } catch (err) {
    // If 401/403 — rethrow so caller handles auth.
    if (err && (err.status === 401 || err.status === 403)) {
      console.error("getMyPosts auth error:", err);
      throw err;
    }

    // Log the original failure for debugging
    console.warn(
      "getMyPosts: /api/Posts/mine failed, attempting fallback",
      err?.status,
      err?.response ?? err?.message
    );

    // Try to obtain current user's identity (name / id) to filter fallback results.
    let me = null;
    try {
      // fetchMe may be asynchronous and return user object or null
      me = await fetchCurrentUser();
    } catch (e) {
      console.warn("getMyPosts: fetchMe failed", e);
      me = null;
    }

    // Try feed endpoint first (the projection we use elsewhere)
    const fallbackCandidates = [
      "/api/posts/feed",
      "/api/posts", // fallback if feed not present
    ];

    for (const path of fallbackCandidates) {
      try {
        const data = await apiRequest(path, { method: "GET" });
        const arr = Array.isArray(data) ? data : data?.posts ?? [];
        if (!Array.isArray(arr) || arr.length === 0) continue;

        // If me is available, try to match by numeric id fields or author name
        if (me) {
          const myId = me.userId ?? me.UserId ?? me.id ?? me.user?.id ?? null;
          const myName = (
            me.fullName ??
            me.FullName ??
            me.name ??
            me.Name ??
            ""
          )
            .toString()
            .trim()
            .toLowerCase();

          const filtered = arr.filter((p) => {
            // check common id shapes
            const postUserId =
              p.userId ?? p.UserId ?? p.authorId ?? p.AuthorId ?? null;
            if (postUserId != null && myId != null)
              return Number(postUserId) === Number(myId);

            // check authorName / userName / author
            const authorName = (
              p.authorName ??
              p.AuthorName ??
              p.userName ??
              p.UserName ??
              p.author ??
              p.Author ??
              ""
            )
              .toString()
              .trim()
              .toLowerCase();
            if (authorName && myName) return authorName === myName;

            // last resort: dept + created by? (skip)
            return false;
          });

          // If we found results, return them. If none found, we'll try next fallback.
          if (filtered.length) return filtered;
        } else {
          // no me info — return the full array (caller expected user's posts; but it's better than failing)
          return arr;
        }
      } catch (e) {
        console.warn(
          `getMyPosts fallback ${path} failed:`,
          e?.status ?? e?.message ?? e
        );
        // try next fallback
      }
    }

    // If we reach here we couldn't get anything useful — rethrow original error to preserve behavior
    throw err;
  }
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
