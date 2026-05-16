import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden hover:scale-105 transform cursor-pointer w-full max-w-xs">
        <div className="w-full h-56 overflow-hidden bg-gray-100">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="p-4">
          <h4 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h4>
          <p className="text-green-600 font-bold text-xl my-2">₹{product.price}</p>
          <p className="text-sm text-gray-600">{product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
          <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;