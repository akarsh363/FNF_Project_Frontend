// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { login } from "../../Services/AuthService";
// import "./Login.css";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [busy, setBusy] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setBusy(true);
//     try {
//       await login({ email, password });
//       navigate("/feed", { replace: true });
//     } catch (err) {
//       setError(err.message || "Login failed");
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <div className="auth-page login-page">
//       <form className="auth-form" onSubmit={handleSubmit}>
//         <h2>Login</h2>
//         {error && <div className="auth-error">{error}</div>}

//         <label className="field">
//           <div className="label-text">Email</div>
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         </label>

//         <label className="field">
//           <div className="label-text">Password</div>
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         </label>

//         <button type="submit" className="primary" disabled={busy}>
//           {busy ? "Logging in..." : "Login"}
//         </button>

//         <p className="auth-alt">
//           Don’t have an account? <Link to="/signup">Sign up</Link>
//         </p>
//       </form>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, fetchMe } from "../../Services/AuthService";
import "./Login.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5294";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function fetchPostsRaw() {
    const token =
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      null;
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/api/Posts`, {
      method: "GET",
      headers,
    });
    if (!res.ok) {
      // return empty array on failure; Feed will handle gracefully
      return [];
    }
    const data = await res.json();
    // return raw response (Feed will normalize if needed)
    return data;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      // 1) login and save token
      await login({ email, password });

      // 2) in parallel fetch me + raw posts (call will use saved token)
      const [me, postsRaw] = await Promise.all([
        fetchMe().catch(() => null),
        fetchPostsRaw().catch(() => []),
      ]);

      // If auth failed / me not returned, keep existing behavior: navigate to login
      if (!me) {
        setError("Login succeeded but failed to fetch user info.");
        // still navigate to feed (optional) — here we'll not navigate
        setBusy(false);
        return;
      }

      // 3) navigate to feed and pass preloaded data via location.state
      navigate("/feed", {
        replace: true,
        state: {
          preloadedUser: me,
          preloadedPostsRaw: postsRaw, // raw form; Feed will normalize it
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      setError((err && err.message) || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page login-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="auth-error">{error}</div>}

        <label className="field">
          <div className="label-text">Email</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <div className="label-text">Password</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="primary" disabled={busy}>
          {busy ? "Logging in..." : "Login"}
        </button>

        <p className="auth-alt">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
}
