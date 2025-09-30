// // // // // import { request as apiRequest } from "./api";

// // // // // export async function repostPost(postId, userId) {
// // // // //   if (postId === undefined || postId === null)
// // // // //     throw new Error("postId required");
// // // // //   const body = { PostId: Number(postId) };
// // // // //   if (userId !== undefined && userId !== null) body.UserId = Number(userId);
// // // // //   return apiRequest("/api/Reposts", { method: "POST", body });
// // // // // }

// // // // // export async function getReposts(postId) {
// // // // //   if (postId === undefined || postId === null)
// // // // //     throw new Error("postId required");
// // // // //   return apiRequest(`/api/Reposts/${postId}`, { method: "GET" });
// // // // // }

// // // // // export async function getMyReposts() {
// // // // //   return apiRequest("/api/Reposts/mine", { method: "GET" });
// // // // // }

// // // // // export default { repostPost, getReposts, getMyReposts };

// // // // // src/Services/repostService.js
// // // // import { request as apiRequest } from "./api";

// // // // /**
// // // //  * Try a few common body shapes the server might expect.
// // // //  * Returns the server response on success, throws last error on failure.
// // // //  */
// // // // function _makeBodies(postId, userId) {
// // // //   const n = Number(postId);
// // // //   const bodies = [
// // // //     { PostId: n },
// // // //     { postId: n },
// // // //     { post_id: n },
// // // //     { PostID: n },
// // // //     // some backends expect a nested object
// // // //     { post: { id: n } },
// // // //     { Post: { PostId: n } },
// // // //   ];
// // // //   if (userId !== undefined && userId !== null) {
// // // //     const uid = Number(userId);
// // // //     bodies.forEach((b) => {
// // // //       if (!("UserId" in b)) b.UserId = uid;
// // // //       if (!("userId" in b)) b.userId = uid;
// // // //     });
// // // //   }
// // // //   return bodies;
// // // // }

// // // // export async function repostPost(postId, userId) {
// // // //   if (postId === undefined || postId === null)
// // // //     throw new Error("postId required");

// // // //   const bodies = _makeBodies(postId, userId);
// // // //   let lastErr = null;

// // // //   for (const body of bodies) {
// // // //     try {
// // // //       // apiRequest will JSON.stringify body and attach auth header
// // // //       const res = await apiRequest("/api/Reposts", { method: "POST", body });
// // // //       return res;
// // // //     } catch (err) {
// // // //       // err is thrown by api.request and has .response (parsed body) and .status
// // // //       lastErr = err;
// // // //       // If server returned validation details, try next shape — but keep the lastErr
// // // //     }
// // // //   }

// // // //   // If we reach here, all shapes failed. Build helpful message
// // // //   const serverInfo = lastErr?.response
// // // //     ? JSON.stringify(lastErr.response)
// // // //     : lastErr?.message || String(lastErr);
// // // //   const status = lastErr?.status ? ` (${lastErr.status})` : "";
// // // //   throw new Error(`Repost failed${status}: ${serverInfo}`);
// // // // }

// // // // export async function getReposts(postId) {
// // // //   if (postId === undefined || postId === null)
// // // //     throw new Error("postId required");
// // // //   return apiRequest(`/api/Reposts/${postId}`, { method: "GET" });
// // // // }

// // // // export async function getMyReposts() {
// // // //   return apiRequest("/api/Reposts/mine", { method: "GET" });
// // // // }

// // // // export default { repostPost, getReposts, getMyReposts };

// // // // src/Services/repostService.js
// // // import { request as apiRequest } from "./api";

// // // /**
// // //  * Try a few payload shapes and content-types that backends commonly expect.
// // //  * Returns server result on success; throws Error with server body on failure.
// // //  */

// // // async function _tryJson(body) {
// // //   // uses apiRequest (which sets Content-Type: application/json)
// // //   return apiRequest("/api/Reposts", { method: "POST", body });
// // // }

// // // async function _tryFormUrlEncoded(pairObj) {
// // //   // some model binders accept "Post.PostId=78" form-encoded
// // //   const params = new URLSearchParams();
// // //   for (const key of Object.keys(pairObj)) {
// // //     params.append(key, String(pairObj[key]));
// // //   }
// // //   // use fetch directly to avoid apiRequest JSON behavior
// // //   const url = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API || "http://localhost:5294").replace(/\/+$/, "") + "/api/Reposts";
// // //   const token = (typeof localStorage !== "undefined" && (localStorage.getItem("token") || localStorage.getItem("authToken"))) || "";
// // //   const res = await fetch(url, {
// // //     method: "POST",
// // //     headers: {
// // //       "Content-Type": "application/x-www-form-urlencoded",
// // //       ...(token ? { Authorization: `Bearer ${token}` } : {}),
// // //       Accept: "application/json"
// // //     },
// // //     body: params.toString(),
// // //     credentials: "include"
// // //   });
// // //   const text = await res.text().catch(() => "");
// // //   let data;
// // //   try { data = text ? JSON.parse(text) : null; } catch { data = text; }
// // //   if (!res.ok) {
// // //     const err = new Error(`Status ${res.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`);
// // //     err.status = res.status;
// // //     err.response = data;
// // //     throw err;
// // //   }
// // //   return data;
// // // }

