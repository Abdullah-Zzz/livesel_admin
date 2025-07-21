import { useEffect, useState } from "react";
import { Search, Filter, Download, Eye, Trash2, Package, ShoppingCart } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [registrationFilter, setRegistrationFilter] = useState('');
  
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/seller/orders`, { withCredentials: true });
      setOrders(res.data.orders);
      setFilteredOrders(res.data.orders);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter function
  const applyFilters = () => {
    let filtered = [...orders];

    // Tab filter
    if (activeTab !== 'All') {
      switch (activeTab) {
        case 'Pending payment':
          filtered = filtered.filter(o => o.paymentStatus === 'pending');
          break;
        case 'Processing':
          filtered = filtered.filter(o => o.status === 'processing');
          break;
        case 'On hold':
          filtered = filtered.filter(o => o.status === 'on_hold');
          break;
        case 'Completed':
          filtered = filtered.filter(o => o.status === 'delivered');
          break;
        case 'Cancelled':
          filtered = filtered.filter(o => o.status === 'cancelled');
          break;
        case 'Refunded':
          filtered = filtered.filter(o => o.status === 'refunded');
          break;
        case 'Failed':
          filtered = filtered.filter(o => o.paymentStatus === 'failed');
          break;
      }
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter (basic implementation - you can enhance this)
    if (filterDate) {
      const filterDateObj = new Date(filterDate);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderedAt);
        return orderDate.toDateString() === filterDateObj.toDateString();
      });
    }

    setFilteredOrders(filtered);
  };

  const resetFilters = () => {
    setActiveTab('All');
    setSearchTerm('');
    setFilterDate('');
    setRegistrationFilter('');
    setFilteredOrders(orders);
  };

  const tabs = [
    { name: 'All', count: orders.length },
    { name: 'Pending payment', count: orders.filter(o => o.paymentStatus === 'pending').length },
    { name: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { name: 'On hold', count: orders.filter(o => o.status === 'on_hold').length },
    { name: 'Completed', count: orders.filter(o => o.status === 'delivered').length },
    { name: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length },
    { name: 'Refunded', count: orders.filter(o => o.status === 'refunded').length },
    { name: 'Failed', count: orders.filter(o => o.paymentStatus === 'failed').length }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, activeTab, searchTerm, filterDate]);

  const getStatusColor = (status, paymentStatus) => {
    if (paymentStatus === 'failed') return 'bg-red-500';
    switch (status) {
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full overflow-x-hidden">
      <div className="w-full">
        {/* Header Tabs */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`whitespace-nowrap text-xs sm:text-sm font-medium pb-2 border-b-2 transition-colors ${
                  activeTab === tab.name
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
            <select 
              value={registrationFilter}
              onChange={(e) => setRegistrationFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full lg:w-auto"
            >
              <option value="">Filter by registere...</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <div className="relative w-full lg:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Orders"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded pl-10 pr-4 py-2 text-sm w-full"
              />
            </div>
            <input
              type="date"
              placeholder="Select Date Range"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full lg:w-48"
            />
            <button 
              onClick={applyFilters}
              className="bg-gray-600 text-white px-4 py-2 rounded text-sm flex items-center justify-center gap-2 w-full lg:w-auto"
            >
              <Filter className="w-4 h-4" />
              FILTER
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button 
              onClick={resetFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded text-sm flex items-center justify-center gap-2"
            >
              🔄 RESET
            </button>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="bg-red-400 text-white px-6 py-2 rounded text-sm">
                EXPORT ALL
              </button>
              <button className="bg-red-400 text-white px-6 py-2 rounded text-sm">
                EXPORT FILTERED
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Bulk Actions</span>
            <button className="bg-red-400 text-white px-6 py-2 rounded text-sm">
              APPLY
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No orders found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-12 px-3 sm:px-6 py-3 text-left">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earning</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Date</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Shipment</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">


                      <td className="px-3 sm:px-6 py-4">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                        <div className="truncate">Order {order.orderId}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                        ${order.price?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                        ${((order.price || 0) * 0.98).toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full text-white ${
                          getStatusColor(order.status, order.paymentStatus)
                        }`}>
                          {order.paymentStatus === 'failed' ? 'Failed' : order.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                        <div className="truncate max-w-32">{order.buyer?.name || 'N/A'}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 hidden sm:table-cell">
                        {new Date(order.orderedAt).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                        —
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Link to={`/vendor/order/${order.orderId}`}>
                          <button className="bg-red-400 text-white p-1.5 sm:p-2 rounded hover:bg-red-500">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          </Link>

                          <div className="hidden sm:flex gap-1">
                            
                          </div>
                          
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorOrders;