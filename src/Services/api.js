// const API_BASE = (import.meta.env.VITE_API || "http://localhost:5294").replace(
//   /\/+$/,
//   ""
// );

// /**
//  * Generic request wrapper around fetch:
//  *  - auto-attaches Authorization from localStorage (key "token")
//  *  - sets Content-Type for JSON bodies (but not for FormData)
//  *  - parses JSON or text and throws helpful errors for non-2xx
//  */
// export async function request(path, options = {}) {
//   const url = path.startsWith("http")
//     ? path
//     : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

//   const opts = { ...(options || {}) };
//   opts.headers = { ...(opts.headers || {}) };

//   // Auto attach token from localStorage (so fetchMe() and others work)
//   try {
//     const token = localStorage.getItem("token");
//     if (token && !opts.headers.Authorization && !opts.headers.authorization) {
//       opts.headers.Authorization = `Bearer ${token}`;
//     }
//   } catch (e) {
//     // ignore localStorage read errors
//   }

//   // If body is FormData, don't set Content-Type (browser will set boundary)
//   if (opts.body instanceof FormData) {
//     if ("Content-Type" in opts.headers) delete opts.headers["Content-Type"];
//     if ("content-type" in opts.headers) delete opts.headers["content-type"];
//   } else if (
//     opts.body &&
//     typeof opts.body === "object" &&
//     !(opts.body instanceof String)
//   ) {
//     // Plain object -> JSON
//     opts.headers["Content-Type"] =
//       opts.headers["Content-Type"] || "application/json";
//     if (
//       opts.headers["Content-Type"].includes("application/json") &&
//       typeof opts.body !== "string"
//     ) {
//       try {
//         opts.body = JSON.stringify(opts.body);
//       } catch (e) {
//         // let fetch throw
//       }
//     }
//   }

//   // default credentials behaviour (change to 'include' if your server uses cookies)
//   if (typeof opts.credentials === "undefined") opts.credentials = "include";

//   let res;
//   try {
//     res = await fetch(url, opts);
//   } catch (networkErr) {
//     console.error("Network error calling", url, networkErr);
//     const err = new Error("Network error");
//     err.original = networkErr;
//     throw err;
//   }

//   const text = await res.text().catch(() => "");
//   let data;
//   try {
//     data = text ? JSON.parse(text) : null;
//   } catch (e) {
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

// export default { request };

// src/Services/api.js
// Generic request wrapper around fetch.
// Exports both a named `request` and a default object { request } for compatibility.

const API_BASE = (import.meta.env.VITE_API || "http://localhost:5294").replace(
  /\/+$/,
  ""
);

function _buildUrl(path) {
  if (!path) return API_BASE;
  return path.startsWith("http")
    ? path
    : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

function _readTokenFromStorage() {
  // Primary key is "token" (AuthService uses it). Also try common alternatives if older code used them.
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

export async function request(path, options = {}) {
  const url = _buildUrl(path);

  const opts = { ...(options || {}) };
  opts.headers = { ...(opts.headers || {}) };

  // Auto attach token from localStorage (robust)
  const token = _readTokenFromStorage();
  if (token && !opts.headers.Authorization && !opts.headers.authorization) {
    opts.headers.Authorization = `Bearer ${token}`;
  }

  // If body is FormData, don't set Content-Type (browser sets boundary)
  if (opts.body instanceof FormData) {
    if ("Content-Type" in opts.headers) delete opts.headers["Content-Type"];
    if ("content-type" in opts.headers) delete opts.headers["content-type"];
  } else if (
    opts.body &&
    typeof opts.body === "object" &&
    !(opts.body instanceof String)
  ) {
    // Plain object -> JSON
    opts.headers["Content-Type"] =
      opts.headers["Content-Type"] || "application/json";
    if (
      opts.headers["Content-Type"].includes("application/json") &&
      typeof opts.body !== "string"
    ) {
      try {
        opts.body = JSON.stringify(opts.body);
      } catch (e) {
        // let fetch throw if serialization fails
      }
    }
  }

  // default credentials behaviour (change to 'include' if server needs cookies)
  if (typeof opts.credentials === "undefined") opts.credentials = "include";

  let res;
  try {
    res = await fetch(url, opts);
  } catch (networkErr) {
    console.error("Network error calling", url, networkErr);
    const err = new Error("Network error");
    err.original = networkErr;
    throw err;
  }

  const text = await res.text().catch(() => "");
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
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

// default export for legacy/other imports
export default { request };
