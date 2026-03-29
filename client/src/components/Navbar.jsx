import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets.js";
import { Link } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, Bot } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const {
    user,
    setUser,
    navigate,
    setShowUserLogin,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
    clearCartLocal,
    agentLoading
  } = useAppContext();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: "Shop", href: "/shop" },
    { label: "Categories", href: "/categories" },
    { label: "Contact", href: "/contact" },
  ];

  const handleLogout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout');

      if (data.success) {
        toast.success(data.message);
        setUser(null);
        clearCartLocal(); // clear UI cart without overwriting DB
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm fixed w-full top-0 z-40 font-sans border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-green-600 transition duration-300 ease-in-out hover:scale-105 transform"
        >
          🍃 LeafCart
        </Link>

        {/* Search bar (desktop) */}
        <div className="hidden md:flex flex-1 mx-6 max-w-md relative">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2.5 pl-10 pr-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300 bg-gray-50/50 text-sm"
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700"
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setSearchQuery('')}
              className="text-gray-700 hover:text-green-600 transition duration-300 ease-in-out font-medium flex items-center transform hover:scale-110"
            >
              {item.label}
            </Link>
          ))}

          {/* Assistant Button */}
          <Link
            to="/assistant"
            className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F4C137] to-amber-400 text-amber-950 font-bold rounded-full hover:shadow-lg transition transform hover:-translate-y-0.5"
            onClick={() => setSearchQuery('')}
          >
            <Bot size={18} />
            <span className="text-sm">Leafy AI</span>
            {agentLoading && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <ShoppingCart size={24} className="text-gray-700" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {getCartCount()}
              </span>
            )}
          </Link>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="px-4 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-50 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Login
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-2 py-2 border border-green-600 rounded-full hover:bg-green-50 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <img
                  src={assets.profile_icon}
                  alt="user"
                  className="w-8 h-8"
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 space-y-2 bg-white p-3 shadow-lg rounded-xl z-10 animate-fadeIn">
                  <button
                    onClick={() => {
                      navigate("/my-orders");
                      setShowDropdown(false);
                    }}
                    className="block w-full px-2 py-2 text-xs border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowDropdown(false);
                    }}
                    className="block w-full px-4 py-2 border border-red-600 text-red-600 rounded-full hover:bg-red-50 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Icons */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Cart Icon Mobile */}
          <Link to="/cart" className="relative">
            <ShoppingCart size={24} className="text-gray-700" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {getCartCount()}
              </span>
            )}
          </Link>

          <button onClick={() => setShowSearch(!showSearch)}>
            <Search size={22} className="text-gray-700" />
          </button>
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      {showSearch && (
        <div className="md:hidden px-4 pb-2 transition-all duration-300 ease-in-out">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2 transition-all duration-300 ease-in-out animate-fadeIn">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setOpen(false)}
              className="block text-gray-700 hover:text-green-600 font-medium transform hover:scale-3d"
            >
              {item.label}
            </Link>
          ))}

          {/* Assistant Mobile */}
          <Link
            to="/assistant"
            onClick={() => setOpen(false)}
            className="relative flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-[#F4C137] to-amber-400 text-amber-950 font-bold rounded-full shadow-sm mt-2 mb-2"
          >
            <Bot size={18} /> Leafy AI
            {agentLoading && (
              <span className="absolute right-4 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-lg"></span>
              </span>
            )}
          </Link>

          {!user ? (
            <button
              className="px-4 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-50 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
            >
              Login
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/myorders");
                  setOpen(false);
                }}
                className="block w-full text-blue-400 border border-blue-400 rounded-full text-center py-2 transform hover:scale-105"
              >
                My Orders
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="block w-full text-red-600 border border-red-600 rounded-full text-center py-2 transform hover:scale-105"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
