import { useState } from "react";
import { Home, Users, Settings, Bell, Building, Menu, X} from "lucide-react";
import { FaUser, FaCalendarCheck } from "react-icons/fa";
import Link from "next/link";

interface SidebarRecruteurProps {
  isSidebarOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export default function Sidebar({ isSidebarOpen, onToggle }: SidebarRecruteurProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); 

  const toggleSidebar = () => {
    onToggle(!isSidebarOpen);
  };

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <aside
      className={`fixed z-[1100] top-0 left-0 h-full bg-white border-r shadow-md transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}>
      {/* Header avec hamburger */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          {isSidebarOpen && <h1 className="text-2xl font-bold" style={{ color: "#007bff" }}>SmartHire</h1>}
        </div>

        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-blue-600 transition-colors">
          {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-2 space-y-1 text-sm font-medium">
        <Link
          href="/Recruteur/Dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors">
          <Home size={18} /> {isSidebarOpen && <span>Dashboard</span>}
        </Link>
        {/* Job Offers */}
        <div className="navbar__dropdown">
          <button
            onClick={() => toggleDropdown("jobOffers")}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors">
            <span className="flex items-center gap-3">
              <Building size={18} />
              {isSidebarOpen && <span>Job Offers</span>}
            </span>
            {isSidebarOpen && <span>{openDropdown === "jobOffers" ? "-" : "+"}</span>}
          </button>
          {isSidebarOpen && openDropdown === "jobOffers" && (
            <ul className="ml-6 space-y-1">
              <li>
                <Link
                  href="/Recruteur/Jobs/ChooseType"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors">
                  Create Offer
                </Link>
              </li>
              <li>
                <Link
                  href="/Recruteur/Jobs/ManageOffers"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors">
                  Manage Offers
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Applications */}
        <div className="navbar__dropdown">
          <button
            onClick={() => toggleDropdown("applications")}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
          >
            <span className="flex items-center gap-3">
              <Users size={18} />
              {isSidebarOpen && <span>Applications</span>}
            </span>
            {isSidebarOpen && <span>{openDropdown === "applications" ? "-" : "+"}</span>}
          </button>
          {isSidebarOpen && openDropdown === "applications" && (
            <ul className="ml-6 space-y-1">
              <li>
                <Link
                  href="/Recruteur/Applications/PreselectedApplication"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  Pre-selected Candidates
                </Link>
              </li>
              <li>
                <Link
                  href="/Recruteur/Applications/All"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  View Applications
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Planned Interviews */}
        <Link
          href="/Recruteur/EntretienPlanifie"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <FaCalendarCheck size={18} /> {isSidebarOpen && <span>Planned Interviews</span>}
        </Link>

     {/* Mon Profil */}
        <Link
          href="/Recruteur/Profile"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors">
          <FaUser size={18} /> {isSidebarOpen && <span>Profil</span>}
        </Link>
        {/* Notifications */}
        <Link
          href="/Recruteur/Notifications"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Bell size={18} /> {isSidebarOpen && <span>Notifications</span>}
        </Link>

        {/* Account Settings */}
        <Link
          href="/Recruteur/Account-settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Settings size={18} /> {isSidebarOpen && <span>Account Settings</span>}
        </Link>
      </nav>
    </aside>
  );
}