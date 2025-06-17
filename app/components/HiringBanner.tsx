import React from "react";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";

const HiringBanner: React.FC = () => {
  return (     
    <div className="w-full flex items-center justify-center bg-gray-50 px-2 py-16">
      <section className="relative w-full max-w-xl bg-gray-50 border border-gray-200 rounded-2xl px-4 py-8 flex flex-col md:flex-row items-center justify-between shadow-xl overflow-hidden">

        <div className="absolute inset-y-0 left-0 w-1/3 ">
          <Image
            src="/images/Hiring.png"
            alt="Hiring Background"
            width={200}
            height={200}
            className="h-full w-full object-contain object-left"
          />
        </div>

        {/* Text Content */}
        <div className="relative z-10 w-full md:w-2/3 text-center md:text-left md:ml-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-tight">
            WE ARE <span className="text-blue-600">HIRING</span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-3">
            Let’s Work Together & Explore Opportunities
          </p>
          <button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2.5 rounded-full inline-flex items-center gap-2 shadow-md transition duration-200">
            Apply Now <FaArrowRight className="text-xs" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HiringBanner;
