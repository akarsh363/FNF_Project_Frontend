// // // // import React from "react";
// // // // import { Routes, Route, Navigate } from "react-router-dom";

// // // // import Login from "./Components/Login/Login";
// // // // import Signup from "./Components/Signup/Signup";
// // // // import Feed from "./Components/Feed/Feed";
// // // // import PostEditor from "./Components/PostEditor/PostEditor";
// // // // import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

// // // // export default function App() {
// // // //   return (
// // // //     <Routes>
// // // //       <Route path="/" element={<Navigate to="/feed" replace />} />
// // // //       <Route path="/login" element={<Login />} />
// // // //       <Route path="/signup" element={<Signup />} />
// // // //       <Route
// // // //         path="/feed"
// // // //         element={
// // // //           <ProtectedRoute>
// // // //             <Feed />
// // // //           </ProtectedRoute>
// // // //         }
// // // //       />
// // // //       <Route
// // // //         path="/post/new"
// // // //         element={
// // // //           <ProtectedRoute>
// // // //             <PostEditor />
// // // //           </ProtectedRoute>
// // // //         }
// // // //       />
// // // //       <Route path="*" element={<Navigate to="/login" replace />} />
// // // //     </Routes>
// // // //   );
// // // // }


// // // import React from "react";
// // // import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// // // import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

// // // import Feed from "./Components/Feed/Feed";
// // // import PostEditor from "./Components/PostEditor/PostEditor";
// // // import MyPosts from "./Components/MyPosts/MyPosts";
// // // import Commits from "./Components/Commits/Commits";
// // // import EditPost from "./Components/EditPost/EditPost";

// // // import Login from "./Components/Login/Login";
// // // import SignUp from "./Components/SignUp/SignUp";

// // // import Navbar from "./Components/Navbar/Navbar";

// // // function AppShell({ children }) {
// // //   // wrap all protected pages with the Navbar
// // //   return (
// // //     <div className="app-shell">
// // //       <Navbar />
// // //       <div className="app-content">{children}</div>
// // //     </div>
// // //   );
// // // }

// // // export default function App() {
// // //   return (
// // //     <BrowserRouter>
// // //       <Routes>
// // //         {/* auth */}
// // //         <Route path="/login" element={<Login />} />
// // //         <Route path="/signup" element={<SignUp />} />

// // //         {/* protected app pages */}
// // //         <Route
// // //           path="/feed"
// // //           element={
// // //             <ProtectedRoute>
// // //               <AppShell><Feed /></AppShell>
// // //             </ProtectedRoute>
// // //           }
// // //         />
// // //         <Route
// // //           path="/post/new"
// // //           element={
// // //             <ProtectedRoute>
// // //               <AppShell><PostEditor /></AppShell>
// // //             </ProtectedRoute>
// // //           }
// // //         />
// // //         <Route
// // //           path="/post/edit/:id"
// // //           element={
// // //             <ProtectedRoute>
// // //               <AppShell><EditPost /></AppShell>
// // //             </ProtectedRoute>
// // //           }
// // //         />
// // //         <Route
// // //           path="/my-posts"
// // //           element={
// // //             <ProtectedRoute>
// // //               <AppShell><MyPosts /></AppShell>
// // //             </ProtectedRoute>
// // //           }
// // //         />
// // //         <Route
// // //           path="/commits"
// // //           element={
// // //             <ProtectedRoute>
// // //               <AppShell><Commits /></AppShell>
// // //             </ProtectedRoute>
// // //           }
// // //         />

// // //         {/* defaults */}
// // //         <Route path="/" element={<Navigate to="/feed" replace />} />
// // //         <Route path="*" element={<Navigate to="/feed" replace />} />
// // //       </Routes>
// // //     </BrowserRouter>
// // //   );
// // // }

// // import React from "react";
// // import { Routes, Route, Navigate } from "react-router-dom";

// // import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

// // import Feed from "./Components/Feed/Feed";
// // import PostEditor from "./Components/PostEditor/PostEditor";
// // import MyPosts from "./Components/MyPosts/MyPosts";
// // import Commits from "./Components/Commits/Commits";
// // import EditPost from "./Components/EditPost/EditPost";

// // import Login from "./Components/Login/Login";
// // import SignUp from "./Components/SignUp/SignUp";
// // import Navbar from "./Components/Navbar/Navbar";

