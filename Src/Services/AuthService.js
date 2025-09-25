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
        
        const { access_token, guard, user } = response.data;
        
        if (access_token && user) {
            // Guardar token
            await AsyncStorage.setItem("userToken", access_token);
            
            // Determinar el rol basado en el guard o la relación rol del usuario
            let userRole = 'paciente'; // default
            
            // Primero intentar obtener el rol de la relación user.rol
            if (user.rol && user.rol.rol) {
                userRole = user.rol.rol;
            } else {
                // Si no existe, usar el guard como fallback
                if (guard === 'apiAdmin') {
                    userRole = 'admin';
                } else if (guard === 'apiDoctor') {
                    userRole = 'doctor';
                } else if (guard === 'apiPaciente') {
                    userRole = 'paciente';
                }
            }
            
            // Guardar información del usuario y rol
            await AsyncStorage.setItem("userInfo", JSON.stringify({
                ...user,
                role: userRole,
                guard: guard
            }));
            
            console.log("Login exitoso - Rol:", userRole, "Guard:", guard);
            
            DeviceEventEmitter.emit('tokenUpdated');
            return {
                success: true,
                token: access_token,
                user: user,
                role: userRole,
                guard: guard
            };
        }
        return { success: false, message: "Respuesta sin token o usuario" };

    } catch (e) {
        console.log(
            "Error al iniciar sesion",
            e.response ? e.response.data : e.message,
        );

        return {
            success: false,
            message: e.response?.data?.message || "Error de conexión",
        };
    }
};

export const getUserInfo = async () => {
    try {
        const userInfo = await AsyncStorage.getItem("userInfo");
        return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
        console.log("Error al obtener información del usuario:", error);
        return null;
    }
};

export const logout = async () => {
    try {
        // Call backend logout endpoint to invalidate token
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
            try {
                await api.post("api/logout", {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (backendError) {
                console.log("Error al cerrar sesión en el backend:", backendError);
                // Continue with local logout even if backend fails
            }
        }
        
        // Remove local storage
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userInfo");
        DeviceEventEmitter.emit('tokenUpdated');
        return { success: true };
    } catch (error) {
        console.log("Error al cerrar sesión:", error);
        return { success: false, message: "Error al cerrar sesión" };
    }
};

export const getUserProfile = async () => {
    try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
            return { success: false, message: "No hay token de autenticación" };
        }

        const response = await api.get("api/mi-perfil", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return {
            success: true,
            user: response.data.user
        };
    } catch (error) {
        console.log("Error al obtener perfil:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Error al obtener perfil"
        };
    }
};

export const updateUserProfile = async (profileData) => {
    try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
            return { success: false, message: "No hay token de autenticación" };
        }

        const response = await api.put("api/actualizar-perfil", profileData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Update local storage with new user data
        if (response.data.user) {
            const currentUserInfo = await getUserInfo();
            const updatedUserInfo = {
                ...currentUserInfo,
                ...response.data.user
            };
            await AsyncStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        }

        return {
            success: true,
            message: response.data.message,
            user: response.data.user
        };
    } catch (error) {
        console.log("Error al actualizar perfil:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Error al actualizar perfil",
            errors: error.response?.data?.errors
        };
    }
};
