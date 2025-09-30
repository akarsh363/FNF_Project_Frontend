// // // // // // // import React, { useEffect, useState } from "react";
// // // // // // // import { Link, useNavigate, useLocation } from "react-router-dom";
// // // // // // // import { clearToken, fetchMe } from "../../Services/AuthService";
// // // // // // // import "./Navbar.css"; // optional styles

// // // // // // // export default function Navbar() {
// // // // // // //   const [me, setMe] = useState(null);
// // // // // // //   const navigate = useNavigate();
// // // // // // //   const location = useLocation();

// // // // // // //   useEffect(() => {
// // // // // // //     fetchMe().then(setMe).catch(() => {});
// // // // // // //   }, [location.pathname]);

// // // // // // //   const logout = () => {
// // // // // // //     clearToken();
// // // // // // //     navigate("/login", { replace: true });
// // // // // // //   };

// // // // // // //   const dp = me?.profilePicture || me?.ProfilePicture || "";

// // // // // // //   return (
// // // // // // //     <header className="feed-header">
// // // // // // //       <div className="brand">FNF Feed</div>
// // // // // // //       <nav className="user-actions">
// // // // // // //         <Link to="/feed" className="btn">Feed</Link>
// // // // // // //         <Link to="/post/new" className="btn">➕ New Post</Link>
// // // // // // //         <Link to="/my-posts" className="btn">My Posts</Link>
// // // // // // //         <Link to="/commits" className="btn">Commits</Link>
// // // // // // //         <span className="user-name">
// // // // // // //           {dp ? <img src={dp} alt="dp" className="user-dp" /> : "👤"}{" "}
// // // // // // //           {me?.fullName || me?.FullName || me?.email || ""}
// // // // // // //         </span>
// // // // // // //         <button onClick={logout} className="btn-logout">Logout</button>
// // // // // // //       </nav>
// // // // // // //     </header>
// // // // // // //   );
// // // // // // // }

// // // // // // import React from "react";
// // // // // // import { Link, useNavigate, useLocation } from "react-router-dom";
// // // // // // import { clearToken, fetchMe } from "../../Services/AuthService";

// // // // // // export default function Navbar() {
// // // // // //   const navigate = useNavigate();
// // // // // //   const location = useLocation();
// // // // // //   const [me, setMe] = React.useState(null);

// // // // // //   React.useEffect(() => {
// // // // // //     let alive = true;
// // // // // //     (async () => {
// // // // // //       try { const user = await fetchMe(); if (alive) setMe(user); }
// // // // // //       catch { /* ignored; ProtectedRoute will handle auth */ }
// // // // // //     })();
// // // // // //     return () => { alive = false; };
// // // // // //   }, [location.pathname]);

// // // // // //   return (
// // // // // //     <header className="feed-header" style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
// // // // // //       <div className="brand" style={{ fontWeight: 700 }}>FNF Feed</div>
// // // // // //       <nav style={{ display: "flex", gap: 8, alignItems: "center" }}>
// // // // // //         <Link to="/feed" className="btn">Feed</Link>
// // // // // //         <Link to="/post/new" className="btn-newpost">➕ New Post</Link>
// // // // // //         <Link to="/my-posts" className="btn">My Posts</Link>
// // // // // //         <Link to="/commits" className="btn">Commits</Link>
// // // // // //         {me && <span className="user-name">Hi, {me.fullName ?? me.FullName ?? me.email}</span>}
// // // // // //         <button
// // // // // //           onClick={() => { clearToken(); navigate("/login", { replace: true }); }}
// // // // // //           className="btn-logout"
// // // // // //         >
// // // // // //           Logout
// // // // // //         </button>
// // // // // //       </nav>
// // // // // //     </header>
// // // // // //   );
// // // // // // }

