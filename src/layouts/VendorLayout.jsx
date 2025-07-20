import VendorSidebar from "../components/VendorSidebar";
import { Outlet } from "react-router-dom";

export default function VendorLayout() {
  return (
    <div className="flex">
      <VendorSidebar />

      <main className="ml-64 flex-1 bg-gray-50 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
}
