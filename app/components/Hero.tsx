import "../styles/hero.css";
import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="hero-section bg-white py-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 px-6">
        {/* Texte principal */}
        <div className="text-left">
          <h1 className="text-5xl font-extrabold text-gray-800 leading-tight hero-title">
            The <span className="gradient-shadow-text">Easiest Way</span> to Get Your New Job
          </h1>
          <p className="text-gray-600 mt-4 text-lg hero-subtitle">
            Each month, more than 3 million job seekers turn to our website in their job search for work...
          </p>
          
        </div>

        <div className="w-full flex justify-center md:justify-end">
        <img
          src="/images/ImageAcceuil.png"
          alt="People working illustration"
          className="w-full max-w-[500px] h-auto object-contain rounded-2xl"
        />
      </div>
      </div>
    </section>
  );
}
