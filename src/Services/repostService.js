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
