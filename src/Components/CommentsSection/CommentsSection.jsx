// import React, { useEffect, useState } from "react";
// import commentsService from "../../Services/commentsService";
// import { fetchMe } from "../../Services/AuthService";
// import "./CommentsSection.css";

// // simple date formatting
// const fmt = (iso) => {
//   try {
//     const d = new Date(iso);
//     return d.toLocaleString();
//   } catch {
//     return iso;
//   }
// };

// /* ---------------- CommentForm ---------------- */
// function CommentForm({
//   postId,
//   parentCommentId = null,
//   initialText = "",
//   onDone,
//   onCancel,
// }) {
//   const [text, setText] = useState(initialText || "");
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleFile = (e) => {
//     const f = e.target.files;
//     if (!f) return;
//     setFiles((prev) => [...prev, ...Array.from(f)]);
//     e.target.value = "";
//   };

//   const removeFileAt = (i) =>
//     setFiles((prev) => prev.filter((_, idx) => idx !== i));

//   const submit = async (e) => {
//     e?.preventDefault();
//     if (!text.trim()) {
//       alert("Please enter comment text.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const dto = {
//         postId,
//         parentCommentId,
//         commentText: text.trim(),
//         attachments: files,
//       };
//       const res = await commentsService.createComment(dto);
//       setText("");
//       setFiles([]);
//       onDone?.(res);
//     } catch (err) {
//       console.error("Create comment failed:", err);
//       alert(err?.message || "Failed to create comment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form className="comment-form" onSubmit={submit}>
//       <textarea
//         placeholder={parentCommentId ? "Write a reply..." : "Write a comment..."}
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         rows={2}
//       />
//       <div className="comment-form-row">
//         <label className="attach-label" title="Attach files">
//           📎
//           <input type="file" multiple onChange={handleFile} style={{ display: "none" }} />
//         </label>

//         <div className="file-list">
//           {files.map((f, i) => (
//             <div key={i} className="file-chip">
//               {f.name}
//               <button type="button" className="file-remove" onClick={() => removeFileAt(i)}>
//                 ✕
//               </button>
//             </div>
//           ))}
//         </div>

//         <div style={{ marginLeft: "auto" }}>
//           {onCancel && (
//             <button type="button" className="btn-cancel" onClick={onCancel}>
//               Cancel
//             </button>
//           )}
//           <button type="submit" className="btn-post" disabled={loading}>
//             {loading ? "Posting..." : "Post"}
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// }

// /* ---------------- CommentItem (with collapsed replies) ---------------- */
// function CommentItem({
//   comment,
//   postId,
//   currentUser,
//   onReplyCreated,
//   onDeleted,
// }) {
//   const [showReplyForm, setShowReplyForm] = useState(false);
//   const [showReplies, setShowReplies] = useState(false); // collapsed by default
//   const [voting, setVoting] = useState(false);

//   const handleVote = async (type) => {
//     try {
//       setVoting(true);
//       await commentsService.voteOnComment(comment.commentId, type);
//       onReplyCreated && onReplyCreated();
//     } catch (err) {
//       console.error("Vote failed:", err);
//       alert(err?.message || "Failed to vote");
//     } finally {
//       setVoting(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!window.confirm("Delete this comment and all its replies?")) return;
//     try {
//       await commentsService.deleteComment(comment.commentId);
//       onDeleted && onDeleted();
//     } catch (err) {
//       console.error("Delete failed:", err);
//       alert(err?.message || "Failed to delete comment");
//     }
//   };

//   const canEditOrDelete =
//     currentUser &&
//     (currentUser.userId === comment.userId ||
//       currentUser.userId === comment.postAuthorId);

//   const isReply = Boolean(comment.parentCommentId);
//   const repliesCount = comment.replies ? comment.replies.length : 0;

//   return (
//     <div className={`comment-item ${isReply ? "reply" : ""}`}>
//       {/* Avatar shown only if comment.avatarUrl exists; otherwise no avatar */}
//       {comment.avatarUrl ? (
//         <img
//           className="avatar"
//           src={comment.avatarUrl}
//           alt={`${comment.authorName}'s avatar`}
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.style.display = "none";
//           }}
//         />
//       ) : null}

//       <div className="content">
//         <div>
//           <span className="author">{comment.authorName}</span>{" "}
//           <span className="text">{comment.commentText}</span>
//         </div>

//         {comment.attachments && comment.attachments.length > 0 && (
//           <div className="attachments">
//             {comment.attachments.map((a, i) => (
//               <div key={i}>
//                 <a href={a.filePath || a.FilePath || a.Filepath} target="_blank" rel="noreferrer">
//                   📎 {a.fileName || a.FileName || a.Filepath || a.filePath}
//                 </a>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="meta">
//           <span className="time">{fmt(comment.createdAt)}</span>

//           <button className="reply-btn" onClick={() => setShowReplyForm((s) => !s)}>
//             Reply
//           </button>

//           <button onClick={() => handleVote("Upvote")} disabled={voting}>
//             👍 Like
//           </button>
//           <button onClick={() => handleVote("Downvote")} disabled={voting}>
//             👎 Dislike
//           </button>

//           {canEditOrDelete && (
//             <button onClick={handleDelete} style={{ color: "crimson", marginLeft: 6 }}>
//               Delete
//             </button>
//           )}
//         </div>

//         {/* View / Hide replies toggle */}
//         {repliesCount > 0 && (
//           <div style={{ marginTop: 6 }}>
//             <button
//               className="view-replies-btn"
//               onClick={() => setShowReplies((s) => !s)}
//             >
//               {showReplies ? `Hide replies (${repliesCount})` : `View replies (${repliesCount})`}
//             </button>
//           </div>
//         )}

//         {/* Reply form */}
//         {showReplyForm && (
//           <div style={{ marginTop: 8 }}>
//             <CommentForm
//               postId={postId}
//               parentCommentId={comment.commentId}
//               onCancel={() => setShowReplyForm(false)}
//               onDone={() => {
//                 setShowReplyForm(false);
//                 onReplyCreated && onReplyCreated();
//               }}
//             />
//           </div>
//         )}

//         {/* Replies (rendered only when showReplies is true) */}
//         {showReplies && comment.replies && comment.replies.length > 0 && (
//           <div className="replies" style={{ marginTop: 8 }}>
//             {comment.replies.map((r) => (
//               <CommentItem
//                 key={r.commentId}
//                 comment={r}
//                 postId={postId}
//                 currentUser={currentUser}
//                 onReplyCreated={onReplyCreated}
//                 onDeleted={onDeleted}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="right-actions">
//         <button
//           className={`heart-btn ${comment.liked ? "liked" : ""}`}
//           onClick={() => handleVote("Upvote")}
//           title="Like"
//         >
//           {comment.liked ? "❤️" : "🤍"}
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ---------------- CommentsSection (top-level) ---------------- */
// export default function CommentsSection({ postId }) {
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [me, setMe] = useState(null);
//   const [reloadKey, setReloadKey] = useState(0);

//   useEffect(() => {
//     let mounted = true;
//     async function load() {
//       setLoading(true);
//       try {
//         const [user, tree] = await Promise.all([
//           fetchMe().catch(() => null),
//           commentsService.fetchCommentsForPost(postId),
//         ]);
//         if (!mounted) return;
//         setMe(user);
//         setComments(tree || []);
//       } catch (err) {
//         console.error("Failed to load comments:", err);
//         setComments([]);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }
//     load();
//     return () => {
//       mounted = false;
//     };
//   }, [postId, reloadKey]);

//   const reload = () => setReloadKey((k) => k + 1);

//   const handleCreateRoot = async (created) => {
//     reload();
//   };

//   if (loading) return <div className="comments-section-loading">Loading comments...</div>;

//   return (
//     <div className="comments-section">
//       <h3>Comments</h3>

//       <CommentForm postId={postId} onDone={(c) => handleCreateRoot(c)} />

//       <div style={{ marginTop: 8 }}>
//         {comments.length === 0 ? (
//           <div style={{ color: "#666" }}>No comments yet. Be the first!</div>
//         ) : (
//           comments.map((c) => (
//             <CommentItem
//               key={c.commentId}
//               comment={c}
//               postId={postId}
//               currentUser={me}
//               onReplyCreated={() => reload()}
//               onDeleted={() => reload()}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
// src/Components/CommentsSection.jsx
import React, { useEffect, useState } from "react";
import commentsService from "../../Services/commentsService";
import { fetchMe } from "../../Services/AuthService";
import "./CommentsSection.css";

// simple date formatting
const fmt = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
};

