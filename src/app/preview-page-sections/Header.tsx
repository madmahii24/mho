import React from "react";

// import ButtonPrimary from "@/shared/Button/ButtonPrimary";
// import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Heading from "@/shared/Heading/Heading";

import { templateDetails } from "./content";
import ImageScroll from "./ImageScroll";

const Header = () => {
  return (
    <div className="">
      <div className="container">
        <Heading
          className="mb-10"
          desc={templateDetails.description}
          isMain
          isCenter
        >
          {templateDetails.name}
        </Heading>
      </div>

      <div className="relative mt-16">
        <div className="">
          <ImageScroll />
        </div>
      </div>
    </div>
  );
};

export default Header;
