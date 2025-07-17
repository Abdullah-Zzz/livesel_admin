// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrMsg("");

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/users/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.data.user?.role !== "admin") {
        setErrMsg("Access denied. Not an admin.");
        return;
      }

      navigate("/admin");
    } catch (err) {
      setErrMsg(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow w-full max-w-md space-y-5"
      >
        <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>

        {errMsg && <p className="text-red-500 text-sm">{errMsg}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
