import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Cart</h2>
        {cart.length > 0 && (
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
            {totalItems} {totalItems === 1 ? "item" : "items"} in cart
          </div>
        )}
      </div>
      
      {cart.length === 0 ? (
        <p className="text-gray-500 text-lg">Cart is empty</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between items-center p-4 border border-gray-300 rounded-lg bg-white hover:shadow-md transition">
                <div>
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                  <p className="text-gray-600">₹{item.price} × {item.qty} = ₹{item.price * item.qty}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg mb-6">
            <h3 className="text-xl font-bold">Total: ₹{totalPrice}</h3>
            <Link 
              to="/checkout"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;