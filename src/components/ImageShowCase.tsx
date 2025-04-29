'use client';

import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import { pathOr } from 'ramda';
import type { FC } from 'react';
import React, { useState } from 'react';

import LikeButton from './LikeButton';

interface ImageShowCaseProps {
  shots: StaticImageData[];
}

const ImageShowCase: FC<ImageShowCaseProps> = ({ shots }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 rounded-2xl border border-neutral-300 p-2">
      {/* Thumbnails - bottom on mobile, left on desktop */}
      <div className="flex h-24 md:h-[500px] w-full md:w-32 flex-row md:flex-col space-x-3 md:space-x-0 md:space-y-3 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden mt-2">
        {shots.map((shot, index) => (
          <div
            key={shot.src}
            className={`${
              activeImageIndex === index ? 'border border-green-700' : ''
            } h-[80px] w-[80px] md:h-[100px] md:w-full flex-shrink-0 overflow-hidden rounded-lg`}
          >
            <button
              className="size-full"
              type="button"
              onClick={() => setActiveImageIndex(index)}
            >
              <Image
                src={shot}
                alt="shoe image"
                className="size-full object-cover object-center"
              />
            </button>
          </div>
        ))}
      </div>

      {/* Main image container - top on mobile, right on desktop */}
      <div className="relative flex-1 overflow-y-auto rounded-2xl order-first md:order-last">
        <LikeButton className="absolute right-5 top-5" />
        <Image
          src={pathOr('', [activeImageIndex], shots)}
          alt="shoe image"
          className="h-[350px] md:h-[500px] w-full object-contain"
        />
      </div>
    </div>
  );
};

export default ImageShowCase;