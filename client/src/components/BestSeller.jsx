import React from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
  const { products } = useAppContext();

  return (
    <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mt-10">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight border-l-4 border-indigo-600 pl-4">
          Best Sellers
        </h2>
        <p className="text-sm sm:text-base text-gray-500 mt-1 ml-4">
          Most popular products chosen by our customers
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </section>
  );
};

export default BestSeller;