// // // export async function repostPost(postId, userId) {
// // //   if (postId === undefined || postId === null) throw new Error("postId required");
// // //   const n = Number(postId);

// // //   // 1) Try exact nested JSON: { Post: { PostId: 78 } }
// // //   try {
// // //     const body1 = { Post: { PostId: n } };
// // //     if (userId !== undefined && userId !== null) body1.Post.UserId = Number(userId);
// // //     return await _tryJson(body1);
// // //   } catch (err1) {
// // //     // keep going
// // //     if (process && process.env && process.env.NODE_ENV === "development") console.debug("repost try1 failed", err1);
// // //     // fall through
// // //   }

// // //   // 2) Try simple root JSON: { PostId: 78 } (many APIs expect this)
// // //   try {
// // //     const body2 = { PostId: n };
// // //     if (userId !== undefined && userId !== null) body2.UserId = Number(userId);
// // //     return await _tryJson(body2);
// // //   } catch (err2) {
// // //     if (process && process.env && process.env.NODE_ENV === "development") console.debug("repost try2 failed", err2);
// // //     // fall through
// // //   }

// // //   // 3) Try form-url-encoded with "Post.PostId=78" (model binders sometimes expect this)
// // //   try {
// // //     // keys like "Post.PostId" mimic nested form properties on server
// // //     const pairObj = { "Post.PostId": n };
// // //     if (userId !== undefined && userId !== null) pairObj["Post.UserId"] = Number(userId);
// // //     return await _tryFormUrlEncoded(pairObj);
// // //   } catch (err3) {
// // //     // All attempts failed — throw combined helpful error
// // //     const last = err3 || {};
// // //     const msg = last?.response ? JSON.stringify(last.response) : last?.message || String(last);
// // //     const e = new Error(`Repost failed: ${msg}`);
// // //     e.status = last?.status;
// // //     e.response = last?.response ?? null;
// // //     throw e;
// // //   }
// // // }

// // // export async function getReposts(postId) {
// // //   if (postId === undefined || postId === null) throw new Error("postId required");
// // //   return apiRequest(`/api/Reposts/${postId}`, { method: "GET" });
// // // }

// // // export async function getMyReposts() {
// // //   return apiRequest("/api/Reposts/mine", { method: "GET" });
// // // }

// // // export default { repostPost, getReposts, getMyReposts };

// // // src/Services/repostService.js
// // import { request as apiRequest } from "./api";

// // /**
// //  * Try a few payload shapes and content-types that backends commonly expect.
// //  * Returns server result on success; throws Error with server body on failure.
// //  */

// // async function _tryJson(body) {
// //   // uses apiRequest (which sets Content-Type: application/json)
// //   return apiRequest("/api/Reposts", { method: "POST", body });
// // }

// // async function _tryFormUrlEncoded(pairObj) {
// //   // some model binders accept "Post.PostId=78" form-encoded
// //   const params = new URLSearchParams();
// //   for (const key of Object.keys(pairObj)) {
// //     params.append(key, String(pairObj[key]));
// //   }
// //   const API_BASE =
// //     (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API || "http://localhost:5294").replace(/\/+$/, "");
// //   const url = `${API_BASE}/api/Reposts`;
// //   const token =
// //     (typeof localStorage !== "undefined" && (localStorage.getItem("token") || localStorage.getItem("authToken"))) ||
// //     "";

// //   const res = await fetch(url, {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/x-www-form-urlencoded",
// //       ...(token ? { Authorization: `Bearer ${token}` } : {}),
// //       Accept: "application/json",
// //     },
// //     body: params.toString(),
// //     credentials: "include",
// //   });

// //   const text = await res.text().catch(() => "");
// //   let data;
// //   try {
// //     data = text ? JSON.parse(text) : null;
// //   } catch {
// //     data = text;
// //   }
// //   if (!res.ok) {
// //     const err = new Error(`Status ${res.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`);
// //     err.status = res.status;
// //     err.response = data;
// //     throw err;
// //   }
// //   return data;
// // }

// // export async function repostPost(postId, userId) {
// //   if (postId === undefined || postId === null) throw new Error("postId required");
// //   const n = Number(postId);

