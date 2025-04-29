import type { FC } from 'react';
import React from 'react';
import { MdStar } from 'react-icons/md';

import ProgressBar from '@/shared/ProgressBar/ProgressBar';

interface RatingsProps {
  rating: number;
  reviews: number;
}

const ratingDetails = [
  {
    title: 5,
    value: 100,
  },
  {
    title: 4,
    value: 56,
  },
  {
    title: 3,
    value: 22,
  },
  {
    title: 2,
    value: 14,
  },
  {
    title: 1,
    value: 2,
  },
];

const Ratings: FC<RatingsProps> = ({ rating, reviews }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Rating summary */}
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-5 md:p-8 min-w-[180px]">
          <p className="text-5xl font-bold text-gray-900">
            {rating}
            <span className="text-sm ml-1 text-gray-500 font-medium">/5</span>
          </p>
          <div className="flex items-center mt-3">
            {[...Array(5)].map((_, i) => (
              <MdStar key={`rating-star-${i}`} className={`text-xl ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-200'}`} />
            ))}
          </div>
          <p className="text-gray-600 mt-3 text-sm font-medium">{`Based on ${reviews} reviews`}</p>
        </div>

        {/* Rating breakdown */}
        <div className="w-full space-y-3">
          {ratingDetails.map((ratingItem) => (
            <div key={ratingItem.title} className="flex items-center gap-3 group">
              <div className="flex items-center gap-1 font-medium text-gray-700 min-w-[40px]">
                {ratingItem.title} <MdStar className="text-sm text-yellow-400" />
              </div>
              <div className="w-full">
                <ProgressBar 
                  value={ratingItem.value} 
                  
                />
              </div>
              <span className="text-xs text-gray-500 min-w-[40px] text-right">
                {`${ratingItem.value}%`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ratings;
