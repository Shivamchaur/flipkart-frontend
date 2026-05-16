import { useState, useEffect } from "react";
import api from "../api/axios";
import { FiChevronDown, FiChevronUp, FiTrash2, FiEdit2 } from "react-icons/fi";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: ""
  });
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);

  // Fetch orders when tab changes
  useEffect(() => {
    if (activeTab === "orders") {
      fetchAllOrders();
    }
  }, [activeTab]);

  const fetchAllOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await api.get("/orders/admin/all-orders");
      setOrders(res.data);
      setMessage("");
    } catch (error) {
      setMessage("Failed to load orders");
      console.error(error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      await api.post("/products/add", product);

      setMessage("Product added successfully!");
      setProduct({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: ""
      });

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to add product");
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(
        `/orders/admin/update-status/${orderId}`,
        { status: newStatus }
      );

      // Update order in state
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      setEditingStatus(null);
      setMessage("Order status updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to update order status");
      console.error(error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      await api.delete(`/orders/admin/delete/${orderId}`);

      setOrders(orders.filter(order => order._id !== orderId));
      setMessage("Order deleted successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to delete order");
      console.error(error);
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "products"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Add Product
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "orders"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            All Orders
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="flex justify-center">
            <form onSubmit={handleAddProduct} className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

              {Object.keys(product).map((key) => (
                <input
                  key={key}
                  type={key === "price" || key === "stock" ? "number" : "text"}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={product[key]}
                  onChange={(e) =>
                    setProduct({ ...product, [key]: e.target.value })
                  }
                  className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}

              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors">
                Add Product
              </button>
            </form>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">All Customer Orders</h2>
              <p className="text-gray-600">Total Orders: <span className="font-bold text-xl">{orders.length}</span></p>
            </div>

            {loadingOrders ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-500 text-lg">No orders yet</p>
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
                            Order ID: <span className="font-mono">{order._id}</span>
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            Customer: <span className="font-semibold">{order.userId?.name || "Unknown"}</span>
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            Email: <span className="font-semibold">{order.userId?.email || "N/A"}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Order Date: {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="text-2xl font-bold text-green-600">
                            ₹{order.totalAmount}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.products?.length || 0} items
                          </p>
                          <button className="text-blue-600 hover:text-blue-800">
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
                        {/* Status Update */}
                        <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <FiEdit2 size={18} />
                            Order Status
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                            {["Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                              <button
                                key={status}
                                onClick={() => handleUpdateOrderStatus(order._id, status)}
                                className={`px-4 py-2 rounded-lg font-semibold transition ${
                                  order.status === status
                                    ? `${getStatusColor(status)}`
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>

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
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                          >
                            <FiTrash2 size={18} />
                            Delete Order
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;