import { useState } from "react";
import { Home, Users, Settings, Bell, Building, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <aside
      className={`fixed z-[1100] top-0 left-0 h-full bg-white border-r shadow-md transition-all duration-300 ease-in-out
      ${isSidebarOpen ? "w-64" : "w-16"}`}
    >
      {/* Header avec hamburger */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          {isSidebarOpen && <Home size={24} className="text-blue-600" />}
          {isSidebarOpen && <h1 className="text-xl font-bold text-blue-700">Admin</h1>}
        </div>

        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-2 space-y-1 text-sm font-medium">
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Home size={18} /> {isSidebarOpen && <span>Dashboard</span>}
        </Link>
        <Link
          href="/Admin/Company-profile"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Building size={18} /> {isSidebarOpen && <span>Company Profile</span>}
        </Link>
        <Link
          href="/Admin/Manage-users"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Users size={18} /> {isSidebarOpen && <span>Manage Users</span>}
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Settings size={18} /> {isSidebarOpen && <span>Settings</span>}
        </Link>
      </nav>
    </aside>
  );
}
