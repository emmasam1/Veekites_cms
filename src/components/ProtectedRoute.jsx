import React from "react";
import { Navigate } from "react-router";
import { useApp } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useApp();

  // ✅ Wait until context finishes checking sessionStorage
  if (loading) return null; // or a loader/spinner if you prefer

  // ✅ No token → redirect to login
  if (!token) return <Navigate to="/" replace />;

  // ✅ Token exists → render the route
  return children;
};

export default ProtectedRoute;
