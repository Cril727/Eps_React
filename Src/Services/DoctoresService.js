import api from './Conexion';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to get user role
const getUserRole = async () => {
  try {
    const userInfo = await AsyncStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      return parsed.role;
    }
    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
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
      console.error('Error al obtener doctores:', error);
      throw error;
    }
  },

  // Crear un nuevo doctor
  createDoctor: async (doctorData) => {
    try {
      const response = await api.post('api/addDoctor', doctorData);
      return response.data;
    } catch (error) {
      console.error('Error al crear doctor:', error);
      throw error;
    }
  },

  // Actualizar un doctor
  updateDoctor: async (id, doctorData) => {
    try {
      const response = await api.put(`api/updateDoctor/${id}`, doctorData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar doctor:', error);
      throw error;
    }
  },

  // Eliminar un doctor
  deleteDoctor: async (id) => {
    try {
      const response = await api.delete(`api/deleteDoctor/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar doctor:', error);
      throw error;
    }
  },

  // Obtener doctor por ID
  getDoctorById: async (id) => {
    try {
      const response = await api.get(`api/DoctorById/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener doctor:', error);
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
      console.error('Error al obtener mis citas:', error);
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
      console.error('Error al obtener citas pendientes:', error);
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
      console.error('Error al aprobar cita:', error);
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
      console.error('Error al rechazar cita:', error);
      throw error;
    }
  },

  getMisHorarios: async () => {
    try {
      const response = await api.get('api/doctor/mis-horarios');
      return response.data;
    } catch (error) {
      console.error('Error al obtener mis horarios:', error);
      throw error;
    }
  },

  getMiConsultorio: async () => {
    try {
      const response = await api.get('api/doctor/mi-consultorio');
      return { consultorio: response.data.mi_consultorio };
    } catch (error) {
      console.error('Error al obtener mi consultorio:', error);
      throw error;
    }
  },

  createHorario: async (horarioData) => {
    try {
      const response = await api.post('api/doctor/addHorario', horarioData);
      return response.data;
    } catch (error) {
      console.error('Error al crear horario:', error);
      throw error;
    }
  },

  updateHorario: async (id, horarioData) => {
    try {
      const response = await api.put(`api/doctor/updateHorario/${id}`, horarioData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar horario:', error);
      throw error;
    }
  },

  deleteHorario: async (id) => {
    try {
      const response = await api.delete(`api/doctor/deleteHorario/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar horario:', error);
      throw error;
    }
  },
};

export default DoctoresService;