"use client"

import React, { useEffect, useState } from 'react';

import Filter from '@/components/Filter';
import ProductCard from '@/components/ProductCard';
import { productsSection} from '@/data/content';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Heading from '@/shared/Heading/Heading';
import { getAllCategory } from '@/utils/dataService';

const SectionProducts = () => {
  const [data, setData] = useState<[]>([])
  useEffect(() => {
    getAllCategory().then((res: any) => {
      setData(res);
    });
  }, []);
  return (
    <div className="container">
      <Heading isCenter isMain desc={productsSection.description}>
        {productsSection.heading}
      </Heading>
      <Filter />

      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
        {data.map((product:any) => (
          <ProductCard
            key={product.productId}
            product={product}
            className="border-neutral-300"
          />
        ))}
      </div>

      <div className="mt-14 flex items-center justify-center">
        <ButtonPrimary>View More</ButtonPrimary>
      </div>
    </div>
  );
};

export default SectionProducts;
