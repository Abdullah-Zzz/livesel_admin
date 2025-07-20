import { useEffect, useState } from "react";
import axios from "axios";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/seller/orders`,{withCredentials:true}); // assumes seller is authenticated
      setOrders(res.data.orders);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-md p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-lg font-medium">Order #{order.orderId}</h3>
                  <p className="text-sm text-gray-500">Ordered At: {new Date(order.orderedAt).toLocaleString()}</p>
                </div>
                <div className="text-sm text-right">
                  <p className="font-medium text-green-600">{order.paymentStatus.toUpperCase()}</p>
                  <p className={`text-xs ${getStatusColor(order.status)}`}>Status: {order.status}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={order.product?.image || "/placeholder.jpg"}
                  alt={order.product?.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{order.product?.name}</p>
                  <p className="text-sm text-gray-600">Qty: {order.quantity}</p>
                  <p className="text-sm text-gray-600">Price: ${order.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-700">
                <p>Buyer: {order.buyer?.name}</p>
                <p>Email: {order.buyer?.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "text-yellow-500";
    case "shipped":
    case "processing":
      return "text-blue-500";
    case "delivered":
      return "text-green-600";
    case "cancelled":
    case "returned":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export default VendorOrders;
