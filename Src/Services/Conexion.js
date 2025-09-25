import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const URL_BASE = "http://10.219.26.16:8000";

const api = axios.create({
  baseURL: URL_BASE,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const rutasPublicas = ["api/login"]; // Rutas sin autentificación

// Interceptor de request
api.interceptors.request.use(
  async (config) => {

    const url = config.url || "";
    const esRutaPublica = rutasPublicas.some((ruta) => url.includes(ruta));

    let token = null;
    if (!esRutaPublica) {
      token = await AsyncStorage.getItem("userToken");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const esRutaPublica = rutasPublicas.some((ruta) =>
      originalRequest.url.includes(ruta)
    );

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !esRutaPublica
    ) {
      originalRequest._retry = true;

      await AsyncStorage.removeItem("userToken");
      console.log("Token expirado o no autorizado, redirigiendo al login");
    }

    return Promise.reject(error);
  }
);

export default api;
