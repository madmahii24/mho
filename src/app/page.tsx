import React from "react";

import CarasoulBanner from "@/components/CarasoulBanner";
import Features from "@/components/Features";
import IntermediateBanner from "@/components/IntermediateBanner";
import SectionBestDeals from "@/components/SectionBestDeals";
import Testimonials from "@/components/Testimonial";
import { dummyTestimonials } from "@/data/content";

// Changed from lowercase 'page' to uppercase 'Page' to follow Next.js convention
const Page = () => {
  return (
    <div>
      <div>
        <CarasoulBanner />
      </div>
      <div className="my-12">
        <SectionBestDeals />
      </div>
      <div>
        <IntermediateBanner />
      </div>
      <div>
        <Features />
      </div>
      <div>
        {/* Ensure dummyTestimonials is properly formatted with all required fields */}
        <Testimonials testimonials={dummyTestimonials || []} />
      </div>
    </div>
  );
};

export default Page;
