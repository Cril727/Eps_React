import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PacientesService from '../../Src/Services/PacientesService';
import DoctoresService from '../../Src/Services/DoctoresService';
import ConsultoriosService from '../../Src/Services/ConsultoriosService';
import { getUserInfo } from '../../Src/Services/AuthService';

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [citasPendientes, setCitasPendientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [consultorios, setConsultorios] = useState([]);
  const [selectedConsultorio, setSelectedConsultorio] = useState(null);
  const [novedad, setNovedad] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const initializeScreen = async () => {
      const userInfo = await getUserInfo();
      setUserRole(userInfo?.role);

      if (userInfo?.role === 'doctor') {
        try {
          await loadMisCitasDoctor();
          await loadCitasPendientesDoctor();
        } catch (error) {
        } finally {
          setLoading(false);
        }
      } else {
        Promise.all([loadMisCitas(), loadDoctoresDisponibles()]).finally(() =>
          setLoading(false)
        );
      }
    };

    initializeScreen();
  }, []);

  const loadMisCitas = async () => {
    try {
      const response = await PacientesService.getMisCitas();
      setCitas(response.citas || []);
    } catch (error) {
    }
  };

  const loadMisCitasDoctor = async () => {
    try {
      const response = await DoctoresService.getMisCitas();
      setCitas(response.citas || []);
    } catch (error) {
    }
  };

  const loadCitasPendientesDoctor = async () => {
    try {
      const response = await DoctoresService.getMisCitasPendientes();
      setCitasPendientes(response.citas_pendientes || []);
    } catch (error) {
    }
  };

  const loadDoctoresDisponibles = async () => {
    try {
      const response = await PacientesService.getDoctoresDisponibles();
      setDoctores(response.doctores_disponibles || []);
    } catch (error) {
    }
  };

  const loadHorariosDisponibles = async (doctorId) => {
    try {
      const response = await PacientesService.getHorariosDisponibles(doctorId);
      setHorarios(response.horarios_disponibles || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los horarios disponibles');
    }
  };

  const loadConsultoriosDisponibles = async (doctorId) => {
    try {
      const response = await PacientesService.getConsultoriosDisponibles(doctorId);
      setConsultorios(response.consultorios_disponibles || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los consultorios disponibles');
    }
  };

  const handleSolicitarCita = () => {
    setSelectedDoctor(null);
    setSelectedHorario(null);
    setSelectedConsultorio(null);
    setHorarios([]);
    setConsultorios([]);
    setNovedad('');
    setModalVisible(true);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedHorario(null);
    setSelectedConsultorio(null);
    loadHorariosDisponibles(doctor.id);
    loadConsultoriosDisponibles(doctor.id);
  };

  const handleHorarioSelect = (horario) => {
    setSelectedHorario(horario);
  };

  const handleConsultorioSelect = (consultorio) => {
    setSelectedConsultorio(consultorio);
  };

  const handleSubmitCita = async () => {
    if (!selectedDoctor || !selectedHorario || !selectedConsultorio) {
      Alert.alert('Error', 'Por favor selecciona un doctor, un horario y un consultorio');
      return;
    }

    const consultorioId = selectedConsultorio.id;

    // Construcción robusta de fecha-hora ISO
    const horaInicio = String(selectedHorario?.horaInicio || '');
    const rawDate =
      selectedHorario?.fecha ||
      selectedHorario?.fechaDia ||
      selectedHorario?.dia;

    let fechaHoraISO = null;

    if (selectedHorario?.fechaHora || selectedHorario?.fechaHoraInicio) {
      const full = selectedHorario?.fechaHora || selectedHorario?.fechaHoraInicio;
      const dt = new Date(full);
      if (!isNaN(dt.getTime())) {
        fechaHoraISO = dt.toISOString();
      }
    } else if (rawDate && horaInicio) {
      // Combinar "YYYY-MM-DD" + "HH:mm"
      const [y, m, d] = String(rawDate).split('-').map(Number);
      const [hh, mm] = String(horaInicio).split(':').map(Number);
      const dt = new Date(y || 1970, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
      if (!isNaN(dt.getTime())) {
        fechaHoraISO = dt.toISOString();
      }
    }

    if (!fechaHoraISO && horaInicio) {
      const now = new Date();
      const [hh, mm] = String(horaInicio).split(':').map(Number);
      const dt = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hh || 0,
        mm || 0,
        0,
        0
      );
      if (!isNaN(dt.getTime())) {
        fechaHoraISO = dt.toISOString();
      }
    }

    if (!fechaHoraISO) {
      Alert.alert(
        'Fecha incompleta',
        'No fue posible construir una fechaHora válida. Verifica que el horario incluya fecha.'
      );
      return;
    }

    const citaData = {
      doctor_id: selectedDoctor.id,
      consultorio_id: consultorioId,
      fechaHora: fechaHoraISO,
      novedad: novedad.trim() || 'Cita solicitada por el paciente',
    };

    try {
      await PacientesService.solicitarCita(citaData);
      Alert.alert('Éxito', 'Cita solicitada correctamente');
      setModalVisible(false);
      loadMisCitas();
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Error al solicitar la cita');
    }
  };

  const handleAprobarCita = async (citaId) => {
    try {
      await DoctoresService.aprobarCita(citaId);
      Alert.alert('Éxito', 'Cita aprobada correctamente');
      loadMisCitasDoctor();
      loadCitasPendientesDoctor();
    } catch {
      Alert.alert('Error', 'No se pudo aprobar la cita');
    }
  };

  const handleRechazarCita = async (citaId) => {
    Alert.alert(
      'Confirmar rechazo',
      '¿Estás seguro de que quieres rechazar esta cita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: async () => {
            try {
              await DoctoresService.rechazarCita(citaId);
              Alert.alert('Éxito', 'Cita rechazada correctamente');
              loadMisCitasDoctor();
              loadCitasPendientesDoctor();
            } catch {
              Alert.alert('Error', 'No se pudo rechazar la cita');
            }
          },
        },
      ]
    );
  };

  const handleCompletarCita = async (citaId) => {
    Alert.alert(
      'Confirmar completado',
      '¿Estás seguro de que quieres marcar esta cita como completada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Completar',
          style: 'default',
          onPress: async () => {
            try {
              await DoctoresService.completarCita(citaId);
              Alert.alert('Éxito', 'Cita completada correctamente');
              loadMisCitasDoctor();
              loadCitasPendientesDoctor();
            } catch {
              Alert.alert('Error', 'No se pudo completar la cita');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Programada':
        return '#ffc107';
      case 'Completada':
        return '#28a745';
      case 'Rechazada':
        return '#dc3545';
      case 'Por aprobar':
        return '#6c757d';
      default:
        return '#092c4bff';
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderCita = ({ item }) => (
    <View style={styles.citaCard}>
      <View style={styles.citaHeader}>
        {userRole === 'doctor' ? (
          <Text style={styles.doctorName}>
            Paciente: {item.paciente?.nombres} {item.paciente?.apellidos}
          </Text>
        ) : (
          <Text style={styles.doctorName}>
            Dr. {item.doctor?.nombres} {item.doctor?.apellidos}
          </Text>
        )}
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado) }]}
        >
          <Text style={styles.statusText}>{item.estado}</Text>
        </View>
      </View>

      {userRole !== 'doctor' && (
        <Text style={styles.especialidadText}>
          {item.doctor?.especialidad?.especialidad}
        </Text>
      )}

      <Text style={styles.fechaText}>{formatDateTime(item.fechaHora)}</Text>

      <Text style={styles.consultorioText}>
        Consultorio: {item.consultorio?.codigo} - {item.consultorio?.ubicacion}
      </Text>

      {!!item.novedad && <Text style={styles.novedadText}>Nota: {item.novedad}</Text>}

      {userRole === 'doctor' && item.estado === 'Por aprobar' && (
        <View style={styles.doctorActions}>
          <TouchableOpacity
            style={[styles.doctorActionButton, styles.approveButton]}
            onPress={() => handleAprobarCita(item.id)}
          >
            <Ionicons name="checkmark" size={16} color="white" />
            <Text style={styles.doctorActionText}>Aprobar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.doctorActionButton, styles.rejectButton]}
            onPress={() => handleRechazarCita(item.id)}
          >
            <Ionicons name="close" size={16} color="white" />
            <Text style={styles.doctorActionText}>Rechazar</Text>
          </TouchableOpacity>
        </View>
      )}

      {userRole === 'doctor' && item.estado === 'Programada' && (
        <View style={styles.doctorActions}>
          <TouchableOpacity
            style={[styles.doctorActionButton, styles.completeButton]}
            onPress={() => handleCompletarCita(item.id)}
          >
            <Ionicons name="checkmark-done" size={16} color="white" />
            <Text style={styles.doctorActionText}>Completar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Citas</Text>
        {userRole !== 'doctor' && (
          <TouchableOpacity style={styles.addButton} onPress={handleSolicitarCita}>
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.addButtonText}>Solicitar Cita</Text>
          </TouchableOpacity>
        )}
      </View>

      {userRole === 'doctor' && citasPendientes.length > 0 && (
        <View style={styles.pendingSection}>
          <Text style={styles.listSectionTitle}>Citas Pendientes</Text>
          <FlatList
            data={citasPendientes}
            renderItem={renderCita}
            keyExtractor={(item) => `pending-${item.id.toString()}`}
            contentContainerStyle={styles.list}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      <Text style={styles.listSectionTitle}>
        {userRole === 'doctor' ? 'Todas mis Citas' : 'Mis Citas'}
      </Text>

      <FlatList
        data={citas}
        renderItem={renderCita}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>
              {userRole === 'doctor'
                ? 'No tienes citas asignadas'
                : 'No tienes citas programadas'}
            </Text>
          </View>
        }
      />

      {/* Modal: formulario simple, SIN FlatList dentro */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Solicitar Nueva Cita</Text>

            <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 16 }}>
              {!selectedDoctor ? (
                <>
                  <Text style={styles.formSectionTitle}>Seleccionar Doctor:</Text>
                  <View style={{ marginBottom: 12 }}>
                    {doctores.length === 0 ? (
                      <Text style={{ color: '#666' }}>No hay doctores disponibles</Text>
                    ) : (
                      doctores.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.optionCard,
                            selectedDoctor?.id === item.id && styles.selectedOption,
                          ]}
                          onPress={() => handleDoctorSelect(item)}
                        >
                          <Text style={styles.optionTitle}>
                            Dr. {item.nombres} {item.apellidos}
                          </Text>
                          <Text style={styles.optionSubtitle}>
                            {item.especialidad?.especialidad}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </>
              ) : !selectedHorario ? (
                <>
                  <Text style={styles.formSectionTitle}>Doctor Seleccionado:</Text>
                  <View style={styles.selectedInfo}>
                    <Text>
                      Dr. {selectedDoctor.nombres} {selectedDoctor.apellidos}
                    </Text>
                    <Text>{selectedDoctor.especialidad?.especialidad}</Text>
                  </View>

                  <Text style={styles.formSectionTitle}>Selecciona un Horario:</Text>
                  <View style={{ marginBottom: 12 }}>
                    {horarios.length === 0 ? (
                      <Text style={{ color: '#666' }}>No hay horarios disponibles</Text>
                    ) : (
                      horarios.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.optionCard,
                            selectedHorario?.id === item.id && styles.selectedOption,
                          ]}
                          onPress={() => handleHorarioSelect(item)}
                        >
                          <Text style={styles.optionTitle}>
                            {item.horaInicio} - {item.horaFin}
                          </Text>
                          <Text style={styles.optionSubtitle}>Estado: {item.estado}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setSelectedDoctor(null)}
                  >
                    <Text style={styles.backButtonText}>Cambiar Doctor</Text>
                  </TouchableOpacity>
                </>
              ) : !selectedConsultorio ? (
                <>
                  <Text style={styles.formSectionTitle}>Horario Seleccionado:</Text>
                  <View style={styles.selectedInfo}>
                    <Text>
                      Dr. {selectedDoctor.nombres} {selectedDoctor.apellidos}
                    </Text>
                    <Text>{selectedDoctor.especialidad?.especialidad}</Text>
                    <Text>{selectedHorario.horaInicio} - {selectedHorario.horaFin}</Text>
                  </View>

                  <Text style={styles.formSectionTitle}>Selecciona un Consultorio:</Text>
                  <View style={{ marginBottom: 12 }}>
                    {consultorios.length === 0 ? (
                      <Text style={{ color: '#666' }}>No hay consultorios disponibles</Text>
                    ) : (
                      consultorios.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.optionCard,
                            selectedConsultorio?.id === item.id && styles.selectedOption,
                          ]}
                          onPress={() => handleConsultorioSelect(item)}
                        >
                          <Text style={styles.optionTitle}>
                            {item.codigo} - {item.ubicacion}
                          </Text>
                          <Text style={styles.optionSubtitle}>Estado: {item.estado}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setSelectedHorario(null)}
                  >
                    <Text style={styles.backButtonText}>Cambiar Horario</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.formSectionTitle}>Confirmar Cita:</Text>
                  <View style={styles.confirmationInfo}>
                    <Text style={styles.confirmTitle}>Doctor:</Text>
                    <Text>
                      Dr. {selectedDoctor.nombres} {selectedDoctor.apellidos}
                    </Text>

                    <Text style={styles.confirmTitle}>Especialidad:</Text>
                    <Text>{selectedDoctor.especialidad?.especialidad}</Text>

                    <Text style={styles.confirmTitle}>Horario:</Text>
                    <Text>
                      {selectedHorario.horaInicio} - {selectedHorario.horaFin}
                    </Text>

                    <Text style={styles.confirmTitle}>Consultorio:</Text>
                    <Text>
                      {selectedConsultorio.codigo} - {selectedConsultorio.ubicacion}
                    </Text>

                    <Text style={styles.confirmTitle}>Nota adicional:</Text>
                    <TextInput
                      style={styles.noteInput}
                      placeholder="Describe tu motivo de consulta (opcional)"
                      value={novedad}
                      onChangeText={setNovedad}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setSelectedConsultorio(null)}
                  >
                    <Text style={styles.backButtonText}>Cambiar Consultorio</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              {selectedDoctor && selectedHorario && selectedConsultorio && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSubmitCita}
                >
                  <Text style={styles.saveButtonText}>Solicitar Cita</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0c82ea',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  addButtonText: { color: 'white', marginLeft: 5, fontWeight: 'bold' },
  list: { padding: 10 },
  listSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    marginBottom: 10,
  },

  citaCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  doctorName: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  especialidadText: { fontSize: 14, color: '#0c82ea', fontWeight: '500', marginBottom: 4 },
  fechaText: { fontSize: 14, color: '#666', marginBottom: 4 },
  consultorioText: { fontSize: 14, color: '#666', marginBottom: 4 },
  novedadText: { fontSize: 14, color: '#666', fontStyle: 'italic' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },

  form: { marginBottom: 20 },
  formSectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },

  optionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  selectedOption: { backgroundColor: '#e3f2fd', borderColor: '#0c82ea' },
  optionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  optionSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },

  selectedInfo: { backgroundColor: '#e3f2fd', padding: 12, borderRadius: 8, marginBottom: 15 },
  confirmationInfo: { backgroundColor: '#f8f9fa', padding: 15, borderRadius: 8, marginBottom: 15 },
  confirmTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 8 },

  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    fontSize: 14,
    textAlignVertical: 'top',
  },

  backButton: { alignSelf: 'center', padding: 10, marginTop: 10 },
  backButtonText: { color: '#0c82ea', fontSize: 14, fontWeight: 'bold' },

  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: { flex: 1, padding: 15, borderRadius: 5, marginHorizontal: 5 },
  cancelButton: { backgroundColor: '#6c757d' },
  saveButton: { backgroundColor: '#0c82ea' },
  cancelButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  saveButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },

  pendingSection: { marginBottom: 20 },

  doctorActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  doctorActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  approveButton: { backgroundColor: '#28a745' },
  rejectButton: { backgroundColor: '#dc3545' },
  completeButton: { backgroundColor: '#007bff' },
  doctorActionText: { color: 'white', fontWeight: 'bold', marginLeft: 5 },
});
