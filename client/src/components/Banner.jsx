import React from 'react';
import { assets } from '../assets/assets.js';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Banner = () => {
  return (
    <section className="w-full">
      <div className="relative">
        {/* Desktop Banner */}
        <img
          src={assets.main_banner_bg}
          alt="Main Banner"
          className="w-full hidden md:block object-cover max-h-[90vh]"
        />
        {/* Mobile Banner */}
        <img
          src={assets.main_banner_bg_sm}
          alt="Main Banner"
          className="w-full md:hidden object-cover max-h-[80vh]"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#1f3b29]/70" />

        {/* Text Content */}
        <div className="absolute top-1/2 left-4 sm:left-8 md:left-16 -translate-y-1/2 z-10 text-white max-w-[90%] sm:max-w-md md:max-w-xl space-y-4 sm:space-y-5">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-snug md:leading-tight text-lime-100 drop-shadow-md">
            Nature’s Best, Delivered Daily
          </h1>
          <p className="text-xs sm:text-sm md:text-lg text-lime-200 leading-relaxed">
            Discover farm-fresh groceries, seasonal picks, and essentials—right at your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-lime-500 hover:bg-lime-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition duration-300"
            >
              Shop Now
              <img src={assets.white_arrow_icon} alt="arrow" className="w-4 h-4" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 border border-lime-300 hover:bg-lime-600 hover:text-white text-lime-100 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition duration-300"
            >
              Explore Deals
              <ArrowRight className="w-4 h-5 text-lime-100" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
