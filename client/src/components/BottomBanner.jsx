import React from 'react';
import { assets, features } from '../assets/assets';

const BottomBanner = () => {
  return (
    <div className="relative mt-20">
      {/* Background Banner Image */}
      <img
        src={assets.image}
        alt="banner"
        className="w-full hidden md:block object-cover h-[480px]"
      />
      <img
        src={assets.bottom_banner_image_sm}
        alt="banner"
        className="w-full md:hidden object-cover"
      />

      {/* Overlay content */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 flex items-center justify-center px-4 md:px-12 py-10">
        <div className="max-w-6xl mx-auto w-full text-white text-center">
          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            Why Choose LeafCart?
          </h2>
          <p className="text-sm sm:text-base text-white/70 mb-10 max-w-xl mx-auto">
            We go above and beyond to deliver the best grocery experience
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 border border-white/10"
              >
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-12 h-12 mb-4"
                />
                <h3 className="text-base font-semibold mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/80 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
