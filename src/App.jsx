// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//    <p>Hiiiii</p>
//     </>
//   )
// }

// export default App


import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Feed from "./Components/Feed/Feed";
import PostEditor from "./Components/PostEditor/PostEditor";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/feed" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/post/new"
        element={
          <ProtectedRoute>
            <PostEditor />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
