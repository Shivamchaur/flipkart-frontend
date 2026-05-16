import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCart";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Results Header */}
      {searchQuery && (
        <div className="bg-white border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Search Results for "<span className="text-blue-600">{searchQuery}</span>"
          </h2>
          <p className="text-gray-600 mt-2">
            Found <span className="font-semibold text-lg">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Products Grid */}
      {/* Products Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 max-w-7xl  mx-auto">
        {loading ? (
          <div className="flex justify-center items-center w-full h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 w-full">
            <p className="text-gray-500 text-xl mb-4">
              {searchQuery ? "No products found matching your search" : "No products available"}
            </p>
            {searchQuery && (
              <a href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
                Clear search
              </a>
            )}
          </div>
        ) : (
          filteredProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;