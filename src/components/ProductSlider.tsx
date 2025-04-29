"use client";

import React, { useEffect, useState } from "react";

import Slider from "@/shared/Slider/Slider";
import {getAllBestSellingProducts } from "@/utils/dataService";

import ProductCard from "./ProductCard";
import { Skeleton } from "./ui/skeleton";

const ProductSlider = () => {
  const [data, setData] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    getAllBestSellingProducts()
    .then((res: any) => {
      setData(res);
      setIsLoading(false);
    })
    .catch(() => setIsLoading(true));
  } 
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <Slider
          itemPerRow={4}
          data={Array(4).fill(null)}
          renderItem={() => (
            <Skeleton className="h-[390px] rounded-4-xl gap-5"/>
          )}
        />
      ) : (
        <Slider
          itemPerRow={4}
          data={data}
          renderItem={(item) => item && <ProductCard product={item} />}
        />
      )}
    </div>
  );
};

export default ProductSlider;
