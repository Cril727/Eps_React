import api from './Conexion';

const CitasService = {
  // Obtener todas las citas (admin)
  getCitas: async () => {
    try {
      const response = await api.get('api/citas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener citas:', error);
      throw error;
    }
  },

  // Crear una nueva cita
  createCita: async (citaData) => {
    try {
      const response = await api.post('api/addCita', citaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear cita:', error);
      throw error;
    }
  },

  // Actualizar una cita
  updateCita: async (id, citaData) => {
    try {
      const response = await api.put(`api/updateCita/${id}`, citaData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      throw error;
    }
  },

  // Eliminar una cita
  deleteCita: async (id) => {
    try {
      const response = await api.delete(`api/deleteCita/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      throw error;
    }
  },

  // Obtener cita por ID
  getCitaById: async (id) => {
    try {
      const response = await api.get(`api/citaById/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener cita:', error);
      throw error;
    }
  },
};

export default CitasService;