// // function AppShell({ children }) {
// //   return (
// //     <div className="app-shell">
// //       <Navbar />
// //       <div className="app-content">{children}</div>
// //     </div>
// //   );
// // }

// // export default function App() {
// //   return (
// //     <Routes>
// //       {/* auth */}
// //       <Route path="/login" element={<Login />} />
// //       <Route path="/signup" element={<SignUp />} />

// //       {/* protected app pages */}
// //       <Route
// //         path="/feed"
// //         element={
// //           <ProtectedRoute>
// //             <AppShell><Feed /></AppShell>
// //           </ProtectedRoute>
// //         }
// //       />
// //       <Route
// //         path="/post/new"
// //         element={
// //           <ProtectedRoute>
// //             <AppShell><PostEditor /></AppShell>
// //           </ProtectedRoute>
// //         }
// //       />
// //       <Route
// //         path="/post/edit/:id"
// //         element={
// //           <ProtectedRoute>
// //             <AppShell><EditPost /></AppShell>
// //           </ProtectedRoute>
// //         }
// //       />
// //       <Route
// //         path="/my-posts"
// //         element={
// //           <ProtectedRoute>
// //             <AppShell><MyPosts /></AppShell>
// //           </ProtectedRoute>
// //         }
// //       />
// //       <Route
// //         path="/commits"
// //         element={
// //           <ProtectedRoute>
// //             <AppShell><Commits /></AppShell>
// //           </ProtectedRoute>
// //         }
// //       />

// //       {/* defaults */}
// //       <Route path="/" element={<Navigate to="/feed" replace />} />
// //       <Route path="*" element={<Navigate to="/feed" replace />} />
// //     </Routes>
// //   );
// // }


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
// import Navbar from "./Components/Navbar/Navbar";

// function AppShell({ children }) {
//   return (
//     <div className="app-shell">
//       <Navbar />
//       <div className="app-content">{children}</div>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <Routes>
//       {/* public */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<SignUp />} />

//       {/* protected */}
//       <Route
//         path="/feed"
//         element={<ProtectedRoute><AppShell><Feed /></AppShell></ProtectedRoute>}
//       />

//       {/* ✅ put /post/new BEFORE any other /post/... routes */}
//       <Route
//         path="/post/new"
//         element={<ProtectedRoute><AppShell><PostEditor /></AppShell></ProtectedRoute>}
//       />
//       <Route
//         path="/post/edit/:id"
//         element={<ProtectedRoute><AppShell><EditPost /></AppShell></ProtectedRoute>}
//       />

//       <Route
//         path="/my-posts"
//         element={<ProtectedRoute><AppShell><MyPosts /></AppShell></ProtectedRoute>}
//       />
//       <Route
//         path="/commits"
//         element={<ProtectedRoute><AppShell><Commits /></AppShell></ProtectedRoute>}
//       />

//       {/* defaults */}
//       <Route path="/" element={<Navigate to="/feed" replace />} />
//       <Route path="*" element={<Navigate to="/feed" replace />} />
//     </Routes>
//   );
// }

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

import Feed from "./Components/Feed/Feed";
import PostEditor from "./Components/PostEditor/PostEditor";
import MyPosts from "./Components/MyPosts/MyPosts";
import Commits from "./Components/Commits/Commits";
import EditPost from "./Components/EditPost/EditPost";

import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";

// ⬇️ use the new hamburger + drawer sidebar instead of the top navbar
import Sidebar from "./Components/Sidebar/Sidebar";

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* public */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* protected */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <AppShell><Feed /></AppShell>
          </ProtectedRoute>
        }
      />

      {/* keep /post/new before other /post/... routes */}
      <Route
        path="/post/new"
        element={
          <ProtectedRoute>
            <AppShell><PostEditor /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/post/edit/:id"
        element={
          <ProtectedRoute>
            <AppShell><EditPost /></AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-posts"
        element={
          <ProtectedRoute>
            <AppShell><MyPosts /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/commits"
        element={
          <ProtectedRoute>
            <AppShell><Commits /></AppShell>
          </ProtectedRoute>
        }
      />

      {/* defaults */}
      <Route path="/" element={<Navigate to="/feed" replace />} />
      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Routes>
  );
}
