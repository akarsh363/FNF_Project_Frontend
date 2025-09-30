
export default function TagChips({ tags = [] }) {
  if (!Array.isArray(tags) || tags.length === 0) return null;

  const normalize = (t, i) => {
    // If API returns plain string names
    if (typeof t === "string") return { id: `s-${i}-${t}`, name: t };
    // If API returns objects with various casings
    const id = t?.tagId ?? t?.TagId ?? i;
    const name = t?.tagName ?? t?.TagName ?? String(t ?? "");
    return { id, name };
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {tags.map((t, i) => {
        const n = normalize(t, i);
        if (!n.name) return null;
        return (
          <span key={n.id} className="tag-chip">#{n.name}</span>
        );
      })}
      <style>{`
        .tag-chip {
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 999px;
          background: #f2f2f2;
          border: 1px solid #e5e7eb;
          color: #374151;
        }
      `}</style>
    </div>
  );
}
