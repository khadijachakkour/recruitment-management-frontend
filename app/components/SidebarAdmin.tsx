import { Home, Users, Settings, Building, Menu, X, UserCircle, Briefcase, LogOut } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export default function Sidebar({ isSidebarOpen, onToggle }: SidebarProps) {
  const toggleSidebar = () => {
    onToggle(!isSidebarOpen);
  };

  return (
    <aside
      className={`fixed z-[1100] top-0 left-0 h-full bg-white border-r shadow-md transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-48" : "w-16"
      }`}
    >
      {/* Header avec hamburger */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex-1 flex items-center justify-center gap-2 select-none">
          {isSidebarOpen && (
            <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 drop-shadow-lg animate-fade-in">
              Smart<span className="font-black">Hire</span>
            </h1>
          )}
        </div>
        {/* Hamburger/X button always visible */}
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-blue-600 transition-colors"
          aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-2 space-y-1 text-sm font-medium">
        <Link
          href="/Admin/Dashboard"
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
          href="/Admin/Profile"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <UserCircle size={18} /> {isSidebarOpen && <span>My Profile</span>}
        </Link>
        <Link
          href="/Admin/CompanyOffers"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Briefcase size={18} /> {isSidebarOpen && <span>Company Offers</span>}
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Settings size={18} /> {isSidebarOpen && <span>Settings</span>}
        </Link>
      </nav>
      {/* Logout button */}
      <div className="absolute bottom-0 left-0 w-full p-4 border-t bg-white">
        <button
          onClick={() => {
            sessionStorage.removeItem("access_token");
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-xl bg-transparent shadow-none hover:bg-blue-50/40 active:scale-95 transition-all duration-200 font-semibold text-xl focus:outline-none group"
        >
          <span className="inline-flex items-center justify-center">
            <LogOut size={22} className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600 group-hover:scale-110 transition-transform duration-200" />
          </span>
          {isSidebarOpen && (
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600 group-hover:underline group-hover:tracking-wider transition-all duration-200 text-xl font-bold">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}