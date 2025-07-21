// src/pages/VendorProducts.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBoxOpen } from "react-icons/fa";

export default function VendorProducts() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState("");

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const handleDelete = async (productId) => {
        const confirmDelete = confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${BACKEND_URL}/api/products/${productId}`, {
                withCredentials: true,
            });
            const updated = products.filter((p) => p._id !== productId);
            setProducts(updated);
            setFilteredProducts(updated);
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Failed to delete product");
        }
    };

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/products/seller/my-products`, {
            withCredentials: true,
        })
            .then((res) => {
                setProducts(res.data.products);
                setFilteredProducts(res.data.products);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleFilter = () => {
        let result = [...products];
        if (search.trim()) {
            result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        if (category) {
            result = result.filter(p => p.category === category);
        }
        if (brand) {
            result = result.filter(p => p.brand === brand);
        }
        if (type) {
            result = result.filter(p => p.type === type);
        }
        if (date) {
            result = result.filter(p => new Date(p.createdAt).toLocaleDateString() === date);
        }
        setFilteredProducts(result);
    };

    const resetFilters = () => {
        setSearch("");
        setCategory("");
        setBrand("");
        setType("");
        setDate("");
        setFilteredProducts(products);
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <h1 className="text-2xl font-bold">All Products</h1>
                <div className="space-y-2 md:space-y-0 md:space-x-2 flex flex-col md:flex-row items-start md:items-center font-bold">
                    <Link to="/vendor/add-product" className="bg-red-700 text-white px-6 py-2 rounded flex items-center w-full justify-center md:w-auto">
                        <FaBoxOpen className="mr-2" /> Add New Product
                    </Link>
                    <button className="bg-red-700 text-white px-6 py-2 rounded">Import</button>
                    <button className="bg-red-700 text-white px-6 py-2 rounded">Export</button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <input type="text" className="border p-2 rounded" placeholder="All dates (dd/mm/yyyy)"
                    value={date} onChange={e => setDate(e.target.value)} />
                <input type="text" className="border p-2 rounded" placeholder="Category"
                    value={category} onChange={e => setCategory(e.target.value)} />
                <input type="text" className="border p-2 rounded" placeholder="Product Type"
                    value={type} onChange={e => setType(e.target.value)} />
                <input type="text" className="border p-2 rounded" placeholder="Brand"
                    value={brand} onChange={e => setBrand(e.target.value)} />
            </div>

            <div className="flex flex-col md:flex-row gap-2 mb-4">
                <button onClick={handleFilter} className="bg-gray-200 px-4 py-2 rounded">Filter</button>
                <button onClick={resetFilters} className="bg-gray-200 px-4 py-2 rounded">Reset</button>
                <input type="text" placeholder="Search Products" className="border p-2 rounded flex-1" value={search} onChange={(e) => setSearch(e.target.value)} />
                <button onClick={handleFilter} className="bg-red-700 text-white px-4 py-2 rounded">Search</button>
            </div>

            <div className="mb-2">
                <select className="border p-2 rounded"><option>Bulk Actions</option></select>
                <button className="bg-red-600 text-white px-4 py-2 rounded ml-2">Apply</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border mt-4 text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2">Image</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Stock</th>
                            <th>Price</th>
                            <th>Earning</th>
                            <th>Views</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product._id} className="border-t">
                                <td className="p-2">
                                    <input type="checkbox" className="mr-2" />
                                    <img src={product.images?.[0]} alt={product.name} className="w-10 h-10 object-cover" />
                                </td>
                                <td>
                                    <Link to={`/vendor/edit-product/${product._id}`} className="font-semibold text-blue-600">
                                        {product.name}
                                    </Link>
                                    <div className="text-xs text-gray-500">
                                        <Link to={`/vendor/edit-product/${product._id}`} className="mr-2">Edit</Link>
                                        <button onClick={() => handleDelete(product._id)} className="text-red-500 mr-2">Delete</button>
                                        <Link to="#" className="mr-2">View</Link>
                                        <Link to="#" className="mr-2">Quick Edit</Link>
                                        <Link to="#">Duplicate</Link>
                                    </div>
                                </td>
                                <td>
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Online</span>
                                </td>
                                <td className="text-green-700">{product.stock > 0 ? `In stock x ${product.stock}` : <span className="text-yellow-600">Out of stock</span>}</td>
                                <td>
                                    <div className="line-through text-red-500">
                                        ₹{product.originalPrice?.toFixed(2)}
                                    </div>
                                    <div className="text-black font-medium">
                                        ₹{product.price?.toFixed(2)}
                                    </div>
                                </td>
                                <td>₹{(product.earning || 0).toFixed(2)}</td>
                                <td>{product.views || 0}</td>
                                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}