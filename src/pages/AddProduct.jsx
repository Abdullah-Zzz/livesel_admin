import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    stock: "",
    category: [],
    images: [],
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [error, setError] = useState("");
  const [prodType, setProdType] = useState("")
  const [attributes, setAttributes] = useState()


  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const cloud_name = import.meta.env.VITE_CLOUD_NAME;
  const preset_name = import.meta.env.VITE_PRESET_NAME;

  const fetchAttributes = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/attribute`, { withCredentials: true });
      setAttributes(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttributes()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (previewImages.length + files.length > 4) return;
    setImages((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const removeImage = (index) => {
    const isObjectUrl = typeof previewImages[index] !== "string";
    if (isObjectUrl) {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToCloudinary = async () => {
    const uploadPromises = images.map(async (image) => {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", preset_name);
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData);
      return res.data.secure_url;
    });
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const uploadedImageUrls = await uploadImagesToCloudinary();

      if (!form.category || form.category.length === 0) {
        setError("At least one category is required.");
        alert("At least one category is required.");
        return;
      }

      const productData = {
        name: form.name,
        price: form.price,
        originalPrice: form.originalPrice,
        category: form.category,
        images: uploadedImageUrls,
        stock: form.stock,
        isActive: true,
      };

      const res = await axios.post(`${BACKEND_URL}/api/products`, productData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      navigate("/vendor/products");
    } catch (err) {
      console.error("Submit error:", err);
      const message = err.response?.data?.message || "Something went wrong. Please try again.";
      alert(message);
      setError(message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-semibold text-gray-800">Add Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <label className="font-medium block mb-1">Title</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="input w-full" required />
          </div>

          {/* <div className="bg-gray-50 p-4 rounded border text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <span>Permalink: https://livesel.com/product/{form.name?.toLowerCase().replaceAll(" ", "-")}</span>
              <button type="button" className="bg-red-500 text-white px-3 py-1 rounded">Edit</button>
            </div>
          </div> */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium block mb-1">Product Type</label>
              <select type="text" className="input w-full bg-gray-100" onChange={(e) => setProdType(e.target.value)}>
                <option value={"simple"}>Simple</option>
                <option value={"variable"}>Variable</option>
              </select>
            </div>
            <div>
              <label className="font-medium block mb-1">Category</label>
              <input type="text" value={form.category?.[0] || ""} readOnly className="input w-full bg-gray-100" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium block mb-1">Price</label>
              <input type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} className="input w-full" />
              <p className="text-xs text-gray-400 mt-1">You earn: ₹{(form.originalPrice - form.price).toFixed(2)}</p>
            </div>
            <div>
              <label className="font-medium block mb-1">Discounted Price</label>
              <div className="flex items-center gap-2">
                <input type="number" name="price" value={form.price} onChange={handleChange} className="input w-full" />
                <span className="text-blue-500 cursor-pointer">Schedule</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="font-medium block mb-1">Brand</label>
              <input type="text" className="input w-full" placeholder="Select brand" />
            </div>
            {prodType === "variable" ?
              <div>
                <label className="font-medium block mb-1">Atributes And Variations</label>
                {
                  attributes ?  <select type="text" className="input w-full bg-gray-100" onChange={(e) => setProdType(e.target.value)}>
                    {attributes.map(attr => <option value={attr.name}>{attr.name}</option>)}
                  </select> : null
                }

              </div> : null
            }
          </div>

          <div className="pt-4 border-t mt-6">
            <h3 className="font-semibold text-lg mb-2">Inventory</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" className="input w-full" placeholder="SKU (Stock Keeping Unit)" />
              <input type="text" className="input w-full" placeholder="Stock Status" value={form.stock > 0 ? "In Stock" : "Out of Stock"} readOnly />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Product Image</label>
          <div className="aspect-square border border-dashed rounded overflow-hidden">
            {previewImages[0] ? (
              <img src={previewImages[0]} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">No image</div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 mt-3">
            {previewImages.slice(1, 5).map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 border rounded overflow-hidden">
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx + 1)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {previewImages.length < 5 && (
              <label className="w-20 h-20 border border-dashed rounded flex items-center justify-center cursor-pointer">
                <Plus className="w-6 h-6 text-gray-400" />
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div className="md:col-span-3 mt-6">
          <button type="submit" className="bg-green-600 text-white w-full py-2 rounded">Submit Product</button>
        </div>
      </form>
    </div>
  );
}
