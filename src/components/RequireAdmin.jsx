// src/components/RequireAdmin.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function RequireAdmin({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/users/dashboard`, { withCredentials: true })
      .then((res) => {
        if (res.data.user?.role === "admin") {
          setIsAuthorized(true);
        }
      })
      .catch(() => {
        setIsAuthorized(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-gray-500">Checking session...</div>;

  return isAuthorized ? children : <Navigate to="/admin/login" replace />;
}
