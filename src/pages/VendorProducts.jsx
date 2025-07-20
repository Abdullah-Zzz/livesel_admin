// src/pages/VendorProducts.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function VendorProducts() {
    const [products, setProducts] = useState([]);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const handleDelete = async (productId) => {
        const confirmDelete = confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${BACKEND_URL}/api/products/${productId}`, {
                withCredentials: true,
            });

            setProducts(products.filter((p) => p._id !== productId));
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Failed to delete product");
        }
    };


    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/products/seller/my-products`, {
            withCredentials: true,
        })
            .then((res) => setProducts(res.data.products))
            .catch((err) => console.error(err));
    }, []);
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">My Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                    <div key={product._id} className="border p-4 shadow-sm rounded">
                        <Link to={`/vendor/edit-product/${product._id}`}><img src={product.images?.[0]} alt={product.name} className="w-full h-40 object-cover mb-2" /></Link>
                        <h2 className="font-semibold">{product.name}</h2>
                        <p>Rs. {product.price}</p>
                        <p className="text-sm text-gray-500">{product.category?.join(", ")}</p>
                        <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:underline"
                        >
                            Delete
                        </button>

                    </div>

                ))}
            </div>
        </div>
    );
}
