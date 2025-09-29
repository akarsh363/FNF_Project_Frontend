import { request } from "./api"; // uses your existing API_BASE + token logic

// GET /api/Tags/mine (requires auth)
export async function getMyTags() {
  return await request("/api/Tags/mine", {
    method: "GET",
    auth: true,
  });
}

// GET /api/Tags?deptId=123 (requires auth)
export async function getTagsByDept(deptId) {
  if (!deptId || Number(deptId) <= 0) throw new Error("Invalid department id");
  const qs = new URLSearchParams({ deptId: String(deptId) }).toString();
  return await request(`/api/Tags?${qs}`, {
    method: "GET",
    auth: true,
  });
}
