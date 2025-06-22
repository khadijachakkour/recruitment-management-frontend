"use client"; 

import { useRef } from "react";
import {
  Briefcase,
  PenTool,
  Users,
  Search,
  Code,
  Banknote,
  BarChart,
  Megaphone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/categories.css";

const categories = [
  { name: "Retail & Product", icon: <Briefcase size={30} />, badge: null },
  { name: "Content Writer", icon: <PenTool size={30} />, badge: "Hot" },
  { name: "Human Resource", icon: <Users size={30} />, badge: null },
  { name: "Market Research", icon: <Search size={30} />, badge: "New" },
  { name: "Software", icon: <Code size={30} />, badge: "Hot" },
  { name: "Finance", icon: <Banknote size={30} />, badge: null },
  { name: "Management", icon: <BarChart size={30} />, badge: null },
  { name: "Marketing & Sales", icon: <Megaphone size={30} />, badge: null },
  { name: "Design", icon: <PenTool size={30} />, badge: null },
  { name: "Legal", icon: <Briefcase size={30} />, badge: null },
  { name: "Engineering", icon: <Code size={30} />, badge: null },
  { name: "Health & Wellness", icon: <Users size={30} />, badge: null },
];

export default function Categories() {
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-12 bg-gray-50"> 
      <div className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center"> 
          Explore Smart Job Categories
        </h2>
        <p className="text-gray-600 text-sm mb-8 text-center max-w-2xl mx-auto"> 
          Tailored for your career goals — explore top industries with AI-powered matches.
        </p>

        <div className="relative">
          <button
            className="absolute left-[-25px] top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition z-10"
            onClick={() => sliderRef.current?.slickPrev()} >
            <ChevronLeft size={20} /> 
          </button>

          <Slider ref={sliderRef} {...settings}>
            {categories.map((cat, index) => (
              <div key={index} className="px-3"> 
                <div className="relative group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-4 text-center flex flex-col items-center gap-3 border border-gray-100"> {/* Réduction du padding interne */}
                  {/* Badge */}
                  {cat.badge && (
                    <span className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${
                      cat.badge === "Hot"
                        ? "from-pink-500 to-red-500"
                        : "from-blue-500 to-cyan-500"
                    } text-white shadow-md animate-pulse`}>
                      {cat.badge}
                    </span>
                  )}

                  {/* Icon */}
                  <div className="bg-indigo-100 rounded-full p-2 group-hover:bg-indigo-200 transition"> 
                    <div className="text-indigo-600 group-hover:scale-110 transition-transform duration-200">
                      {cat.icon}
                    </div>
                  </div>

                  {/* Text */}
                  <h3 className="font-semibold text-gray-800 text-md group-hover:text-indigo-700 transition"> 
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500">+100 Jobs Available</p> 
                </div>
              </div>
            ))}
          </Slider>

          <button
            className="absolute right-[-25px] top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition z-10"
            onClick={() => sliderRef.current?.slickNext()} >
            <ChevronRight size={20} /> 
          </button>
        </div>
      </div>
    </section>
  );
}
