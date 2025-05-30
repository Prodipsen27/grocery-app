import React, { useRef } from 'react';
import { categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Categories = () => {
  const { navigate } = useAppContext();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-8 bg-white relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>

      {/* Arrows for desktop */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full"
      >
        <ChevronRight size={20} />
      </button>

      {/* Scrollable category row */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar space-x-4 scroll-smooth"
      >
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex-shrink-0 snap-start flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl p-4 shadow-md hover:shadow-lg transition duration-300 cursor-pointer text-center w-40"
            style={{ backgroundColor: category.bgColor || '#fff' }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              window.scrollTo(0, 0);
            }}
          >
            <img
              src={category.image}
              alt={category.text}
              className="w-12 h-12 mb-3 transition-transform duration-300 ease-in-out hover:scale-110"
            />
            <p className="text-sm font-medium text-gray-700">{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
