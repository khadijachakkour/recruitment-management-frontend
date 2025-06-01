"use client";

import { useEffect, useState } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useAuth } from "@/src/context/authContext";
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
  const { logoutCandidat } = useAuth();

  useEffect(() => {
    NProgress.start();
    setTimeout(() => {
      NProgress.done();
    }, 800);
  }, []);

  return (
    <>
      <style>{customStyle}</style>

      <div className="flex min-h-screen bg-white">
        <main className="flex-1 transition-all duration-300 p-6">
          <NavbarCandidat />
          <main className="space-y-22">
            <Hero />
            <Categories />
            <JobList />
          </main>
        </main>
      </div>
    </>
  );
}
