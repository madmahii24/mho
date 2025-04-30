'use client';

import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import { pathOr } from 'ramda';
import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import LikeButton from './LikeButton';

// Custom hook to detect if the device is mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Consider under 768px as mobile
    };
    
    // Check on mount
    checkIfMobile();
    
    // Check on resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  return isMobile;
};

interface ImageShowCaseProps {
  shots: StaticImageData[];
  showZoomView?: boolean;
}

const ImageShowCase: FC<ImageShowCaseProps> = ({ shots, showZoomView = true }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Use the mobile detection hook
  const isMobile = useIsMobile();
  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const zoomFactor = 3.5; // How much to zoom in
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageContainerRef.current || isMobile) return;
    
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    
    // Calculate mouse position within container (pixels)
    const mouseX = Math.max(0, Math.min(width, e.clientX - left));
    const mouseY = Math.max(0, Math.min(height, e.clientY - top));
    
    // Calculate position as percentage (0 to 100) for background-position
    const relativeX = (mouseX / width) * 100;
    const relativeY = (mouseY / height) * 100;
    
    setZoomPosition({ x: relativeX, y: relativeY });
    
    // Constrain indicator within image boundaries
    const indicatorSize = 80; // 20px * 2 for each side
    const indicatorLeft = Math.max(0, Math.min(width - indicatorSize, mouseX - indicatorSize/2));
    const indicatorTop = Math.max(0, Math.min(height - indicatorSize, mouseY - indicatorSize/2));
    
    setMousePosition({ x: indicatorLeft, y: indicatorTop });
  };
  
  // Clean up any side effects
  useEffect(() => {
    return () => {
      setShowZoom(false);
    };
  }, []);

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
                alt="product image"
                className="size-full object-cover object-center"
              />
            </button>
          </div>
        ))}
      </div>

      {/* Main image container - top on mobile, right on desktop */}
      <div 
        className="relative flex-1 overflow-hidden rounded-2xl order-first md:order-last"
        ref={imageContainerRef}
        onMouseEnter={() => showZoomView && setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <LikeButton className="absolute right-5 top-5 z-10" />
        
        <div className="w-full h-[400px] md:h-[550px] relative">
          <Image
            src={pathOr('', [activeImageIndex], shots)}
            alt="product image"
            className="h-full w-full object-contain"
            fill
          />
        </div>
        
        {/* Zoom view overlay - appears on hover but invisible */}
        {showZoom && showZoomView && !isMobile && (
          <div 
            className="absolute top-0 left-0 right-0 bottom-0 z-20 pointer-events-none opacity-0"
            style={{
              backgroundImage: `url(${(shots[activeImageIndex] as any).src})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${zoomFactor * 100}%`,
            }}
          />
        )}
        
        {/* Enhanced square zoom lens indicator */}
        {showZoom && showZoomView && !isMobile && (
          <div 
            className="absolute w-20 h-20 pointer-events-none z-30"
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
              backgroundImage: `
                linear-gradient(to right, #22c55e 2px, transparent 2px) 0 0,
                linear-gradient(to right, #22c55e 2px, transparent 2px) 0 100%,
                linear-gradient(to left, #22c55e 2px, transparent 2px) 100% 0,
                linear-gradient(to left, #22c55e 2px, transparent 2px) 100% 100%,
                linear-gradient(to bottom, #22c55e 2px, transparent 2px) 0 0,
                linear-gradient(to bottom, #22c55e 2px, transparent 2px) 100% 0,
                linear-gradient(to top, #22c55e 2px, transparent 2px) 0 100%,
                linear-gradient(to top, #22c55e 2px, transparent 2px) 100% 100%
              `,
              backgroundSize: '20px 20px',
              backgroundRepeat: 'no-repeat',
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }}
          />
        )}
      </div>
      
      {/* Larger zoom result preview */}
      {showZoom && showZoomView && !isMobile && (
        <div 
          className="zoom-result fixed top-24 right-8 w-1/3 h-[500px] border-2 border-gray-200 rounded-lg shadow-xl bg-white overflow-hidden z-50"
          style={{
            backgroundImage: `url(${(shots[activeImageIndex] as any).src})`,
            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${zoomFactor * 100}%`,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          }}
        />
      )}
    </div>
  );
};

export default ImageShowCase;