import Image from 'next/image';
import type { FC } from 'react';
import React, { useRef, useState } from 'react';
import { MdChevronLeft, MdChevronRight, MdClose, MdImage, MdSearch, MdStar, MdStarBorder, MdZoomIn, MdZoomOut } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import Heading from '@/shared/Heading/Heading';

import Ratings from './Ratings';

interface CustomerReview {
  id: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  date: string;
  reviewText: string;
  reviewImages: string[];
  verifiedPurchase: boolean;
  helpfulCount: number;
}

interface CustomerReviewsProps {
  productId: string;
  totalReviews: number;
  averageRating: number;
}

// Mock data for customer reviews
const mockReviews: CustomerReview[] = [
  {
    id: '1',
    customerName: 'John Doe',
    customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 5,
    date: '2025-03-15',
    reviewText: 'These banana chips are absolutely delicious! Perfect crunch and sweetness. I keep them in my desk for a healthy afternoon snack.',
    reviewImages: [
      'https://images.unsplash.com/photo-1569870499705-504209102861?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1569870499705-504209102861?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    verifiedPurchase: true,
    helpfulCount: 12
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 4,
    date: '2025-03-10',
    reviewText: 'Great taste and quality. The packaging keeps them fresh for weeks. My only suggestion would be to offer bigger pack sizes.',
    reviewImages: [],
    verifiedPurchase: true,
    helpfulCount: 8
  },
  {
    id: '3',
    customerName: 'Mike Johnson',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 3,
    date: '2025-03-05',
    reviewText: 'Decent banana chips, but a bit too sweet for my preference. I wish they had a less sweetened option available.',
    reviewImages: ['https://images.unsplash.com/photo-1590166774851-bc49b23a18fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
    verifiedPurchase: false,
    helpfulCount: 5
  }
];


// Updated popular topics specifically for banana chips
const popularTopics = [
  "crunchiness", "sweetness", "natural flavor", "packaging", "freshness", 
  "health benefits", "snack value", "organic", "ingredients"
];

// Image Modal Component
const ImageModal: FC<{
  src: string;
  alt: string;
  onClose: () => void;
}> = ({ src, alt, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" 
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] overflow-hidden" 
        onClick={e => e.stopPropagation()}
        ref={containerRef}
        role="document"
      >
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button 
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition-colors"
            onClick={handleZoomIn}
            type="button"
            aria-label="Zoom in"
          >
            <MdZoomIn size={24} />
          </button>
          <button 
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition-colors"
            onClick={handleZoomOut}
            type="button"
            aria-label="Zoom out"
          >
            <MdZoomOut size={24} />
          </button>
          <button 
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition-colors"
            onClick={onClose}
            type="button"
            aria-label="Close modal"
          >
            <MdClose size={24} />
          </button>
        </div>
        <div 
          className="cursor-move"
          style={{ 
            overflow: 'hidden',
            touchAction: 'none'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          role="img"
          aria-label={alt}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={src} 
            alt={alt}
            className="max-h-[90vh] object-contain transition-transform"
            style={{ 
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transformOrigin: '0 0'
            }}
            draggable="false"
          />
        </div>
      </div>
    </div>
  );
};

const CustomerReviews: FC<CustomerReviewsProps> = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>(mockReviews);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [showMediaOnly, setShowMediaOnly] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  
  // Calculate total images from all reviews for the media gallery
  const allReviewImages = reviews.flatMap(review => 
    review.reviewImages.map(img => ({ image: img, reviewId: review.id }))
  );

  const handleRatingClick = (rating: number) => {
    setNewRating(rating);
  };

  const handleRatingHover = (rating: number) => {
    setHoveredRating(rating);
  };

  const handleSubmitReview = () => {
    if (newReviewText.trim() === '' || newRating === 0) return;
    
    // In a real app, you would upload images and send data to an API
    const newReview: CustomerReview = {
      id: `${reviews.length + 1}`,
      customerName: 'You',
      customerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      rating: newRating,
      date: new Date().toISOString().substring(0, 10),
      reviewText: newReviewText,
      reviewImages: selectedImages.map((_, index) => 
        `https://images.unsplash.com/photo-${1550000000000 + index}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`
      ),
      verifiedPurchase: true,
      helpfulCount: 0
    };

    setReviews([newReview, ...reviews]);
    setNewReviewText('');
    setNewRating(0);
    setSelectedImages([]);
    setShowAddReview(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages([...selectedImages, ...filesArray]);
    }
  };

  const handleMarkHelpful = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? {...review, helpfulCount: review.helpfulCount + 1} 
        : review
    ));
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={`star-position-${i}`}>
        {i < rating ? (
          <MdStar className="text-yellow-400 text-xl" />
        ) : (
          <MdStarBorder className="text-yellow-400 text-xl" />
        )}
      </span>
    ));
  };

  // Filter reviews based on selections
  const filteredReviews = reviews.filter(review => {
    // Filter by rating
    if (selectedFilter && parseInt(selectedFilter, 10) !== review.rating) {
      return false;
    }
    
    // Filter by media
    if (showMediaOnly && review.reviewImages.length === 0) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '' && 
        !review.reviewText.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !review.customerName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {modalImage && (
        <ImageModal 
          src={modalImage} 
          alt="Review image" 
          onClose={() => setModalImage(null)}
        />
      )}

      <Heading className="text-center mb-12">Customer Reviews</Heading>

      {/* Rating Summary Section */}
      <Ratings rating={5} reviews={54}/>
      {/* Reviews with Media Section - Only show if there are images */}
      {allReviewImages.length > 0 && (
        <div className="mb-16">
          <h3 className="font-semibold text-lg mb-6 text-center">Media Gallery</h3>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto py-4 px-8 justify-center">
              {allReviewImages.map((item, idx) => (
                <div 
                  key={`image-${item.reviewId}-${item.image.substring(item.image.lastIndexOf('/') + 1, item.image.lastIndexOf('?'))}`} 
                  className="relative min-w-[140px] w-[140px] h-[140px] cursor-pointer rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105"
                  onClick={() => setModalImage(item.image)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setModalImage(item.image);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View review image ${idx + 1}`}
                >
                  <Image
                    src={item.image}
                    alt={`Review image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            {allReviewImages.length > 3 && (
              <>
                <button 
                  type="button"
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Previous images"
                >
                  <MdChevronLeft size={24} />
                </button>
                <button 
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Next images"
                >
                  <MdChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Filters & Controls Section - More minimal and centered */}
      <div className="mb-12">
        <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search reviews"
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="border border-gray-200 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all appearance-none bg-no-repeat bg-right"
            style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="media-only"
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              checked={showMediaOnly}
              onChange={() => setShowMediaOnly(!showMediaOnly)}
            />
            <label htmlFor="media-only" className="text-sm">With photos</label>
          </div>
        </div>

        {/* Popular Topics */}
        <div className="mb-10 text-center">
          <h3 className="font-medium mb-4">Popular topics about our Banana Chips</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                className="px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-sm transition-colors border border-amber-200"
              >
                {topic}
              </button>
            ))}
            <button 
              type="button"
              className="px-4 py-2 rounded-full bg-green-50 hover:bg-green-100 text-sm font-medium transition-colors border border-green-200"
            >
              More
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select className="border-none bg-transparent font-medium text-sm focus:outline-none appearance-none bg-no-repeat bg-right"
              style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")", backgroundSize: "1.5em 1.5em", paddingRight: "1.5rem" }}>
              <option value="relevant">Most relevant</option>
              <option value="recent">Most recent</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </div>
          
          {!showAddReview && (
            <Button 
              onClick={() => setShowAddReview(true)}
              className="rounded-full bg-green-600 hover:bg-green-700"
            >
              Write a Review
            </Button>
          )}
        </div>
      </div>

      {/* Write Review Form - Modal-like design */}
      {showAddReview && (
        <div className="bg-white p-8 rounded-xl mb-12 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold mb-6 text-center">Share Your Experience</h3>
          
          <div className="mb-6">
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
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleRatingClick(star);
                    }
                  }}
                  aria-label={`Rate ${star} ${star === 1 ? 'star' : 'stars'}`}
                >
                  {(hoveredRating || newRating) >= star ? (
                    <MdStar className="text-yellow-400 text-3xl" />
                  ) : (
                    <MdStarBorder className="text-yellow-400 text-3xl" />
                  )}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <textarea
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              placeholder="Share your experience with this product..."
              rows={4}
            />
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-center">
              <label className="flex items-center gap-2 cursor-pointer border rounded-full py-2 px-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <MdImage className="text-gray-600" />
                <span>Add Photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {selectedImages.length > 0 && (
                <span className="ml-4 text-sm text-gray-600">
                  {selectedImages.length} image(s) selected
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={handleSubmitReview} 
              disabled={newReviewText.trim() === '' || newRating === 0}
              className="rounded-full px-6"
            >
              Submit Review
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowAddReview(false)}
              className="rounded-full px-6"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-10">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-10">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
                <Image
                  src={review.customerAvatar}
                  alt={review.customerName}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium text-center sm:text-left">{review.customerName}</p>
                  <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.date)}
                    </span>
                    {review.verifiedPurchase && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">✓ Verified Purchase</span>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="mb-4 text-gray-700 leading-relaxed">{review.reviewText}</p>
              
              {review.reviewImages.length > 0 && (
                <div className="flex gap-3 mb-6 overflow-x-auto py-2 justify-center sm:justify-start">
                  {review.reviewImages.map((image, idx) => (
                    <div 
                      key={`review-${review.id}-img-${image.substring(image.lastIndexOf('/') + 1, image.indexOf('?') > 0 ? image.indexOf('?') : image.length)}`} 
                      className="relative w-24 h-24 cursor-pointer rounded-lg overflow-hidden shadow-sm transition-transform hover:scale-105"
                      onClick={() => setModalImage(image)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setModalImage(image);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`View image ${idx + 1} from ${review.customerName}'s review`}
                    >
                      <Image
                        src={image}
                        alt={`Review image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => handleMarkHelpful(review.id)}
                  className="text-gray-500 hover:text-gray-900 flex items-center gap-1 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded-full transition-colors"
                >
                  Helpful
                </button>
                {review.helpfulCount > 0 && (
                  <span className="text-gray-500">
                    {review.helpfulCount} {review.helpfulCount === 1 ? 'person' : 'people'} found this helpful
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No reviews match your current filters.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
      
      {reviews.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-2">No reviews yet.</p>
          <Button onClick={() => setShowAddReview(true)} className="rounded-full">
            Be the first to review
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;