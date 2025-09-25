// import api from "./api";
// const TOKEN_KEY = "token";

// export function saveToken(token) {
//   localStorage.setItem(TOKEN_KEY, token);
// }
// export function getToken() {
//   return localStorage.getItem(TOKEN_KEY);
// }
// export function clearToken() {
//   localStorage.removeItem(TOKEN_KEY);
// }

// export async function login({ email, password }) {
//   const body = await api.request("/api/Auth/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });
//   const token = body?.Token || body?.token || body;
//   if (!token) throw new Error("No token returned from server");
//   saveToken(token);
//   return token;
// }

// export async function register({
//   fullName,
//   email,
//   password,
//   departmentId,
//   profileFile,
// }) {
//   const form = new FormData();
//   form.append("FullName", fullName);
//   form.append("Email", email);
//   form.append("Password", password);

//   // Force Role = Employee (backend also enforces, but we send it explicitly)
//   form.append("Role", "Employee");

//   if (
//     departmentId !== undefined &&
//     departmentId !== null &&
//     departmentId !== ""
//   ) {
//     form.append("DepartmentId", String(departmentId));
//   }

//   if (profileFile) {
//     form.append("ProfilePicture", profileFile, profileFile.name);
//   }

//   const body = await api.request("/api/Auth/register", {
//     method: "POST",
//     body: form,
//   });

//   const token = body?.Token || body?.token || body;
//   if (!token) throw new Error("No token returned from server");
//   saveToken(token);
//   return token;
// }

// export async function fetchMe() {
//   return api.request("/api/Auth/me", { method: "GET" });
// }

// src/Services/AuthService.js
import api from "./api";

const TOKEN_KEY = "token";

export function saveToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.warn("Failed to save token to localStorage", e);
  }
}
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}
export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    // ignore
  }
}

export async function login({ email, password }) {
  const body = await api.request("/api/Auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  // backend might return { Token: "..."} or the token string directly
  const token = body?.Token || body?.token || body;
  if (!token) throw new Error("No token returned from server");
  saveToken(token);
  return token;
}

export async function register({
  fullName,
  email,
  password,
  departmentId,
  profileFile,
}) {
  const form = new FormData();
  form.append("FullName", fullName);
  form.append("Email", email);
  form.append("Password", password);
  form.append("Role", "Employee"); // default to Employee

  if (
    departmentId !== undefined &&
    departmentId !== null &&
    departmentId !== ""
  ) {
    form.append("DepartmentId", String(departmentId));
  }

  if (profileFile) {
    form.append("ProfilePicture", profileFile, profileFile.name);
  }

  const body = await api.request("/api/Auth/register", {
    method: "POST",
    body: form,
  });

  const token = body?.Token || body?.token || body;
  if (!token) throw new Error("No token returned from server");
  saveToken(token);
  return token;
}

export async function fetchMe() {
  return api.request("/api/Auth/me", { method: "GET" });
}

export default {
  saveToken,
  getToken,
  clearToken,
  login,
  register,
  fetchMe,
};
