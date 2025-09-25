import api from './Conexion';

const UserService = {
  // Obtener todos los usuarios
  getUsers: async () => {
    try {
      const response = await api.get('api/users');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  // Crear un nuevo usuario
  createUser: async (userData) => {
    try {
      const response = await api.post('api/addUser', userData);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  // Actualizar un usuario
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`api/updateUser/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },

  // Eliminar un usuario
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`api/deleteUser/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  },

  // Obtener usuario por ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`api/userById/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  },

  // Actualizar perfil de usuario (admin)
  actualizarPerfilAdmin: async (id, profileData) => {
    try {
      const response = await api.put(`api/actualizar-perfil-admin/${id}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  },
};

export default UserService;