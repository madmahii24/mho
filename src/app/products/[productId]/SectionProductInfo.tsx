import type { FC } from 'react';
import React from 'react';
import { MdAccessTime,MdLocalShipping, MdPayment, MdSecurity } from 'react-icons/md';

import ProductInfoTab from './ProductInfoTab';

interface SectionProductInfoProps {
  overview: string;
  shipment_details: {
    icon: JSX.Element;
    title: string;
    description: string;
  }[];
}

const SectionProductInfo: FC<SectionProductInfoProps> = ({
  overview,
  shipment_details,
}) => {
  // Provide meaningful default data for banana chips if not available
  const defaultOverview = "Our premium organic banana chips are made from handpicked, naturally ripened bananas. We slice them to the perfect thickness and fry them in high-quality oil to achieve that ideal crunch. The result is a delicious, satisfying snack that captures the authentic flavor of fresh bananas while providing a convenient, on-the-go option for health-conscious snackers.";
  
  const defaultShipmentDetails = [
    {
      icon: <MdLocalShipping className="text-xl" />,
      title: "Free Shipping",
      description: "On orders above ₹499"
    },
    {
      icon: <MdPayment className="text-xl" />,
      title: "Secure Payment",
      description: "All major cards accepted"
    },
    {
      icon: <MdSecurity className="text-xl" />,
      title: "Quality Guarantee",
      description: "100% satisfaction guaranteed"
    },
    {
      icon: <MdAccessTime className="text-xl" />,
      title: "24/7 Support",
      description: "Available round the clock"
    }
  ];

  return (
    <div className="mx-auto max-w-4xl bg-white rounded-xl shadow-sm overflow-hidden">
      <ProductInfoTab 
        overview={overview || defaultOverview} 
        shipment_details={shipment_details?.length ? shipment_details : defaultShipmentDetails} 
      />
    </div>
  );
};

export default SectionProductInfo;
