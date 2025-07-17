// src/components/AdminTopbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminTopbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="flex items-center justify-between bg-white shadow px-6 py-4">
      <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
      <button
        onClick={handleLogout}
        className="text-sm text-red-500 border border-red-500 px-4 py-1 rounded hover:bg-red-50"
      >
        Logout
      </button>
    </div>
  );
}
