"use client";

import { pathOr } from "ramda";
import React, { useEffect, useState } from "react";

import SectionBestDeals from "@/components/SectionBestDeals";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { getProductById } from "@/utils/dataService";

import CustomerReviews from "./CustomerReviews";
import SectionNavigation from "./SectionNavigation";
import SectionProductHeader from "./SectionProductHeader";


type Props = {
  params: { productId: string };
};

const SingleProductPage = (props: Props) => {
  const [data, setdata] = useState<any>([]);
  useEffect(() => {
    getProductById(props.params.productId).then((res: any) => {
      setdata(res);
    });
  }, [props.params.productId]);

  return (
    <div className="container px-4 mx-auto">
      <SectionNavigation 
        categoryName={pathOr("Snacks", ["categoryName"], data)}
        productName={pathOr("Organic Banana Chips", ["productName"], data)}
      />

      <div className="mb-16">
        <SectionProductHeader item={data} />
      </div>

      <div className="mb-20">
        
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Product Information</h2>
          <Accordion type="single" collapsible className="divide-y divide-gray-100">
            <AccordionItem value="ingredients" className="pt-2 pb-1">
              <AccordionTrigger className="py-4">Ingredients</AccordionTrigger>
              <AccordionContent className="pb-4 text-gray-700">
                <p className="mb-3">Our delicious banana chips contain:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Fresh organic bananas</li>
                  <li>Coconut oil (for frying)</li>
                  <li>Raw cane sugar (minimal amount)</li>
                  <li>Sea salt</li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">*All ingredients are sourced responsibly with a focus on organic farming practices.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="storage" className="pt-2 pb-1">
              <AccordionTrigger className="py-4">Storage Instructions</AccordionTrigger>
              <AccordionContent className="pb-4 text-gray-700">
                <p className="leading-relaxed">For maximum freshness and crunch, please store in a cool, dry place away from direct sunlight. Once opened, consume within 2 weeks for best quality. For extended freshness, store in an airtight container.</p>
                <p className="mt-3 leading-relaxed">Our resealable packaging helps maintain freshness, but transferring to an airtight container is recommended after opening.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="mb-24">
        <CustomerReviews 
          productId={props.params.productId}
          totalReviews={pathOr(0, ["reviews"], data)}
          averageRating={pathOr(0, ["rating"], data)}
        />
      </div>

      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-10 text-center">You May Also Like</h2>
        <SectionBestDeals />
      </div>
    </div>
  );
};

export default SingleProductPage;