// // // // // // import React, { useEffect, useState } from "react";
// // // // // // import { Link, useNavigate, useLocation } from "react-router-dom";
// // // // // // import { clearToken, fetchMe } from "../../Services/AuthService";
// // // // // // import "./Navbar.css"; // optional styles

// // // // // // export default function Navbar() {
// // // // // //   const [me, setMe] = useState(null);
// // // // // //   const navigate = useNavigate();
// // // // // //   const location = useLocation();

// // // // // //   useEffect(() => {
// // // // // //     fetchMe().then(setMe).catch(() => {});
// // // // // //   }, [location.pathname]);

// // // // // //   const logout = () => {
// // // // // //     clearToken();
// // // // // //     navigate("/login", { replace: true });
// // // // // //   };

// // // // // //   const dp = me?.profilePicture || me?.ProfilePicture || "";

// // // // // //   return (
// // // // // //     <header className="feed-header">
// // // // // //       <div className="brand">FNF Feed</div>
// // // // // //       <nav className="user-actions">
// // // // // //         <Link to="/feed" className="btn">Feed</Link>
// // // // // //         <Link to="/post/new" className="btn">➕ New Post</Link>
// // // // // //         <Link to="/my-posts" className="btn">My Posts</Link>
// // // // // //         <Link to="/commits" className="btn">Commits</Link>
// // // // // //         <span className="user-name">
// // // // // //           {dp ? <img src={dp} alt="dp" className="user-dp" /> : "👤"}{" "}
// // // // // //           {me?.fullName || me?.FullName || me?.email || ""}
// // // // // //         </span>
// // // // // //         <button onClick={logout} className="btn-logout">Logout</button>
// // // // // //       </nav>
// // // // // //     </header>
// // // // // //   );
// // // // // // }

// // // // // import React from "react";
// // // // // import { Link, useNavigate, useLocation } from "react-router-dom";
// // // // // import { clearToken, fetchMe } from "../../Services/AuthService";

// // // // // export default function Navbar() {
// // // // //   const navigate = useNavigate();
// // // // //   const location = useLocation();
// // // // //   const [me, setMe] = React.useState(null);

// // // // //   React.useEffect(() => {
// // // // //     let alive = true;
// // // // //     (async () => {
// // // // //       try { const user = await fetchMe(); if (alive) setMe(user); }
// // // // //       catch { /* ignored; ProtectedRoute will handle auth */ }
// // // // //     })();
// // // // //     return () => { alive = false; };
// // // // //   }, [location.pathname]);

// // // // //   return (
// // // // //     <header className="feed-header" style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
// // // // //       <div className="brand" style={{ fontWeight: 700 }}>FNF Feed</div>
// // // // //       <nav style={{ display: "flex", gap: 8, alignItems: "center" }}>
// // // // //         <Link to="/feed" className="btn">Feed</Link>
// // // // //         <Link to="/post/new" className="btn-newpost">➕ New Post</Link>
// // // // //         <Link to="/my-posts" className="btn">My Posts</Link>
// // // // //         <Link to="/commits" className="btn">Commits</Link>
// // // // //         {me && <span className="user-name">Hi, {me.fullName ?? me.FullName ?? me.email}</span>}
// // // // //         <button
// // // // //           onClick={() => { clearToken(); navigate("/login", { replace: true }); }}
// // // // //           className="btn-logout"
// // // // //         >
// // // // //           Logout
// // // // //         </button>
// // // // //       </nav>
// // // // //     </header>
// // // // //   );
// // // // // }

// // // // import React from "react";
// // // // import { Link, useNavigate, useLocation } from "react-router-dom";
// // // // import { clearToken, fetchMe } from "../../Services/AuthService";
// // // // import "./Navbar.css";

// // // // export default function Navbar() {
// // // //   const navigate = useNavigate();
// // // //   const location = useLocation();

// // // //   const [me, setMe] = React.useState(null);

// // // //   // read URL params -> controls
// // // //   const params = new URLSearchParams(location.search);
// // // //   const qParam = params.get("q") ?? "";
// // // //   const deptParam = params.get("dept") ?? "all";

