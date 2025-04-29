'use client';

import type { FC } from 'react';
import React, { useState } from 'react';

import ButtonCircle3 from '@/shared/Button/ButtonCircle3';
import Heading from '@/shared/Heading/Heading';

interface ProductInfoTabProps {
  overview: string;
  shipment_details: {
    icon: JSX.Element;
    title: string;
    description: string;
  }[];
}

const tabs = ['Overview', 'Shipment details'];

const ProductInfoTab: FC<ProductInfoTabProps> = ({
  overview,
  shipment_details,
}) => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="p-6 md:p-8">
      <Heading className="text-2xl font-bold mb-6">Product Information</Heading>

      <div className="flex mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab}
          className={`mb-8 ${activeTab === tab ? 'block' : 'hidden'}`}
        >
          {activeTab === 'Overview' ? (
            <div className="space-y-5 text-gray-700">
              <p className="leading-relaxed">{overview}</p>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Key Benefits:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Made from 100% organic bananas</li>
                  <li>No artificial flavors, colors, or preservatives</li>
                  <li>Good source of potassium and dietary fiber</li>
                  <li>Perfect on-the-go snack for both kids and adults</li>
                  <li>Satisfying crunch with natural sweetness</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {shipment_details.map((detail) => (
                <div key={detail.title} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
                  <ButtonCircle3 size="w-10 h-10" className="bg-green-50 flex-shrink-0">
                    {detail.icon}
                  </ButtonCircle3>

                  <div>
                    <p className="font-medium text-gray-900">{detail.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{detail.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="p-5 bg-amber-50 rounded-lg border border-amber-100">
        <h3 className="text-amber-800 font-medium mb-2">Important Note</h3>
        <p className="text-amber-700 text-sm leading-relaxed">
          Our banana chips are processed in a facility that also handles nuts, wheat, and soy products. 
          The color of the product may vary slightly from batch to batch due to the natural variation 
          in banana ripeness and our minimal processing approach.
        </p>
      </div>
    </div>
  );
};

export default ProductInfoTab;
