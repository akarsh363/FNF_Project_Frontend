import React from "react";
import { Navigate } from "react-router-dom";

const TOKEN_KEY = "token";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
