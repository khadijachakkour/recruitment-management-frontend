"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import "../styles/navbar.css";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/context/authContext";

export default function Navbar() {
  const { isLoggedIn, userRoles, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // ✅ Fixe le problème d'hydratation en s'assurant que le composant est bien monté
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Vérifie si le rendu est bien côté client
  if (!isClient) return null;

  return (
    <nav className="navbar">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="navbar__logo">JobBox</Link>

        <ul className="hidden md:flex space-x-6 navbar__nav">
          <li><Link href="/" className="navbar__nav-item">Find a Job</Link></li>
          <li><Link href="/" className="navbar__nav-item">Employers</Link></li>
          <li><Link href="/" className="navbar__nav-item">Candidates</Link></li>
          <li><Link href="/" className="navbar__nav-item">Blog</Link></li>
          {isLoggedIn && userRoles.includes("Candidat") && (
            <li><Link href="#" className="navbar__nav-item">Teste Candidat role</Link></li>
          )}
        </ul>

        <div className="hidden md:flex space-x-4 navbar__button-container">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="navbar__connexion">Sign In</Link>
              <Link href="/employers/post-job" className="navbar__entreprises">Employers / Post a Job</Link>
            </>
          ) : (
            <>
              <Link href="/profile" className="navbar__icon-link">
                <FaUserCircle className="navbar__profile-icon" size={35} />
              </Link>
              <button onClick={logout} className="navbar__connexion">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
