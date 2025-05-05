import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ProductDescriptionImage {
  src: string;
  alt: string;
}

interface ProductDescriptionGalleryProps {
  images: ProductDescriptionImage[];
}

const ProductDescriptionGallery = ({
  images,
}: ProductDescriptionGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay && images.length > 1) {
      interval = setInterval(() => {
        setSelectedImage((prev) => (prev + 1) % images.length);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoPlay, images.length]);

  const handleInteraction = () => {
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  return (
    <div 
      className="flex flex-col space-y-6 w-full"
      onMouseEnter={handleInteraction}
      onClick={handleInteraction}
      role="region"
      aria-label="Product image gallery"
    >
      {/* Main image display */}
      <motion.div 
        className="w-full bg-white rounded-lg overflow-hidden shadow-lg relative"
        initial={{ opacity: 0.8, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        role="tabpanel"
        id="main-image-panel"
        aria-labelledby={`thumb-${selectedImage}`}
      >
        <div className="w-full flex justify-center items-center" style={{ minHeight: "400px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Image
                src={images[selectedImage]?.src || "/assets/images/placeholder.webp"}
                alt={images[selectedImage]?.alt || "Product image"}
                width={1000}
                height={1000}
                priority
                quality={90}
                className="w-full h-auto transition-all duration-300"
                style={{ maxHeight: "80vh" }}
                aria-live="polite"
                aria-atomic="true"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Thumbnail gallery */}
      {images.length > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3"
          role="tablist"
          aria-label="Select product view"
        >
          {images.map((image, index) => (
            <motion.button
              key={`product-thumb-${index}`}
              role="tab"
              aria-label={`View product angle ${index + 1}`}
              aria-selected={selectedImage === index}
              id={`thumb-${index}`}
              aria-controls="main-image-panel"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`border rounded-md transition-all bg-transparent p-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary ${
                selectedImage === index 
                  ? "ring-2 ring-primary ring-offset-1 border-primary" 
                  : "hover:opacity-100 border-gray-200 opacity-80"
              }`}
              onClick={() => setSelectedImage(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedImage(index);
                }
              }}
              tabIndex={selectedImage === index ? 0 : -1}
            >
              <div className="relative w-full aspect-video overflow-hidden rounded-sm">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 20vw, 10vw"
                  className={`object-cover transition-transform duration-500 ${
                    selectedImage === index ? "scale-105" : "scale-100"
                  }`}
                  aria-hidden="true"
                />
                {selectedImage === index && (
                  <motion.div
                    layoutId="selectedBorder"
                    className="absolute inset-0 border-2 border-primary rounded-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProductDescriptionGallery;