import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/login`;

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(API_URL, { email, password }, { withCredentials: true });
    const { access_token } = response.data;

    sessionStorage.setItem("access_token", access_token); // ✅ Stockage en mémoire

    return access_token;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await axios.post(
      "http://localhost:4000/api/users/refresh-token",
      {},
      { withCredentials: true } // ✅ Important pour envoyer automatiquement le cookie
    );
    const { access_token } = response.data;

    sessionStorage.setItem("access_token", access_token);
    return access_token;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error);
    throw error;
  }
};
