// AdminLayout.tsx
"use client";
import NavbarAdmin from "./app/components/NavbarAdmin";
import Sidebar from "./app/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen ml-64">
        <NavbarAdmin />
        {children}
      </div>
    </div>
  );
}
