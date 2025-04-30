interface ProfileUpdateResults {
  cv_url?: string;
  avatar_url?: string;
}

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
  const profilePart = {
    phone_number: formData.get("phone_number"),
    address: formData.get("address"),
    experience: formData.get("experience"),
    education_level: formData.get("education_level"),
    skills: formData.get("skills"),
  };

  await axios.put(`${API_URL}/profile`, profilePart, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const results: ProfileUpdateResults = {};

  // Upload CV si présent
  const cv = formData.get("cv") as File;
  if (cv) {
    const cvFormData = new FormData();
    cvFormData.append("cv", cv);
    const res = await axios.post(`${API_URL}/upload-cv`, cvFormData, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    results.cv_url = res.data.cv_url;
  }
  const avatar = formData.get("avatar") as File;
  if (avatar) {
    const avatarFormData = new FormData();
    avatarFormData.append("avatar", avatar);

    const res = await axios.post(`${API_URL}/upload-avatar`, avatarFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getAuthHeaders(),
      },
    });
    results.avatar_url = res.data.avatar_url;
  }

  return results;
};

export const deleteAvatar = async () => {
  return axios.delete(`${API_URL}/delete-avatar`, { headers: getAuthHeaders() });
};

export const deleteCv = async () => {
  return axios.delete(`${API_URL}/delete-cv`, { headers: getAuthHeaders() });
};