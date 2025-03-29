"use client";
import Footer from "./components/Footer";
import NavbarAdmin from "./Navbar/Admin/page";  // Import du Navbar Admin
import NavbarCandidat from "./Navbar/Candidat/page";  // Import du Navbar Candidat
import "./styles/globals.css";
import { AuthProvider, useAuth } from "../context/authContext"; // 🔥 Import du Provider
import Navbar from "./Navbar/Navbar";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="relative">
        <AuthProvider>
          {/* Formes en arrière-plan */}
          <div className="bg-shape bg-shape-1"></div>
          <div className="bg-shape bg-shape-2"></div>
          <div className="bg-shape bg-shape-3"></div>          
          <main className="pt-16">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

