import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import VendorLayout from "./layouts/VendorLayout";
import AdminDashboardHome from "./pages/AdminDashboardHome";
import VendorDashboardHome from "./pages/VendorDashboardHome";
import Sellers from "./pages/Sellers";
import Stores from "./pages/Stores";
import Orders from "./pages/Orders";
import AdminLogin from "./pages/AdminLogin";
import VendorLogin from "./pages/VendorLogin";
import RequireAdmin from "./components/RequireAdmin";
import RequireVendor from "./components/RequireVendor";
import StoreDetails from "./pages/StoreDetails";
import Products from "./pages/Products";
import AdminCategories from "./pages/AdminCategories";
import VendorProducts from "./pages/VendorProducts"
import AddProduct from "./pages/AddProduct"
import StoreInfo from "./pages/StoreInfo"
import EditProduct from "./pages/EditProduct"
import VendorOrders from "./pages/VendorOrders";
import ShippingZones from "./pages/ShippingZones"
import OrderDetailsPage from "./pages/orderInfo"
import ProductAttributes from "./pages/ProductAttributes"


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------------- Admin Panel ---------------- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/"
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
          <Route path="stores/:id" element={<StoreDetails />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>

        {/* ---------------- Vendor Panel ---------------- */}
        <Route path="/vendor/login" element={<VendorLogin/>}/>
        <Route path="/vendor" element={<RequireVendor><VendorLayout /></RequireVendor>}>
          <Route index element={<VendorDashboardHome />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="store-info" element={<StoreInfo />} />
          <Route path="orders" element={<VendorOrders/>}/>
          <Route path="shipping" element={<ShippingZones/>}/>
          <Route path="order/:id" element={<OrderDetailsPage/>}/>
          <Route path="attributes" element={<ProductAttributes/>}/>
        </Route>


        {/* ---------------- Not Found ---------------- */}
        <Route path="*" element={<p className="p-6">Page not found</p>} />
      </Routes>
    </BrowserRouter>
  );
}
