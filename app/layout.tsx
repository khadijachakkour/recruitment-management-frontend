import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "./styles/globals.css";

export const metadata = {
  title: "Job Portal",
  description: "Plateforme de gestion de recrutement intelligent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="relative">
        {/* Formes en arrière-plan */}
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>

        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
