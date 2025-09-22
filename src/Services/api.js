const API_BASE = import.meta.env.VITE_API || "http://localhost:5294";
const TOKEN_KEY = "token";

async function request(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  const headers = opts.headers ? { ...opts.headers } : {};

  const token = localStorage.getItem(TOKEN_KEY);
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...opts, headers });
  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const msg =
      (body && (body.error || body.Error || body.message || body.Message)) ||
      (typeof body === "string" ? body : null) ||
      res.statusText;
    throw new Error(msg || "Request failed");
  }
  return body;
}

export default { request, API_BASE };
