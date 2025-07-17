// src/components/SidebarLayout.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { to: "/admin/", label: "Dashboard" },
    { to: "/admin/sellers", label: "Sellers" },
    { to: "/admin/stores", label: "Stores" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/categories", label: "Categories" }
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin/"}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition ${isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              {link.label}
            </NavLink>

          ))}
        </nav>
      </aside>


    </div>
  );
};

export default Sidebar;