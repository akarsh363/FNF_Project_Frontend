// import React, { useEffect, useState } from "react";
// import Navbar from "../Navbar/Navbar";

// const API_BASE = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API || "http://localhost:5294").replace(
//   /\/+$/, ""
// );

// export default function Commits() {
//   const [commits, setCommits] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/Commits/mine`, {
//           method: "GET",
//           headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
//           credentials: "include",
//         });
//         const data = await res.json();
//         setCommits(Array.isArray(data) ? data : []);
//       } catch (e) {
//         console.error(e);
//         alert("Failed to load commits");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   if (loading) return <div className="loading">Loading…</div>;

//   return (
//     <div className="page">
//       <Navbar />
//       <div className="container">
//         <h1>Commits (moderation log)</h1>
//         {commits.length === 0 ? (
//           <div>No commits yet.</div>
//         ) : (
//           <ul style={{ listStyle: "none", padding: 0 }}>
//             {commits.map((c) => (
//               <li key={c.commitId || c.CommitId} className="commit-row" style={{ padding: 12, borderBottom: "1px solid #eee" }}>
//                 <div><strong>Post:</strong> {c.postTitle || c.PostTitle}</div>
//                 <div><strong>Action:</strong> {c.action || c.Action}</div>
//                 <div><strong>By:</strong> {c.managerName || c.ManagerName}</div>
//                 <div><strong>Reason/Message:</strong> {c.message || c.Message}</div>
//                 <div><strong>At:</strong> {new Date(c.createdAt || c.CreatedAt).toLocaleString()}</div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../../Services/api";
import "./Commits.css";

export default function Commits(){
  const [items, setItems] = useState(null);

  useEffect(()=>{(async()=>{
    try{ const list = await api.request("/api/Commits/mine",{ method:"GET" }); setItems(Array.isArray(list)?list:[]); }
    catch{ setItems([]); }
  })();},[]);

  if (items===null) return <div className="loading">Loading...</div>;
  if (!items.length) return <div className="no-posts">No commits yet.</div>;

  const fmt = (ts)=> new Date(ts).toLocaleString();

  return (
    <div className="container" style={{ padding: 16 }}>
      <h1>Commits (Moderation)</h1>
      <ul className="list">
        {items.map((c)=>(
          <li key={c.commitId} className="card">
            <div className="title">Post: {c.postTitle}</div>
            <div className="meta">Action: {c.action || "DELETE"} • Manager: {c.managerName} • {fmt(c.createdAt)}</div>
            <div className="reason"><strong>Message:</strong> {c.message}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
