import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';
// import ProductCard from './ProductCard'; // Assuming this exists

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category
  );

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category
  );

  return (
    <div className="px-4 md:px-12 mt-24">
      {searchCategory ? (
        
        <>
          {/* Category Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 border-l-4 border-green-500 pl-4 mb-6">
            {searchCategory.text.toUpperCase()}
          </h1>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-lg">No products available in this category.</p>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-lg">Category not found.</p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
