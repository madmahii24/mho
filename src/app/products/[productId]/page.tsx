"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { pathOr } from "ramda";
import React, { useEffect, useState } from "react";

import SectionBestDeals from "@/components/SectionBestDeals";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/utils/dataService";

import CustomerReviews from "./CustomerReviews";
import ProductDescriptionGallery from "./ProductDescriptionGallery";
import SectionProductHeader from "./SectionProductHeader";

type Props = {
  params: { productId: string };
};

const SingleProductPage = (props: Props) => {
  const router = useRouter();
  const [data, setdata] = useState<any>([]);

  useEffect(() => {
    getProductById(props.params.productId).then((res: any) => {
      setdata(res);
    });
  }, [props.params.productId]);

  return (
    <div className="container px-4 mx-auto pt-6">
      <div className="absolute top-25 left-20 z-10">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors rounded-full py-6 pr-6 pl-4"
        >
          <ArrowLeft size={22} />
          Back
        </Button>
      </div>

      <div className="mb-16">
        <SectionProductHeader item={data} />
      </div>

      {/* Product Description images */}
      <div className="mb-16">
        <ProductDescriptionGallery
          images={[
            {
              src: "/assets/images/ProdDesc.png",
              alt: "Product usage description"
            }
          ]}
        />
      </div>

      <div className="mb-24">
        <CustomerReviews
          productId={props.params.productId}
          totalReviews={pathOr(0, ["reviews"], data)}
          averageRating={pathOr(0, ["rating"], data)}
        />
      </div>

      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-10 text-center">
          You May Also Like
        </h2>
        <SectionBestDeals />
      </div>
    </div>
  );
};

export default SingleProductPage;