// //   // 1) Try exact nested JSON: { Post: { PostId: 78 } }
// //   try {
// //     const body1 = { Post: { PostId: n } };
// //     if (userId !== undefined && userId !== null) body1.Post.UserId = Number(userId);
// //     return await _tryJson(body1);
// //   } catch (err1) {
// //     console.debug("repost try1 failed", err1);
// //   }

// //   // 2) Try simple root JSON: { PostId: 78 }
// //   try {
// //     const body2 = { PostId: n };
// //     if (userId !== undefined && userId !== null) body2.UserId = Number(userId);
// //     return await _tryJson(body2);
// //   } catch (err2) {
// //     console.debug("repost try2 failed", err2);
// //   }

// //   // 3) Try form-url-encoded with "Post.PostId=78"
// //   try {
// //     const pairObj = { "Post.PostId": n };
// //     if (userId !== undefined && userId !== null) pairObj["Post.UserId"] = Number(userId);
// //     return await _tryFormUrlEncoded(pairObj);
// //   } catch (err3) {
// //     // All attempts failed — throw combined helpful error
// //     const last = err3 || {};
// //     const msg = last?.response ? JSON.stringify(last.response) : last?.message || String(last);
// //     const e = new Error(`Repost failed: ${msg}`);
// //     e.status = last?.status;
// //     e.response = last?.response ?? null;
// //     throw e;
// //   }
// // }

// // export async function getReposts(postId) {
// //   if (postId === undefined || postId === null) throw new Error("postId required");
// //   return apiRequest(`/api/Reposts/${postId}`, { method: "GET" });
// // }

// // export async function getMyReposts() {
// //   return apiRequest("/api/Reposts/mine", { method: "GET" });
// // }

// // export default { repostPost, getReposts, getMyReposts };

// // src/Services/repostService.js
// import { request as apiRequest } from "./api";

// /**
//  * Robust repost service - tries a few payload shapes & content-types.
//  * Records the last error and throws a clear error if all attempts fail.
//  */

// /* Helpers */
// async function _tryJson(body) {
//   return apiRequest("/api/Reposts", { method: "POST", body });
// }

// async function _tryFormUrlEncoded(pairObj) {
//   const params = new URLSearchParams();
//   for (const k of Object.keys(pairObj)) params.append(k, String(pairObj[k]));
//   const API_BASE = (
//     import.meta.env.VITE_API_BASE_URL ||
//     import.meta.env.VITE_API ||
//     "http://localhost:5294"
//   ).replace(/\/+$/, "");
//   const url = `${API_BASE}/api/Reposts`;
//   const token =
//     (typeof localStorage !== "undefined" &&
//       (localStorage.getItem("token") || localStorage.getItem("authToken"))) ||
//     "";

//   const res = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       Accept: "application/json",
//     },
//     body: params.toString(),
//     credentials: "include",
//   });

//   const text = await res.text().catch(() => "");
//   let data;
//   try {
//     data = text ? JSON.parse(text) : null;
//   } catch {
//     data = text;
//   }

//   if (!res.ok) {
//     const err = new Error(
//       typeof data === "string" ? data : JSON.stringify(data)
//     );
//     err.status = res.status;
//     err.response = data;
//     throw err;
//   }
//   return data;
// }

// async function _tryMultipartForm(pairObj) {
//   const fd = new FormData();
//   for (const k of Object.keys(pairObj)) fd.append(k, String(pairObj[k]));
//   const API_BASE = (
//     import.meta.env.VITE_API_BASE_URL ||
//     import.meta.env.VITE_API ||
//     "http://localhost:5294"
//   ).replace(/\/+$/, "");
//   const url = `${API_BASE}/api/Reposts`;
//   const token =
//     (typeof localStorage !== "undefined" &&
//       (localStorage.getItem("token") || localStorage.getItem("authToken"))) ||
//     "";

//   const res = await fetch(url, {
//     method: "POST",
//     headers: {
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       Accept: "application/json",
//       // DO NOT set Content-Type for multipart
//     },
//     body: fd,
//     credentials: "include",
//   });

//   const text = await res.text().catch(() => "");
//   let data;
//   try {
//     data = text ? JSON.parse(text) : null;
//   } catch {
//     data = text;
//   }

//   if (!res.ok) {
//     const err = new Error(
//       typeof data === "string" ? data : JSON.stringify(data)
//     );
//     err.status = res.status;
//     err.response = data;
//     throw err;
//   }
//   return data;
// }

// async function _tryMultipartWithJsonField(postObj) {
//   const fd = new FormData();
//   fd.append("Post", JSON.stringify(postObj));
//   const API_BASE = (
//     import.meta.env.VITE_API_BASE_URL ||
//     import.meta.env.VITE_API ||
//     "http://localhost:5294"
//   ).replace(/\/+$/, "");
//   const url = `${API_BASE}/api/Reposts`;
//   const token =
//     (typeof localStorage !== "undefined" &&
//       (localStorage.getItem("token") || localStorage.getItem("authToken"))) ||
//     "";

