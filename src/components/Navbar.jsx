import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiLogOut, FiPackage, FiSearch } from "react-icons/fi";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const { cart } = useContext(CartContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  
  const logout = () => {
    const userName = user?.name || "User";
    localStorage.clear();
    
    toast.info(`Goodbye, ${userName}! See you soon.`, {
      position: "top-right",
      autoClose: 2000,
    });

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSearchMobile(false);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center gap-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold hover:text-blue-100 transition whitespace-nowrap">
            🛍️ Flipkart
          </Link>
          
          {/* Search Bar - Desktop */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-4"
          >
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-lg text-black bg-amber-50 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-r-lg transition flex items-center gap-2"
              >
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          {/* Right Navigation */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Mobile Search Icon */}
            <button
              onClick={() => setShowSearchMobile(!showSearchMobile)}
              className="md:hidden hover:text-blue-100 transition"
            >
              <FiSearch size={20} />
            </button>

            <Link to="/cart" className="relative flex items-center gap-2 hover:text-blue-100 transition">
              <FiShoppingCart size={20} />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2 md:gap-4">
                <Link to="/orders" className="flex items-center gap-2 hover:text-blue-100 transition">
                  <FiPackage size={20} />
                  <span className="hidden sm:inline">Orders</span>
                </Link>
                <span className="text-sm hidden md:inline">Hello, {user.name}</span>
                {user.isAdmin && (
                  <Link to="/admin" className="bg-orange-500 hover:bg-orange-600 px-2 md:px-3 py-1 rounded transition text-sm">
                    Admin
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-2 md:px-3 py-1 rounded transition"
                >
                  <FiLogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2 md:gap-4">
                <Link to="/login" className="hover:text-blue-100 transition text-sm">Login</Link>
                <Link to="/register" className="bg-green-500 hover:bg-green-600 px-2 md:px-3 py-1 rounded transition text-sm">Register</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearchMobile && (
          <form onSubmit={handleSearch} className="mt-4 md:hidden">
            <div className="flex w-full gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-r-lg transition flex items-center gap-2"
              >
                <FiSearch size={18} />
              </button>
            </div>
          </form>
        )}
      </div>
    </nav>
  );
};

export default Navbar;