// components/Features.tsx
import Image from "next/image";
import React from "react";

import featureImage from "@/public/assets/images/featureImage.webp";

const Features: React.FC = () => {
  return (
    <section className="lg:w-3/4 sm:w-4/5 px-4 py-8 bg-white mx-auto">
      <Image src={featureImage} alt="" className="h-auto w-full"/>
    </section>
  );
};

export default Features;
