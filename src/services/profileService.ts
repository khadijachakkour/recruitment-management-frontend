import axios from "axios";

const API_URL = "http://localhost:4000/api/users/profile";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Récupérer le profil
export const getProfile = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};


export const updateProfileAndCv = async (formData: FormData) => {
  const response = await axios.put(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Nécessaire pour envoyer des fichiers
      ...getAuthHeaders(), // Ajouter l'en-tête d'autorisation
    },
  });
  return response.data;
};