//   const res = await fetch(url, {
//     method: "POST",
//     headers: {
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       Accept: "application/json",
//     },
//     body: fd,
//     credentials: "include",
//   });

//   const text = await res.text().catch(() => "");
//   let data;
//   try {
//     data = text ? JSON.parse(text) : null;
//   } catch {
//     data = text;
//   }

//   if (!res.ok) {
//     const err = new Error(
//       typeof data === "string" ? data : JSON.stringify(data)
//     );
//     err.status = res.status;
//     err.response = data;
//     throw err;
//   }
//   return data;
// }

// /* Main exported function */
// export async function repostPost(postId, userId) {
//   if (postId === undefined || postId === null)
//     throw new Error("postId required");
//   const n = Number(postId);
//   let lastErr = null;

//   // 1) nested JSON
//   try {
//     const body1 = { Post: { PostId: n } };
//     if (userId != null) body1.Post.UserId = Number(userId);
//     return await _tryJson(body1);
//   } catch (e) {
//     lastErr = e;
//     console.debug("repost try1 (nested JSON) failed:", e);
//   }

//   // 2) flat JSON
//   try {
//     const body2 = { PostId: n };
//     if (userId != null) body2.UserId = Number(userId);
//     return await _tryJson(body2);
//   } catch (e) {
//     lastErr = e;
//     console.debug("repost try2 (flat JSON) failed:", e);
//   }

//   // 3) form-urlencoded Post.PostId=78
//   try {
//     const pairObj = { "Post.PostId": n };
//     if (userId != null) pairObj["Post.UserId"] = Number(userId);
//     return await _tryFormUrlEncoded(pairObj);
//   } catch (e) {
//     lastErr = e;
//     console.debug("repost try3 (form-urlencoded) failed:", e);
//   }

//   // 4) multipart Post.PostId
//   try {
//     const pairObjA = { "Post.PostId": n };
//     if (userId != null) pairObjA["Post.UserId"] = Number(userId);
//     return await _tryMultipartForm(pairObjA);
//   } catch (e) {
//     lastErr = e;
//     console.debug("repost try4a (multipart Post.PostId) failed:", e);
//   }

//   // 5) multipart PostId
//   try {
//     const pairObjB = { PostId: n };
//     if (userId != null) pairObjB["UserId"] = Number(userId);
//     return await _tryMultipartForm(pairObjB);
//   } catch (e) {
//     lastErr = e;
//     console.debug("repost try4b (multipart PostId) failed:", e);
//   }

//   // 6) multipart with Post JSON string field
//   try {
//     const postObj = { PostId: n };
//     if (userId != null) postObj.UserId = Number(userId);
//     return await _tryMultipartWithJsonField(postObj);
//   } catch (e) {
//     lastErr = e;
//     console.debug("repost try5 (multipart Post as JSON field) failed:", e);
//   }

//   // all attempts failed - construct helpful error
//   const serverInfo = lastErr?.response
//     ? lastErr.response
//     : lastErr?.message || String(lastErr || "unknown error");
//   const status = lastErr?.status ? ` (${lastErr.status})` : "";
//   const err = new Error(
//     `Repost failed${status}: ${
//       typeof serverInfo === "string" ? serverInfo : JSON.stringify(serverInfo)
//     }`
//   );
//   err.status = lastErr?.status;
//   err.response = lastErr?.response ?? null;
//   throw err;
// }

// export async function getReposts(postId) {
//   if (postId === undefined || postId === null)
//     throw new Error("postId required");
//   return apiRequest(`/api/Reposts/${postId}`, { method: "GET" });
// }
// export async function getMyReposts() {
//   return apiRequest("/api/Reposts/mine", { method: "GET" });
// }

// export default { repostPost, getReposts, getMyReposts };

// repostService.js
import { request as apiRequest } from "./api";

/**
 * Single reliable repost: POST { PostId: <n>, UserId?: <id> }
 * Uses api.request which adds JSON content-type and bearer token.
 */
export async function repostPost(postId, userId) {
  if (postId == null) throw new Error("postId required");
  const body = { PostId: Number(postId) };
  if (userId != null) body.UserId = Number(userId);
  return apiRequest("/api/Reposts", { method: "POST", body });
}

export async function getReposts(postId) {
  if (postId == null) throw new Error("postId required");
  return apiRequest(`/api/Reposts/${postId}`, { method: "GET" });
}

export async function getMyReposts() {
  return apiRequest("/api/Reposts/mine", { method: "GET" });
}

export default { repostPost, getReposts, getMyReposts };
