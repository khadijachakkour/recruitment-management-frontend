import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ✅ Envoie les cookies automatiquement
});

// ✅ Intercepteur de requêtes pour ajouter l'access token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Intercepteur de réponse pour gérer l'expiration du token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/refresh-token`,
          {},
          { withCredentials: true }
        );
                const newAccessToken = refreshResponse.data.access_token;

        sessionStorage.setItem("access_token", newAccessToken); // ✅ Correction ici

        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api.request(error.config);
      } catch (refreshError) {
        console.error("Échec du rafraîchissement du token:", refreshError);
        sessionStorage.removeItem("access_token"); // ✅ Supprime le token
        window.location.replace("/login"); // ✅ Redirige vers la page de connexion
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


