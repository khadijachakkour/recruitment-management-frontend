"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import NavbarAdmin from "./app/components/NavbarAdmin";
import Sidebar from "./app/components/SidebarAdmin";

interface AdminLayoutProps {
  children: React.ReactNode;
  noSidebarMargin?: boolean;
}

export default function AdminLayout({ children, noSidebarMargin = false }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // sidebar fermée par défaut

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
      {/* Main Content */}
      <div
        className="flex-1 min-h-screen w-full bg-white"
        style={{
          marginLeft: noSidebarMargin ? 0 : isSidebarOpen ? "16rem" : "4rem",
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