// // // //   const [q, setQ] = React.useState(qParam);
// // // //   const [dept, setDept] = React.useState(deptParam || "all");
// // // //   const [deptOptions, setDeptOptions] = React.useState(["all"]);

// // // //   // keep local state in sync if URL changes elsewhere
// // // //   React.useEffect(() => {
// // // //     setQ(qParam);
// // // //     setDept(deptParam || "all");
// // // //   }, [qParam, deptParam]);

// // // //   // fetch current user (for greeting)
// // // //   React.useEffect(() => {
// // // //     let alive = true;
// // // //     (async () => {
// // // //       try {
// // // //         const user = await fetchMe();
// // // //         if (alive) setMe(user);
// // // //       } catch {}
// // // //     })();
// // // //     return () => {
// // // //       alive = false;
// // // //     };
// // // //   }, []);

// // // //   // load dept list from localStorage (Feed should write it as ["all", ...])
// // // //   const loadDepts = React.useCallback(() => {
// // // //     try {
// // // //       const raw = localStorage.getItem("deptOptions");
// // // //       const arr = raw ? JSON.parse(raw) : null;
// // // //       if (Array.isArray(arr) && arr.length) {
// // // //         // ensure "all" first and unique
// // // //         const uniq = Array.from(new Set(arr)).filter(Boolean);
// // // //         setDeptOptions(["all", ...uniq]);
// // // //       } else {
// // // //         setDeptOptions(["all"]);
// // // //       }
// // // //     } catch {
// // // //       setDeptOptions(["all"]);
// // // //     }
// // // //   }, []);

// // // //   React.useEffect(() => {
// // // //     loadDepts();
// // // //     const onStorage = (e) => {
// // // //       if (e.key === "deptOptions") loadDepts();
// // // //     };
// // // //     window.addEventListener("storage", onStorage);
// // // //     return () => window.removeEventListener("storage", onStorage);
// // // //   }, [loadDepts]);

// // // //   // write params back to URL so Feed filters based on q & dept
// // // //   function updateSearch(nextQ, nextDept) {
// // // //     const p = new URLSearchParams(location.search);
// // // //     if (nextQ) p.set("q", nextQ);
// // // //     else p.delete("q");

// // // //     if (nextDept && nextDept !== "all") p.set("dept", nextDept);
// // // //     else p.delete("dept");

// // // //     navigate(
// // // //       { pathname: location.pathname, search: p.toString() },
// // // //       { replace: true }
// // // //     );
// // // //   }

// // // //   return (
// // // //     <header className="nav-header">
// // // //       {/* Left: hamburger + toolbar (search + dept) on the SAME row */}
// // // //       <div className="nav-left">
// // // //         <button className="hamburger" aria-label="Menu" type="button">
// // // //           <span></span>
// // // //           <span></span>
// // // //           <span></span>
// // // //         </button>

// // // //         <div className="nav-toolbar">
// // // //           <input
// // // //             className="nav-search"
// // // //             type="search"
// // // //             placeholder="Search posts (title or text)…"
// // // //             value={q}
// // // //             onChange={(e) => {
// // // //               const v = e.target.value;
// // // //               setQ(v);
// // // //               updateSearch(v, dept);
// // // //             }}
// // // //           />
// // // //           <select
// // // //             className="nav-dept"
// // // //             value={dept}
// // // //             onChange={(e) => {
// // // //               const v = e.target.value;
// // // //               setDept(v);
// // // //               updateSearch(q, v);
// // // //             }}
// // // //             title="Filter by department"
// // // //           >
// // // //             {deptOptions.map((d) => (
// // // //               <option key={d} value={d}>
// // // //                 {d === "all" ? "All Departments" : d}
// // // //               </option>
// // // //             ))}
// // // //           </select>
// // // //         </div>
// // // //       </div>

