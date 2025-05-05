import type { FC } from "react";
import React, { useState } from "react";
import {
  MdChevronLeft,
  MdChevronRight,
  MdSearch,
  MdStar,
  MdStarBorder
} from "react-icons/md";

import { Button } from "@/components/ui/button";
import Heading from "@/shared/Heading/Heading";

import Ratings from "./Ratings";

interface CustomerReview {
  id: string;
  customerName: string;
  customerInitials: string;
  rating: number;
  date: string;
  reviewText: string;
  verifiedPurchase: boolean;
}

interface CustomerReviewsProps {
  productId: string;
  totalReviews: number;
  averageRating: number;
}

// Mock data for customer reviews
const mockReviews: CustomerReview[] = [
  {
    id: "1",
    customerName: "Shaik R.",
    customerInitials: "SR",
    rating: 5,
    date: "25/02/25",
    reviewText:
      "This hair oil has made my hair so much more manageable and shiny. Love the natural ingredients!",
    verifiedPurchase: true
  },
  {
    id: "2",
    customerName: "Sidipto R.",
    customerInitials: "SR",
    rating: 5,
    date: "24/02/25",
    reviewText:
      "This is my 3rd bottle of this hair oil. After trying several brands, I found this one works best for reducing hair fall and promoting growth. My hair feels stronger, smoother, and has a natural shine. Just a few drops everyday and I can see the difference. Absolutely perfect for dry scalp.",
    verifiedPurchase: true
  },
  {
    id: "3",
    customerName: "Deepak M.",
    customerInitials: "DM",
    rating: 5,
    date: "24/02/25",
    reviewText:
      "Very effective hair oil for controlling frizz and adding shine",
    verifiedPurchase: true
  },
  {
    id: "4",
    customerName: "Rahul S.",
    customerInitials: "RS",
    rating: 4,
    date: "20/02/25",
    reviewText:
      "Good product for daily use. Saw improvements in hair texture in two weeks.",
    verifiedPurchase: true
  },
  {
    id: "5",
    customerName: "Priya K.",
    customerInitials: "PK",
    rating: 5,
    date: "18/02/25",
    reviewText:
      "Amazing results! My hair fall has reduced drastically and my hair feels thicker and healthier.",
    verifiedPurchase: true
  },
  {
    id: "6",
    customerName: "Amit T.",
    customerInitials: "AT",
    rating: 3,
    date: "15/02/25",
    reviewText:
      "Its decent. Takes time to show results but reduces dandruff eventually.",
    verifiedPurchase: false
  },
  {
    id: "7",
    customerName: "Neha J.",
    customerInitials: "NJ",
    rating: 5,
    date: "10/02/25",
    reviewText:
      "Excellent quality! The oil is lightweight and non-sticky. Will purchase again.",
    verifiedPurchase: true
  }
];

// Popular topics for skincare products
const popularTopics = [
  "Skin Cleansing",
  "Toning",
  "Hydration",
  "Pores",
  "Oily Skin",
  "Acne",
  "Glowing Skin"
];

