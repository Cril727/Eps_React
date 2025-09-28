import api from './Conexion';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función auxiliar para obtener el rol del usuario
const getUserRole = async () => {
  try {
    const userInfo = await AsyncStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      return parsed.role;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const DoctoresService = {
  // Obtener todos los doctores
  getDoctores: async () => {
    try {
      const response = await api.get('api/doctores');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear un nuevo doctor
  createDoctor: async (doctorData) => {
    try {
      const response = await api.post('api/addDoctor', doctorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un doctor
  updateDoctor: async (id, doctorData) => {
    try {
      const response = await api.put(`api/updateDoctor/${id}`, doctorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un doctor
  deleteDoctor: async (id) => {
    try {
      const response = await api.delete(`api/deleteDoctor/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener doctor por ID
  getDoctorById: async (id) => {
    try {
      const response = await api.get(`api/DoctorById/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Métodos específicos para doctores y admins autenticados
  getMisCitas: async () => {
    try {
      const userRole = await getUserRole();
      const endpoint = userRole === 'doctor' ? 'api/doctor/mis-citas' : 'api/mis-citas';
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMisCitasPendientes: async () => {
    try {
      const userRole = await getUserRole();
      const endpoint = userRole === 'doctor' ? 'api/doctor/mis-citas-pendientes' : 'api/mis-citas-pendientes';
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  aprobarCita: async (id) => {
    try {
      const userRole = await getUserRole();
      const endpoint = userRole === 'doctor' ? `api/doctor/aprobar-cita/${id}` : `api/aprobar-cita/${id}`;
      const response = await api.put(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  rechazarCita: async (id) => {
    try {
      const userRole = await getUserRole();
      const endpoint = userRole === 'doctor' ? `api/doctor/rechazar-cita/${id}` : `api/rechazar-cita/${id}`;
      const response = await api.put(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  completarCita: async (id) => {
    try {
      const userRole = await getUserRole();
      const endpoint = userRole === 'doctor' ? `api/doctor/completar-cita/${id}` : `api/completar-cita/${id}`;
      const response = await api.put(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMisHorarios: async () => {
    try {
      const response = await api.get('api/doctor/mis-horarios');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMiConsultorio: async () => {
    try {
      const response = await api.get('api/doctor/mi-consultorio');
      return { consultorio: response.data.mi_consultorio };
    } catch (error) {
      throw error;
    }
  },

  createHorario: async (horarioData) => {
    try {
      const response = await api.post('api/doctor/addHorario', horarioData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateHorario: async (id, horarioData) => {
    try {
      const response = await api.put(`api/doctor/updateHorario/${id}`, horarioData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteHorario: async (id) => {
    try {
      const response = await api.delete(`api/doctor/deleteHorario/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default DoctoresService;