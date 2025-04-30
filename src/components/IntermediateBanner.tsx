import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Banner from '@/public/assets/images/mho_ws_banner_2.png';

const IntermediateBanner = () => {
  return (
    <div className="relative overflow-hidden w-full max-w-7xl mx-auto my-4 sm:my-6 md:my-8 px-0 sm:px-6 md:px-8 lg:px-0">
      <Link href="/products/229" className="block cursor-pointer">
        {/* Aspect ratio container for 1423/800 */}
        <div className="relative w-full" style={{ paddingTop: `${(800 / 1423) * 100}%` }}>
          {/* Rounded corners container */}
          <div className="absolute inset-0 rounded-none sm:rounded-lg lg:rounded-2xl overflow-hidden">
            <Image
              src={Banner}
              alt="Intermediate Banner"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1423px"
              className="object-cover object-center"
              priority
            />
            
            {/* Optional overlay */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div> */}
            
            {/* Optional text content */}
            {/* <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 text-white">
                Banner Heading
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                Optional description text
              </p>
            </div> */}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default IntermediateBanner;