import "../styles/hero.css";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero-section bg-gradient-to-br from-white to-blue-50 py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-6">
        {/* Main text */}
        <div className="text-left animate-fade-in-up">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
            <span className="block mb-2">Take Your Career to the Next Level</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              with Ease & Confidence
            </span>
          </h1>
          <p className="text-gray-700 mt-4 text-base max-w-md">
            A smart and intuitive platform to connect with the right opportunities.
            Discover, explore, and take action — all in one place.
          </p>

          <div className="mt-6 space-y-3">
            <button className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition duration-300">
              Get Started
            </button>
          </div>
        </div>

        {/* Illustration image */}
        <div className="w-full flex justify-center md:justify-end animate-fade-in-up">
          <Image
            src="/images/ImageAcceuil.png"
            alt="Professional platform illustration"
            width={400}
            height={300}
            className="w-full max-w-[400px] h-auto object-contain rounded-3xl"
          />
        </div>
      </div>
    </section>
  );
}
