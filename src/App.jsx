// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardHome from "./pages/AdminDashboardHome";
import Sellers from "./pages/Sellers";
import Stores from "./pages/Stores";
import Orders from "./pages/Orders";
import AdminLogin from "./pages/AdminLogin";
import RequireAdmin from "./components/RequireAdmin";
import StoreDetails from "./pages/StoreDetails"
import Products from "./pages/Products";
import AdminCategories from "./pages/AdminCategories"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboardHome />} />
          <Route path="sellers" element={<Sellers />} />
          <Route path="stores" element={<Stores />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="stores/:id" element={<StoreDetails/>}/>
          <Route path="categories" element={<AdminCategories/>}/>
        </Route>

        <Route path="*" element={<p className="p-6">Page not found</p>} />
      </Routes>
    </BrowserRouter>
  );
}
