import React from 'react';

import ProductSlider from '@/components/ProductSlider';

const SectionBestDeals = () => {
  return (
    <div className="container ">
      <div className=" overflow-hidden rounded-2xl p-5">
        <div className="mb-5 items-center justify-between space-y-5 md:flex md:space-y-0">
          <h3 className="text-2xl font-medium">Best Selling Products</h3>
          {/* <CountDownTimer /> */}
        </div>
        <div className="pb-2">
          <ProductSlider />
        </div>
      </div>
    </div>
  );
};

export default SectionBestDeals;
