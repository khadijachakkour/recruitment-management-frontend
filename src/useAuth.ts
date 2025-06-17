import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

        sessionStorage.setItem("access_token", newAccessToken); 

        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api.request(error.config);
      } catch (refreshError) {
        console.error("Échec du rafraîchissement du token:", refreshError);
        sessionStorage.removeItem("access_token"); 
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


