// src/utils/localCommits.js
// Small utility to manage client-side "commits" (soft-deletes) stored in localStorage.

export const LOCAL_COMMITS_KEY = "localPostCommits";

/**
 * Returns array of commits:
 * { postId, postTitle, authorName, managerId, managerName, reason, createdAt }
 */
export function getLocalCommits() {
  try {
    const raw = localStorage.getItem(LOCAL_COMMITS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalCommits(arr) {
  try {
    localStorage.setItem(LOCAL_COMMITS_KEY, JSON.stringify(arr || []));
  } catch {}
}

/** Adds a commit to front (newest first) */
export function addLocalCommit(commit) {
  try {
    const arr = getLocalCommits();
    arr.unshift(commit);
    saveLocalCommits(arr);
  } catch {}
}

/** Remove a commit by postId (useful for Undo/Restore) */
export function removeLocalCommitByPostId(postId) {
  try {
    const arr = getLocalCommits().filter(
      (c) => Number(c.postId) !== Number(postId)
    );
    saveLocalCommits(arr);
  } catch {}
}

/**
 * Merge serverPosts (array of UI-normalized posts) with local commits targeting the current user's posts.
 * Strategy: create pseudo-post entries for commits whose postId is in the user's posts (or optionally match by authorName).
 * - serverPosts: normalized UI posts (should contain postId)
 * - currentUserId (optional): if provided, you can match commits for that user's authored posts differently.
 */
export function mergeMyPostsWithCommits(
  serverPosts = [],
  currentUserId = null
) {
  const commits = getLocalCommits() || [];
  const myServerPostIds = new Set(
    (serverPosts || []).map((p) => Number(p.postId))
  );

  const commitEntries = commits
    .filter((c) => myServerPostIds.has(Number(c.postId)))
    .map((c) => ({
      id: `deleted-${c.postId}-${c.createdAt}`,
      postId: c.postId,
      title: `[Deleted by ${c.managerName}] ${c.postTitle}`,
      elements: [
        {
          id: `deleted-${c.postId}-msg`,
          type: "text",
          content: `Deleted: ${c.reason}`,
        },
      ],
      tags: [],
      createdAt: c.createdAt,
      authorName: c.authorName || "(unknown)",
      departmentName: "",
      likeCount: 0,
      dislikeCount: 0,
      userVote: 0,
      raw: { deletedCommit: c },
      isRepost: false,
      isLocalCommit: true,
    }));

  // Prepend commits so user sees them first
  return [...commitEntries, ...serverPosts];
}
