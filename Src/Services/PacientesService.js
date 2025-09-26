import api from './Conexion';

const PacientesService = {
  // Obtener todos los pacientes
  getPacientes: async () => {
    try {
      const response = await api.get('api/pacientes');
      return response.data;
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      throw error;
    }
  },

  // Crear un nuevo paciente
  createPaciente: async (pacienteData) => {
    try {
      const response = await api.post('api/addPaciete', pacienteData);
      return response.data;
    } catch (error) {
      console.error('Error al crear paciente:', error);
      throw error;
    }
  },

  // Actualizar un paciente
  updatePaciente: async (id, pacienteData) => {
    try {
      const response = await api.put(`api/updatePaciente/${id}`, pacienteData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      throw error;
    }
  },

  // Eliminar un paciente
  deletePaciente: async (id) => {
    try {
      const response = await api.delete(`api/deletePaciente/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      throw error;
    }
  },

  // Obtener paciente por ID
  getPacienteById: async (id) => {
    try {
      const response = await api.get(`api/pacienteById/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener paciente:', error);
      throw error;
    }
  },

  // Métodos específicos para pacientes autenticados
  getMisCitas: async () => {
    try {
      const response = await api.get('api/mis-citas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener mis citas:', error);
      throw error;
    }
  },

  solicitarCita: async (citaData) => {
    try {
      const response = await api.post('api/solicitar-cita', citaData);
      return response.data;
    } catch (error) {
      console.error('Error al solicitar cita:', error);
      throw error;
    }
  },

  getDoctoresDisponibles: async () => {
    try {
      const response = await api.get('api/doctores-disponibles');
      return response.data;
    } catch (error) {
      console.error('Error al obtener doctores disponibles:', error);
      throw error;
    }
  },

  getHorariosDisponibles: async (doctorId) => {
    try {
      const response = await api.get(`api/horarios-disponibles/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener horarios disponibles:', error);
      throw error;
    }
  },

  getConsultoriosDisponibles: async (doctorId) => {
    try {
      const response = await api.get(`api/consultorios-disponibles/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener consultorios disponibles:', error);
      throw error;
    }
  },
};

export default PacientesService;