import Hero from "./components/Hero";
 import JobList from "./components/JobList";
 import Categories from "./components/Categories";
import Navbar from "./components/NavbarDefault";
import FeaturesAndMotivationSection from "./components/FeaturesAndMotivationSection";

export default function Home() {
  return (
    <>
     <Navbar/>
      <Hero />
      <FeaturesAndMotivationSection />
      <JobList />
    </>
  );
}
