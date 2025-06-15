"use client";

import Footer from "./components/Footer";
import "./styles/globals.css";
import { AuthProvider } from "../src/context/authContext";
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from "react-hot-toast";
import Head from "next/head";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <Head>
        <title>SmartHire</title>
      </Head>
      <body className="min-h-screen flex flex-col bg-white">
          <AuthProvider>
          {/* Formes en arrière-plan */}
          <div className="bg-shape bg-shape-1"></div>
          <div className="bg-shape bg-shape-2"></div>
          <div className="bg-shape bg-shape-3"></div>

          {/* Contenu principal */}
      <main className="flex-grow pt-16 bg-white">{children}</main>
          <Toaster position="top-right" />
          {/* Footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}