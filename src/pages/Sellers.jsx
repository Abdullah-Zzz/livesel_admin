import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tab, setTab] = useState("verified");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchSellers();
  }, [page, tab]);

  const fetchSellers = () => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/api/admin/sellers?page=${page}`, {
        withCredentials: true,
      })
      .then((res) => {
        const allSellers = res.data.sellers;
        const filtered = allSellers.filter((s) =>
          tab === "verified" ? s.isSellerVerified : !s.isSellerVerified
        );
        setSellers(filtered);
        setTotalPages(res.data.pages); // Keep page count general
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch sellers:", err);
        setLoading(false);
      });
  };

  const toggleVerification = (sellerId, approve) => {
    axios
      .post(
        `${BACKEND_URL}/api/admin/sellers/verify`,
        { sellerId, approve },
        { withCredentials: true }
      )
      .then(() => fetchSellers())
      .catch((err) => console.error("Verification error:", err));
  };

  const toggleActivation = (sellerId, activate) => {
    axios
      .put(
        `${BACKEND_URL}/api/admin/sellers/status`,
        { sellerId, activate },
        { withCredentials: true }
      )
      .then(() => fetchSellers())
      .catch((err) => console.error("Activation error:", err));
  };

  if (loading) return <p className="text-gray-500">Loading sellers...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Sellers</h1>

      {/* Tabs */}
      <div className="flex gap-3 border-b">
        {["verified", "unverified"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setPage(1);
            }}
            className={`px-4 py-2 font-medium ${tab === t
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
              }`}
          >
            {t === "verified" ? "Verified Sellers" : "Unverified Sellers"}
          </button>
        ))}
      </div>

      {/* Seller Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller._id} className="border-b">
                <td className="px-4 py-2">{seller.name}</td>
                <td className="px-4 py-2">{seller.email}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${seller.isSellerVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {seller.isSellerVerified ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {seller.isActive ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-2 space-x-2">
                  {!seller.isSellerVerified ? (
                    <button
                      onClick={() => toggleVerification(seller._id, true)}
                      className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Approve
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          toggleActivation(seller._id, !seller.isActive)
                        }
                        className={`text-sm px-3 py-1 rounded text-white ${seller.isActive
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                          }`}
                      >
                        {seller.isActive ? "Deactivate" : "Activate"}
                      </button>
                      {
                        seller.isSellerVerified ? null : (
                          <button
                            onClick={() => toggleVerification(seller._id, false)}
                            className="text-sm px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                          >
                            Revoke
                          </button>
                        )
                      }

                    </>
                  )}
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
