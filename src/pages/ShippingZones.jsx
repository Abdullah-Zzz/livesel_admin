import React, { useState } from "react";
import Select from "react-select";
import { indianStates } from "../assets/indianStates";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const stateOptions = indianStates.map((state) => ({
  label: state,
  value: state,
}));

export default function ShippingZones() {
  const [zones, setZones] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    zoneName: "",
    states: [],
    shippingType: "free",
    rate: ""
  });

  const resetForm = () => {
    setForm({ zoneName: "", states: [], shippingType: "free", rate: "" });
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleAddOrUpdateZone = () => {
    if (!form.zoneName || form.states.length === 0) return alert("Please fill all required fields.");
    const newZone = {
      ...form,
      states: form.states.map((s) => s.value)
    };

    const updatedZones = [...zones];
    if (editingIndex !== null) {
      updatedZones[editingIndex] = newZone;
    } else {
      updatedZones.push(newZone);
    }
    setZones(updatedZones);
    resetForm();
  };

  const handleEdit = (index) => {
    const zone = zones[index];
    setForm({
      zoneName: zone.zoneName,
      states: zone.states.map((s) => ({ value: s, label: s })),
      shippingType: zone.shippingType,
      rate: zone.rate
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updatedZones = [...zones];
    updatedZones.splice(index, 1);
    setZones(updatedZones);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Shipping Zones</h2>

      {/* List of Zones */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your Zones</h3>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            <FaPlus className="mr-2" /> Add Zone
          </button>
        </div>

        {zones.length === 0 ? (
          <p className="text-gray-500">No zones added yet.</p>
        ) : (
          <div className="space-y-3">
            {zones.map((zone, index) => (
              <div key={index} className="border p-4 rounded flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{zone.zoneName}</p>
                  <p className="text-sm text-gray-700">
                    States: {zone.states.join(", ")}
                  </p>
                  <p className="text-sm text-gray-700">
                    Shipping: {zone.shippingType === "free" ? "Free" : `Flat ₹${zone.rate}`}
                  </p>
                </div>
                <div className="flex gap-3 mt-1">
                  <button onClick={() => handleEdit(index)} className="text-blue-600"><FaEdit /></button>
                  <button onClick={() => handleDelete(index)} className="text-red-500"><FaTrash /></button>
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
              {editingIndex !== null ? "Edit Zone" : "Add New Zone"}
            </h3>

            <input
              value={form.zoneName}
              onChange={(e) => setForm({ ...form, zoneName: e.target.value })}
              placeholder="Zone Name"
              className="w-full border p-2 rounded mb-4"
            />

            <label className="block mb-1 font-medium">Select States</label>
            <Select
              isMulti
              options={stateOptions}
              value={form.states}
              onChange={(selected) => setForm({ ...form, states: selected })}
              className="mb-4"
            />

            <div className="mb-4">
              <label className="block font-medium mb-1">Shipping Type</label>
              <select
                value={form.shippingType}
                onChange={(e) => setForm({ ...form, shippingType: e.target.value })}
                className="w-full border p-2 rounded"
              >
                <option value="free">Free</option>
                <option value="flat">Flat Rate</option>
              </select>
            </div>

            {form.shippingType === "flat" && (
              <input
                type="number"
                placeholder="Enter flat rate"
                value={form.rate}
                onChange={(e) => setForm({ ...form, rate: e.target.value })}
                className="w-full border p-2 rounded mb-4"
              />
            )}

            <button
              onClick={handleAddOrUpdateZone}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              {editingIndex !== null ? "Update Zone" : "Add Zone"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
