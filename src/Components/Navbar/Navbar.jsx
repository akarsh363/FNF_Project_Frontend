// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { clearToken, fetchMe } from "../../Services/AuthService";
// import "./Navbar.css"; // optional styles

// export default function Navbar() {
//   const [me, setMe] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     fetchMe().then(setMe).catch(() => {});
//   }, [location.pathname]);

//   const logout = () => {
//     clearToken();
//     navigate("/login", { replace: true });
//   };

//   const dp = me?.profilePicture || me?.ProfilePicture || "";

//   return (
//     <header className="feed-header">
//       <div className="brand">FNF Feed</div>
//       <nav className="user-actions">
//         <Link to="/feed" className="btn">Feed</Link>
//         <Link to="/post/new" className="btn">➕ New Post</Link>
//         <Link to="/my-posts" className="btn">My Posts</Link>
//         <Link to="/commits" className="btn">Commits</Link>
//         <span className="user-name">
//           {dp ? <img src={dp} alt="dp" className="user-dp" /> : "👤"}{" "}
//           {me?.fullName || me?.FullName || me?.email || ""}
//         </span>
//         <button onClick={logout} className="btn-logout">Logout</button>
//       </nav>
//     </header>
//   );
// }

import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { clearToken, fetchMe } from "../../Services/AuthService";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [me, setMe] = React.useState(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try { const user = await fetchMe(); if (alive) setMe(user); }
      catch { /* ignored; ProtectedRoute will handle auth */ }
    })();
    return () => { alive = false; };
  }, [location.pathname]);

  return (
    <header className="feed-header" style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div className="brand" style={{ fontWeight: 700 }}>FNF Feed</div>
      <nav style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Link to="/feed" className="btn">Feed</Link>
        <Link to="/post/new" className="btn-newpost">➕ New Post</Link>
        <Link to="/my-posts" className="btn">My Posts</Link>
        <Link to="/commits" className="btn">Commits</Link>
        {me && <span className="user-name">Hi, {me.fullName ?? me.FullName ?? me.email}</span>}
        <button
          onClick={() => { clearToken(); navigate("/login", { replace: true }); }}
          className="btn-logout"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
