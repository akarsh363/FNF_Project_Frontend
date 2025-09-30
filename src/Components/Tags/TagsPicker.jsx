
import { useEffect, useMemo, useState } from "react";
import { getMyTags, getTagsByDept } from "../../Services/tagsService";



export default function TagsPicker({
  mode = "mine",
  deptId,
  multiple = true,
  value = multiple ? [] : null,
  onChange,
  placeholder = "Select tags",
  disabled = false,
}) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data =
          mode === "byDept" ? await getTagsByDept(deptId) : await getMyTags();
        if (isMounted) setTags(Array.isArray(data) ? data : []);
      } catch (e) {
        if (isMounted) setError(e?.message || "Failed to load tags");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [mode, deptId]);

  const selected = useMemo(() => {
    if (multiple) return Array.isArray(value) ? value : [];
    return typeof value === "number" ? value : null;
  }, [value, multiple]);

  function toggle(id) {
    if (!onChange) return;
    if (multiple) {
      const set = new Set(Array.isArray(selected) ? selected : []);
      set.has(id) ? set.delete(id) : set.add(id);
      onChange(Array.from(set));
    } else {
      onChange(id === selected ? null : id);
    }
  }

  // ---------- RENDER ----------
  if (loading) return <div className="text-sm opacity-70">Loading tags…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;

  // handle API casing differences
  const norm = (t) => ({
    id: t.tagId ?? t.TagId,
    name: t.tagName ?? t.TagName,
  });

  if (!tags.length) {
    return (
      <div className="text-sm opacity-70">
        {mode === "byDept" && deptId ? `No tags for department ${deptId}.` : "No tags."}
      </div>
    );
  }

  return (
    <div className="tags-picker">
      <div className="picker-grid">
        {tags.map((raw) => {
          const t = norm(raw);
          const isOn = multiple
            ? Array.isArray(selected) && selected.includes(t.id)
            : selected === t.id;
          return (
            <button
              key={t.id}
              type="button"
              disabled={disabled}
              className={`tag-pill ${isOn ? "on" : ""}`}
              onClick={() => toggle(t.id)}
              title={`#${t.name}`}
            >
              #{t.name}
            </button>
          );
        })}
      </div>
      <style>{`
        .tags-picker { display: grid; gap: .5rem; }
        .picker-grid { display: flex; flex-wrap: wrap; gap: .5rem; }
        .tag-pill { padding: .35rem .6rem; border-radius: 999px; border: 1px solid #ddd; background: #fff; cursor: pointer; }
        .tag-pill.on { border-color: #111; box-shadow: 0 0 0 2px rgba(0,0,0,.05) inset; font-weight: 600; }
        .tag-pill:disabled { opacity: .5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
