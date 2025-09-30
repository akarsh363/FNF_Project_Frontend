// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { clearToken, fetchMe } from "../../Services/AuthService";
// import "./Sidebar.css";

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL ||
//   import.meta.env.VITE_API ||
//   (typeof window !== "undefined" ? `${window.location.origin}` : "http://localhost:5294");

// export default function Sidebar() {
//   const [open, setOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const [imageSrc, setImageSrc] = useState("/default-avatar.png");
//   const navigate = useNavigate();

//   const toggle = () => setOpen(!open);
//   const logout = () => {
//     clearToken();
//     navigate("/login", { replace: true });
//   };

//   // Fetch current user on mount
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const me = await fetchMe();
//         if (!mounted) return;
//         setUser(me);

//         // compute immediately so avatar shows ASAP
//         const candidate = computeProfileUrl(me);
//         setImageSrc(resolveCandidateToSrc(candidate));
//       } catch (err) {
//         // keep default avatar if fetch fails
//         console.error("Failed to fetch user details", err);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // When user object changes update src only if really different
//   useEffect(() => {
//     const candidate = computeProfileUrl(user);
//     const resolved = resolveCandidateToSrc(candidate);
//     setImageSrc((prev) => (prev !== resolved ? resolved : prev));
//   }, [user]);

//   // Heuristic: find the profile-picture-ish field from user object
//   function computeProfileUrl(u) {
//     if (!u) return null;

//     // common field names
//     const candidates = [
//       u.profilePictureUrl,
//       u.ProfilePictureUrl,
//       u.profilePicture,
//       u.ProfilePicture,
//       u.profileFileName,
//       u.ProfileFileName,
//       u.avatar,
//       u.Avatar,
//       u.picture,
//       u.Picture,
//       u.image,
//       u.Image,
//     ];

//     for (const c of candidates) {
//       if (c === undefined || c === null) continue;
//       const trimmed = String(c).trim();
//       if (trimmed) return trimmed;
//     }

//     return null;
//   }

//   // Turn a candidate into a usable <img src>:
//   // - if absolute (http(s) or data:) -> return as-is
//   // - if startsWith('/') -> treat as root-relative and return as-is
//   // - otherwise, try several prefixes (API_BASE/uploads/<file>, API_BASE/<file>)
//   function resolveCandidateToSrc(candidate) {
//     if (!candidate) return "/default-avatar.png";

//     const s = String(candidate);

//     // already absolute or data-uri
//     if (/^data:|^https?:\/\//i.test(s)) return s;

//     // root-relative path
//     if (s.startsWith("/")) return s;

//     // likely a bare filename or relative path — try reasonable server prefixes
//     // order: API_BASE/uploads/<file>  then API_BASE/<file>
//     // This preserves compatibility with many backend upload schemes.
//     return `${API_BASE.replace(/\/+$/, "")}/uploads/${s}`;
//   }

//   // Safe onError: clear handler and set default image (no loop)
//   const handleImgError = (e) => {
//     e.currentTarget.onerror = null;
//     // If current src already tried /uploads/<name>, try fallback next: API_BASE/<name>
//     const cur = e.currentTarget.src || "";
//     try {
//       // If cur ends with /uploads/<file>, try API_BASE/<file>
//       const uploadsPattern = /\/uploads\/(.+?)$/;
//       const m = cur.match(uploadsPattern);
//       if (m && m[1]) {
//         const fallback = `${API_BASE.replace(/\/+$/, "")}/${m[1]}`;
//         if (fallback !== cur) {
//           // set fallback and return (allow one more load attempt)
//           e.currentTarget.src = fallback;
//           return;
//         }
//       }
//     } catch (err) {
//       // ignore
//     }

//     // final fallback: default avatar
//     if (imageSrc !== "/default-avatar.png") setImageSrc("/default-avatar.png");
//   };

//   const displayName = user?.fullName ?? user?.FullName ?? "(No name)";
//   const displayEmail = user?.email ?? user?.Email ?? "";
//   const displayRole = user?.role ?? user?.Role ?? "User";
//   const displayDept = user?.departmentId ?? user?.DepartmentId ?? "N/A";

//   return (
//     <>
//       {/* hamburger button – fixed left top */}
//       <button
//         className={`hamburger-btn ${open ? "active" : ""}`}
//         onClick={toggle}
//         aria-label="Toggle menu"
//       >
//         <span></span>
//         <span></span>
//         <span></span>
//       </button>

//       {/* overlay */}
//       <div
//         className={`sidebar-overlay ${open ? "show" : ""}`}
//         onClick={toggle}
//       />

//       {/* side drawer */}
//       <aside className={`sidebar-drawer ${open ? "open" : ""}`}>
//         {/* User info section */}
//         <div className="sidebar-user" role="region" aria-label="User info">
//           <img
//             src={imageSrc}
//             alt={`${displayName}'s avatar`}
//             className="sidebar-user__avatar"
//             onError={handleImgError}
//           />
//           <div className="sidebar-user__info">
//             <div className="sidebar-user__name">{displayName}</div>
//             <div className="sidebar-user__email">{displayEmail}</div>
//             <div className="sidebar-user__meta">
//               <span className="role">{displayRole}</span>
//               <span className="sep"> | </span>
//               <span className="dept">Dept: {displayDept}</span>
//             </div>
//           </div>
//         </div>

