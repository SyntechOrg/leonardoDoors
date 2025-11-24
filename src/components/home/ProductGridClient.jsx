"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import ProductCard from "../../mini-components/ProductCard";

const filterCategories = ["Alle", "Innentüren", "Aussentüren", "Rahmentüren"];

export default function ProductGridClient({ doors = [] }) {
  const [activeFilter, setActiveFilter] = useState("Alle");

  // 1. Memoize filtering for performance
  // 2. Limit to 8 items for the homepage to optimize LCP (Largest Contentful Paint)
  const filteredProducts = useMemo(() => {
    let result = doors;

    if (activeFilter !== "Alle") {
      result = doors.filter((door) => door.category === activeFilter);
    }

    return result.slice(0, 8);
  }, [doors, activeFilter]);

  // Helper to format price safely
  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-CH", {
      style: "currency",
      currency: "CHF",
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 md:py-35 py-15">
      <div className="flex flex-row justify-between max-md:flex-col ">
        <h2 className="text-3xl font-bold mb-6 max-md:text-center">
          Unsere Produkte
        </h2>

        {/* <div className="flex items-center justify-center gap-4 mb-8 max-md:flex-col">
          {filterCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === category
                  ? "bg-black text-white border border-black"
                  : "bg-transparent text-gray-600 border border-transparent hover:border-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 gap-y-12 min-h-[400px]">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((door) => (
            <ProductCard
              key={door.id}
              product={{
                id: door.id,
                name: door.name,
                // Ensure consistent data shape for ProductCard
                price: formatPrice(door.price),
                rating: 5, // Default rating (if not in DB)
                imageUrl: door.images?.[0] || "/images/placeholder.png",
                category: door.category,
                discount: door.discount_price ? "SALE" : null,
              }}
            />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center text-gray-400">
            <p>Keine Produkte gefunden.</p>
          </div>
        )}
      </div>

      <div className="text-center mt-12">
        <Link
          href={
            activeFilter === "Alle"
              ? "/shop"
              : `/shop?category=${encodeURIComponent(activeFilter)}`
          }
          className="inline-block px-8 py-3 rounded-lg text-black border border-gray-400 transition-colors hover:bg-black hover:text-white hover:border-black"
        >
          Alle anzeigen
        </Link>
      </div>
    </div>
  );
}