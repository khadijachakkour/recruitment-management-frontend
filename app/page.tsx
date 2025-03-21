// import HeroSection from "./components/Hero";
// import JobList from "./components/JobList";
// import Categories from "./components/Categories";
// import SearchBar from "./components/SearchBar";

// export default function Home() {
//   return (
//     <main>
//       <HeroSection />
//       <SearchBar />
//       <Categories />
//       <JobList />
//     </main>
//   );
// }
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
 import JobList from "./components/JobList";
 import Categories from "./components/Categories";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <JobList />
    </>
  );
}