//         <nav>
//           <Link to="/feed" onClick={toggle}>Feed</Link>
//           <Link to="/post/new" onClick={toggle}>➕ New Post</Link>
//           <Link to="/my-posts" onClick={toggle}>My Posts</Link>
//           <Link to="/commits" onClick={toggle}>Commits</Link>
//           <button onClick={logout} className="logout-btn">Logout</button>
//         </nav>
//       </aside>
//     </>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearToken, fetchMe } from "../../Services/AuthService";
import "./Sidebar.css";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API ||
  (typeof window !== "undefined" ? `${window.location.origin}` : "http://localhost:5294");

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [imageSrc, setImageSrc] = useState("/default-avatar.png");
  const navigate = useNavigate();

  // track whether we've attempted fallback(s) to prevent infinite loop / blinking
  const triedFallbackRef = useRef({ triedUploads: false, triedRoot: false, triedAbsolute: false });

  const toggle = () => setOpen(!open);
  const logout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  // compute a candidate profile URL from server response
  function computeProfileCandidate(u) {
    if (!u) return null;

    // prefer backend-provided fully qualified URL
    if (u.ProfilePictureUrl) return u.ProfilePictureUrl;
    if (u.profilePictureUrl) return u.profilePictureUrl;

    // raw stored path/filename from DB
    const raw = u.ProfilePicture ?? u.profilePicture ?? u.ProfileFileName ?? u.profileFileName ?? null;
    if (!raw) return null;
    const s = String(raw).trim();
    if (!s) return null;
    return s;
  }

  // resolve candidate -> actual src to set on img
  function resolveToSrc(candidate) {
    if (!candidate) return "/default-avatar.png";
    const s = String(candidate);

    // already absolute or data uri
    if (/^data:|^https?:\/\//i.test(s)) return s;

    // root-relative path (starts with '/')
    if (s.startsWith("/")) return s;

    // bare filename: try /profiles/<file> first (matches your wwwroot/profiles layout)
    return `${API_BASE.replace(/\/+$/, "")}/profiles/${s}`;
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await fetchMe();
        if (!mounted) return;
        setUser(me);

        // set initial image with computed candidate
        const cand = computeProfileCandidate(me);
        const src = resolveToSrc(cand);
        setImageSrc(src || "/default-avatar.png");

        // reset tried flags whenever user changes (fresh user => new attempts allowed)
        triedFallbackRef.current = { triedUploads: false, triedRoot: false, triedAbsolute: false };
      } catch (err) {
        console.error("Failed to fetch user details", err);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If user object later changes, update image once if needed
  useEffect(() => {
    const cand = computeProfileCandidate(user);
    const resolved = resolveToSrc(cand);
    setImageSrc((prev) => (prev !== resolved ? resolved : prev));
    // reset tried flags as above
    triedFallbackRef.current = { triedUploads: false, triedRoot: false, triedAbsolute: false };
  }, [user]);

  // onError handler that attempts one reasonable fallback, then sets default avatar.
  const handleImgError = (e) => {
    // prevent infinite error loop: clear handler first
    e.currentTarget.onerror = null;

    const cur = e.currentTarget.src || "";
    const apiBase = API_BASE.replace(/\/+$/, "");

    // If currently pointing at /profiles/<file>, try API_BASE/<file> next (some setups store in root)
    const uploadsMatch = cur.match(/\/profiles\/(.+?)$/i);
    if (uploadsMatch && uploadsMatch[1] && !triedFallbackRef.current.triedRoot) {
      triedFallbackRef.current.triedRoot = true;
      const fallback = `${apiBase}/${uploadsMatch[1]}`;
      if (fallback !== cur) {
        e.currentTarget.src = fallback;
        // reattach handler for one more attempt
        e.currentTarget.onerror = handleImgError;
        return;
      }
    }

    // If current was an absolute URL to /profiles or other, try stripping to /uploads/<file> once
    const uploads2Match = cur.match(/\/([^/]+?\.(?:png|jpe?g|gif|webp|bmp|svg))$/i);
    if (uploads2Match && uploads2Match[1] && !triedFallbackRef.current.triedUploads) {
      triedFallbackRef.current.triedUploads = true;
      const fallback = `${apiBase}/uploads/${uploads2Match[1]}`;
      if (fallback !== cur) {
        e.currentTarget.src = fallback;
        e.currentTarget.onerror = handleImgError;
        return;
      }
    }

    // Final fallback: default avatar
    if (imageSrc !== "/default-avatar.png") {
      setImageSrc("/default-avatar.png");
    } else {
      // set element src directly as a last resort
      e.currentTarget.src = "/default-avatar.png";
    }
  };

  const displayName = user?.fullName ?? user?.FullName ?? "(No name)";
  const displayEmail = user?.email ?? user?.Email ?? "";
  const displayRole = user?.role ?? user?.Role ?? "User";
  const displayDept = user?.departmentId ?? user?.DepartmentId ?? "N/A";

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
        {/* User info section */}
        <div className="sidebar-user" role="region" aria-label="User info">
          <img
            src={imageSrc}
            alt={`${displayName}'s avatar`}
            className="sidebar-user__avatar"
            onError={handleImgError}
          />
          <div className="sidebar-user__info">
            <div className="sidebar-user__name">{displayName}</div>
            <div className="sidebar-user__email">{displayEmail}</div>
            <div className="sidebar-user__meta">
              <span className="role">{displayRole}</span>
              <span className="sep"> | </span>
              <span className="dept">Dept: {displayDept}</span>
            </div>
          </div>
        </div>

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
