import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    category: [],
    specifications: [],
    shippingInfo: {
      weight: "",
      dimensions: { length: "", width: "", height: "" },
      shippingClass: "",
    },
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const cloud_name = import.meta.env.VITE_CLOUD_NAME
  const preset_name  = import.meta.env.VITE_PRESET_NAME

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addCategory = () => {
    if (categoryInput.trim()) {
      setForm((prev) => ({
        ...prev,
        category: [...prev.category, categoryInput.trim()],
      }));
      setCategoryInput("");
    }
  };

  const removeCategory = (index) => {
    setForm((prev) => ({
      ...prev,
      category: prev.category.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    if (specKey && specValue) {
      setForm((prev) => ({
        ...prev,
        specifications: [
          ...prev.specifications,
          { key: specKey, value: specValue },
        ],
      }));
      setSpecKey("");
      setSpecValue("");
    }
  };

  const removeSpecification = (index) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      shippingInfo: {
        ...prev.shippingInfo,
        [name]: value,
      },
    }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      shippingInfo: {
        ...prev.shippingInfo,
        dimensions: {
          ...prev.shippingInfo.dimensions,
          [name]: value,
        },
      },
    }));
  };

  const uploadImagesToCloudinary = async () => {
    const uploadPromises = images.map(async (image) => {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", preset_name); // replace with your Cloudinary preset

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, // replace with your cloud name
        formData
      );

      return res.data.secure_url;
    });
    console.log(Promise.all(uploadPromises))
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Upload images
      const uploadedImageUrls = await uploadImagesToCloudinary();

      // Step 2: Prepare full product data
      const productData = {
        ...form,
        images: uploadedImageUrls,
      };

      // Step 3: Send to your backend
      await axios.post(`${BACKEND_URL}/api/products`, productData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      navigate("/vendor/products");
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required className="input" />
          <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required className="input" />
          <input type="number" name="originalPrice" placeholder="Original Price" value={form.originalPrice} onChange={handleChange} className="input" />
          <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required className="input" />
        </div>
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="input h-28" required />

        {/* Categories */}
        <div>
          <label className="font-semibold block mb-1">Categories</label>
          <div className="flex gap-2">
            <input type="text" value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)} placeholder="Enter category" className="input flex-1" />
            <button type="button" className="btn" onClick={addCategory}>Add</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.category.map((cat, idx) => (
              <span key={idx} className="bg-gray-200 px-3 py-1 rounded-full">
                {cat} <button onClick={() => removeCategory(idx)} className="ml-1 text-red-500">&times;</button>
              </span>
            ))}
          </div>
        </div>

        {/* Specifications */}
        <div>
          <label className="font-semibold block mb-1">Specifications</label>
          <div className="flex gap-2">
            <input type="text" placeholder="Key" value={specKey} onChange={(e) => setSpecKey(e.target.value)} className="input" />
            <input type="text" placeholder="Value" value={specValue} onChange={(e) => setSpecValue(e.target.value)} className="input" />
            <button type="button" className="btn" onClick={addSpecification}>Add</button>
          </div>
          <div className="mt-2 space-y-1">
            {form.specifications.map((spec, idx) => (
              <div key={idx} className="bg-gray-100 p-2 rounded flex justify-between">
                <span>{spec.key}: {spec.value}</span>
                <button onClick={() => removeSpecification(idx)} className="text-red-500 text-sm">&times;</button>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Shipping Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="number" name="weight" placeholder="Weight (kg)" value={form.shippingInfo.weight} onChange={handleShippingChange} className="input" />
            <input type="number" name="length" placeholder="Length" value={form.shippingInfo.dimensions.length} onChange={handleDimensionChange} className="input" />
            <input type="number" name="width" placeholder="Width" value={form.shippingInfo.dimensions.width} onChange={handleDimensionChange} className="input" />
            <input type="number" name="height" placeholder="Height" value={form.shippingInfo.dimensions.height} onChange={handleDimensionChange} className="input" />
            <input type="text" name="shippingClass" placeholder="Shipping Class" value={form.shippingInfo.shippingClass} onChange={handleShippingChange} className="input" />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block font-semibold mb-1">Upload Images</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="input" />
          <div className="flex gap-2 mt-2 flex-wrap">
            {previewImages.map((src, idx) => (
              <div key={idx} className="relative">
                <img src={src} alt={`preview-${idx}`} className="w-24 h-24 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary w-full py-2 mt-4">Submit Product</button>
      </form>
    </div>
  );
}
