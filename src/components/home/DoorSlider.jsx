"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";

const products = [
  {
    id: 1,
    name: "Moderne Shaker-Doppeltür",
    price: "CHF 1477.80",
    rating: 5,
    image: "/images/sliderDoor1.png",
    discount: "15% OFF",
  },
  {
    id: 2,
    name: "Moderne Shaker-Doppeltür",
    price: "CHF 1890.50",
    rating: 5,
    image: "/images/sliderDoor2.png",
    discount: null,
  },
  {
    id: 3,
    name: "Moderne Shaker-Doppeltür",
    price: "CHF 2150.00",
    rating: 5,
    image: "/images/sliderDoor3.png",
    discount: null,
  },
  {
    id: 4,
    name: "Moderne Shaker-Doppeltür",
    price: "CHF 980.00",
    rating: 5,
    image: "/images/sliderDoor4.png",
    discount: "15% OFF",
  },
  {
    id: 5,
    name: "Moderne Shaker-Doppeltür",
    price: "CHF 1320.25",
    rating: 4,
    image: "/images/sliderDoor1.png",
    discount: null,
  },
  {
    id: 6,
    name: "Moderne Shaker-Doppeltür",
    price: "CHF 1645.70",
    rating: 5,
    image: "/images/sliderDoor2.png",
    discount: "10% OFF",
  },
  {
    id: 7,
    name: "Moderne Shaker-Doppeltür",
    price: "CHF 2400.00",
    rating: 4,
    image: "/images/sliderDoor3.png",
    discount: null,
  },
];

const getVisibleCards = () => {
  if (typeof window === "undefined") return 4;
  if (window.innerWidth >= 1280) return 4;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
};

const StarRating = ({ rating }) => (
  <div className="flex items-center justify-center">
    {[...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill={i < rating ? "currentColor" : "none"}
      />
    ))}
  </div>
);

const ProductCard = ({ product, style }) => (
  <div className="flex-shrink-0 p-2" style={style}>
    <div className="rounded-lg overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full" />
        {product.discount && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded">
            {product.discount}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col justify-center text-center flex-grow">
        <h3 className="text-[18px] font-medium text-gray-800">
          {product.name}
        </h3>
        <div className="my-2">
          <StarRating rating={product.rating} />
        </div>
        <p className="text-lg text-gray-900 font-semibold mt-auto">
          {product.price}
        </p>
      </div>
    </div>
  </div>
);

const DoorSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(getVisibleCards());
  const sliderRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCards(getVisibleCards());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const maxIndex = Math.max(0, products.length - visibleCards);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [visibleCards, currentIndex, products.length]);

  const maxIndex = Math.max(0, products.length - visibleCards);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const progressBarWidth = (visibleCards / products.length) * 100;
  const progressBarOffset = (currentIndex / products.length) * 100;

  return (
    <div className="bg-gray-50 w-full py-8 sm:py-12">
      <div className="w-full container mx-auto">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-bold text-gray-900">Bestseller</h2>
          <p className="mt-2 text-base text-gray-500 max-w-2xl mx-auto sm:mx-0">
            Entdecken Sie eine große Auswahl an Türprodukten, die zu Ihrem
            einzigartigen Lebensstil und Ihren Bedürfnissen passen.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="h-6 w-6 text-gray-800" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Next slide"
          >
            <FiChevronRight className="h-6 w-6 text-gray-800" />
          </button>

          <div className="overflow-hidden" ref={sliderRef}>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / visibleCards)
                }%)`,
              }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  style={{ flex: `0 0 ${100 / visibleCards}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 h-1 w-full bg-gray-200 rounded-full relative">
          <div
            className="h-1 bg-gray-800 rounded-full absolute transition-all duration-500 ease-in-out"
            style={{
              width: `${progressBarWidth}%`,
              left: `${progressBarOffset}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DoorSlider;
