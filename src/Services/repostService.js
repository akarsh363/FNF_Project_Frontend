// // // src/Services/repostService.js
// // import { request as apiRequest } from "./api";

// // const API_BASE = (import.meta.env.VITE_API || "http://localhost:5294").replace(
// //   /\/+$/,
// //   ""
// // );

// // /**
// //  * Create a repost for a postId.
// //  * Server ignores client-sent UserId/CreatedAt, so we only send PostId (PascalCase).
// //  * Returns PostResponseDto (or throws).
// //  */
// // export async function repostPost(postId) {
// //   if (postId === undefined || postId === null)
// //     throw new Error("postId required");

// //   // ensure numeric
// //   const PostId = Number(postId);
// //   if (Number.isNaN(PostId)) throw new Error("postId must be a number");

// //   // Send PascalCase keys which maps to typical .NET DTO property names
// //   return apiRequest("/api/Reposts", {
// //     method: "POST",
// //     body: {
// //       PostId,
// //       UserId: 0,
// //       CreatedAt: new Date().toISOString(),
// //     },
// //   });
// // }

// // /**
// //  * Get reposts for a given original postId.
// //  * Returns array of PostResponseDto.
// //  */
// // export async function getReposts(postId) {
// //   if (postId === undefined || postId === null)
// //     throw new Error("postId required");
// //   return apiRequest(`/api/Reposts/${postId}`, { method: "GET" });
// // }

// // /**
// //  * Get reposts made by the current user.
// //  * Server endpoint is /api/Reposts/mine (must exist server-side).
// //  */
// // export async function getMyReposts() {
// //   return apiRequest("/api/Reposts/mine", { method: "GET" });
// // }

// // export default { repostPost, getReposts, getMyReposts };

// // src/Services/repostService.js
// import { request as apiRequest } from "./api";

// /**
//  * Create a repost for a postId.
//  * Server ignores client-sent UserId/CreatedAt, so send only PostId.
//  * Returns PostResponseDto (or throws).
//  */
// export async function repostPost(postId) {
//   if (postId === undefined || postId === null)
//     throw new Error("postId required");
//   const PostId = Number(postId);
//   if (Number.isNaN(PostId)) throw new Error("postId must be a number");

//   // Send minimal body to avoid model-binding/validation issues
//   return apiRequest("/api/Reposts", {
//     method: "POST",
//     body: { PostId },
//   });
// }

// /**
//  * Get reposts for a given original postId.
//  * Returns array of PostResponseDto.
//  */
// export async function getReposts(postId) {
//   if (postId === undefined || postId === null)
//     throw new Error("postId required");
//   return apiRequest(`/api/Reposts/${postId}`, { method: "GET" });
// }

// /**
//  * Get reposts made by the current user.
//  */
// export async function getMyReposts() {
//   return apiRequest("/api/Reposts/mine", { method: "GET" });
// }

// export default { repostPost, getReposts, getMyReposts };
// src/Services/repostService.js
import { request as apiRequest } from "./api";

/**
 * Create a repost for a postId.
 * Some backends require the client to include UserId (must match logged-in user).
 * We accept userId as a second param and send it (if provided).
 *
 * Returns PostResponseDto (or throws).
 */
export async function repostPost(postId, userId) {
  if (postId === undefined || postId === null)
    throw new Error("postId required");
  const PostId = Number(postId);
  if (Number.isNaN(PostId)) throw new Error("postId must be a number");

  const body = { PostId };

  if (userId !== undefined && userId !== null) {
    const uid = Number(userId);
    if (Number.isNaN(uid)) throw new Error("userId must be a number");
    body.UserId = uid;
  }

  return apiRequest("/api/Reposts", {
    method: "POST",
    body,
  });
}

/**
 * Get reposts for a given original postId.
 * Returns array of PostResponseDto.
 */
export async function getReposts(postId) {
  if (postId === undefined || postId === null)
    throw new Error("postId required");
  return apiRequest(`/api/Reposts/${postId}`, { method: "GET" });
}

/**
 * Get reposts made by the current user.
 */
export async function getMyReposts() {
  return apiRequest("/api/Reposts/mine", { method: "GET" });
}

export default { repostPost, getReposts, getMyReposts };
