import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const URL_BASE = "http://192.168.1.103:8000/";

const api = axios.create({
  baseURL: URL_BASE,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const rutasPublicas = ["api/login", "api/reset-password"]; 

// Interceptor de request
api.interceptors.request.use(
  async (config) => {
    console.log("🌐 Request interceptor - URL:", config.url);
    console.log("🌐 Request interceptor - Data:", config.data);

    const url = config.url || "";
    const esRutaPublica = rutasPublicas.some((ruta) => url.includes(ruta));
    console.log("🌐 Es ruta pública:", esRutaPublica);

    let token = null;
    if (!esRutaPublica) {
      token = await AsyncStorage.getItem("userToken");
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        config.headers['X-User-Guard'] = parsedUserInfo.guard || 'apiPaciente';
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("🌐 Headers finales:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response exitosa:", response.status, response.data);
    return response;
  },
  async (error) => {
    console.log("❌ Response error:", error);
    console.log("❌ Error response:", error.response);
    console.log("❌ Error status:", error.response?.status);
    console.log("❌ Error data:", error.response?.data);

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
    }

    return Promise.reject(error);
  }
);

export default api;
