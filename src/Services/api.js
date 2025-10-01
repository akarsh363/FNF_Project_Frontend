// const API_BASE = (
//   import.meta.env.VITE_API_BASE_URL ||
//   import.meta.env.VITE_API ||
//   "http://localhost:5294"
// ).replace(/\/+$/, "");

// function _buildUrl(path) {
//   return !path
//     ? API_BASE
//     : path.startsWith("http")
//     ? path
//     : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
// }
// function _readToken() {
//   try {
//     return (
//       localStorage.getItem("token") ||
//       localStorage.getItem("authToken") ||
//       localStorage.getItem("accessToken") ||
//       null
//     );
//   } catch {
//     return null;
//   }
// }

// /**
//  * Small localStorage cache helpers
//  * - stores { ts: <ms>, ttl: <sec>, data: <any> }
//  */
// function _cacheKey(key) {
//   return `__api_cache__:${key}`;
// }
// export function getCached(key) {
//   try {
//     const raw = localStorage.getItem(_cacheKey(key));
//     if (!raw) return null;
//     const parsed = JSON.parse(raw);
//     if (!parsed || typeof parsed !== "object") return null;
//     const now = Date.now();
//     if (parsed.ttl && parsed.ts && now - parsed.ts > parsed.ttl * 1000) {
//       localStorage.removeItem(_cacheKey(key));
//       return null;
//     }
//     return parsed.data;
//   } catch {
//     return null;
//   }
// }
// export function setCached(key, data, ttlSeconds = 60) {
//   try {
//     localStorage.setItem(
//       _cacheKey(key),
//       JSON.stringify({ ts: Date.now(), ttl: Number(ttlSeconds || 60), data })
//     );
//   } catch {}
// }
// export function clearCache(key) {
//   try {
//     localStorage.removeItem(_cacheKey(key));
//   } catch {}
// }

// /**
//  * requestWithCache(path, options, { ttl = 60, cacheKey })
//  * - If cacheKey present and cached entry fresh, returns cached data
//  * - Otherwise performs request() and caches result (if ok)
//  */
// export async function requestWithCache(path, options = {}, opts = {}) {
//   const ttl = Number(opts.ttl ?? 60);
//   const cacheKey = opts.cacheKey ?? path;
//   if (cacheKey) {
//     const cached = getCached(cacheKey);
//     if (cached != null) return cached;
//   }
//   const data = await request(path, options);
//   if (cacheKey) setCached(cacheKey, data, ttl);
//   return data;
// }

// export async function request(path, options = {}) {
//   const url = _buildUrl(path);
//   const opts = { ...(options || {}) };
//   opts.headers = { ...(opts.headers || {}) };

//   const token = _readToken();
//   if (token && !opts.headers.Authorization && !opts.headers.authorization) {
//     opts.headers.Authorization = `Bearer ${token}`;
//   }

//   if (opts.body instanceof FormData) {
//     delete opts.headers["Content-Type"];
//     delete opts.headers["content-type"];
//   } else if (
//     opts.body &&
//     typeof opts.body === "object" &&
//     !(opts.body instanceof String)
//   ) {
//     opts.headers["Content-Type"] =
//       opts.headers["Content-Type"] || "application/json";
//     if (
//       opts.headers["Content-Type"].includes("application/json") &&
//       typeof opts.body !== "string"
//     ) {
//       try {
//         opts.body = JSON.stringify(opts.body);
//       } catch {}
//     }
//   }

//   if (typeof opts.credentials === "undefined") opts.credentials = "include";

//   let res;
//   try {
//     res = await fetch(url, opts);
//   } catch {
//     throw new Error("Network error");
//   }

//   const text = await res.text().catch(() => "");
//   let data;
//   try {
//     data = text ? JSON.parse(text) : null;
//   } catch {
//     data = text;
//   }

//   if (!res.ok) {
//     const message =
//       (data &&
//         (data.message || data.error || data.title || data.error_description)) ||
//       (typeof data === "string" && data) ||
//       `HTTP ${res.status}`;
//     const err = new Error(message);
//     err.status = res.status;
//     err.response = data;
//     console.error("API request failed:", {
//       url,
//       status: res.status,
//       body: data,
//     });
//     throw err;
//   }
//   return data;
// }

// export default { request, requestWithCache, getCached, setCached, clearCache };

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

/**
 * Small localStorage cache helpers
 * - stores { ts: <ms>, ttl: <sec>, data: <any> }
 */
function _cacheKey(key) {
  return `__api_cache__:${key}`;
}
export function getCached(key) {
  try {
    const raw = localStorage.getItem(_cacheKey(key));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const now = Date.now();
    if (parsed.ttl && parsed.ts && now - parsed.ts > parsed.ttl * 1000) {
      localStorage.removeItem(_cacheKey(key));
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}
export function setCached(key, data, ttlSeconds = 60) {
  try {
    localStorage.setItem(
      _cacheKey(key),
      JSON.stringify({ ts: Date.now(), ttl: Number(ttlSeconds || 60), data })
    );
  } catch {}
}
export function clearCache(key) {
  try {
    localStorage.removeItem(_cacheKey(key));
  } catch {}
}

/**
 * requestWithCache(path, options, { ttl = 60, cacheKey })
 * - If cacheKey present and cached entry fresh, returns cached data
 * - Otherwise performs request() and caches result (if ok)
 */
export async function requestWithCache(path, options = {}, opts = {}) {
  const ttl = Number(opts.ttl ?? 60);
  const cacheKey = opts.cacheKey ?? path;
  if (cacheKey) {
    const cached = getCached(cacheKey);
    if (cached != null) return cached;
  }
  const data = await request(path, options);
  if (cacheKey) setCached(cacheKey, data, ttl);
  return data;
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
    const ne = new Error("Network error");
    ne.status = 0;
    throw ne;
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

export default { request, requestWithCache, getCached, setCached, clearCache };
