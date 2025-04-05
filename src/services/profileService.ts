import axios from "axios";

const API_URL = "http://localhost:4000/api/users";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Récupérer le profil
export const getProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`, { headers: getAuthHeaders() });
  return response.data;
};


export const updateProfileAndCv = async (formData: FormData) => {
  // Séparer la partie profil
  const profilePart = {
    phone_number: formData.get("phone_number"),
    address: formData.get("address"),
    experience: formData.get("experience"),
    education_level: formData.get("education_level"),
    skills: formData.get("skills"),
  };

  // Mettre à jour les infos du profil
  await axios.put(`${API_URL}/profile`, profilePart, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  // Si un fichier CV est inclus, on l’upload
  const cv = formData.get("cv") as File;
  if (cv) {
    const cvFormData = new FormData();
    cvFormData.append("cv", cv);

    const uploadRes = await axios.post(`${API_URL}/upload-cv`, cvFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getAuthHeaders(),
      },
    });
    return uploadRes.data; 
  }

  return {};
};
