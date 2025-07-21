import React, { useState,useEffect } from 'react';
import { Star, Bookmark, Truck, Info } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function OrderDetailsPage() {
  const { id } = useParams(); // Get order ID from route params
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/orders/get/${id}`, {
          withCredentials: true,
        });
        setOrder(res.data.order);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading order...</div>;
  if (!order) return <div className="text-center py-10 text-red-500">Order not found.</div>;


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium">
              ← ORDERS
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-gray-400" />
            <Star className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-blue-100 rounded-lg p-4">
              <h1 className="text-lg font-semibold text-gray-800">
                Order#15500 → Order Items
              </h1>
            </div>

            {/* Order Items Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Item</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Cost</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Qty</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <div className="w-8 h-8 bg-gray-400 rounded"></div>
                          </div>
                          <span className="text-sm text-gray-800">Takshashila Paithani 108</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">₹1.90</td>
                      <td className="px-4 py-4 text-sm text-gray-600">1</td>
                      <td className="px-4 py-4 text-sm text-gray-600">₹1.90</td>
                      <td className="px-4 py-4 text-sm text-gray-600">₹0.10</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <Truck className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-800">Free Shipping</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600"></td>
                      <td className="px-4 py-4 text-sm text-gray-600"></td>
                      <td className="px-4 py-4 text-sm text-gray-600">₹0.00</td>
                      <td className="px-4 py-4 text-sm text-gray-600">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Discount</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-600">₹0.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Shipping</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-600">₹0.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tax:</span>
                  <span className="text-sm text-gray-600">₹0.10</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800">Order Total:</span>
                    <span className="text-sm font-medium text-gray-800">₹2.00</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-600">Refunded:</span>
                  <span className="text-sm text-red-600">₹0.00</span>
                </div>
              </div>
            </div>

            {/* Shipments */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipments</h3>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No shipment found</p>
                <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
                  CREATE NEW SHIPMENT
                </button>
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Billing Address</h3>
                <div className="text-gray-500">Address details would go here</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h3>
                <div className="text-gray-500">Address details would go here</div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Details */}
          <div className="space-y-6">
            {/* General Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">General Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Order Status: </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    Processing
                  </span>
                  <button className="ml-2 text-xs text-blue-600 hover:underline">Edit</button>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Order Date: </span>
                  <span className="text-sm text-gray-800">16/07/2025, 8:08 PM</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Earning From Order: </span>
                  <span className="text-sm text-gray-800">₹1.98</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Customer: </span>
                  <span className="text-sm text-gray-800">Mitesh gujar</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email: </span>
                  <span className="text-sm text-gray-800">iosh619@gmail.com</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Phone: </span>
                  <span className="text-sm text-gray-800">918888477619</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Customer IP: </span>
                  <span className="text-sm text-gray-800">223.233.80.230</span>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Notes</h3>
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-700">
                  Order status changed from Pending payment to Processing.
                </p>
                <p className="text-xs text-gray-500 mt-1">added 4 days ago Delete note</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Add note</h4>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 text-sm"
                  placeholder="Enter your note..."
                />
                <p className="text-xs text-gray-500">Customer note</p>
                <button className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors">
                  ADD NOTE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


