import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { ShoppingBasket } from "lucide-react";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  return (
    product && (
      <div onClick={()=>{navigate(`/products/${product.category.toLowerCase()}/${product._id}`);scrollTo(0,0)}} className="bg-white w-full max-w-[230px] rounded-xl border border-gray-200 shadow hover:shadow-md transition-all p-4 flex flex-col cursor-pointer">
        {/* Image */}
        <div className="flex items-center justify-center h-32 sm:h-36 overflow-hidden">
          <img
            src={product.image[0]}
            alt={product.name}
            className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="mt-4 text-sm text-gray-600 flex-1">
          <p className="mb-1 capitalize">{product.category}</p>
          <p className="text-gray-900 font-semibold text-base sm:text-lg truncate">
            {product.name}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="w-3.5 sm:w-4"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="star"
                />
              ))}
            <span className="text-xs text-gray-400 ml-1">(4)</span>
          </div>

          {/* Price and Add-to-Cart */}
          <div className="flex items-end justify-between mt-4">
            <p className="text-green-600 font-semibold text-base sm:text-lg">
              {currency}{product.offerPrice}
              <span className="line-through text-gray-400 text-sm ml-1">
                ₹{product.price}
              </span>
            </p>

            <div
              onClick={(e) => e.stopPropagation()}
              className="text-primary cursor-pointer"
            >
              {!cartItems[product._id] ? (
                <button
                  onClick={() => addToCart(product._id)}
                  className="flex items-center gap-1 bg-green-100 border border-green-300 px-2.5 py-1.5 rounded-md text-green-600 text-sm font-medium hover:bg-green-200 transition"
                >
                  <ShoppingBasket className="w-4 h-4" />
                  Add
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-green-100 px-2 py-1 rounded-full text-green-600 text-sm font-medium">
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="px-2 text-lg hover:text-green-800"
                  >
                    -
                  </button>
                  <span className="w-4 text-center">
                    {cartItems[product._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="px-2 text-lg hover:text-green-800"
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
