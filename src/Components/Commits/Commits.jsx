// import React, { useEffect, useState } from "react";
// import api from "../../Services/api";
// import "./Commits.css";

// export default function Commits(){
//   const [items, setItems] = useState(null);

//   useEffect(()=>{(async()=>{
//     try{ const list = await api.request("/api/Commits/mine",{ method:"GET" }); setItems(Array.isArray(list)?list:[]); }
//     catch{ setItems([]); }
//   })();},[]);

//   if (items===null) return <div className="loading">Loading...</div>;
//   if (!items.length) return <div className="no-posts">No commits yet.</div>;

//   const fmt = (ts)=> new Date(ts).toLocaleString();

//   return (
//     <div className="container" style={{ padding: 16 }}>
//       <h1>Commits (Moderation)</h1>
//       <ul className="list">
//         {items.map((c)=>(
//           <li key={c.commitId} className="card">
//             <div className="title">Post: {c.postTitle}</div>
//             <div className="meta">Action: {c.action || "DELETE"} • Manager: {c.managerName} • {fmt(c.createdAt)}</div>
//             <div className="reason"><strong>Message:</strong> {c.message}</div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../../Services/api";
import "./Commits.css";

/**
 * Commits list (moderation)
 *
 * Notes:
 * - This component preserves your existing behavior and layout.
 * - It now reads the manager name from multiple possible locations:
 *   c.managerName | c.ManagerName | c.manager?.fullName | c.manager?.name | c.manager?.userName | c.manager?.full_name
 * - It falls back to "Unknown" when no manager name is available.
 * - Similarly it reads the commit message from c.message or c.reason.
 */

export default function Commits() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await api.request("/api/Commits/mine", { method: "GET" });
        setItems(Array.isArray(list) ? list : []);
      } catch {
        setItems([]);
      }
    })();
  }, []);

  if (items === null) return <div className="loading">Loading...</div>;
  if (!items.length) return <div className="no-posts">No commits yet.</div>;

  const fmt = (ts) => new Date(ts).toLocaleString();

  // Helper to extract manager's display name robustly
  function managerDisplayName(commit) {
    if (!commit) return "Unknown";
    // direct fields
    if (commit.managerName && String(commit.managerName).trim()) return String(commit.managerName);
    if (commit.ManagerName && String(commit.ManagerName).trim()) return String(commit.ManagerName);

    // some APIs use `manager` object
    const mgr = commit.manager ?? commit.Manager ?? commit.ManagerInfo ?? commit.managerInfo ?? null;
    if (mgr) {
      // common name fields
      if (mgr.fullName && String(mgr.fullName).trim()) return String(mgr.fullName);
      if (mgr.FullName && String(mgr.FullName).trim()) return String(mgr.FullName);
      if (mgr.name && String(mgr.name).trim()) return String(mgr.name);
      if (mgr.Name && String(mgr.Name).trim()) return String(mgr.Name);
      if (mgr.userName && String(mgr.userName).trim()) return String(mgr.userName);
      if (mgr.user && mgr.user.fullName && String(mgr.user.fullName).trim()) return String(mgr.user.fullName);
      if (mgr.displayName && String(mgr.displayName).trim()) return String(mgr.displayName);
      if (mgr.email && String(mgr.email).trim()) return String(mgr.email); // last resort
    }

    // sometimes the manager id maps to a user map: commit.managerId with a separate user list — not handled here.
    return "Unknown";
  }

  // Helper to read commit message (backend may use 'message' or 'reason')
  function commitMessage(commit) {
    if (!commit) return "";
    if (commit.message && String(commit.message).trim()) return String(commit.message);
    if (commit.Message && String(commit.Message).trim()) return String(commit.Message);
    if (commit.reason && String(commit.reason).trim()) return String(commit.reason);
    if (commit.Reason && String(commit.Reason).trim()) return String(commit.Reason);
    return "";
  }

  return (
    <div className="container page-commits" style={{ padding: 16 }}>
      <h1>Commits (Moderation)</h1>
      <ul className="list" style={{ paddingLeft: 8 }}>
        {items.map((c) => (
          <li key={c.commitId ?? `${c.postId}-${c.createdAt}`} className="card" style={{ marginBottom: 12 }}>
            <div className="title">Post: {c.postTitle ?? c.post?.title ?? "(untitled)"}</div>
            <div className="meta" style={{ marginTop: 6 }}>
              Action: {c.action ?? c.Action ?? "DELETE"} • Manager: {managerDisplayName(c)} • {fmt(c.createdAt ?? c.created_at ?? c.timestamp ?? Date.now())}
            </div>
            <div className="reason" style={{ marginTop: 8 }}>
              <strong>Message:</strong> {commitMessage(c) || (c.details ? JSON.stringify(c.details) : "(no message)")}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
