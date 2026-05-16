import { useEffect, useState } from "react";
import api from "../api/axios";
import { FiChevronDown, FiChevronUp, FiTrash2 } from "react-icons/fi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [error, setError] = useState("");
  const [cancellingOrder, setCancellingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your orders");
        setLoading(false);
        return;
      }

      const res = await api.get("/orders/my-orders");
      setOrders(res.data);
      setError("");
      setLoading(false);
    } catch (err) {
      setError("Failed to load orders. Please try again.");
      setLoading(false);
      console.error(err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setCancellingOrder(orderId);
      await api.delete(`/orders/cancel/${orderId}`);

      // Remove the cancelled order from the list
      setOrders(orders.filter(order => order._id !== orderId));
      setExpandedOrder(null);
      alert("Order cancelled successfully");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to cancel order";
      alert(errorMsg);
      console.error(err);
    } finally {
      setCancellingOrder(null);
    }
  };

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 text-lg mb-4">No orders found</p>
            <a href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div
                  onClick={() => toggleExpandOrder(order._id)}
                  className="p-6 cursor-pointer hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        Order ID: <span className="font-mono text-gray-900">{order._id}</span>
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Order Date: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-2xl font-bold text-green-600">
                        ₹{order.totalAmount}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.products?.length || 0} item{order.products?.length !== 1 ? "s" : ""}
                      </p>
                      <button className="text-blue-600 hover:text-blue-800 mt-2">
                        {expandedOrder === order._id ? (
                          <FiChevronUp size={20} />
                        ) : (
                          <FiChevronDown size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Details - Expandable */}
                {expandedOrder === order._id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    {/* Products List */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {order.products?.map((product, index) => (
                          <div
                            key={index}
                            className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-start"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800 mb-2">
                                {product.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                Quantity: <span className="font-semibold">{product.qty}</span>
                              </p>
                              <p className="text-sm text-gray-600">
                                Price: <span className="font-semibold">₹{product.price}</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">
                                ₹{product.price * product.qty}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Delivery Address
                      </h3>
                      <p className="text-gray-700">{order.address}</p>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Order Summary
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-700">
                          <span>Subtotal:</span>
                          <span>₹{order.totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                          <span>Shipping:</span>
                          <span>Free</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-lg font-bold text-gray-900">
                          <span>Total:</span>
                          <span className="text-green-600">₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {order.status === "Processing" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingOrder === order._id}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 rounded-lg transition"
                        >
                          <FiTrash2 size={18} />
                          {cancellingOrder === order._id ? "Cancelling..." : "Cancel Order"}
                        </button>
                      )}
                      <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition">
                        Track Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;