// // // //       {/* Right: brand + links + user + logout */}
// // // //       <nav className="nav-right">
// // // //         <span className="brand">FNF Feed</span>
// // // //         <Link to="/feed" className="btn">Feed</Link>
// // // //         <Link to="/post/new" className="btn btn-primary">➕ New Post</Link>
// // // //         <Link to="/my-posts" className="btn">My Posts</Link>
// // // //         <Link to="/commits" className="btn">Commits</Link>
// // // //         {me && (
// // // //           <span className="user-name">
// // // //             Hi, {me.fullName ?? me.FullName ?? me.email}
// // // //           </span>
// // // //         )}
// // // //         <button
// // // //           onClick={() => {
// // // //             clearToken();
// // // //             navigate("/login", { replace: true });
// // // //           }}
// // // //           className="btn danger"
// // // //         >
// // // //           Logout
// // // //         </button>
// // // //       </nav>
// // // //     </header>
// // // //   );
// // // // }



// // // import React from "react";
// // // import { Link, useNavigate, useLocation } from "react-router-dom";
// // // import { clearToken, fetchMe } from "../../Services/AuthService";
// // // import "./Navbar.css";

// // // export default function Navbar() {
// // //   const navigate = useNavigate();
// // //   const location = useLocation();

// // //   const [me, setMe] = React.useState(null);

// // //   // read URL params -> controls
// // //   const params = new URLSearchParams(location.search);
// // //   const qParam = params.get("q") ?? "";
// // //   const deptParam = params.get("dept") ?? "all";

// // //   const [q, setQ] = React.useState(qParam);
// // //   const [dept, setDept] = React.useState(deptParam || "all");
// // //   const [deptOptions, setDeptOptions] = React.useState(["all"]);

// // //   // keep local state in sync if URL changes elsewhere
// // //   React.useEffect(() => {
// // //     setQ(qParam);
// // //     setDept(deptParam || "all");
// // //   }, [qParam, deptParam]);

// // //   // fetch current user (for greeting)
// // //   React.useEffect(() => {
// // //     let alive = true;
// // //     (async () => {
// // //       try {
// // //         const user = await fetchMe();
// // //         if (alive) setMe(user);
// // //       } catch {}
// // //     })();
// // //     return () => {
// // //       alive = false;
// // //     };
// // //   }, []);

// // //   // load dept list from localStorage (Feed should write it as ["all", ...])
// // //   const loadDepts = React.useCallback(() => {
// // //     try {
// // //       const raw = localStorage.getItem("deptOptions");
// // //       const arr = raw ? JSON.parse(raw) : null;
// // //       if (Array.isArray(arr) && arr.length) {
// // //         // ensure "all" first and unique
// // //         const uniq = Array.from(new Set(arr)).filter(Boolean);
// // //         setDeptOptions(["all", ...uniq]);
// // //       } else {
// // //         setDeptOptions(["all"]);
// // //       }
// // //     } catch {
// // //       setDeptOptions(["all"]);
// // //     }
// // //   }, []);

// // //   React.useEffect(() => {
// // //     loadDepts();
// // //     const onStorage = (e) => {
// // //       if (e.key === "deptOptions") loadDepts();
// // //     };
// // //     window.addEventListener("storage", onStorage);
// // //     return () => window.removeEventListener("storage", onStorage);
// // //   }, [loadDepts]);

// // //   // write params back to URL so Feed filters based on q & dept
// // //   function updateSearch(nextQ, nextDept) {
// // //     const p = new URLSearchParams(location.search);
// // //     if (nextQ) p.set("q", nextQ);
// // //     else p.delete("q");

// // //     if (nextDept && nextDept !== "all") p.set("dept", nextDept);
// // //     else p.delete("dept");

// // //     navigate(
// // //       { pathname: location.pathname, search: p.toString() },
// // //       { replace: true }
// // //     );
// // //   }

