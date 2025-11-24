import React from "react";

const ConfigurationStart = () => {
  return (
    <div className="bg-[#EDEDED] relative">
      <div className="container myHeight flex items-center max-md:justify-end max-md:flex-col-reverse">
        <div className="w-[25%] max-md:w-full flex flex-col gap-4 my-auto max-md:my-8">
          <p className="xl:text-[20px] text-[18px] text-[#5A5A5A]">
            Massgeschneidert
          </p>
          <h1 className="xl:text-[50px] text-[36px] text-black font-medium leading-[1.05]">
            Tür bis ins kleinste Detail konfigurieren
          </h1>
          <p className="xl:text-[18px] text-[16px] text-black">
            Mit dem Konfigurator können Kunden jedes Detail der Tür visuell
            anpassen, egal wie klein. Verkaufen Sie mehr, indem Sie ihnen die
            Freiheit geben, zu wählen.
          </p>
          <button className="w-fit text-[14px] bg-black rounded-lg px-10 py-3 text-white">
            Beginnen Sie mit der Erstellung
          </button>
        </div>

        <img
          className="absolute max-md:relative right-0 top-0 xl:w-[70%] w-[65%] max-md:w-full max-md:mt-10 h-[auto] md:h-full"
          src="/images/aboutStart.png"
          alt=""
        />
      </div>
    </div>
  );
};

export default ConfigurationStart;
