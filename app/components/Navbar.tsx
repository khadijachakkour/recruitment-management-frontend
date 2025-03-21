"use client";
import { useState } from "react";
import Link from "next/link";
import "../styles/navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Link
            href="/login"
            className="navbar__connexion"
          >
            Sign In
          </Link>
          <Link
            href="/employers/post-job"
            className="navbar__entreprises"
          >
            Employers / Post a Job
          </Link>
        </div>

       
      </div>
    </nav>
  );
}
