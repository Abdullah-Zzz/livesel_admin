import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/admin/dashboard`, { withCredentials: true })
      .then(res => {
        setStats(res.data.stats);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching dashboard stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!stats) return <p className="text-red-500">Failed to load stats.</p>;

  return (
    <div className="p-6 space-y-10">
      
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Total Sellers" value={stats.sellers.total} />
        <DashboardCard title="Verified Sellers" value={stats.sellers.verified} />
        <DashboardCard title="Active Sellers" value={stats.sellers.active} />
        <DashboardCard title="Total Stores" value={stats.stores.total} />
        <DashboardCard title="Verified Stores" value={stats.stores.verified} />
        <DashboardCard title="Active Stores" value={stats.stores.active} />
        <DashboardCard title="Total Products" value={stats.products.total} />
        <DashboardCard title="Active Products" value={stats.products.active} />
        <DashboardCard title="Orders" value={stats.orders.total} />
        <DashboardCard title="Pending Orders" value={stats.orders.pending} />
        <DashboardCard title="Completed Orders" value={stats.orders.completed} />
        <DashboardCard title="Total Revenue" value={`$${stats.orders.revenue}`} />
      </div>
    </div>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition">
      <h2 className="text-lg font-medium text-gray-600 mb-1">{title}</h2>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
