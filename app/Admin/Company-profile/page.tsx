"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import NavbarAdmin from "@/app/components/NavbarAdmin";
import { Company } from "@/app/types/company";
import Image from "next/image";


export default function CompanyProfile() {
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">{error}</div>
    );
  }

  return (
    <>
      <NavbarAdmin />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 px-6 py-10">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl">
          <div className="flex items-center space-x-6 mb-6">
          <Image 
  src={company!.companyLogo || "/default-logo.png"} 
  alt="Company Logo" 
  width={96}
  height={96}
  className="w-24 h-24 rounded-full object-cover" 
/>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{company!.companyName}</h2>
              <p className="text-lg text-gray-600">{company!.industry}</p>
            </div>
          </div>

          {/* Description de l'entreprise */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Company Description</h3>
            <p className="text-gray-700">{company!.companyDescription}</p>
          </div>

          {/* Informations sur l'entreprise */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-800">Address</h4>
              <p className="text-gray-700">{company!.companyAddress}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Country/Region</h4>
              <p className="text-gray-700">{company!.country} / {company!.region}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-800">Year Founded</h4>
              <p className="text-gray-700">{company!.yearFounded}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Company Size</h4>
              <p className="text-gray-700">{company!.companySize}</p>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800">Contact Information</h4>
            <p className="text-gray-700">Email: {company!.contactEmail}</p>
            <p className="text-gray-700">Phone: {company!.phoneNumber}</p>
            <p className="text-gray-700">Website: <a href={company!.website} target="_blank" className="text-blue-500 hover:underline">{company!.website}</a></p>
          </div>

          {/* Liens sociaux */}
          {company!.socialLinks && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800">Social Links</h4>
              <p className="text-gray-700">{company!.socialLinks}</p>
            </div>
          )}

          {/* Bouton de modification */}
          <div className="flex justify-end">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
