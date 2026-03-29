import React from 'react';
import { categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const CategoriesPage = () => {
  const { navigate, products } = useAppContext();

  // Count products per category
  const getCategoryCount = (path) => {
    return products.filter(
      (p) => p.category.toLowerCase() === path.toLowerCase() && p.inStock
    ).length;
  };

  return (
    <div className="mt-20 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pb-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight border-l-4 border-green-500 pl-4">
          All Categories
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1 ml-5">
          Explore our wide range of fresh grocery categories
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
        {categories.map((category, index) => {
          const count = getCategoryCount(category.path);
          return (
            <div
              key={index}
              onClick={() => {
                navigate(`/products/${category.path.toLowerCase()}`);
                window.scrollTo(0, 0);
              }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ backgroundColor: category.bgColor || '#f9fafb' }}
            >
              {/* Card content */}
              <div className="p-6 sm:p-8 flex flex-col items-center text-center min-h-[200px] justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4 transition-transform duration-300 group-hover:scale-110">
                  <img
                    src={category.image}
                    alt={category.text}
                    className="w-full h-full object-contain drop-shadow-md"
                  />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-green-700 transition">
                  {category.text}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {count} product{count !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Hover overlay arrow */}
              <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;
