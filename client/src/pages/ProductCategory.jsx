import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

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
    <div className="mt-20 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pb-16">
      {searchCategory ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight border-l-4 border-green-500 pl-4">
              {searchCategory.text}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1 ml-5">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-base">No products available in this category.</p>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-lg">Category not found.</p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
