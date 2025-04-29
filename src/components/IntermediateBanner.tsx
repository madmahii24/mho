import Image from 'next/image';
import React from 'react';

import Banner from '@/public/assets/images/banner_2.png';

const IntermediateBanner = () => {
  return (
    <div className="relative overflow-hidden w-full max-w-7xl mx-auto my-4 sm:my-6 md:my-8 h-[200px] sm:h-[300px] md:h-[400px] lg:h-[600px] xl:h-[800px] px-0 sm:px-6 md:px-8 lg:px-0">
      {/* Rounded corners only on larger screens */}
      <div className="relative w-full h-full rounded-none sm:rounded-lg lg:rounded-2xl overflow-hidden">
        <Image
          src={Banner}
          alt="Intermediate Banner"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 1024px, 1280px"
          className="object-cover object-center w-full h-full"
          priority
        />
        
        {/* Optional overlay for text readability if needed */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div> */}
        
        {/* Optional text content - Uncomment if needed */}
        {/* <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 text-white">
            Banner Heading
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            Optional description text that can be added if needed
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default IntermediateBanner;