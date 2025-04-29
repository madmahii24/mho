import Image from 'next/image';
import React from 'react';

// import Logo from '@/shared/Logo/Logo';
import allThemesPreview from '@/images/preview/showcase1.jpg';


const SectionMid = () => {
  return (
    <div className="container">
      <div className="items-stretch justify-between overflow-hidden rounded-3xl bg-gray shadow-lg md:flex">
        <div className="basis-[55%]">
          <Image
            src={allThemesPreview}
            alt="cover image"
            className="size-full object-cover object-center"
          />
        </div>
        
      </div>
     
    </div>
  );
};

export default SectionMid;
