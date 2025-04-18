"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import NavbarAdmin from "@/app/components/NavbarAdmin";
import { Company } from "@/app/types/company";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/src/context/authContext";
import { useRouter } from "next/navigation";
import AdminLayout from "@/AdminLayout";

export default function CompanyProfile() {
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoggedIn, userRoles } = useAuth();
  const router = useRouter();

      useEffect(() => {
        if (!isLoggedIn) {
          router.push("/login");
          return;
        }
    const fetchCompanyProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/companies/profile", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setCompany(response.data);
        setLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Erreur lors de la récupération du profil de l'entreprise");
        } else {
          setError("Une erreur inattendue s’est produite.");
        }
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  const handleEditProfile = () => {
    router.push("/Admin/Edite-CompanyProfile");  // Redirige vers la page de modification
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }
  return (
    <>
     <AdminLayout>
     
             {/* Main Content */}
             <main className="p-6 pt-24">
        <motion.div
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
            <Image
              src={company!.companyLogo || "/images/default-companylogo.png"}
              alt="Company Logo"
              width={120}
              height={120}
              className="w-28 h-28 rounded-xl object-cover shadow-md"
              unoptimized={true}
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{company!.companyName}</h2>
              <p className="text-lg text-gray-600">{company!.industry}</p>
              {company!.departments!.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Departments: {company!.departments!.map((d) => d.name).join(", ")}
                </p>
              )}
            </div>
          </div>

          {/* Sections */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <InfoCard title="Headquarters" value={company!.companyAddress} />
            <InfoCard title="Region" value={`${company!.region}, ${company!.country}`} />
            <InfoCard title="Founded" value={company!.yearFounded} />
            <InfoCard title="Company Size" value={company!.companySize} />
            <InfoCard title="Employees" value={company!.numberOfEmployees} />
            <InfoCard title="Contract Types" value={company!.contractTypes} />
            <InfoCard title="Required Documents" value={company!.requiredDocuments} />
            {company!.revenue && <InfoCard title="Revenue" value={`${company!.revenue.toLocaleString()}`} />}
          </div>

          {/* Description */}
          <Section title="About the Company">
            <p className="text-gray-700">{company!.companyDescription}</p>
          </Section>

          {/* CEO */}
          {(company!.ceo || company!.ceoImage) && (
            <Section title="CEO">
              <div className="flex items-center gap-4">
                {company!.ceoImage && (
                  <Image
                    src={company!.ceoImage}
                    alt="CEO"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover shadow-md"
                    unoptimized={true}
                  />
                )}
                <p className="text-lg text-gray-800 font-medium">{company!.ceo}</p>
              </div>
            </Section>
          )}

          {/* Contact */}
          <Section title="Contact">
            <p className="text-gray-700">📧 {company!.contactEmail}</p>
            <p className="text-gray-700">📞 {company!.phoneNumber}</p>
            {company!.website && (
              <p className="text-gray-700">
                🌐{" "}
                <a href={company!.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {company!.website}
                </a>
              </p>
            )}
          </Section>

          {/* Social Links */}
          {company!.socialLinks && (
            <Section title="Social Media">
              {company!.socialLinks.split(",").map((link, index) => (
                <p key={index}>
                  <a href={link.trim()} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {link.trim()}
                  </a>
                </p>
              ))}
            </Section>
          )}

          {/* Departments */}
          {company!.departments && company!.departments.length > 0 && (
            <Section title="Departments">
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {company!.departments.map((dept) => (
                  <li key={dept.id}>{dept.name}</li>
                ))}
              </ul>
            </Section>
          )}

        
          {/* Bouton modification */}
          <div className="flex justify-end">
            <button
              onClick={handleEditProfile}  // Ajout du gestionnaire de clic
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out"
            >
              Edit Profile
            </button>
          </div>

        </motion.div>
        </main>
    </AdminLayout>
    </>
  );
}

// Composants réutilisables
const InfoCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-gray-50 rounded-xl p-4 shadow-sm border">
    <h4 className="text-sm font-semibold text-gray-600">{title}</h4>
    <p className="text-gray-800 mt-1">{value}</p>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
    {children}
  </div>
);
