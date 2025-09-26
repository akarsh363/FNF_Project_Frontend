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
