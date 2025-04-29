"use client";

import "react-slideshow-image/dist/styles.css";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Slide } from "react-slideshow-image";

// Sample images
const images = [
  {
    url: "/assets/images/banner_1.webp",
    path: "/best-selling",
    title: "Best Selling Products",
    subtitle: "Shop our most popular items",
  },
  // You can add more images here
];

// ArrowButton moved outside main component
const ArrowButton = ({
  direction,
  isVisible,
}: {
  direction: "left" | "right";
  isVisible: boolean;
}) => {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  const positionClass = direction === "left" ? "left-4" : "right-4";

  return (
    <button
      type="button"
      className={`absolute top-1/2 -translate-y-1/2 ${positionClass} ${
        isVisible ? "opacity-70" : "opacity-0"
      } transition-all duration-300 bg-black/60 p-2 md:p-3 rounded-full z-20 hover:bg-black/80 hover:opacity-100 backdrop-blur-sm hover:scale-110`}
      aria-label={direction === "left" ? "Previous Slide" : "Next Slide"}
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6" color="white" />
    </button>
  );
};

const CarouselBanner = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Check if it's mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, path: string) => {
    if (e.key === "Enter" || e.key === " ") {
      router.push(path);
    }
  };

  const properties = {
    autoplay: false,
    transitionDuration: 500,
    infinite: false,
    pauseOnHover: true,
    duration: 8000,
    indicators: () => (
      <div className="flex justify-center gap-2 absolute bottom-4 md:bottom-6 left-0 right-0">
        {images.map((_, idx) => (
          <div
            key={idx}
            className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white/50 hover:bg-white cursor-pointer transition-all"
          />
        ))}
      </div>
    ),
    prevArrow: <ArrowButton direction="left" isVisible={isHovered || isMobile} />,
    nextArrow: <ArrowButton direction="right" isVisible={isHovered || isMobile} />,
  };

  return (
    <div
      className="relative overflow-hidden text-white rounded-none sm:rounded-lg my-2 md:my-4 mx-0 sm:mx-8 md:mx-12 lg:mx-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Slide {...properties}>
          {images.map((image, index) => (
            <div
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => router.push(image.path)}
              onKeyDown={(e) => handleKeyDown(e, image.path)}
              className="cursor-pointer relative"
            >
              <div
                style={{
                  backgroundImage: `url(${image.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[550px] xl:h-[740px] relative"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/10" />

                {/* Optional Text Content */}
                {/* Uncomment this block if you want title/subtitle/buttons inside banners */}
                {/* 
                <div className="absolute inset-0 flex flex-col justify-center pl-4 sm:pl-6 md:pl-8 lg:pl-16 xl:pl-24 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 sm:mb-2 md:mb-3 tracking-tight">
                    {image.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                    {image.subtitle}
                  </p>
                  <button className="bg-white text-black font-semibold text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-md hover:bg-opacity-90 transition w-fit">
                    Shop Now
                  </button>
                </div> 
                */}
              </div>
            </div>
          ))}
        </Slide>
      </div>
    </div>
  );
};

export default CarouselBanner;
