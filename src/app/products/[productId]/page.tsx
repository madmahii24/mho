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
import SectionProductInfo from "./SectionProductInfo";

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
        <div className="mb-16">
          <SectionProductInfo
            overview={pathOr("", ["overview"], data)}
            shipment_details={pathOr([], ["shipment_details"], data)}
          />
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Nutritional Information & Ingredients</h2>
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
            <AccordionItem value="nutrition" className="pt-2 pb-1">
              <AccordionTrigger className="py-4">Nutritional Information</AccordionTrigger>
              <AccordionContent className="pb-4 text-gray-700">
                <p className="mb-3 font-medium">Per 30g serving:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">Calories</p>
                    <p>140 kcal</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">Total Fat</p>
                    <p>7g (9% DV)</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">Carbohydrates</p>
                    <p>18g (6% DV)</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">Protein</p>
                    <p>1g (2% DV)</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">Dietary Fiber</p>
                    <p>2g (8% DV)</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">Sugars</p>
                    <p>10g</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">Potassium</p>
                    <p>220mg (6% DV)</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">Sodium</p>
                    <p>50mg (2% DV)</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-500">*Percent Daily Values (DV) are based on a 2,000 calorie diet.</p>
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
