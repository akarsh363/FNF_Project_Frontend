import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearToken } from "../../Services/AuthService";
import "./Sidebar.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggle = () => setOpen(!open);
  const logout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* hamburger button – fixed left top */}
     <button
  className={`hamburger-btn ${open ? "active" : ""}`}
  onClick={toggle}
  aria-label="Toggle menu"
>
  <span></span>
  <span></span>
  <span></span>
</button>


      {/* overlay */}
      <div
        className={`sidebar-overlay ${open ? "show" : ""}`}
        onClick={toggle}
      />

      {/* side drawer */}
      <aside className={`sidebar-drawer ${open ? "open" : ""}`}>
        <nav>
          <Link to="/feed" onClick={toggle}>Feed</Link>
          <Link to="/post/new" onClick={toggle}>➕ New Post</Link>
          <Link to="/my-posts" onClick={toggle}>My Posts</Link>
          <Link to="/commits" onClick={toggle}>Commits</Link>
          <button onClick={logout} className="logout-btn">Logout</button>
        </nav>
      </aside>
    </>
  );
}
