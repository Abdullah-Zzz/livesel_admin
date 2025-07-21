import { NavLink } from "react-router-dom";
import { FaBoxOpen, FaHome, FaStore, FaPlus } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VendorSidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/users/logout`, {}, {
        withCredentials: true,
      });

      if (res.status === 200) {
        navigate("/vendor/login");
      } else {
        alert("An error occurred, please try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("An error occurred, please try again.");
    }
  };

  const menuItems = [
    { path: "/vendor", label: "Dashboard", icon: <FaHome /> },
    { path: "/vendor/products", label: "My Products", icon: <FaBoxOpen /> },
    { path: "/vendor/add-product", label: "Add Product", icon: <FaPlus /> },
    { path: "/vendor/store-info", label: "Store Info", icon: <FaStore /> },
    { path: "/vendor/orders", label: "Orders", icon: <FaStore /> },
    { path: "/vendor/shipping", label: "Shipping Zones", icon: <FaStore /> },
    { path: "/vendor/attributes", label: "Attributes and Variations", icon: <FaStore /> }
  ];

  return (
    <aside
      className={`bg-white border-r shadow-sm fixed top-0 z-40 h-screen transition-transform duration-200
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static w-64`}
    >
      <div className="px-6 py-4 text-xl font-bold text-gray-800 border-b">
        Vendor Panel
      </div>

      <nav className="flex flex-col p-4 gap-2">
        {menuItems.map(({ path, label, icon }) => (
          <NavLink
            end
            key={path}
            to={path}
            onClick={() => setSidebarOpen(false)} // close on mobile click
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-all
               ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-100"}`
            }
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 w-full px-4 py-3 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-800"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
