
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
