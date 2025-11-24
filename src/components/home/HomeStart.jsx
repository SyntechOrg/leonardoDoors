import Link from "next/link";
import React from "react";

const HomeStart = () => {
  return (
    <div className="bg-[#EDEDED] relative">
      <div className="container myHeight flex items-center max-md:justify-end max-md:flex-col-reverse">
        <div className="w-[25%] max-md:w-full flex flex-col gap-4 my-auto max-md:my-8">
          <p className="xl:text-[20px] text-[18px] text-[#5A5A5A]">
            AUSSENTÜREN
          </p>
          <h1 className="xl:text-[50px] text-[36px] text-black font-medium leading-[1.05]">
            Die Art und Weise, wie Sie eintreten, neu definieren
          </h1>
          <p className="xl:text-[18px] text-[16px] text-black">
            Entdecken Sie Türen, wo Design auf Langlebigkeit trifft. Von schlank
            modern bis zeitlos klassisch finden Sie Ihre perfekte Passform.
          </p>
          <Link href={"/shop"} className="w-fit text-[14px] bg-black rounded-lg px-10 py-3 text-white">
            Jetzt einkaufen
          </Link>
        </div>

        <img
          className="absolute max-md:relative right-0 top-0 xl:w-[70%] w-[65%] max-md:w-full max-md:mt-10 h-[auto] md:h-full"
          src="/images/homeStart.png"
          alt=""
        />
      </div>
    </div>
  );
};

export default HomeStart;
