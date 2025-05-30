import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets.js";
import { Link } from "react-router-dom";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { useAppContext } from "../context/AppContext";

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
  } = useAppContext();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: "Shop", href: "/shop" },
    { label: "Categories", href: "/categories" },
    { label: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    setUser(null);
    navigate("/");
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
  }, [navigate, searchQuery]);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50 font-sans transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-green-600 transition duration-300 ease-in-out hover:scale-110 transform"
        >
          LeafCart
        </Link>

        {/* Search bar (desktop) */}
        <div className="hidden md:flex flex-1 mx-6 max-w-md relative">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 pl-10 pr-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ease-in-out"
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
              className="text-gray-700 hover:text-green-600 transition duration-300 ease-in-out font-medium flex items-center transform hover:scale-110"
            >
              {item.label}
            </Link>
          ))}

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
