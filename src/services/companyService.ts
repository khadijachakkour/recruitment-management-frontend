import { useState, useEffect } from "react";
import axios from "axios";

// ✅ À adapter selon ton backend
const API_URL = "http://localhost:5000/api/companies";

interface ProfileUpdateResults {
  logo_url?: string;
}

// 🔐 Headers avec token pour chaque requête
const getAuthHeaders = () => {
  const token = sessionStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Hook pour vérifier si le profil de l’entreprise existe déjà
export const useCompanyProfile = () => {
  const [hasCompanyProfile, setHasCompanyProfile] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: getAuthHeaders(),
        });
        setHasCompanyProfile(response.data?.hasCompanyProfile ?? false);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil d'entreprise:", error);
        setHasCompanyProfile(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  return hasCompanyProfile;
};

// ✅ Méthode pour mettre à jour/créer le profil
export const createProfile = async (formData: FormData): Promise<ProfileUpdateResults> => {
  const results: ProfileUpdateResults = {};

  try {
    let logo_url = "";

    // 1. Upload logo si présent AVANT création du profil
    const logo = formData.get("logo") as File | null;
    if (logo && logo instanceof File) {
      const logoFormData = new FormData();
      logoFormData.append("logo", logo);

      const res = await axios.post(`${API_URL}/upload-logo`, logoFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...getAuthHeaders(),
        },
      });

      logo_url = res.data?.logo_url;
      results.logo_url = logo_url;
    }

    const jsonData: any = {};

    formData.forEach((value, key) => {
      if (key !== "logo") {
        jsonData[key] = value;
      }
    });

    if (logo_url) {
      jsonData.logo_url = logo_url;
    }

    await axios.post(`${API_URL}/createCompany`, jsonData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

  } catch (error) {
    console.error("Erreur lors de creation du profil :", error);
    throw error;
  }

  return results;
};

