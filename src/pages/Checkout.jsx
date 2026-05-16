import { useContext, useState } from "react";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cart } = useContext(CartContext);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const placeOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter a delivery address", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      await api.post(
        "/orders/create",
        {
          products: cart,
          totalAmount,
          address
        }
      );

      toast.success("Order placed successfully! Redirecting...", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to place order";
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
          {cart.map((item) => (
            <div key={item._id} className="mb-3 pb-3 border-b border-gray-200">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-600">₹{item.price} × {item.qty} = ₹{item.price * item.qty}</p>
            </div>
          ))}
        </div>

        <textarea
          placeholder="Enter your delivery address..."
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="4"
        />

        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="text-xl font-bold">Total: ₹{totalAmount}</h3>
        </div>

        <button 
          onClick={placeOrder}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;