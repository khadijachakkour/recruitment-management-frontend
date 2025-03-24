"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Vérifie si l'utilisateur est connecté
  const checkLoginStatus = () => {
    const token = sessionStorage.getItem("access_token");
    setIsLoggedIn(!!token); // Si un token est présent, on met l'état à true
  };

  useEffect(() => {
    // Vérifie l'état de la connexion à chaque changement du sessionStorage
    checkLoginStatus();

    // Vérifie régulièrement (toutes les 500ms) si le token est présent dans sessionStorage
    const intervalId = setInterval(() => {
      checkLoginStatus();
    }, 500);

    // Nettoie l'intervalle quand le composant est démonté
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include", // ✅ Important pour envoyer le cookie
      });
  
      if (response.ok) {
        sessionStorage.removeItem("access_token"); // ✅ Supprime le token du sessionStorage
        window.location.href = "/login"; // ✅ Redirection
      } else {
        console.error("Erreur de déconnexion");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };
  
  

  return (
    <nav className="navbar">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="navbar__logo">
          JobBox
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6 navbar__nav">
          <li><Link href="/" className="navbar__nav-item">Find a Job</Link></li>
          <li><Link href="/" className="navbar__nav-item">Employers</Link></li>
          <li><Link href="/" className="navbar__nav-item">Candidates</Link></li>
          <li><Link href="/" className="navbar__nav-item">Blog</Link></li>
        </ul>

        {/* Buttons Container (Sign In and Post a Job for Employers) */}
        <div className="hidden md:flex space-x-4 navbar__button-container">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="navbar__connexion">
                Sign In
              </Link>
              <Link href="/employers/post-job" className="navbar__entreprises">
                Employers / Post a Job
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="navbar__connexion">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
