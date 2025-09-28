import api from './Conexion';

const RolesService = {
  // Obtener todos los roles
  getRoles: async () => {
    try {
      const response = await api.get('api/roles');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear un nuevo rol
  createRol: async (rolData) => {
    try {
      const response = await api.post('api/addRol', rolData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un rol
  updateRol: async (id, rolData) => {
    try {
      const response = await api.put(`api/updateRoles/${id}`, rolData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un rol
  deleteRol: async (id) => {
    try {
      const response = await api.delete(`api/deleteRol/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener rol por ID
  getRolById: async (id) => {
    try {
      const response = await api.get(`api/rolById/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default RolesService;