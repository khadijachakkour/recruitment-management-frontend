import "../styles/hero.css";
import SearchBar from "./SearchBar"; // Importation du composant de la barre de recherche

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center relative z-10">
        {/* Texte principal */}
        <div className="text-left">
          <h1 className="text-5xl font-extrabold text-gray-800 leading-tight hero-title">
            The <span className="gradient-shadow-text">Easiest Way</span> to Get Your New Job
          </h1>
          <p className="text-gray-600 mt-4 text-lg hero-subtitle">
            Each month, more than 3 million job seekers turn to our website in their job search for work...
          </p>

          {/* Nouvelle barre de recherche améliorée */}
          <div className="mt-8 flex justify-start w-full">
            <SearchBar />
          </div>
        </div>

        {/* Image à droite du texte */}
        <div className="hero-image"></div>
      </div>
    </section>
  );
}
