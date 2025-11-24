"use client";
import React, { useState } from "react";
import Link from "next/link";

const TopCategories = () => {
  const [hovered, setHovered] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const [hovered3, setHovered3] = useState(false);

  return (
    <div>
      <div className="container md:py-22 py-10">
        <div className="mb-10">
          <h1 className="md:text-[32px] text-[24px] text-black font-semibold">
            Top Kategorien
          </h1>
          <p className="md:text-[18px] text-[16px] text-[#9CA3AF]">
            Entdecken Sie eine große Auswahl an Türprodukten, die zu <br />{" "}
            Ihrem einzigartigen Lebensstil und Ihren Bedürfnissen passen.
          </p>
        </div>
        <div className="flex md:flex-row flex-col max-md:gap-4 justify-between">
          <div className="flex flex-col md:gap-5 gap-4 md:w-[49%] w-full">
            
            {/* --- CATEGORY 1: Innentüren --- */}
            <Link href="/shop?category=Innentür" className="w-full block">
              <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="relative w-fit hover:cursor-pointer w-full"
              >
                <img src="/images/interiorDoors.png" alt="Innentüren" className="w-full" />
                <div className="absolute z-9 bg-gradient-to-b from-transparent to-black bottom-0 w-full rounded-b-lg">
                  <div className="flex flex-row justify-between items-center mb-5 w-[90%] mx-auto">
                    <div className="h-1/3">
                      <h1 className="lg:text-[24px] text-[20px] text-white font-medium">
                        Innentüren
                      </h1>
                      <p className="text-[14px] lg:text-[16px] text-[#D1D5DB]">
                        350+ Artikel
                      </p>
                    </div>
                    <div
                      className={`flex justify-center items-center rounded-full p-2 h-fit transition-colors duration-300 ${
                        hovered ? "bg-[#FECC17]" : "bg-white"
                      }`}
                    >
                      <img src="/images/rightArrow.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* --- CATEGORY 2: Rahmentüren --- */}
            <Link href="/shop?category=Rahmentüren" className="w-full block">
              <div
                onMouseEnter={() => setHovered2(true)}
                onMouseLeave={() => setHovered2(false)}
                className="relative w-fit hover:cursor-pointer w-full"
              >
                <img
                  src="/images/frameDoors.png"
                  alt="Rahmentüren"
                  className="rounded-lg w-full"
                />
                <div className="absolute z-9 bg-gradient-to-b from-transparent to-black bottom-0 w-full rounded-b-lg">
                  <div className="flex flex-row justify-between items-center mb-5 w-[90%] mx-auto">
                    <div className="h-1/3">
                      <h1 className="lg:text-[24px] text-[20px] text-white font-medium">
                        Rahmentüren
                      </h1>
                      <p className="text-[14px] lg:text-[16px] text-[#D1D5DB]">
                        350+ Artikel
                      </p>
                    </div>
                    <div
                      className={`flex justify-center items-center rounded-full p-2 h-fit transition-colors duration-300 ${
                        hovered2 ? "bg-[#FECC17]" : "bg-white"
                      }`}
                    >
                      <img src="/images/rightArrow.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

          </div>
          
          {/* --- CATEGORY 3: Aussentüren --- */}
          <div className="md:w-[49%] w-full">
            <Link href="/shop?category=Aussentüren" className="w-full h-full block">
              <div
                onMouseEnter={() => setHovered3(true)}
                onMouseLeave={() => setHovered3(false)}
                className="relative w-full md:w-fit xl:w-[98%] hover:cursor-pointer h-full"
              >
                <img
                  src="/images/exteriorDoors.png"
                  alt="Aussentüren"
                  className="max-md:w-full xl:w-[98%]"
                />
                <div className="absolute z-9 bg-gradient-to-b from-transparent to-black bottom-0 w-full rounded-b-lg xl:w-[98%]">
                  <div className="flex flex-row justify-between items-center mb-5 w-[90%] mx-auto">
                    <div className="h-1/3">
                      <h1 className="lg:text-[24px] text-[20px] text-white font-medium">
                        Aussentüren
                      </h1>
                      <p className="text-[14px] lg:text-[16px] text-[#D1D5DB]">
                        350+ Artikel
                      </p>
                    </div>
                    <div
                      className={`flex justify-center items-center rounded-full p-2 h-fit transition-colors duration-300 ${
                        hovered3 ? "bg-[#FECC17]" : "bg-white"
                      }`}
                    >
                      <img src="/images/rightArrow.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCategories;