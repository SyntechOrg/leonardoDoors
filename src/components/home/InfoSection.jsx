import React from "react";

const InfoSection = () => {
  return (
    <div className="bg-black">
      <div className="container py-10 flex md:flex-row flex-col gap-18 max-md:gap-8 max-md:items-center justify-center">
        
        {/* 1. MATERIAL (Gem/Diamond Icon) */}
        <div className="flex flex-row gap-3 items-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 3h12l4 6-10 10L2 9h4" />
            <path d="M12 22V9" />
          </svg>
          <h1 className="text-[18px] text-white font-medium">
            Hochwertige Materialien
          </h1>
        </div>

        {/* 2. DESIGN (Pen/Nib Icon) */}
        <div className="flex flex-row gap-3 items-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
          <h1 className="text-[18px] text-white font-medium">
            Exklusives Design
          </h1>
        </div>

        {/* 3. CUSTOM DIMENSIONS (Ruler Icon) */}
        <div className="flex flex-row gap-3 items-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0l12.6 12.6z" />
            <path d="m14.5 12.5 2-2" />
            <path d="m11.5 9.5 2-2" />
            <path d="m8.5 6.5 2-2" />
            <path d="m17.5 15.5 2-2" />
          </svg>
          <h1 className="text-[18px] text-white font-medium">
            Individuelle Maße
          </h1>
        </div>

        {/* 4. DURABILITY (Shield Icon) */}
        <div className="flex flex-row gap-3 items-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <h1 className="text-[18px] text-white font-medium">
            Langlebige Konstruktion
          </h1>
        </div>

      </div>
    </div>
  );
};

export default InfoSection;