import api from './Conexion';

const ConsultoriosService = {
  // Obtener todos los consultorios
  getConsultorios: async () => {
    try {
      const response = await api.get('api/consultorios');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear un nuevo consultorio
  createConsultorio: async (consultorioData) => {
    try {
      const response = await api.post('api/addConsultorio', consultorioData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un consultorio
  updateConsultorio: async (id, consultorioData) => {
    try {
      const response = await api.put(`api/updateConsultorio/${id}`, consultorioData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un consultorio
  deleteConsultorio: async (id) => {
    try {
      const response = await api.delete(`api/deleteConsultorio/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener consultorio por ID
  getConsultorioById: async (id) => {
    try {
      const response = await api.get(`api/consultorioById/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener consultorio del doctor autenticado
  getMiConsultorio: async () => {
    try {
      const response = await api.get('api/mi-consultorio');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ConsultoriosService;