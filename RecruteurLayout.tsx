"use client";
import { useState } from "react";
import NavbarAdmin from "./app/components/NavbarAdmin";
import Sidebar from "./app/components/SidebarRecruteur";

export default function RecruteurLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar onToggle={(isOpen) => setIsSidebarOpen(isOpen)} />

      {/* Main Content */}
      <div
        className={`flex-1 min-h-screen transition-all duration-300`}
        style={{
          marginLeft: isSidebarOpen ? "16rem" : "4rem", // Ajuste dynamiquement la marge gauche
        }}
      >
        {/* Navbar */}
        <NavbarAdmin />

        {/* Page Content */}
        <div className="pt-16">{children}</div>
      </div>
    </div>
  );
}