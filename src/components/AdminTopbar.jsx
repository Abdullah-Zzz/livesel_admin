import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminTopbar() {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/users/logout`, {}, {
        withCredentials: true,
      });

      if (res.status === 200) {
        navigate("/admin/login");
      } else {
        alert("An error occurred, please try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("An error occurred, please try again.");
    }
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
