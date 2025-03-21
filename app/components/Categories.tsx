"use client";

import { useRef } from "react";
import { Briefcase, PenTool, Users, Search, Code, Banknote, BarChart, Megaphone, ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/categories.css";

const categories = [
  { name: "Retail & Product", icon: <Briefcase size={32} /> },
  { name: "Content Writer", icon: <PenTool size={32} /> },
  { name: "Human Resource", icon: <Users size={32} /> },
  { name: "Market Research", icon: <Search size={32} /> },
  { name: "Software", icon: <Code size={32} /> },
  { name: "Finance", icon: <Banknote size={32} /> },
  { name: "Management", icon: <BarChart size={32} /> },
  { name: "Marketing & Sales", icon: <Megaphone size={32} /> },
  { name: "Design", icon: <PenTool size={32} /> }, /* Nouvelle catégorie */
  { name: "Legal", icon: <Briefcase size={32} /> }, /* Nouvelle catégorie */
  { name: "Engineering", icon: <Code size={32} /> }, /* Nouvelle catégorie */
  { name: "Health & Wellness", icon: <Users size={32} /> }, /* Nouvelle catégorie */
];

export default function Categories() {
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Afficher 4 cartes à la fois
    slidesToScroll: 2, // Avance de 2 cartes
    autoplay: true, // Défilement automatique
    autoplaySpeed: 3000, // 3 secondes par slide
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="categories">
      <div className="container">
        <h2 className="title">Browse by category</h2>
        <p className="subtitle">Find jobs that fit you, about 600+ new jobs every day</p>

        <div className="slider-container">
          {/* Bouton Gauche */}
          <button className="slider-btn left" onClick={() => sliderRef.current?.slickPrev()}>
            <ChevronLeft size={32} />
          </button>

          {/* Slider */}
          <div className="categories-grid">
            <Slider ref={sliderRef} {...settings}>
              {categories.map((cat, index) => (
                <div key={index} className="category-card">
                  {cat.icon}
                  <h3>{cat.name}</h3>
                  <p>+100 Jobs Available</p>
                </div>
              ))}
            </Slider>
          </div>

          {/* Bouton Droit */}
          <button className="slider-btn right" onClick={() => sliderRef.current?.slickNext()}>
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    </section>
  );
}
