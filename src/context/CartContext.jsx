import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ADD TO CART
  const addToCart = (product) => {
    const exist = cart.find((item) => item._id === product._id);

    if (exist) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
      toast.info(`${product.title} quantity updated in cart!`, {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
      toast.success(`${product.title} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // REMOVE FROM CART
  const removeFromCart = (id) => {
    const product = cart.find((item) => item._id === id);
    setCart(cart.filter((item) => item._id !== id));
    toast.warning(`${product?.title} removed from cart!`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;