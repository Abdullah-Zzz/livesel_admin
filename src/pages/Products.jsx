import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/products`, { withCredentials: true })
      .then((res) => {
        setProducts(res.data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/admin/product/${productId}`,
        { settings: { isActive: !currentStatus } },
        { withCredentials: true }
      );
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? { ...p, settings: { ...p.settings, isActive: !currentStatus } }
            : p
        )
      );
    } catch (err) {
      console.error("Failed to toggle product status:", err);
    }
  };

  const deleteProduct = async (productId) => {
    const confirm = window.confirm("Are you sure you want to delete this product?");
    if (!confirm) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/products/admin/${productId}`, {
        withCredentials: true,
      });
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  if (loading) return <p className="text-gray-500">Loading products...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">All Products</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Store</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.store?.storeName || "Unknown"}</td>
                  <td className="px-4 py-2">${product.price}</td>
                  <td className="px-4 py-2">
                    {product.settings?.isActive ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-red-600 font-medium">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() =>
                        toggleProductStatus(product._id, product.settings?.isActive)
                      }
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
