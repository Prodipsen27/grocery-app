import React from 'react';
import { assets, features } from '../assets/assets';

const BottomBanner = () => {
  return (
    <div className="relative mt-24">
      {/* Background Banner Image */}
      <img
        src={assets.image}
        alt="banner"
        className="w-full h-120 hidden md:block object-cover"
      />
      <img
        src={assets.bottom_banner_image_sm}
        alt="banner"
        className="w-full md:hidden object-cover"
      />

      {/* Overlay content */}
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center px-4 md:px-12 py-10">
        <div className="max-w-6xl mx-auto w-full text-white text-center">
          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">
            Why We Are Best?
          </h1>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 flex flex-col items-center text-white hover:bg-white/20 transition"
              >
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-12 h-12 mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm opacity-90">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
