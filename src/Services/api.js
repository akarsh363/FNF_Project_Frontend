const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API ||
  "http://localhost:5294"
).replace(/\/+$/, "");

function _buildUrl(path) {
  return !path
    ? API_BASE
    : path.startsWith("http")
    ? path
    : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}
function _readToken() {
  try {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      null
    );
  } catch {
    return null;
  }
}

export async function request(path, options = {}) {
  const url = _buildUrl(path);
  const opts = { ...(options || {}) };
  opts.headers = { ...(opts.headers || {}) };

  const token = _readToken();
  if (token && !opts.headers.Authorization && !opts.headers.authorization) {
    opts.headers.Authorization = `Bearer ${token}`;
  }

  if (opts.body instanceof FormData) {
    delete opts.headers["Content-Type"];
    delete opts.headers["content-type"];
  } else if (
    opts.body &&
    typeof opts.body === "object" &&
    !(opts.body instanceof String)
  ) {
    opts.headers["Content-Type"] =
      opts.headers["Content-Type"] || "application/json";
    if (
      opts.headers["Content-Type"].includes("application/json") &&
      typeof opts.body !== "string"
    ) {
      try {
        opts.body = JSON.stringify(opts.body);
      } catch {}
    }
  }

  if (typeof opts.credentials === "undefined") opts.credentials = "include";

  let res;
  try {
    res = await fetch(url, opts);
  } catch {
    throw new Error("Network error");
  }

  const text = await res.text().catch(() => "");
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      (data &&
        (data.message || data.error || data.title || data.error_description)) ||
      (typeof data === "string" && data) ||
      `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.response = data;
    console.error("API request failed:", {
      url,
      status: res.status,
      body: data,
    });
    throw err;
  }
  return data;
}

export default { request };
