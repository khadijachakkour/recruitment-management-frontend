"use client";

import Footer from "./components/Footer";
import "./styles/globals.css";
import { AuthProvider } from "../src/context/authContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          {/* Formes en arrière-plan */}
          <div className="bg-shape bg-shape-1"></div>
          <div className="bg-shape bg-shape-2"></div>
          <div className="bg-shape bg-shape-3"></div>

          {/* Contenu principal qui s'étend pour remplir l'espace disponible */}
          <main className="flex-grow pt-16">{children}</main>
          </AuthProvider>
          {/* Footer fixé en bas de la page */}
          <Footer />
        
      </body>
    </html>
  );
}
