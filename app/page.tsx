import Hero from "./components/Hero";
 import JobList from "./components/JobList";
 import Categories from "./components/Categories";
import Navbar from "./Navbar/Navbar";

export default function Home() {
  return (
    <>
    <Navbar/>
      <Hero />
      <Categories />
      <JobList />
    </>
  );
}
