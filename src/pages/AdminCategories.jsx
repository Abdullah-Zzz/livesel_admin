import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", icon: "" });
  const [editingSlug, setEditingSlug] = useState(null);
  const [error, setError] = useState("");
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/category`, { withCredentials: true });
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/admin/category`, form, { withCredentials: true });
      setForm({ name: "", description: "", icon: "" });
      fetchCategories();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error adding category");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BACKEND_URL}/api/admin/category/${editingSlug}`, form, { withCredentials: true });
      setEditingSlug(null);
      setForm({ name: "", description: "", icon: "" });
      fetchCategories();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error updating category");
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/category/${slug}`, { withCredentials: true });
      fetchCategories();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const startEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description, icon: cat.icon });
    setEditingSlug(cat.slug);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Manage Categories</h1>

      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-medium mb-2">{editingSlug ? "Edit Category" : "Add Category"}</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="icon"
            value={form.icon}
            onChange={handleChange}
            placeholder="Icon URL or emoji"
            className="border rounded px-3 py-2"
          />
          <button
            onClick={editingSlug ? handleUpdate : handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {editingSlug ? "Update Category" : "Add Category"}
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-medium mb-4">All Categories</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Icon</th>
                <th className="p-2">Name</th>
                <th className="p-2">Description</th>
                <th className="p-2">Slug</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-t">
                  <img src={cat.icon ? cat.icon : null} width={"30px"}/>
                  <td className="p-2 font-medium">{cat.name}</td>
                  <td className="p-2">{cat.description}</td>
                  <td className="p-2 text-sm text-gray-500">{cat.slug}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.slug)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td className="p-2" colSpan="5">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
