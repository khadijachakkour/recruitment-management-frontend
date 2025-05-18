"use client";

import Link from "next/link";
import "../styles/navbarCandidat.css";
import { useAuth } from "@/src/context/authContext";
import { FaUserCircle } from "react-icons/fa";

export default function NavbarCandidat() {
  const { isLoggedIn, userRoles, logoutCandidat } = useAuth();

  return (
    <nav className="navbar">
      <div className="container mx-auto flex justify-between items-center p-1.5">
        <Link href="/" className="navbar__logo text-lg">JobBox</Link>

        {!isLoggedIn && (
          <ul className="hidden md:flex space-x-4 navbar__nav">
            <li><Link href="#" className="navbar__nav-item text-sm">Find Jobs</Link></li>
            <li><Link href="#" className="navbar__nav-item text-sm">Companies</Link></li>
            <li><Link href="#" className="navbar__nav-item text-sm">Candidates</Link></li>
            <li><Link href="#" className="navbar__nav-item text-sm">Blog</Link></li>
          </ul>
        )}

        <div className="navbar__button-container">
          {/* Display user profile and logout button if the user is logged in */}
          {isLoggedIn && userRoles.includes("Candidat") ? (
            <>
              <Link href="/Candidat/Profile" className="navbar__icon-link">
                <FaUserCircle className="navbar__profile-icon" size={30} />
              </Link>
              <button onClick={logoutCandidat} className="navbar__connexion text-sm">Logout</button>
            </>
          ) : (
            /* Display sign-in and post job buttons if the user is not logged in */
            <div className="hidden md:flex space-x-4">
              <Link href="/login/Candidat" className="navbar__connexion text-sm">Sign In</Link>
              <Link href="/login" className="navbar__entreprises text-sm">Employers / Post Job</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