// // //   return (
// // //     <header className="nav-header">
// // //       {/* Left: hamburger + toolbar (search + dept) on the SAME row */}
// // //       <div className="nav-left">
// // //         <button className="hamburger" aria-label="Menu" type="button">
// // //           <span></span>
// // //           <span></span>
// // //           <span></span>
// // //         </button>

// // //         <div className="nav-toolbar">
// // //           <input
// // //             className="nav-search"
// // //             type="search"
// // //             placeholder="Search posts (title or text)…"
// // //             value={q}
// // //             onChange={(e) => {
// // //               const v = e.target.value;
// // //               setQ(v);
// // //               updateSearch(v, dept);
// // //             }}
// // //           />
// // //           <select
// // //             className="nav-dept"
// // //             value={dept}
// // //             onChange={(e) => {
// // //               const v = e.target.value;
// // //               setDept(v);
// // //               updateSearch(q, v);
// // //             }}
// // //             title="Filter by department"
// // //           >
// // //             {deptOptions.map((d) => (
// // //               <option key={d} value={d}>
// // //                 {d === "all" ? "All Departments" : d}
// // //               </option>
// // //             ))}
// // //           </select>
// // //         </div>
// // //       </div>

// // //       {/* Right: brand + links + user + logout */}
// // //       <nav className="nav-right">
// // //         <span className="brand">FNF Feed</span>
// // //         <Link to="/feed" className="btn">Feed</Link>
// // //         <Link to="/post/new" className="btn btn-primary">➕ New Post</Link>
// // //         <Link to="/my-posts" className="btn">My Posts</Link>
// // //         <Link to="/commits" className="btn">Commits</Link>
// // //         {me && (
// // //           <span className="user-name">
// // //             Hi, {me.fullName ?? me.FullName ?? me.email}
// // //           </span>
// // //         )}
// // //         <button
// // //           onClick={() => {
// // //             clearToken();
// // //             navigate("/login", { replace: true });
// // //           }}
// // //           className="btn danger"
// // //         >
// // //           Logout
// // //         </button>
// // //       </nav>
// // //     </header>
// // //   );
// // // }

// // import React from "react";
// // import { Link, useNavigate, useLocation } from "react-router-dom";
// // import { clearToken, fetchMe } from "../../Services/AuthService";
// // import "./Navbar.css";

// // export default function Navbar() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [me, setMe] = React.useState(null);

// //   // read URL params
// //   const params = new URLSearchParams(location.search);
// //   const qParam = params.get("q") ?? "";
// //   const deptParam = params.get("dept") ?? "all";

// //   const [q, setQ] = React.useState(qParam);
// //   const [dept, setDept] = React.useState(deptParam || "all");
// //   const [deptOptions, setDeptOptions] = React.useState(["all"]);

// //   React.useEffect(() => {
// //     setQ(qParam);
// //     setDept(deptParam || "all");
// //   }, [qParam, deptParam]);

// //   React.useEffect(() => {
// //     let alive = true;
// //     (async () => {
// //       try { const user = await fetchMe(); if (alive) setMe(user); } catch {}
// //     })();
// //     return () => { alive = false; };
// //   }, []);

// //   // load dept list from localStorage (Feed writes it)
// //   const loadDepts = React.useCallback(() => {
// //     try {
// //       const raw = localStorage.getItem("deptOptions");
// //       const arr = raw ? JSON.parse(raw) : null;
// //       if (Array.isArray(arr) && arr.length) {
// //         setDeptOptions(["all", ...Array.from(new Set(arr)).filter(Boolean)]);
// //       } else setDeptOptions(["all"]);
// //     } catch { setDeptOptions(["all"]); }
// //   }, []);

// //   React.useEffect(() => {
// //     loadDepts();
// //     const onStorage = (e) => { if (e.key === "deptOptions") loadDepts(); };
// //     window.addEventListener("storage", onStorage);
// //     return () => window.removeEventListener("storage", onStorage);
// //   }, [loadDepts]);

