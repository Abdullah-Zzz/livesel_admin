import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function VendorDashboardHome() {
    const [vendor, setVendor] = useState(null);
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, storeRes] = await Promise.all([
                    axios.get(`${BACKEND_URL}/api/users/dashboard`, { withCredentials: true }),
                    axios.get(`${BACKEND_URL}/api/store`, { withCredentials: true }),
                ]);

                const user = userRes.data.user;
                if (user?.role === "seller") {
                    setVendor(user);
                    setStore(storeRes.data.store);
                }
            } catch (err) {
                console.error("Vendor dashboard fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-6 text-gray-500">Loading dashboard...</div>;
    if (!vendor || !store) return <div className="p-6 text-red-500">Unauthorized or Store Not Found</div>;

    const { sellerInfo } = vendor;
    return (
        <div className="p-6 space-y-6">
            {/* Top Info */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                    {store?.media?.logo?.url ? (
                        <img
                            src={store.media.logo.url}
                            alt="Shop Logo"
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                            No Logo
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold">{sellerInfo?.shopName || vendor.name}</h1>
                        <p className="text-sm text-gray-500">{vendor.email}</p>
                        <p className="text-xs text-gray-600">
                            {store.verificationStatus} | {store.isActive ? "Active" : "Inactive"}
                        </p>
                    </div>
                </div>

                <Link to="/vendor/store-info">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Edit Store Info
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Products" value={store.metrics.totalProducts} color="blue" />
                <StatCard label="Orders" value={store.orders.length} color="green" />
                <StatCard
                    label="Rating"
                    value={`${store.metrics.averageRating?.toFixed(1) || "0.0"} ★`}
                    color="yellow"
                />
            </div>
            {/* Business Info */}
            {store.businessInfo?.gst || store.businessInfo?.pan ? (
                <div className="bg-white p-4 rounded shadow border border-gray-100">
                    <h2 className="text-lg font-semibold mb-2">Business Details</h2>
                    <p><strong>GST:</strong> {store.businessInfo.gst || "N/A"}</p>
                    <p><strong>PAN:</strong> {store.businessInfo.pan || "N/A"}</p>
                </div>
            ) : null}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mt-6">
                <Link to="/vendor/add-product/">
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        ➕ Add Product
                    </button>
                </Link>
                <Link to="/vendor/products">
                    <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                        View My Products
                    </button>
                </Link>
                <Link to="/vendor/orders">
                    <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                        Manage Orders
                    </button>
                </Link>
            </div>
        </div>
    );
}

const StatCard = ({ label, value, color }) => {
    const colorClass = {
        blue: "text-blue-600",
        green: "text-green-600",
        yellow: "text-yellow-500",
    }[color] || "text-gray-700";

    return (
        <div className="bg-white shadow p-4 rounded border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700">{label}</h3>
            <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
        </div>
    );
};
