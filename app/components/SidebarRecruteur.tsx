import { useState } from "react";
import { Home, Users, Settings, Bell, Building, Menu, X, Briefcase } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/src/context/authContext"; // Import the auth context

export default function Sidebar({ onToggle }: { onToggle: (isOpen: boolean) => void }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // Track which dropdown is open
  const { logoutAdmin } = useAuth(); // Use the logoutAdmin function from the auth context

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    onToggle(newState); // Notify parent about the state change
  };

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu); // Toggle the dropdown
  };

  return (
    <aside
      className={`fixed z-[1100] top-0 left-0 h-full bg-white border-r shadow-md transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Header avec hamburger */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          {isSidebarOpen && <Home size={24} className="text-blue-600" />}
          {isSidebarOpen && <h1 className="text-xl font-bold text-blue-700">Recruteur</h1>}
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
          href="/Recruteur/Dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Home size={18} /> {isSidebarOpen && <span>Dashboard</span>}
        </Link>

        {/* Job Offers */}
        <div className="navbar__dropdown">
          <button
            onClick={() => toggleDropdown("jobOffers")}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
          >
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
                  href="/Recruteur/Jobs/Create"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  Create Offer
                </Link>
              </li>
              <li>
                <Link
                  href="/Recruteur/Offers/Manage"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  Manage Offers
                </Link>
              </li>
              <li>
                <Link
                  href="/Recruteur/Offers/Publish"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  Multi-platform Publishing
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
                  href="/Recruteur/Applications/Preselected"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  Pre-selected Candidates
                </Link>
              </li>
              <li>
                <Link
                  href="/Recruteur/Applications/Shortlist"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  Shortlist Candidates
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Departments */}
        <Link
          href="/Recruteur/Departments/List"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Building size={18} /> {isSidebarOpen && <span>Departments</span>}
        </Link>

        {/* Recruitment Management */}
        <Link
          href="/Recruteur/Recruitment-management"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Briefcase size={18} /> {isSidebarOpen && <span>Recruitment Management</span>}
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

        {/* Logout */}
        <button
          onClick={logoutAdmin} // Use the logoutAdmin function
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-700 transition-colors"
        >
          <X size={18} /> {isSidebarOpen && <span>Logout</span>}
        </button>
      </nav>
    </aside>
  );
}