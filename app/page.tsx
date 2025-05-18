import Hero from "./components/Hero";
 import JobList from "./components/JobList";
 import Categories from "./components/Categories";
import Navbar from "./components/NavbarDefault";
import FeaturesAndMotivationSection from "./components/FeaturesAndMotivationSection";
import HiringBanner from "./components/HiringBanner";

export default function Home() {
  return (
    <>
     <Navbar/>
     <main className="space-y-22">
        <Hero />
        <FeaturesAndMotivationSection />
        <Categories />
        <HiringBanner />
        <JobList />
      </main>
    </>
  );
}
