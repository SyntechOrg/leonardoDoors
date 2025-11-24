import React, { useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export default function ImageGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safeguard: Handle empty or null image arrays
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        No Images Available
      </div>
    );
  }

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Optional: Add simple touch swipe support for mobile interactiveness
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  return (
    <div className="w-full mx-auto max-w-6xl p-4">
      {/* LAYOUT STRATEGY:
        - Mobile: Flex-col (Image top, Thumbnails bottom)
        - Desktop (md): Flex-row (Thumbnails left, Image right)
        - 'h-[500px]' or 'aspect' sets the anchor for desktop height.
      */}
      <div className="flex flex-col md:flex-row gap-4 md:h-[500px] lg:h-[600px]">
        
        {/* THUMBNAIL CONTAINER (SIDEBAR)
          - Order: 2 on mobile (bottom), 1 on desktop (left) - achieved via md:order-1
          - Logic: 'flex-1' inside children divides space equally (1/3, 1/4 etc)
        */}
        <div className="order-2 md:order-1 flex md:flex-col gap-3 md:w-24 lg:w-32 md:h-full overflow-x-auto md:overflow-hidden md:overflow-y-auto no-scrollbar">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              // flex-1: This is the magic. It forces items to split available vertical space equally on desktop.
              // shrink-0: Prevents squishing on mobile horizontal scroll.
              className={`
                relative overflow-hidden rounded-md transition-all duration-300 ease-in-out
                md:flex-1 md:w-full shrink-0 h-20 w-20 md:h-auto
                border-2 
                ${currentIndex === index ? "border-black opacity-100 scale-95" : "border-transparent opacity-60 hover:opacity-100"}
              `}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* MAIN IMAGE CONTAINER 
          - flex-1: Takes remaining width
          - relative: For positioning arrows
        */}
        <div 
          className="order-1 md:order-2 flex-1 relative rounded-xl overflow-hidden bg-gray-50 group"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img
            src={images[currentIndex]}
            alt={`Product View ${currentIndex + 1}`}
            className="w-full h-full object-contain mix-blend-multiply" 
            // object-contain ensures entire image is visible. Use object-cover if you want to fill the square.
          />

          {/* Navigation Arrows (Hidden on mobile usually, or visible) */}
          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrev}
              className="bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg backdrop-blur-sm transition-transform active:scale-90"
              aria-label="Previous Image"
            >
              <HiChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg backdrop-blur-sm transition-transform active:scale-90"
              aria-label="Next Image"
            >
              <HiChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Indicator Dots (Optional, good for UX) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-black' : 'w-1.5 bg-black/20'
                }`} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}