import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StoreInfo() {
  const [storeData, setStoreData] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${
    import.meta.env.VITE_CLOUD_NAME
  }/image/upload`;
  const UPLOAD_PRESET = import.meta.env.VITE_PRESET_NAME;

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/store`, { withCredentials: true })
      .then((res) => {
        setStoreData(res.data.store);
        setLoading(false);
      })
      .catch(() => {
        setMessage("Error fetching store info.");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("contact.")) {
      const field = name.split(".")[1];
      setStoreData({
        ...storeData,
        contact: { ...storeData.contact, [field]: value },
      });
    } else if (name.includes("socialMedia.")) {
      const field = name.split(".")[1];
      setStoreData({
        ...storeData,
        socialMedia: { ...storeData.socialMedia, [field]: value },
      });
    } else {
      setStoreData({ ...storeData, [name]: value });
    }
  };

  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    try {
      const res = await axios.post(CLOUDINARY_URL, formData);
      return { public_id: res.data.public_id, url: res.data.secure_url };
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      let logo = storeData.media?.logo;
      let banner = storeData.media?.banner;

      if (logoFile) {
        const uploaded = await uploadToCloudinary(logoFile);
        if (uploaded) logo = uploaded;
      }

      if (bannerFile) {
        const uploaded = await uploadToCloudinary(bannerFile);
        if (uploaded) banner = uploaded;
      }

      const payload = {
        storeName: storeData.storeName,
        description: storeData.description,
        address: storeData.address,
        contact: storeData.contact,
        socialMedia: storeData.socialMedia,
        media: {
          logo,
          banner,
        },
      };

      await axios.post(`${BACKEND_URL}/api/store/update`, payload, {
        withCredentials: true,
      });

      setMessage("✅ Store updated successfully.");
      alert("✅ Store updated successfully.")
    } catch (err) {
      console.error(err);
      setMessage("❌ Error updating store.");
      alert("❌ Error updating store.")
    }

    setUpdating(false);
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading store info...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Store Info</h1>

      {message && (
        <div className="mb-4 text-sm text-center text-blue-700">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Info */}
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-700">General Info</h2>
          <div className="space-y-4">
            <input
              name="storeName"
              value={storeData.storeName}
              onChange={handleChange}
              placeholder="Store Name"
              className="w-full p-2 border rounded-md"
            />
            <textarea
              name="description"
              value={storeData.description}
              onChange={handleChange}
              placeholder="Store Description"
              rows={3}
              className="w-full p-2 border rounded-md"
            />
            <input
              name="address"
              value={storeData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Contact Info</h2>
          <div className="space-y-4">
            <input
              name="contact.phone"
              value={storeData.contact?.phone || ""}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full p-2 border rounded-md"
            />
            <input
              name="contact.email"
              value={storeData.contact?.email || ""}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Social Media</h2>
          <div className="space-y-4">
            <input
              name="socialMedia.instagram"
              value={storeData.socialMedia?.instagram || ""}
              onChange={handleChange}
              placeholder="Instagram"
              className="w-full p-2 border rounded-md"
            />
            <input
              name="socialMedia.facebook"
              value={storeData.socialMedia?.facebook || ""}
              onChange={handleChange}
              placeholder="Facebook"
              className="w-full p-2 border rounded-md"
            />
            <input
              name="socialMedia.twitter"
              value={storeData.socialMedia?.twitter || ""}
              onChange={handleChange}
              placeholder="Twitter"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Store Logo</h2>
          <div className="flex items-center gap-4">
            {logoFile ? (
              <img
                src={URL.createObjectURL(logoFile)}
                alt="logo"
                className="h-20 w-20 object-cover rounded border"
              />
            ) : (
              storeData.media?.logo?.url && (
                <img
                  src={storeData.media.logo.url}
                  alt="logo"
                  className="h-20 w-20 object-cover rounded border"
                />
              )
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files[0])}
              className="block"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          disabled={updating}
        >
          {updating ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
