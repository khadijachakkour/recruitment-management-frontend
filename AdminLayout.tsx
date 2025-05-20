"use client";
import { useState } from "react";
import NavbarAdmin from "./app/components/NavbarAdmin";
import Sidebar from "./app/components/SidebarAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">

      <Sidebar onToggle={(isOpen) => setIsSidebarOpen(isOpen)} />

      <div
        className={`flex-1 min-h-screen transition-all duration-300`}
        style={{
          marginLeft: isSidebarOpen ? "16rem" : "4rem", 
        }}
      >
        {/* Navbar */}
        <NavbarAdmin />

        {/* Page Content */}
        <div className="pt-16 bg-white">{children}</div>
      </div>
    </div>
  );
}