const CustomerReviews: FC<CustomerReviewsProps> = () => {
  const [reviews] = useState<CustomerReview[]>(mockReviews);
  const [newReviewText, setNewReviewText] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showAddReview, setShowAddReview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const [sortOption, setSortOption] = useState("highest");

  const handleRatingClick = (rating: number) => {
    setNewRating(rating);
  };

  const handleRatingHover = (rating: number) => {
    setHoveredRating(rating);
  };

  const handleSubmitReview = () => {
    if (newReviewText.trim() === "" || newRating === 0) return;

    // In a real app, you would send data to an API
    // We're not handling state updates here since it's simplified

    setNewReviewText("");
    setNewRating(0);
    setShowAddReview(false);
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={`star-position-${i}`} className="text-[18px]">
          {i < rating ? (
            <MdStar className="text-yellow-400" />
          ) : (
            <MdStarBorder className="text-yellow-400" />
          )}
        </span>
      ));
  };

  // Filter reviews based on selections
  const filteredReviews = reviews.filter((review) => {
    // Filter by rating
    if (selectedFilter && parseInt(selectedFilter, 10) !== review.rating) {
      return false;
    }

    // Filter by search query
    if (
      searchQuery.trim() !== "" &&
      !review.reviewText.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !review.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Sort reviews based on selected option
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOption === "highest") {
      return b.rating - a.rating;
    } if (sortOption === "lowest") {
      return a.rating - b.rating;
    } if (sortOption === "recent") {
      return (
        new Date(b.date.split("/").reverse().join("-")).getTime() -
        new Date(a.date.split("/").reverse().join("-")).getTime()
      );
    } 
      // Most Relevant (default)
      return b.verifiedPurchase === a.verifiedPurchase
        ? b.rating - a.rating
        : b.verifiedPurchase
          ? 1
          : -1;
    
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Heading className="text-center mb-8">Customer Reviews</Heading>

      {/* Rating Summary Section */}
      <Ratings rating={4.3} reviews={54} />

      {/* Filters & Controls Section */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search reviews"
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="border border-gray-200 rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all appearance-none bg-no-repeat bg-right"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {/* Popular Topics */}
        <div className="mb-6 text-center">
          <h3 className="font-medium mb-3">Popular topics</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-sm transition-colors border border-amber-200"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              className="border-none bg-transparent font-medium text-sm focus:outline-none appearance-none bg-no-repeat bg-right"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "1.5rem"
              }}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="relevant">Most relevant</option>
              <option value="recent">Most recent</option>
              <option value="highest">Highest rating</option>
              <option value="lowest">Lowest rating</option>
            </select>
          </div>

          {!showAddReview && (
            <Button
              onClick={() => setShowAddReview(true)}
              className="rounded-full bg-green-600 hover:bg-green-700"
              type="button"
            >
              Write a Review
            </Button>
          )}
        </div>
      </div>

      {/* Write Review Form - Minimal design */}
      {showAddReview && (
        <div className="bg-white p-6 rounded-lg mb-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Share Your Experience
          </h3>

          <div className="mb-4">
            <p className="mb-2 text-center">Your Rating</p>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onMouseEnter={() => handleRatingHover(star)}
                  onMouseLeave={() => handleRatingHover(0)}
                  onClick={() => handleRatingClick(star)}
                  className="cursor-pointer mx-1"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleRatingClick(star);
                    }
                  }}
                  aria-label={`Rate ${star} ${star === 1 ? "star" : "stars"}`}
                >
                  {(hoveredRating || newRating) >= star ? (
                    <MdStar className="text-yellow-400 text-2xl" />
                  ) : (
                    <MdStarBorder className="text-yellow-400 text-2xl" />
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <textarea
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all"
              placeholder="Share your experience with this product..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleSubmitReview}
              disabled={newReviewText.trim() === "" || newRating === 0}
              className="rounded-full px-5"
              type="button"
            >
              Submit Review
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAddReview(false)}
              className="rounded-full px-5"
              type="button"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Reviews List - Updated layout to match screenshot */}
      <div className="space-y-6 divide-y divide-gray-100">
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => (
            <div key={review.id} className="pt-8 first:pt-0">
              <div className="flex items-start gap-3">
                {/* Customer initial avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                  {review.customerInitials}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {review.customerName}
                        </span>

                        {review.verifiedPurchase && (
                          <div className="text-xs text-gray-600 flex items-center gap-1">
                            <span>✓</span>
                            <span>
                              Verified{" "}
                              {review.id === "2" ? "Buyer" : "Reviewer"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>

                  <div className="flex mt-1 mb-2">
                    {renderStars(review.rating)}
                    <span className="ml-2 font-medium">
                      {review.rating === 5 && review.id === "1"
                        ? "very good product"
                        : review.rating === 5 && review.id === "2"
                          ? "Awesome Cleanser"
                          : review.rating === 5 && review.id === "3"
                            ? "wow 😮"
                            : ""}
                    </span>
                  </div>

                  <p className="text-gray-700">{review.reviewText}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No reviews match your current filters.
            </p>
            <p className="text-gray-400 mt-2">
              Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {sortedReviews.length > reviewsPerPage && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full border border-gray-200 disabled:opacity-50"
            aria-label="Previous page"
            type="button"
          >
            <MdChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                currentPage === number
                  ? "bg-green-600 text-white"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
              type="button"
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full border border-gray-200 disabled:opacity-50"
            aria-label="Next page"
            type="button"
          >
            <MdChevronRight />
          </button>
        </div>
      )}

      {reviews.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-2">No reviews yet.</p>
          <Button
            onClick={() => setShowAddReview(true)}
            className="rounded-full"
            type="button"
          >
            Be the first to review
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
