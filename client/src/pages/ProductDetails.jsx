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
          <p className="text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:underline">
              Home
            </Link>{" "}
            /
            <Link to="/products" className="hover:underline">
              {" "}
              Products
            </Link>{" "}
            /
            <Link
              to={`/products/${product.category.toLowerCase()}`}
              className="hover:underline"
            >
              {" "}
              {product.category}
            </Link>{" "}
            /<span className="text-green-600"> {product.name}</span>
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
                    className="w-20 h-20 object-cover border rounded-md cursor-pointer hover:ring-2 ring-green-400"
                  />
                ))}
              </div>
              <div className="flex-1 border rounded-lg overflow-hidden">
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
              <div className="mt-6">
                <p className="line-through text-gray-400">
                  MRP: {currency}{product.price}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {currency}{product.offerPrice}
                </p>
                <span className="text-sm text-gray-500">
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
                  className="w-full py-3 bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 rounded transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    addToCart(product._id);
                    navigate("/cart");
                  }}
                  className="w-full py-3 bg-green-600 text-white font-semibold hover:bg-green-700 rounded transition"
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
              className="mx-auto block px-12 my-16 py-2.5 border rounded text-green-600 hover:bg-green-50 transition"
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
