// src/pages/StoreDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function StoreDetails() {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/admin/stores/${id}`, { withCredentials: true })
            .then((res) => {
                setStore(res.data.store);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch store details:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p className="text-gray-500">Loading store...</p>;
    if (!store) return <p className="text-red-500">Store not found.</p>;

    const seller = store.seller;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">
                Store: {store.storeName}
            </h1>

            {/* Store Info */}
            <section className="bg-white rounded-xl shadow p-6 space-y-2">
                <h2 className="text-lg font-semibold text-gray-700">Store Info</h2>
                <p><span className="font-medium">Email:</span> {store.contact?.email}</p>
                <p><span className="font-medium">Phone:</span> {store.contact?.phone}</p>
                <p><span className="font-medium">WhatsApp:</span> {store.contact?.whatsapp}</p>
                <p><span className="font-medium">Address:</span> {store.address}</p>
                <p><span className="font-medium">Status:</span>{" "}
                    {store.settings?.isActive ? (
                        <span className="text-green-600 font-medium">Active</span>
                    ) : (
                        <span className="text-red-600 font-medium">Inactive</span>
                    )}
                </p>
                <p><span className="font-medium">Verified:</span>{" "}
                    {store.verificationStatus === "verified" ? (
                        <span className="text-green-700 font-medium">Verified</span>
                    ) : (
                        <span className="text-yellow-600 font-medium">Not Verified</span>
                    )}
                </p>
                {store.verificationNotes && (
                    <p><span className="font-medium">Notes:</span> {store.verificationNotes}</p>
                )}
            </section>

            {/* Seller Info */}
            <section className="bg-white rounded-xl shadow p-6 space-y-2">
                <h2 className="text-lg font-semibold text-gray-700">Seller Info</h2>
                <p><span className="font-medium">Name:</span> {seller.name}</p>
                <p><span className="font-medium">Email:</span> {seller.email}</p>
                <p><span className="font-medium">Phone:</span> {seller.phone}</p>
            </section>

            {/* Products */}
            <section className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Products</h2>
                {store.products && store.products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {store.products.map((product) => (
                            <div key={product._id} className="p-4 border rounded-lg shadow-sm">
                                <p className="font-medium text-gray-800">{product.name}</p>
                                <p className="text-sm text-gray-500">${product.price}</p>
                                <p className="text-sm text-yellow-600">
                                    Rating: {product.ratings?.average || 0} ⭐ ({product.ratings?.count || 0} reviews)
                                </p>

                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No products found.</p>
                )}
            </section>

            {/* Orders */}
            <section className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Orders</h2>
                {store.orders && store.orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2">Total Amount</th>
                                    <th className="px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {store.orders.map((order) => (
                                    <tr key={order._id} className="border-t">
                                        <td className="px-4 py-2">${order.totalAmount}</td>
                                        <td className="px-4 py-2 text-gray-700">{order.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">No orders found.</p>
                )}
            </section>

            <Link
                to="/stores"
                className="inline-block mt-4 text-sm px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                ← Back to Stores
            </Link>
        </div>
    );
}
