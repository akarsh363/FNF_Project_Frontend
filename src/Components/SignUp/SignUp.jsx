import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../Services/AuthService";
import "./Signup.css";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [departmentId, setDepartmentId] = useState(""); // NEW state
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register({ fullName, email, password, profileFile, departmentId }); // pass deptId
      navigate("/feed", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {/* New DepartmentId input */}
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
