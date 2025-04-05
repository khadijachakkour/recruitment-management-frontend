import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/companies/admin/company"; // Endpoint pour vérifier le profil d'entreprise

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const useCompanyProfile = () => {
  const [hasCompanyProfile, setHasCompanyProfile] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await axios.get(API_URL, { headers: getAuthHeaders() });
        setHasCompanyProfile(response.data.hasCompanyProfile);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil d'entreprise:", error);
        setHasCompanyProfile(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  return hasCompanyProfile; // 🔥 Retourne directement la valeur booléenne
};
