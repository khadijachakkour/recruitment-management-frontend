"use client";
import { useAuth } from "@/src/context/authContext";

export default function Footer() {
  const { isLoggedIn, userRoles } = useAuth();
  const isAdmin = isLoggedIn && userRoles.includes("Admin");

  if (isAdmin) {
    return (
      <footer className="bg-gray-900 text-white py-2 text-center mt-auto">
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} SmartHire Admin Panel</p>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
        <div>
          <h2 className="text-xl font-bold">SmartHire</h2>
          <p className="mt-2 text-gray-400 text-sm">
            Find your dream job or recruit top talent quickly and efficiently with SmartHire.
          </p>
        </div>

        <div>
          <h3 className="text-md font-semibold">For Job Seekers</h3>
          <ul className="mt-2 space-y-1">
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300 ease-in-out text-sm">Find a Job</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300 ease-in-out text-sm">Create Profile</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300 ease-in-out text-sm">Job Alerts</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300 ease-in-out text-sm">Career Advice</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-md font-semibold">For Recruiters & HR</h3>
          <ul className="mt-2 space-y-1">
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300 ease-in-out text-sm">Post a Job</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300 ease-in-out text-sm">Manage Candidates</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300 ease-in-out text-sm">Employer Dashboard</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300 ease-in-out text-sm">Recruitment Resources</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-md font-semibold">Support & Contact</h3>
          <ul className="mt-2 space-y-1">
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300 ease-in-out text-sm">Help Center</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300 ease-in-out text-sm">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300 ease-in-out text-sm">Terms of Service</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300 ease-in-out text-sm">Contact Us</a></li>
          </ul>

          <div className="flex mt-4 space-x-4">
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white text-xl transition duration-300 ease-in-out">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white text-xl transition duration-300 ease-in-out">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white text-xl transition duration-300 ease-in-out">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-3 text-center text-white text-xs mt-6">
        © {new Date().getFullYear()} SmartHire. All rights reserved.
      </div>
    </footer>
  );
}
