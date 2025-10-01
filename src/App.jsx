
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

// import Feed from "./Components/Feed/Feed";
// import PostEditor from "./Components/PostEditor/PostEditor";
// import MyPosts from "./Components/MyPosts/MyPosts";
// import Commits from "./Components/Commits/Commits";
// import EditPost from "./Components/EditPost/EditPost";

// import Login from "./Components/Login/Login";
// import SignUp from "./Components/SignUp/SignUp";

// // ⬇️ use the new hamburger + drawer sidebar instead of the top navbar
// import Sidebar from "./Components/Sidebar/Sidebar";
// import GuestPage from "./Components/GuestPage/GuestPage";

// function AppShell({ children }) {
//   return (
//     <div className="app-shell">
//       <Sidebar />
//       <div className="app-content">{children}</div>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <Routes>
//       {/* public */}
//       <Route path="/" element={<GuestPage />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<SignUp />} />

//       {/* protected */}
//       <Route
//         path="/feed"
//         element={
//           <ProtectedRoute>
//             <AppShell><Feed /></AppShell>
//           </ProtectedRoute>
//         }
//       />

//       {/* keep /post/new before other /post/... routes */}
//       <Route
//         path="/post/new"
//         element={
//           <ProtectedRoute>
//             <AppShell><PostEditor /></AppShell>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/post/edit/:id"
//         element={
//           <ProtectedRoute>
//             <AppShell><EditPost /></AppShell>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/my-posts"
//         element={
//           <ProtectedRoute>
//             <AppShell><MyPosts /></AppShell>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/commits"
//         element={
//           <ProtectedRoute>
//             <AppShell><Commits /></AppShell>
//           </ProtectedRoute>
//         }
//       />

//       {/* defaults */}
//       {/* <Route path="/" element={<Navigate to="/feed" replace />} /> */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }




// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

import Feed from "./Components/Feed/Feed";
import PostEditor from "./Components/PostEditor/PostEditor";
import MyPosts from "./Components/MyPosts/MyPosts";
import Commits from "./Components/Commits/Commits";
import EditPost from "./Components/EditPost/EditPost";

import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";

import Sidebar from "./Components/Sidebar/Sidebar";
import GuestPage from "./Components/GuestPage/GuestPage";

import { fetchMe, clearToken } from "./Services/AuthService";

/* AppShell stays the same */
function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">{children}</div>
    </div>
  );
}

/**
 * Inline root handler — placed here so no additional files are created.
 * Behavior:
 *  - If no token: render GuestPage
 *  - If token: validate with fetchMe()
 *      - valid -> navigate to /feed
 *      - invalid -> clear token and render GuestPage
 * While validating, display a small "Checking..." UI to avoid flash/redirects.
 */
function RootHandler() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function check() {
      const token = localStorage.getItem("token");
      if (!token) {
        if (mounted) setChecking(false);
        return;
      }

      try {
        const me = await fetchMe(); // fetchMe returns user or null on 401/403
        if (!mounted) return;
        if (me) {
          navigate("/feed", { replace: true });
        } else {
          // invalid token - already cleared by fetchMe; stay on guest
          if (mounted) setChecking(false);
        }
      } catch (err) {
        // network or server error - clear token and show guest page
        clearToken();
        if (mounted) setChecking(false);
      }
    }

    check();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (checking) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <div>Checking authentication…</div>
      </div>
    );
  }

  return <GuestPage />;
}

export default function App() {
  return (
    <Routes>
      {/* root: show GuestPage or redirect to feed (RootHandler included inline) */}
      <Route path="/" element={<RootHandler />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* protected */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <AppShell>
              <Feed />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/post/new"
        element={
          <ProtectedRoute>
            <AppShell>
              <PostEditor />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/post/edit/:id"
        element={
          <ProtectedRoute>
            <AppShell>
              <EditPost />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-posts"
        element={
          <ProtectedRoute>
            <AppShell>
              <MyPosts />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/commits"
        element={
          <ProtectedRoute>
            <AppShell>
              <Commits />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
