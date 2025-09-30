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
