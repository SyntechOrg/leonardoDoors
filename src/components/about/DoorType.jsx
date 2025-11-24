"use client";
import React, { useState } from "react";

const DoorType = () => {
  const [hovered, setHovered] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const [hovered3, setHovered3] = useState(false);

  const toggleHovered = () => {
    setHovered((prev) => !prev);
  };

  const toggleHovered2 = () => {
    setHovered2((prev) => !prev);
  };
  const toggleHovered3 = () => {
    setHovered3((prev) => !prev);
  };
  return (
    <div className="py-10">
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-5 container">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="bg-[#F5F5F5] p-5 rounded-lg flex flex-row max-lg:w-[65%] max-md:w-full max-lg:mx-auto"
        >
          <img src="/images/Innenturen.png" alt="" />
          <div className="flex flex-row justify-between items-center w-full max-xl:px-3 px-5">
            <h1 className="font-medium xl:text-[20px] text-[18px]">
              Innentüren
            </h1>
            <img
              src="/images/whiteRightArrow.svg"
              alt=""
              className={`rounded-full p-1 ${
                hovered ? "bg-[#FECC17]" : "bg-black"
              }`}
            />
          </div>
        </div>
        <div
          onMouseEnter={() => setHovered2(true)}
          onMouseLeave={() => setHovered2(false)}
          className="bg-[#F5F5F5] p-5 rounded-lg flex flex-row max-lg:w-[65%] max-md:w-full max-lg:mx-auto"
        >
          <img src="/images/Innenturen.png" alt="" />
          <div className="flex flex-row justify-between items-center w-full max-xl:px-3 px-5">
            <h1 className="font-medium xl:text-[20px] text-[18px]">
              Aussentüren
            </h1>
            <img
              src="/images/whiteRightArrow.svg"
              alt=""
              className={`rounded-full p-1 ${
                hovered2 ? "bg-[#FECC17]" : "bg-black"
              }`}
            />
          </div>
        </div>
        <div
          onMouseEnter={() => setHovered3(true)}
          onMouseLeave={() => setHovered3(false)}
          className="bg-[#F5F5F5] p-5 rounded-lg flex flex-row max-lg:w-[65%] max-md:w-full max-lg:mx-auto"
        >
          <img src="/images/Innenturen.png" alt="" />
          <div className="flex flex-row justify-between items-center w-full max-xl:px-3 px-5">
            <h1 className="font-medium xl:text-[20px] text-[18px]">
              Rahmentüren
            </h1>
            <img
              src="/images/whiteRightArrow.svg"
              alt=""
              className={`rounded-full p-1 ${
                hovered3 ? "bg-[#FECC17]" : "bg-black"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoorType;
