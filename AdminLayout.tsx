// AdminLayout.tsx
"use client";

import NavbarAdmin from "./app/components/NavbarAdmin";
import Sidebar from "./app/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen bg-gray-100">
        <NavbarAdmin />
        <main className="p-6">{children}</main>
      </div>
    </>
  );
}
