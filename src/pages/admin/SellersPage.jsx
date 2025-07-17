import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SellersPage() {
  const [sellers, setSellers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchSellers = () => {
    setLoading(true);
    axios
      .get("/api/admin/sellers", {
        params: { page, search },
        withCredentials: true
      })
      .then((res) => {
        setSellers(res.data.sellers);
        setTotal(res.data.total);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch sellers:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSellers();
  }, [page, search]);

  const toggleVerification = (sellerId, currentStatus) => {
    axios
      .post(
        "/api/admin/sellers/verify",
        {
          sellerId,
          approve: !currentStatus,
          notes: !currentStatus ? "Verified by admin" : "Unverified by admin"
        },
        { withCredentials: true }
      )
      .then(() => fetchSellers())
      .catch((err) => console.error("Failed to toggle verification:", err));
  };

  const toggleActive = (sellerId, currentStatus) => {
    axios
      .put(
        "/api/admin/sellers/status",
        {
          sellerId,
          activate: !currentStatus,
          reason: !currentStatus ? "Re-activated by admin" : "Deactivated by admin"
        },
        { withCredentials: true }
      )
      .then(() => fetchSellers())
      .catch((err) => console.error("Failed to toggle active status:", err));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sellers</h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg w-64"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading sellers...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Verified</th>
                <th className="p-3">Active</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller._id} className="border-t">
                  <td className="p-3">{seller.name}</td>
                  <td className="p-3">{seller.email}</td>
                  <td className="p-3">{seller.isSellerVerified ? "Yes" : "No"}</td>
                  <td className="p-3">{seller.isActive ? "Yes" : "No"}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      className={`px-3 py-1 rounded text-white text-sm ${
                        seller.isSellerVerified ? "bg-yellow-500" : "bg-green-600"
                      }`}
                      onClick={() =>
                        toggleVerification(seller._id, seller.isSellerVerified)
                      }
                    >
                      {seller.isSellerVerified ? "Unverify" : "Verify"}
                    </button>
                    <button
                      className={`px-3 py-1 rounded text-white text-sm ${
                        seller.isActive ? "bg-red-600" : "bg-blue-600"
                      }`}
                      onClick={() => toggleActive(seller._id, seller.isActive)}
                    >
                      {seller.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-end gap-2">
        {Array.from({ length: Math.ceil(total / 10) }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 border rounded ${
              page === p ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
