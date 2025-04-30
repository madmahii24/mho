"use client";

import { Quote } from 'lucide-react';
import React, { useEffect,useState } from 'react';

interface Testimonial {
  name: string;
  feedback: string;
  location?: string;
  id: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(2);

  // Update items per slide on window resize
  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(window.innerWidth < 768 ? 1 : 2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getTotalSlides = () => {
    return Math.ceil(testimonials.length / itemsPerSlide);
  };

  const getTestimonialsForSlide = (slideIndex: number) => {
    const startIndex = slideIndex * itemsPerSlide;
    const items = [];
    /* eslint-disable-next-line no-plusplus */
    for (let i = 0; i < itemsPerSlide; i++) {
      const index = startIndex + i;
      if (index < testimonials.length) {
        items.push(testimonials[index]);
      }
    }
    return items;
  };

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % getTotalSlides());
  };

  // const prevSlide = () => {
  //   setCurrentSlide((prev) => (prev === 0 ? getTotalSlides() - 1 : prev - 1));
  // };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, itemsPerSlide]);

  return (
    <section className="w-full py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-semibold text-black text-center mb-16">
        What Our Customer Say
        </h2>

        <div className="relative " style={{ minHeight: "300px" }}>
          <div className="overflow-hidden" style={{ minHeight: "300px" }}>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * (100 / getTotalSlides())}%)`,
                width: `${getTotalSlides() * 100}%`
              }}
            >
              {Array.from({ length: getTotalSlides() }, (_, slideIndex) => (
                <div
                  key={slideIndex}
                  style={{ width: `${100 / getTotalSlides()}%` }}
                  className="flex-shrink-0 px-4"
                >
                  <div className="grid gap-12 md:grid-cols-2 h-full">
                    {getTestimonialsForSlide(slideIndex).map((item:any) => (
                      <article
                        key={item.id}
                        className="group relative p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full"
                      >
                        <Quote className="absolute top-6 right-6 text-green-600/20 w-12 h-12 group-hover:text-green-600/30 transition-colors duration-300" />
                        <div className="space-y-6">
                          <blockquote className="text-xl text-gray-700 leading-relaxed">
                            {item.feedback}
                          </blockquote>
                          <div className="pt-6 border-t border-green-100">
                            <p className="text-lg font-medium text-gray-900">{item.name}</p>
                            {item.location && (
                              <p className="text-base text-green-600 mt-1">{item.location}</p>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows - positioned outside the slide content */}
          {/* <button
            onClick={prevSlide}
            type='button'
            className="absolute top-1/2 -translate-y-1/2 left-0 z-10 w-10 h-10 rounded-full bg-white/80 text-green-600 flex items-center justify-center hover:bg-white transition-colors duration-300"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            type='button'

            className="absolute top-1/2 -translate-y-1/2 right-0 z-10 w-10 h-10 rounded-full bg-white/80 text-green-600 flex items-center justify-center hover:bg-white transition-colors duration-300"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button> */}
        </div>

        {/* Slide indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: getTotalSlides() }, (_, i) => (
            <button
              key={i}
              type='button'
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'bg-white scale-125' : 'bg-white/40'
              }`}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to testimonial set ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
// import React from 'react'

// const Testimonial = () => {
//   return (
//     <div>Testimonial</div>
//   )
// }

// export default Testimonial