// src/pages/Stores.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  

  useEffect(() => {
    fetchStores();
  }, [page]);

  const fetchStores = () => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/api/admin/stores?page=${page}`, { withCredentials: true })
      .then((res) => {
        setStores(res.data.stores);
        setTotalPages(res.data.pages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch stores:", err);
        setLoading(false);
      });
  };

  const toggleVerification = (storeId, approve) => {
    axios
      .post(
        `${BACKEND_URL}/api/admin/stores/verify`,
        { storeId, approve },
        { withCredentials: true }
      )
      .then(() => fetchStores())
      .catch((err) => console.error("Verification error:", err));
  };

  const toggleActive = (storeId, activate) => {
    axios
      .put(
        `${BACKEND_URL}/api/admin/stores/status`,
        { storeId, activate },
        { withCredentials: true }
      )
      .then(() => fetchStores())
      .catch((err) => console.error("Activation error:", err));
  };

  if (loading) return <p className="text-gray-500">Loading stores...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Stores</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-3">Store Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store._id} className="border-b">
                <td className="px-4 py-2">{store.storeName}</td>
                <td className="px-4 py-2">{store.contact?.email}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      store.verificationStatus === "verified"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {store.verificationStatus}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {store.settings?.isActive ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-2 space-x-2">
                  {store.verificationStatus !== "verified" && (
                    <button
                      onClick={() => toggleVerification(store._id, true)}
                      className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Approve
                    </button>
                  )}
                  {store.verificationStatus === "verified" && (
                    <button
                      onClick={() => toggleVerification(store._id, false)}
                      className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Revoke
                    </button>
                  )}
                  <button
                    onClick={() =>
                      toggleActive(store._id, !store.settings?.isActive)
                    }
                    className="text-sm px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    {store.settings?.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <Link
                    to={`/admin/stores/${store._id}`}
                    className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-gray-600 font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
