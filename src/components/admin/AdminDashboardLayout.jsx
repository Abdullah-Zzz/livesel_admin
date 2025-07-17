import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Sellers", path: "/admin/sellers" },
  { label: "Stores", path: "/admin/stores" },
  { label: "Products", path: "/admin/products" },
  { label: "Orders", path: "/admin/orders" }
];

export default function AdminDashboardLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white p-6 border-r">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Admin Panel</h1>
        <nav className="flex flex-col gap-4">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `text-sm font-medium px-3 py-2 rounded-md ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