// //   function updateSearch(nextQ, nextDept) {
// //     const p = new URLSearchParams(location.search);
// //     if (nextQ) p.set("q", nextQ); else p.delete("q");
// //     if (nextDept && nextDept !== "all") p.set("dept", nextDept); else p.delete("dept");
// //     navigate({ pathname: location.pathname, search: p.toString() }, { replace: true });
// //   }

// //   return (
// //     <header className="nav-header">
// //       {/* LEFT: hamburger + search + dept all in ONE row */}
// //       <div className="nav-left">
// //         <button className="hamburger" aria-label="Menu" type="button">
// //           <span></span><span></span><span></span>
// //         </button>

// //         <input
// //           className="nav-search"
// //           type="search"
// //           placeholder="Search posts (title or text)…"
// //           value={q}
// //           onChange={(e) => {
// //             const v = e.target.value;
// //             setQ(v);
// //             updateSearch(v, dept);
// //           }}
// //         />

// //         <select
// //           className="nav-dept"
// //           value={dept}
// //           onChange={(e) => {
// //             const v = e.target.value;
// //             setDept(v);
// //             updateSearch(q, v);
// //           }}
// //           title="Filter by department"
// //         >
// //           {deptOptions.map((d) => (
// //             <option key={d} value={d}>
// //               {d === "all" ? "All Departments" : d}
// //             </option>
// //           ))}
// //         </select>
// //       </div>

// //       {/* RIGHT: links + user + logout */}
// //       <nav className="nav-right">
// //         <span className="brand">FNF Feed</span>
// //         <Link to="/feed" className="btn">Feed</Link>
// //         <Link to="/post/new" className="btn btn-primary">➕ New Post</Link>
// //         <Link to="/my-posts" className="btn">My Posts</Link>
// //         <Link to="/commits" className="btn">Commits</Link>
// //         {me && <span className="user-name">Hi, {me.fullName ?? me.FullName ?? me.email}</span>}
// //         <button
// //           onClick={() => { clearToken(); navigate("/login", { replace: true }); }}
// //           className="btn danger"
// //         >
// //           Logout
// //         </button>
// //       </nav>
// //     </header>
// //   );
// // }

// import React from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { clearToken, fetchMe } from "../../Services/AuthService";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [me, setMe] = React.useState(null);

//   // read URL params -> controls (so Feed can filter using the URL)
//   const params = new URLSearchParams(location.search);
//   const qParam = params.get("q") ?? "";
//   const deptParam = params.get("dept") ?? "all";

//   const [q, setQ] = React.useState(qParam);
//   const [dept, setDept] = React.useState(deptParam || "all");
//   const [deptOptions, setDeptOptions] = React.useState(["all"]);

//   React.useEffect(() => {
//     setQ(qParam);
//     setDept(deptParam || "all");
//   }, [qParam, deptParam]);

//   React.useEffect(() => {
//     let alive = true;
//     (async () => {
//       try { const user = await fetchMe(); if (alive) setMe(user); } catch {}
//     })();
//     return () => { alive = false; };
//   }, []);

//   // load dept list (Feed writes it to localStorage)
//   React.useEffect(() => {
//     try {
//       const raw = localStorage.getItem("deptOptions");
//       const arr = raw ? JSON.parse(raw) : null;
//       if (Array.isArray(arr) && arr.length) {
//         const uniq = ["all", ...Array.from(new Set(arr)).filter(Boolean)];
//         setDeptOptions(uniq);
//       }
//     } catch {/* ignore */}
//   }, []);

//   function updateSearch(nextQ, nextDept) {
//     const p = new URLSearchParams(location.search);
//     if (nextQ) p.set("q", nextQ); else p.delete("q");
//     if (nextDept && nextDept !== "all") p.set("dept", nextDept); else p.delete("dept");
//     navigate({ pathname: location.pathname, search: p.toString() }, { replace: true });
//   }

