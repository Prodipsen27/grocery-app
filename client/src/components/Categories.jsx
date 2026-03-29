import React, { useRef } from 'react';
import { categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Categories = () => {
  const { navigate } = useAppContext();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -250 : 250;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-12 bg-white relative">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight border-l-4 border-green-500 pl-4">
          Shop by Category
        </h2>
        <p className="text-sm sm:text-base text-gray-500 mt-1 ml-5">
          Browse our curated collection of fresh essentials
        </p>
      </div>

      {/* Arrows for desktop */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-4 top-1/2 translate-y-4 z-10 bg-white shadow-lg border border-gray-100 p-2.5 rounded-full hover:bg-green-50 transition"
      >
        <ChevronLeft size={20} className="text-gray-600" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-4 top-1/2 translate-y-4 z-10 bg-white shadow-lg border border-gray-100 p-2.5 rounded-full hover:bg-green-50 transition"
      >
        <ChevronRight size={20} className="text-gray-600" />
      </button>

      {/* Scrollable category row */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar space-x-5 scroll-smooth"
      >
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex-shrink-0 snap-start flex flex-col items-center justify-center rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer text-center w-44 group border border-transparent hover:border-green-200"
            style={{ backgroundColor: category.bgColor || '#f9fafb' }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              window.scrollTo(0, 0);
            }}
          >
            <img
              src={category.image}
              alt={category.text}
              className="w-16 h-16 mb-3 transition-transform duration-300 group-hover:scale-115"
            />
            <p className="text-sm font-semibold text-gray-700 group-hover:text-green-700 transition">{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
