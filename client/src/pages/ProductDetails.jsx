import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      const productCopy = products
        .filter(
          (item) => item.category === product.category && item._id !== product._id
        )
        .slice(0, 5);
      setRelatedProducts(productCopy);
    }
  }, [products, product]);

  useEffect(() => {
    setThumbnail(product?.image?.[0] || null);
  }, [product]);

  return (
    product && (
      <div className="pt-28 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <p className="text-sm text-gray-500 mb-6 flex items-center flex-wrap gap-1">
            <Link to="/" className="hover:text-green-600 transition">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link to="/products" className="hover:text-green-600 transition">
              Products
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              to={`/products/${product.category.toLowerCase()}`}
              className="hover:text-green-600 transition"
            >
              {product.category}
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-green-600 font-medium">{product.name}</span>
          </p>

          {/* Main Section */}
          <div className="flex flex-col md:flex-row gap-10">
            {/* Images */}
            <div className="flex gap-4 w-full md:w-1/2">
              <div className="flex flex-col gap-3 overflow-auto max-h-[450px]">
                {product.image.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`thumb-${i}`}
                    onClick={() => setThumbnail(img)}
                    className="w-20 h-20 object-cover border-2 border-transparent rounded-lg cursor-pointer hover:border-green-400 transition"
                  />
                ))}
              </div>
              <div className="flex-1 border border-gray-200 rounded-2xl overflow-hidden bg-gradient-to-b from-green-50/30 to-white">
                <img
                  src={thumbnail}
                  alt="Selected"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full md:w-1/2 text-gray-800">
              <h1 className="text-3xl font-semibold">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-2">
                {Array(5)
                  .fill("")
                  .map((_, i) => (
                    <img
                      key={i}
                      src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                      className="w-4 h-4"
                      alt="star"
                    />
                  ))}
                <p className="ml-2 text-sm text-gray-600">(4)</p>
              </div>

              {/* Pricing */}
              <div className="mt-6 p-5 bg-green-50/50 rounded-xl border border-green-100">
                <p className="line-through text-gray-400 text-sm">
                  MRP: {currency}{product.price}
                </p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {currency}{product.offerPrice}
                </p>
                <span className="text-xs text-gray-500">
                  (inclusive of all taxes)
                </span>
              </div>

              {/* Description */}
              <p className="mt-6 font-medium text-lg">About Product</p>
              <ul className="list-disc pl-5 mt-2 text-gray-600 space-y-1 text-sm">
                {product?.description?.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))}
              </ul>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={() => addToCart(product._id)}
                  className="w-full py-3.5 bg-white border-2 border-green-500 text-green-600 font-semibold hover:bg-green-50 rounded-xl transition cursor-pointer"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    addToCart(product._id);
                    navigate("/cart");
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 rounded-xl transition shadow-lg shadow-green-200 cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-24 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <p className="text-3xl font-semibold text-gray-800">
                Related Products
              </p>
              <div className="w-20 h-1 bg-green-400 rounded-full mt-2"></div>
            </div>

            {relatedProducts.filter((p) => p.inStock).length === 0 ? (
              <p className="text-center text-gray-500 mt-6">
                No related products in stock.
              </p>
            ) : (
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center">
                {relatedProducts
                  .filter((product) => product.inStock)
                  .map((product, index) => (
                    <ProductCard key={index} product={product} />
                  ))}
              </div>
            )}

            <button
              onClick={() => {
                navigate("/products");
                window.scrollTo(0, 0);
              }}
              className="mx-auto block px-12 my-16 py-3 border-2 border-green-500 rounded-full text-green-600 font-medium hover:bg-green-500 hover:text-white transition cursor-pointer"
            >
              See more
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductDetails;
