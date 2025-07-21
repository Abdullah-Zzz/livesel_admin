import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";


const colorOptions = ["Red", "Blue", "Black", "White", "Green"].map(c => ({ value: c, label: c }));
const sizeOptions = ["S", "M", "L", "XL", "XXL"].map(s => ({ value: s, label: s }));
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export default function ProductAttributes() {
  const [attributes, setAttributes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", colors: [], sizes: [] });

  const fetchAttributes = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/attribute`, { withCredentials: true });
      setAttributes(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchAttributes(); }, []);

  const resetForm = () => {
    setForm({ name: "", colors: [], sizes: [] });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddOrUpdate = async () => {
    if (!form.name || form.colors.length === 0 || form.sizes.length === 0) {
      return alert("Please fill all fields.");
    }

    const payload = {
      name: form.name,
      colors: form.colors.map(c => c.value),
      sizes: form.sizes.map(s => s.value),
    };

    try {
      if (editingId) {
        await axios.put(`${BACKEND_URL}/api/attribute/${editingId}`, payload, { withCredentials: true });
      } else {
        await axios.post(`${BACKEND_URL}/api/attribute`, payload, { withCredentials: true });
      }

      fetchAttributes();
      resetForm();
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const handleEdit = (attr) => {
    setForm({
      name: attr.name,
      colors: attr.colors.map(c => ({ value: c, label: c })),
      sizes: attr.sizes.map(s => ({ value: s, label: s })),
    });
    setEditingId(attr._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/attribute/${id}`, { withCredentials: true });
      fetchAttributes();
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Product Attributes</h2>

      {/* Attribute List */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your Attributes</h3>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            <FaPlus className="mr-2" /> Add Attribute
          </button>
        </div>

        {attributes.length === 0 ? (
          <p className="text-gray-500">No attributes added yet.</p>
        ) : (
          <div className="space-y-3">
            {attributes.map(attr => (
              <div key={attr._id} className="border p-4 rounded flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{attr.name}</p>
                  <p className="text-sm text-gray-700">Colors: {attr.colors.join(", ")}</p>
                  <p className="text-sm text-gray-700">Sizes: {attr.sizes.join(", ")}</p>
                </div>
                <div className="flex gap-3 mt-1">
                  <button onClick={() => handleEdit(attr)} className="text-blue-600"><FaEdit /></button>
                  <button onClick={() => handleDelete(attr._id)} className="text-red-500"><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-16 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={resetForm}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <FaTimes size={18} />
            </button>

            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Attribute" : "Add New Attribute"}
            </h3>

            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Attribute Name"
              className="w-full border p-2 rounded mb-4"
            />

            <label className="block mb-1 font-medium">Select Colors</label>
            <Select
              isMulti
              options={colorOptions}
              value={form.colors}
              onChange={(selected) => setForm({ ...form, colors: selected })}
              className="mb-4"
            />

            <label className="block mb-1 font-medium">Select Sizes</label>
            <Select
              isMulti
              options={sizeOptions}
              value={form.sizes}
              onChange={(selected) => setForm({ ...form, sizes: selected })}
              className="mb-4"
            />

            <button
              onClick={handleAddOrUpdate}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              {editingId ? "Update Attribute" : "Add Attribute"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
