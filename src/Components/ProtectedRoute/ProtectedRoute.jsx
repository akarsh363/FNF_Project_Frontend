
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchMe } from "../../Services/AuthService";

const TOKEN_KEY = "token";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setValid(false);
      setChecking(false);
      return;
    }
    fetchMe()
      .then(() => setValid(true))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setValid(false);
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <div style={{ padding: 24 }}>Checking session…</div>;
  if (!valid) return <Navigate to="/login" replace />;
  return children;
}
