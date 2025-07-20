// src/pages/VendorLogin.jsx
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VendorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${BACKEND_URL}/api/users/login`, {
        email,
        password,
      }, {
        withCredentials: true,
      });

      if (res.data.user?.role === "seller") {
        navigate("/vendor");
      } else {
        setError("Unauthorized access.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
  useEffect(() => {
  axios.get(`${BACKEND_URL}/api/users/dashboard`, { withCredentials: true })
    .then(res => {
      if (res.data.user?.role === "seller") navigate("/vendor");
    });
}, []);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-96 space-y-4">
        <h2 className="text-2xl font-bold">Vendor Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
