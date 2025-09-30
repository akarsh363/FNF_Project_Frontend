// src/Components/Auth/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../Services/AuthService";
import "./Signup.css";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [departmentId, setDepartmentId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Password validation rules (same as you had)
  function validatePassword(pw) {
    if (!pw) return { ok: false, message: "Password is required." };
    if (pw.length < 8) return { ok: false, message: "Password must be at least 8 characters long." };
    if (!/[A-Za-z]/.test(pw)) return { ok: false, message: "Password must contain at least one letter." };
    if (!/\d/.test(pw)) return { ok: false, message: "Password must contain at least one number." };
    if (!/[^A-Za-z\d]/.test(pw)) return { ok: false, message: "Password must contain at least one special character." };
    return { ok: true, message: "" };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const pwCheck = validatePassword(password);
    if (!pwCheck.ok) {
      setError(pwCheck.message);
      return;
    }

    setBusy(true);
    try {
      // Register but DO NOT auto-login (AuthService.register no longer saves token)
      await register({ fullName, email, password, profileFile, departmentId });

      // Redirect to login page — user must explicitly login after registering
      // (we can pass a query flag so Login can show a friendly banner if you want)
      navigate("/login?registered=1", { replace: true });
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page signup-page">
      <form className="auth-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Create account</h2>

        {error && <div className="auth-error">{error}</div>}

        <label className="field">
          <div className="label-text">Full name</div>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>

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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-describedby="password-requirements"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="small-btn"
              style={{ cursor: "pointer" }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div id="password-requirements" className="password-hint" style={{ marginTop: "6px", fontSize: "0.9rem" }}>
            <div>Password must have:</div>
            <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
              <li>Minimum 8 characters</li>
              <li>At least 1 letter (a–z or A–Z)</li>
              <li>At least 1 number (0–9)</li>
              <li>At least 1 special character (e.g. !@#$%^&*)</li>
            </ul>
          </div>
        </label>

        <label className="field">
          <div className="label-text">Department ID</div>
          <input
            type="number"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            required
          />
        </label>

        <label className="field file-field">
          <div className="label-text">Profile picture (optional)</div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileFile(e.target.files?.[0] || null)}
          />
        </label>

        <button type="submit" className="primary" disabled={busy}>
          {busy ? "Creating..." : "Sign up"}
        </button>

        <p className="auth-alt">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
