// // // const API_BASE = import.meta.env.VITE_API || "http://localhost:5294";
// // // const TOKEN_KEY = "token";

// // // async function request(path, opts = {}) {
// // //   const url = `${API_BASE}${path}`;
// // //   const headers = opts.headers ? { ...opts.headers } : {};

// // //   const token = localStorage.getItem(TOKEN_KEY);
// // //   if (token && !headers.Authorization) {
// // //     headers.Authorization = `Bearer ${token}`;
// // //   }

// // //   const res = await fetch(url, { ...opts, headers });
// // //   const contentType = res.headers.get("content-type") || "";
// // //   const body = contentType.includes("application/json")
// // //     ? await res.json()
// // //     : await res.text();

// // //   if (!res.ok) {
// // //     const msg =
// // //       (body && (body.error || body.Error || body.message || body.Message)) ||
// // //       (typeof body === "string" ? body : null) ||
// // //       res.statusText;
// // //     throw new Error(msg || "Request failed");
// // //   }
// // //   return body;
// // // }

// // // export default { request, API_BASE };

// // // src/Services/api.js
// // const API_BASE = import.meta.env.VITE_API || "http://localhost:5294";

// // /**
// //  * Generic request wrapper around fetch that:
// //  * - ensures JSON requests have Content-Type set
// //  * - ensures FormData requests DO NOT have Content-Type set (so browser can add boundary)
// //  * - returns parsed JSON (or text) and throws helpful errors for non-2xx responses
// //  */
// // export async function request(path, options = {}) {
// //   const url = path.startsWith("http")
// //     ? path
// //     : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

// //   const opts = { ...(options || {}) };
// //   opts.headers = { ...(opts.headers || {}) };

// //   // If body is FormData, do not set Content-Type (browser will add multipart boundary)
// //   if (opts.body instanceof FormData) {
// //     // Remove Content-Type if present from upstream
// //     if ("Content-Type" in opts.headers) delete opts.headers["Content-Type"];
// //     if ("content-type" in opts.headers) delete opts.headers["content-type"];
// //   } else if (
// //     opts.body &&
// //     typeof opts.body === "object" &&
// //     !(opts.body instanceof String)
// //   ) {
// //     // If it's a plain object (not FormData or already-stringified), ensure JSON header
// //     opts.headers["Content-Type"] =
// //       opts.headers["Content-Type"] || "application/json";
// //     // Convert body to JSON string if not already a string
// //     if (
// //       opts.headers["Content-Type"].includes("application/json") &&
// //       typeof opts.body !== "string"
// //     ) {
// //       try {
// //         opts.body = JSON.stringify(opts.body);
// //       } catch (e) {
// //         // ignore stringify error; will be thrown by fetch
// //       }
// //     }
// //   }

// //   // Credentials: include by default when dealing with same-origin auth; adjust as needed
// //   if (typeof opts.credentials === "undefined") opts.credentials = "include";

// //   const res = await fetch(url, opts);
// //   const text = await res.text();

// //   // Try parse json, otherwise keep text
// //   let data;
// //   try {
// //     data = text ? JSON.parse(text) : null;
// //   } catch (e) {
// //     data = text;
// //   }

// //   if (!res.ok) {
// //     // Build helpful message from common fields
// //     const message =
// //       (data &&
// //         (data.message || data.error || data.title || data.error_description)) ||
// //       (typeof data === "string" && data) ||
// //       `HTTP ${res.status}`;
// //     const err = new Error(message);
// //     err.status = res.status;
// //     err.response = data;
// //     throw err;
// //   }

// //   return data;
// // }

// // export default { request };
// // src/Services/api.js
// const API_BASE = import.meta.env.VITE_API || "http://localhost:5294";

// /**
//  * Generic request wrapper around fetch that:
//  * - ensures JSON requests have Content-Type set
//  * - ensures FormData requests DO NOT have Content-Type set (so browser can add boundary)
//  * - returns parsed JSON (or text) and throws clear errors for non-2xx responses
//  */
// export async function request(path, options = {}) {
//   const url = path.startsWith("http")
//     ? path
//     : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

//   const opts = { ...(options || {}) };
//   opts.headers = { ...(opts.headers || {}) };

//   // If body is FormData, do not set Content-Type (browser will add multipart boundary)
//   if (opts.body instanceof FormData) {
//     if ("Content-Type" in opts.headers) delete opts.headers["Content-Type"];
//     if ("content-type" in opts.headers) delete opts.headers["content-type"];
//   } else if (
//     opts.body &&
//     typeof opts.body === "object" &&
//     !(opts.body instanceof String)
//   ) {
//     // Ensure JSON header for plain objects
//     opts.headers["Content-Type"] =
//       opts.headers["Content-Type"] || "application/json";
//     if (
//       opts.headers["Content-Type"].includes("application/json") &&
//       typeof opts.body !== "string"
//     ) {
//       try {
//         opts.body = JSON.stringify(opts.body);
//       } catch (e) {
//         // ignore stringify error; fetch will throw if it's invalid
//       }
//     }
//   }

//   if (typeof opts.credentials === "undefined") opts.credentials = "include";

//   const res = await fetch(url, opts);
//   const text = await res.text();

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
//     throw err;
//   }

//   return data;
// }

// export default { request };
// src/Services/api.js
const API_BASE = (import.meta.env.VITE_API || "http://localhost:5294").replace(
  /\/+$/,
  ""
);

/**
 * Generic request wrapper around fetch:
 *  - auto-attaches Authorization from localStorage (key "token")
 *  - sets Content-Type for JSON bodies (but not for FormData)
 *  - parses JSON or text and throws helpful errors for non-2xx
 */
export async function request(path, options = {}) {
  const url = path.startsWith("http")
    ? path
    : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  const opts = { ...(options || {}) };
  opts.headers = { ...(opts.headers || {}) };

  // Auto attach token from localStorage (so fetchMe() and others work)
  try {
    const token = localStorage.getItem("token");
    if (token && !opts.headers.Authorization && !opts.headers.authorization) {
      opts.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore localStorage read errors
  }

  // If body is FormData, don't set Content-Type (browser will set boundary)
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
        // let fetch throw
      }
    }
  }

  // default credentials behaviour (change to 'include' if your server uses cookies)
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

export default { request };
