import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from 'react-native';
import api from "./Conexion";

export const registerUser = async (name, email, password, rol) => {
    try {
        const response = await api.post("api/addUser", { name, email, password, rol });
        console.log("Respuesta del registro", response.data);
        return { success: true, message: response.data.message, user: response.data.user };
    } catch (e) {
        console.log(
            "Error al registrar usuario",
            e.response ? e.response.data : e.message,
        );
        return {
            success: false,
            message: e.response ? e.response.data : "Error de conexión",
        };
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await api.post("api/login", { email, password });
        console.log("Respuesta del servidor", response.data);
        console.log("Keys in response.data:", Object.keys(response.data));
        const token = response.data.Token;

        console.log("Token recibido", token);

        if (token) {
            await AsyncStorage.setItem("userToken", token);
            DeviceEventEmitter.emit('tokenUpdated');
            return { success: true, token };
        }
        return { success: false, message: "Respuesta sin token" };

    } catch (e) {
        console.log(
            "Error al iniciar sesion",
            e.response ? e.response.data : e.message,
        );

        return {
            success: false,
            message: e.response ? e.response.data : "Error de conexion",
        };
    }
};