//   // ---------- STRICT INLINE LAYOUT (single row) ----------
//   const header = {
//     position: "sticky", top: 0, zIndex: 1001, background: "#fff",
//     boxShadow: "0 2px 8px rgba(0,0,0,.06)",
//     padding: "10px 14px",
//     display: "flex", alignItems: "center", justifyContent: "space-between",
//     minWidth: 0, // allow children to shrink in flex
//   };
//   const leftRow = {
//     display: "flex", alignItems: "center", gap: 12,
//     minWidth: 0, // prevent wrapping caused by flex item min width
//     flex: "1 1 auto",
//   };
//   const hamburgerBtn = {
//     width: 32, height: 26,
//     display: "inline-flex", flexDirection: "column", justifyContent: "space-between",
//     background: "transparent", border: "none", padding: 0, cursor: "pointer", flex: "0 0 auto",
//   };
//   const bar = { height: 3, width: "100%", background: "#111827", borderRadius: 3 };

//   // IMPORTANT: minWidth:0 and flex-basis ensure the inputs stay on the SAME row
//   const searchInput = {
//     flex: "1 1 600px", minWidth: 0,
//     border: "1px solid #dbe3ef", borderRadius: 10,
//     padding: "9px 11px", fontSize: 14, outline: "none",
//   };
//   const deptSelect = {
//     flex: "0 0 200px",
//     border: "1px solid #dbe3ef", borderRadius: 10,
//     padding: "9px 11px", fontSize: 14, background: "#fff", outline: "none",
//   };

//   const rightRow = { display: "flex", alignItems: "center", gap: 10, flex: "0 0 auto" };
//   const btn = {
//     padding: "8px 12px", border: "1px solid #d1d5db",
//     background: "#fff", borderRadius: 8, fontSize: 14,
//     cursor: "pointer", textDecoration: "none", color: "#111827",
//   };
//   const primary = { background: "#2563eb", color: "#fff", borderColor: "#2563eb" };
//   const danger = { background: "#fef2f2", color: "#b91c1c", borderColor: "#fecaca" };

//   return (
//     <header style={header}>
//       {/* LEFT: hamburger + search + dept — ALL IN ONE ROW */}
//       <div style={leftRow}>
//         <button style={hamburgerBtn} aria-label="Menu" type="button">
//           <span style={bar} /><span style={bar} /><span style={bar} />
//         </button>

//         <input
//           type="search"
//           style={searchInput}
//           placeholder="Search posts (title or text)…"
//           value={q}
//           onChange={(e) => {
//             const v = e.target.value;
//             setQ(v);
//             updateSearch(v, dept);
//           }}
//         />

//         <select
//           style={deptSelect}
//           value={dept}
//           onChange={(e) => {
//             const v = e.target.value;
//             setDept(v);
//             updateSearch(q, v);
//           }}
//           title="Filter by department"
//         >
//           {deptOptions.map((d) => (
//             <option key={d} value={d}>
//               {d === "all" ? "All Departments" : d}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* RIGHT: links + user + logout */}
//       <nav style={rightRow}>
//         <span style={{ fontWeight: 700 }}>FNF Feed</span>
//         <Link to="/feed" style={btn}>Feed</Link>
//         <Link to="/post/new" style={{ ...btn, ...primary }}>➕ New Post</Link>
//         <Link to="/my-posts" style={btn}>My Posts</Link>
//         <Link to="/commits" style={btn}>Commits</Link>
//         {me && <span style={{ color: "#374151", fontWeight: 500 }}>
//           Hi, {me.fullName ?? me.FullName ?? me.email}
//         </span>}
//         <button
//           onClick={() => { clearToken(); navigate("/login", { replace: true }); }}
//           style={{ ...btn, ...danger }}
//         >
//           Logout
//         </button>
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

