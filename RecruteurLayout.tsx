"use client";
import { useState } from "react";
import Sidebar from "./app/components/SidebarRecruteur";

export default function RecruteurLayout({ children, noSidebarMargin = false }: { children: React.ReactNode, noSidebarMargin?: boolean }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar onToggle={setIsSidebarOpen} />
      {/* Hamburger bouton flottant */}
      {!isSidebarOpen && (
        <button
          className="fixed top-4 left-4 z-[1201] bg-white border border-blue-200 shadow-lg rounded-full p-2 hover:bg-blue-50 transition-all"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      {/* Main Content */}
      <div
        className="flex-1 min-h-screen w-full bg-gradient-to-br from-blue-50 to-white"
        style={{
          marginLeft: noSidebarMargin ? 0 : isSidebarOpen ? "16rem" : "4rem",
        }}
      >
        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}