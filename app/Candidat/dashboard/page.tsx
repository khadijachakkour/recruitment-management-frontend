"use client";

import "nprogress/nprogress.css";
import NavbarCandidat from "@/app/components/NavbarCandidat";
import Hero from "../../components/Hero";
import JobList from "../../components/JobList";
import Categories from "../../components/Categories";

const customStyle = `
#nprogress {
  pointer-events: none;
}
#nprogress .bar {
  background: #2563eb;
  position: fixed;
  z-index: 1031;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  border-radius: 2px;
}
`;

export default function DashboardCandidat() {
  return (
    <>
      <style>{customStyle}</style>
      <div className="min-h-screen bg-white flex flex-col w-full">
        <NavbarCandidat />
        <main className="flex-1 w-full">
          <Hero />
          <Categories />
          <JobList />
        </main>
      </div>
    </>
  );
}