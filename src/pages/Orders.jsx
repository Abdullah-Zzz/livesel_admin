// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState({ status: "", page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = () => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/api/admin/orders`, {
        params: filter,
        withCredentials: true
      })
      .then((res) => {
        setOrders(res.data.orders);
        setTotalPages(res.data.pages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  };

  const cancelOrder = (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    axios
      .put(`${BACKEND_URL}/api/admin/orders/${id}/cancel`, {}, { withCredentials: true })
      .then(() => {
        alert("Order cancelled.");
        fetchOrders();
      })
      .catch((err) => {
        alert("Failed to cancel order.");
        console.error(err);
      });
  };

  const statuses = ["", "pending", "processing", "shipped", "delivered", "cancelled", "returned"];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">All Orders</h1>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <select
          className="p-2 border rounded"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All Statuses"}
            </option>
          ))}
        </select>
        <button
          onClick={() => setFilter({ ...filter, page: 1 })}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Apply
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="p-4 text-gray-500">No orders found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Buyer</th>
                <th className="text-left px-4 py-2">Total</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="px-4 py-2">{order.buyer?.name}</td>
                  <td className="px-4 py-2">${order.totalAmount}</td>
                  <td className="px-4 py-2 capitalize">{order.status}</td>
                  <td className="px-4 py-2 space-x-2">
                    {["pending", "processing"].includes(order.status) && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="text-sm px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setFilter({ ...filter, page: idx + 1 })}
            className={`px-3 py-1 rounded ${
              filter.page === idx + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
