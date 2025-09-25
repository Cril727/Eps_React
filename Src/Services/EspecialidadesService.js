import api from './Conexion';

const EspecialidadesService = {
  // Obtener todas las especialidades
  getEspecialidades: async () => {
    try {
      const response = await api.get('api/Especialidades');
      return response.data;
    } catch (error) {
      console.error('Error al obtener especialidades:', error);
      throw error;
    }
  },

  // Crear una nueva especialidad
  createEspecialidad: async (especialidadData) => {
    try {
      const response = await api.post('api/addEspecialidad', especialidadData);
      return response.data;
    } catch (error) {
      console.error('Error al crear especialidad:', error);
      throw error;
    }
  },

  // Actualizar una especialidad
  updateEspecialidad: async (id, especialidadData) => {
    try {
      const response = await api.put(`api/updateEspecialidad/${id}`, especialidadData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar especialidad:', error);
      throw error;
    }
  },

  // Eliminar una especialidad
  deleteEspecialidad: async (id) => {
    try {
      const response = await api.delete(`api/deleteEspecialidad/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar especialidad:', error);
      throw error;
    }
  },

  // Obtener especialidad por ID
  getEspecialidadById: async (id) => {
    try {
      const response = await api.get(`api/especialidadById/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener especialidad:', error);
      throw error;
    }
  },
};

export default EspecialidadesService;