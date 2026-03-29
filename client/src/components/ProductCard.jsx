import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { ShoppingBasket } from "lucide-react";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  return (
    product && (
      <div
        onClick={() => {
          navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
          scrollTo(0, 0);
        }}
        className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all duration-300 p-4 flex flex-col cursor-pointer"
      >
        {/* Image */}
        <div className="flex items-center justify-center h-36 sm:h-40 overflow-hidden rounded-xl bg-gradient-to-b from-green-50/60 to-white">
          <img
            src={product.image[0]}
            alt={product.name}
            className="object-contain max-h-full transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Product Info */}
        <div className="mt-3 text-sm text-gray-500 flex-1">
          <p className="text-xs uppercase tracking-wider font-medium text-green-600">{product.category}</p>
          <p className="text-gray-800 font-semibold text-base mt-1 truncate">
            {product.name}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mt-2">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="w-3.5"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="star"
                />
              ))}
            <span className="text-xs text-gray-400 ml-1">(4)</span>
          </div>

          {/* Price and Add-to-Cart */}
          <div className="flex items-end justify-between mt-3 pt-3 border-t border-gray-100">
            <div>
              <p className="text-green-600 font-bold text-lg leading-none">
                {currency}{product.offerPrice}
              </p>
              <span className="line-through text-gray-400 text-xs">
                {currency}{product.price}
              </span>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="cursor-pointer"
            >
              {!cartItems[product._id] ? (
                <button
                  onClick={() => addToCart(product._id)}
                  className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition shadow-sm hover:shadow-md"
                >
                  <ShoppingBasket className="w-4 h-4" />
                  Add
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-green-500 text-white px-2 py-1 rounded-lg text-sm font-medium">
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="px-1.5 text-base hover:bg-green-600 rounded"
                  >
                    −
                  </button>
                  <span className="w-4 text-center font-bold">
                    {cartItems[product._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="px-1.5 text-base hover:bg-green-600 rounded"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;

