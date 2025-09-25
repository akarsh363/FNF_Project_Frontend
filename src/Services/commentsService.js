// // src/Services/commentsService.js
// const API_BASE = (
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:5294"
// ).replace(/\/+$/, "");

// function getToken() {
//   // adjust if your token key is different
//   return (
//     localStorage.getItem("authToken") || localStorage.getItem("token") || null
//   );
// }

// async function parseResponse(res) {
//   const ct = (res.headers.get("content-type") || "").toLowerCase();
//   const text = await res.text();
//   try {
//     return text ? JSON.parse(text) : null;
//   } catch {
//     return text;
//   }
// }

// export async function fetchCommentsForPost(postId) {
//   const url = `${API_BASE}/api/Comments/post/${postId}`;
//   const res = await fetch(url, { method: "GET" });
//   if (!res.ok) {
//     const body = await parseResponse(res);
//     throw new Error(body?.error || body || res.statusText);
//   }
//   return await parseResponse(res);
// }

// export async function createComment(dto) {
//   // dto: { postId, parentCommentId?, commentText, attachments[] (File[]) }
//   const token = getToken();
//   if (!token) throw new Error("No auth token");

//   const form = new FormData();
//   form.append("PostId", String(dto.postId));
//   if (dto.parentCommentId)
//     form.append("ParentCommentId", String(dto.parentCommentId));
//   form.append("CommentText", dto.commentText || "");

//   if (dto.attachments && Array.isArray(dto.attachments)) {
//     dto.attachments.forEach((f) => {
//       if (f) form.append("Attachments", f, f.name);
//     });
//   }

//   const url = `${API_BASE}/api/Comments`;
//   const res = await fetch(url, {
//     method: "POST",
//     headers: { Authorization: `Bearer ${token}` },
//     body: form,
//   });

//   const body = await parseResponse(res);
//   if (!res.ok) throw new Error(body?.error || body || res.statusText);
//   return body;
// }

// export async function editComment(commentId, dto) {
//   // dto: { commentText } — uses JSON
//   const token = getToken();
//   if (!token) throw new Error("No auth token");
//   const url = `${API_BASE}/api/Comments/${commentId}`;
//   const res = await fetch(url, {
//     method: "PUT",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ CommentText: dto.commentText }),
//   });
//   const body = await parseResponse(res);
//   if (!res.ok) throw new Error(body?.error || body || res.statusText);
//   return body;
// }

// export async function deleteComment(commentId) {
//   const token = getToken();
//   if (!token) throw new Error("No auth token");
//   const url = `${API_BASE}/api/Comments/${commentId}`;
//   const res = await fetch(url, {
//     method: "DELETE",
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (res.status === 204) return null;
//   const body = await parseResponse(res);
//   if (!res.ok) throw new Error(body?.error || body || res.statusText);
//   return body;
// }

// export async function voteOnComment(commentId, voteType) {
//   // voteType: "Upvote" or "Downvote"
//   const token = getToken();
//   if (!token) throw new Error("No auth token");
//   const url = `${API_BASE}/api/Votes/comment/${commentId}`;
//   const res = await fetch(url, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ voteType }),
//   });
//   const body = await parseResponse(res);
//   if (!res.ok) throw new Error(body?.error || body || res.statusText);
//   return body;
// }

// export default {
//   fetchCommentsForPost,
//   createComment,
//   editComment,
//   deleteComment,
//   voteOnComment,
// };

// src/Services/commentsService.js
const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5294"
).replace(/\/+$/, "");

function getToken() {
  try {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      null
    );
  } catch (e) {
    return null;
  }
}

async function parseResponse(res) {
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

export async function fetchCommentsForPost(postId) {
  const url = `${API_BASE}/api/Comments/post/${postId}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const body = await parseResponse(res);
    throw new Error(body?.error || body || res.statusText);
  }
  return await parseResponse(res);
}

export async function createComment(dto) {
  const token = getToken();
  if (!token) throw new Error("No auth token");

  const form = new FormData();
  form.append("PostId", String(dto.postId));
  if (dto.parentCommentId)
    form.append("ParentCommentId", String(dto.parentCommentId));
  form.append("CommentText", dto.commentText || "");

  if (dto.attachments && Array.isArray(dto.attachments)) {
    dto.attachments.forEach((f) => {
      if (f) form.append("Attachments", f, f.name);
    });
  }

  const url = `${API_BASE}/api/Comments`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const body = await parseResponse(res);
  if (!res.ok) throw new Error(body?.error || body || res.statusText);
  return body;
}

export async function editComment(commentId, dto) {
  const token = getToken();
  if (!token) throw new Error("No auth token");
  const url = `${API_BASE}/api/Comments/${commentId}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ CommentText: dto.commentText }),
  });
  const body = await parseResponse(res);
  if (!res.ok) throw new Error(body?.error || body || res.statusText);
  return body;
}

export async function deleteComment(commentId) {
  const token = getToken();
  if (!token) throw new Error("No auth token");
  const url = `${API_BASE}/api/Comments/${commentId}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 204) return null;
  const body = await parseResponse(res);
  if (!res.ok) throw new Error(body?.error || body || res.statusText);
  return body;
}

export async function voteOnComment(commentId, voteType) {
  const token = getToken();
  if (!token) throw new Error("No auth token");
  const url = `${API_BASE}/api/Votes/comment/${commentId}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ voteType }),
  });
  const body = await parseResponse(res);
  if (!res.ok) throw new Error(body?.error || body || res.statusText);
  return body;
}

export default {
  fetchCommentsForPost,
  createComment,
  editComment,
  deleteComment,
  voteOnComment,
};
