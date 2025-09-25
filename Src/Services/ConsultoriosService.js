import api from './Conexion';

const ConsultoriosService = {
  // Obtener todos los consultorios
  getConsultorios: async () => {
    try {
      const response = await api.get('api/consultorios');
      return response.data;
    } catch (error) {
      console.error('Error al obtener consultorios:', error);
      throw error;
    }
  },

  // Crear un nuevo consultorio
  createConsultorio: async (consultorioData) => {
    try {
      const response = await api.post('api/addConsultorio', consultorioData);
      return response.data;
    } catch (error) {
      console.error('Error al crear consultorio:', error);
      throw error;
    }
  },

  // Actualizar un consultorio
  updateConsultorio: async (id, consultorioData) => {
    try {
      const response = await api.put(`api/updateConsultorio/${id}`, consultorioData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar consultorio:', error);
      throw error;
    }
  },

  // Eliminar un consultorio
  deleteConsultorio: async (id) => {
    try {
      const response = await api.delete(`api/deleteConsultorio/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar consultorio:', error);
      throw error;
    }
  },

  // Obtener consultorio por ID
  getConsultorioById: async (id) => {
    try {
      const response = await api.get(`api/consultorioById/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener consultorio:', error);
      throw error;
    }
  },

  // Obtener consultorio del doctor autenticado
  getMiConsultorio: async () => {
    try {
      const response = await api.get('api/mi-consultorio');
      return response.data;
    } catch (error) {
      console.error('Error al obtener mi consultorio:', error);
      throw error;
    }
  },
};

export default ConsultoriosService;