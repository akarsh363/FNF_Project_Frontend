
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { clearToken, fetchMe } from "../../Services/AuthService";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [me, setMe] = React.useState(null);

  // Read URL params (Feed also uses these)
  const params = new URLSearchParams(location.search);
  const qParam = params.get("q") ?? "";
  const deptParam = params.get("dept") ?? "all";

  const [q, setQ] = React.useState(qParam);
  const [dept, setDept] = React.useState(deptParam || "all");
  const [deptOptions, setDeptOptions] = React.useState(["all"]);

  React.useEffect(() => {
    setQ(qParam);
    setDept(deptParam || "all");
  }, [qParam, deptParam]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const user = await fetchMe();
        if (alive) setMe(user);
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  // Load department names (Feed writes them to localStorage)
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("deptOptions");
      const arr = raw ? JSON.parse(raw) : null;
      if (Array.isArray(arr) && arr.length) {
        setDeptOptions(["all", ...Array.from(new Set(arr)).filter(Boolean)]);
      } else {
        setDeptOptions(["all"]);
      }
    } catch {
      setDeptOptions(["all"]);
    }
  }, []);

  function updateSearch(nextQ, nextDept) {
    const p = new URLSearchParams(location.search);
    if (nextQ) p.set("q", nextQ); else p.delete("q");
    if (nextDept && nextDept !== "all") p.set("dept", nextDept); else p.delete("dept");
    navigate({ pathname: location.pathname, search: p.toString() }, { replace: true });
  }

  // ===== One-row, non-collapsing layout (hamburger + search + dept + actions) =====
  const header = {
    position: "sticky", top: 0, zIndex: 1001, background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,.06)",
  };

  const row = {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    minWidth: 0,
  };

  const hamburgerBtn = {
    width: 32, height: 26,
    display: "inline-flex", flexDirection: "column", justifyContent: "space-between",
    background: "transparent", border: "none", padding: 0, cursor: "pointer",
  };
  const bar = { height: 3, width: "100%", background: "#111827", borderRadius: 3 };

  // Middle toolbar (same row as hamburger)
  const toolbar = {
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: "1fr 220px",
    gap: 10,
    alignItems: "center",
    background: "#ffffffcc",
    border: "1px solid #eef1f5",
    borderRadius: 12,
    padding: "8px 10px",
    backdropFilter: "saturate(1.2) blur(4px)",
    boxShadow: "0 4px 12px rgba(16,24,40,.06)",
  };

  const searchInput = {
    width: "100%",
    border: "1px solid #dbe3ef",
    borderRadius: 10,
    padding: "9px 11px",
    fontSize: 14,
    outline: "none",
  };

  const deptSelect = {
    width: "100%",
    border: "1px solid #dbe3ef",
    borderRadius: 10,
    padding: "9px 11px",
    fontSize: 14,
    background: "#fff",
    outline: "none",
  };

  const right = { display: "flex", alignItems: "center", gap: 10 };
  const btn = {
    padding: "8px 12px", border: "1px solid #d1d5db",
    background: "#fff", borderRadius: 8, fontSize: 14,
    cursor: "pointer", textDecoration: "none", color: "#111827",
  };
  const primary = { background: "#2563eb", color: "#fff", borderColor: "#2563eb" };
  const danger = { background: "#fef2f2", color: "#b91c1c", borderColor: "#fecaca" };

  return (
    <header style={header}>
      <div style={row}>
        {/* LEFT: hamburger */}
        <button style={hamburgerBtn} aria-label="Menu" type="button">
          <span style={bar} /><span style={bar} /><span style={bar} />
        </button>

        {/* MIDDLE: search + department (same line as hamburger) */}
        <div style={toolbar}>
          <input
            type="search"
            style={searchInput}
            placeholder="Search posts (title or text)…"
            value={q}
            onChange={(e) => {
              const v = e.target.value;
              setQ(v);
              updateSearch(v, dept);
            }}
          />
          <select
            style={deptSelect}
            value={dept}
            onChange={(e) => {
              const v = e.target.value;
              setDept(v);
              updateSearch(q, v);
            }}
            title="Filter by department"
          >
            {deptOptions.map((d) => (
              <option key={d} value={d}>
                {d === "all" ? "All Departments" : d}
              </option>
            ))}
          </select>
        </div>

        {/* RIGHT: actions */}
        <nav style={right}>
          <Link to="/feed" style={btn}>Feed</Link>
          <Link to="/post/new" style={{ ...btn, ...primary }}>➕ New Post</Link>
          <Link to="/my-posts" style={btn}>My Posts</Link>
          <Link to="/commits" style={btn}>Commits</Link>
          {me && <span style={{ color: "#374151", fontWeight: 500 }}>
            Hi, {me.fullName ?? me.FullName ?? me.email}
          </span>}
          <button
            onClick={() => { clearToken(); navigate("/login", { replace: true }); }}
            style={{ ...btn, ...danger }}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

