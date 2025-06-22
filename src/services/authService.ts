import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/users/login`, { email, password }, { withCredentials: true });
    const { access_token } = response.data;
    console.log("Token d'accès reçu:", access_token);
    sessionStorage.setItem("access_token", access_token); 
    return access_token;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/users/refresh-token`,
      {},
      { withCredentials: true } 
    );
    const { access_token } = response.data;

    sessionStorage.setItem("access_token", access_token);
    return access_token;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error);
    throw error;
  }
};