/* ---------------- CommentForm ---------------- */
function CommentForm({
  postId,
  parentCommentId = null,
  initialText = "",
  onDone,
  onCancel,
}) {
  const [text, setText] = useState(initialText || "");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files;
    if (!f) return;
    setFiles((prev) => [...prev, ...Array.from(f)]);
    e.target.value = "";
  };

  const removeFileAt = (i) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e?.preventDefault();
    if (!text.trim()) {
      alert("Please enter comment text.");
      return;
    }
    setLoading(true);
    try {
      const dto = {
        postId,
        parentCommentId,
        commentText: text.trim(),
        attachments: files,
      };
      const res = await commentsService.createComment(dto);
      setText("");
      setFiles([]);
      onDone?.(res);
    } catch (err) {
      console.error("Create comment failed:", err);
      alert(err?.message || "Failed to create comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={submit}>
      <textarea
        placeholder={parentCommentId ? "Write a reply..." : "Write a comment..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
      />
      <div className="comment-form-row">
        <label className="attach-label" title="Attach files">
          📎
          <input type="file" multiple onChange={handleFile} style={{ display: "none" }} />
        </label>

        <div className="file-list">
          {files.map((f, i) => (
            <div key={i} className="file-chip">
              {f.name}
              <button type="button" className="file-remove" onClick={() => removeFileAt(i)}>
                ✕
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginLeft: "auto" }}>
          {onCancel && (
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn-post" disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ---------------- CommentItem (with collapsed replies + compact counts) ---------------- */
function CommentItem({
  comment,
  postId,
  currentUser,
  onReplyCreated,
  onDeleted,
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false); // collapsed by default
  const [voting, setVoting] = useState(false);

  const handleVote = async (type) => {
    try {
      setVoting(true);
      await commentsService.voteOnComment(comment.commentId, type);
      onReplyCreated && onReplyCreated();
    } catch (err) {
      console.error("Vote failed:", err);
      alert(err?.message || "Failed to vote");
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this comment and all its replies?")) return;
    try {
      await commentsService.deleteComment(comment.commentId);
      onDeleted && onDeleted();
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err?.message || "Failed to delete comment");
    }
  };

  const canEditOrDelete =
    currentUser &&
    (currentUser.userId === comment.userId ||
      currentUser.userId === comment.postAuthorId);

  const isReply = Boolean(comment.parentCommentId);
  const repliesCount = comment.replies ? comment.replies.length : 0;

  // Use available fields or fallbacks
  const likeCount = comment.likeCount ?? comment.likes ?? 0;
  const dislikeCount = comment.dislikeCount ?? comment.dislikes ?? 0;
  const liked = Boolean(comment.liked); // may be boolean or number from API

  return (
    <div className={`comment-item ${isReply ? "reply" : ""}`}>
      {/* Avatar shown only if comment.avatarUrl exists; otherwise no avatar */}
      {comment.avatarUrl ? (
        <img
          className="avatar"
          src={comment.avatarUrl}
          alt={`${comment.authorName}'s avatar`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = "none";
          }}
        />
      ) : null}

      <div className="content">
        <div>
          <span className="author">{comment.authorName}</span>{" "}
          <span className="text">{comment.commentText}</span>
        </div>

        {comment.attachments && comment.attachments.length > 0 && (
          <div className="attachments">
            {comment.attachments.map((a, i) => (
              <div key={i}>
                <a href={a.filePath || a.FilePath || a.Filepath} target="_blank" rel="noreferrer">
                  📎 {a.fileName || a.FileName || a.Filepath || a.filePath}
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="meta">
          <span className="time">{fmt(comment.createdAt)}</span>

          <button className="reply-btn" onClick={() => setShowReplyForm((s) => !s)}>
            Reply
          </button>

          <button onClick={() => handleVote("Upvote")} disabled={voting}>
            <span aria-hidden>👍</span>
            {likeCount > 0 && <span className="count"> {likeCount}</span>}
          </button>

          <button onClick={() => handleVote("Downvote")} disabled={voting}>
            <span aria-hidden>👎</span>
            {dislikeCount > 0 && <span className="count"> {dislikeCount}</span>}
          </button>

          {canEditOrDelete && (
            <button onClick={handleDelete} style={{ color: "crimson", marginLeft: 6 }}>
              Delete
            </button>
          )}
        </div>

        {/* View / Hide replies toggle */}
        {repliesCount > 0 && (
          <div style={{ marginTop: 6 }}>
            <button
              className="view-replies-btn"
              onClick={() => setShowReplies((s) => !s)}
            >
              {showReplies ? `Hide replies (${repliesCount})` : `View replies (${repliesCount})`}
            </button>
          </div>
        )}

        {/* Reply form */}
        {showReplyForm && (
          <div style={{ marginTop: 8 }}>
            <CommentForm
              postId={postId}
              parentCommentId={comment.commentId}
              onCancel={() => setShowReplyForm(false)}
              onDone={() => {
                setShowReplyForm(false);
                onReplyCreated && onReplyCreated();
              }}
            />
          </div>
        )}

        {/* Replies (rendered only when showReplies is true) */}
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="replies" style={{ marginTop: 8 }}>
            {comment.replies.map((r) => (
              <CommentItem
                key={r.commentId}
                comment={r}
                postId={postId}
                currentUser={currentUser}
                onReplyCreated={onReplyCreated}
                onDeleted={onDeleted}
              />
            ))}
          </div>
        )}
      </div>

      <div className="right-actions">
        <button
          className={`heart-btn ${liked ? "liked" : ""}`}
          onClick={() => handleVote("Upvote")}
          title="Like"
        >
          {liked ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- CommentsSection (top-level) ---------------- */
export default function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [user, tree] = await Promise.all([
          fetchMe().catch(() => null),
          commentsService.fetchCommentsForPost(postId),
        ]);
        if (!mounted) return;
        setMe(user);
        setComments(tree || []);
      } catch (err) {
        console.error("Failed to load comments:", err);
        setComments([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [postId, reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  const handleCreateRoot = async (created) => {
    reload();
  };

  if (loading) return <div className="comments-section-loading">Loading comments...</div>;

  return (
    <div className="comments-section">
      <h3>Comments</h3>

      <CommentForm postId={postId} onDone={(c) => handleCreateRoot(c)} />

      <div style={{ marginTop: 8 }}>
        {comments.length === 0 ? (
          <div style={{ color: "#666" }}>No comments yet. Be the first!</div>
        ) : (
          comments.map((c) => (
            <CommentItem
              key={c.commentId}
              comment={c}
              postId={postId}
              currentUser={me}
              onReplyCreated={() => reload()}
              onDeleted={() => reload()}
            />
          ))
        )}
      </div>
    </div>
  );
}
