import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";

const ProductDetails = () => {
  const { addToCart } = useContext(CartContext);
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: ""
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.isAdmin) {
      setIsAdmin(true);
    }

    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data));
  }, [id]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    try {
      await api.post(
        "/products/add",
        newProduct
      );
      alert("Product added successfully!");
      setNewProduct({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: ""
      });
      setShowAddForm(false);
      window.location.reload();
    } catch (error) {
      alert("Failed to add product: " + (error.response?.data || error.message));
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src={product.image} alt={product.title} className="w-full h-96 object-cover rounded-lg shadow-md" />
        <div>
          <h2 className="text-3xl font-bold mb-4">{product.title}</h2>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <h3 className="text-2xl font-semibold text-green-600 mb-6">₹{product.price}</h3>
          <button 
            onClick={() => addToCart(product)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Add to Cart
          </button>

          {isAdmin && (
            <div className="mt-8 pt-8 border-t-2 border-gray-300">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                {showAddForm ? "Cancel" : "Admin: Add New Product"}
              </button>

              {showAddForm && (
                <form
                  onSubmit={handleAddProduct}
                  className="mt-6 p-6 border border-gray-300 rounded-lg bg-gray-50"
                >
                  <h3 className="text-xl font-bold mb-4">Add New Product</h3>
                  {Object.keys(newProduct).map((key) => (
                    <input
                      key={key}
                      type={key === "price" || key === "stock" ? "number" : "text"}
                      placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={newProduct[key]}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, [key]: e.target.value })
                      }
                      className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Add Product
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;