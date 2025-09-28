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
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PacientesService from '../../Src/Services/PacientesService';
import DoctoresService from '../../Src/Services/DoctoresService';
import { getUserInfo } from '../../Src/Services/AuthService';
import { AppointmentCard, SelectionCard, LoadingSpinner, EmptyState, Header } from '../../components';

// --- Helpers ---
const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
const toYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [citasPendientes, setCitasPendientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Proceso de solicitud
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateSelected, setDateSelected] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [consultorios, setConsultorios] = useState([]);
  const [selectedConsultorio, setSelectedConsultorio] = useState(null);
  const [novedad, setNovedad] = useState('');

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

  //acepta fecha (YYYY-MM-DD)
  const loadHorariosDisponibles = async (doctorId, fechaStr) => {
    try {
      const response = await PacientesService.getHorariosDisponibles(doctorId, fechaStr);
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

  const resetSolicitud = () => {
    setSelectedDoctor(null);
    setSelectedDate(null);
    setDateSelected(false);
    setSelectedHorario(null);
    setSelectedConsultorio(null);
    setHorarios([]);
    setConsultorios([]);
    setNovedad('');
  };

  const handleSolicitarCita = () => {
    resetSolicitud();
    setModalVisible(true);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(null);
    setDateSelected(false);
    setSelectedHorario(null);
    setSelectedConsultorio(null);
    setHorarios([]);
    setConsultorios([]);
    loadConsultoriosDisponibles(doctor.id);
  };

  const handleDatePicked = async (date) => {
    setSelectedDate(date);
    setDateSelected(true);
    setSelectedHorario(null);
    setHorarios([]);

    if (selectedDoctor) {
      const fechaStr = toYMD(date); // evita desfase vs toISOString()
      await loadHorariosDisponibles(selectedDoctor.id, fechaStr);
    }
  };

  const handleHorarioSelect = (horario) => setSelectedHorario(horario);
  const handleConsultorioSelect = (consultorio) => setSelectedConsultorio(consultorio);

  const handleSubmitCita = async () => {
    if (!selectedDoctor || !dateSelected || !selectedHorario || !selectedConsultorio || !selectedDate) {
      Alert.alert('Error', 'Por favor selecciona un doctor, una fecha, un horario y un consultorio');
      return;
    }

    const consultorioId = selectedConsultorio.id;

    // Combinar fecha (calendario) + horaInicio (horario) -> ISO único
    const horaInicio = String(selectedHorario?.horaInicio || '');
    const [hh, mm] = horaInicio.split(':').map((x) => parseInt(x, 10));
    const fechaHora = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      isNaN(hh) ? 0 : hh,
      isNaN(mm) ? 0 : mm,
      0,
      0
    );
    const fechaHoraISO = fechaHora.toISOString();

    const citaData = {
      doctor_id: selectedDoctor.id,
      consultorio_id: consultorioId,
      fechaHora: fechaHoraISO, // único campo
      novedad: (novedad || '').trim() || 'Cita solicitada por el paciente',
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
    Alert.alert('Confirmar rechazo', '¿Estás seguro de que quieres rechazar esta cita?', [
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
    ]);
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
    <AppointmentCard
      item={item}
      userRole={userRole}
      onApprove={handleAprobarCita}
      onReject={handleRechazarCita}
      formatDateTime={formatDateTime}
    />
  );

  if (loading) return <LoadingSpinner message="Cargando citas..." />;

  return (
    <View style={styles.container}>
      <Header
        title="Mis Citas"
        onAdd={userRole !== 'doctor' ? handleSolicitarCita : null}
        addText="Solicitar Cita"
        showAdd={userRole !== 'doctor'}
      />

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
          <EmptyState
            title="No hay citas"
            message={userRole === 'doctor' ? 'No tienes citas asignadas' : 'No tienes citas programadas'}
          />
        }
      />

      {/* Modal de solicitud */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
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
                        <SelectionCard
                          key={item.id}
                          item={item}
                          isSelected={selectedDoctor?.id === item.id}
                          onPress={handleDoctorSelect}
                          title={`Dr. ${item.nombres} ${item.apellidos}`}
                          subtitle={item.especialidad?.especialidad}
                        />
                      ))
                    )}
                  </View>
                </>
              ) : !dateSelected ? (
                <>
                  <Text style={styles.formSectionTitle}>Doctor Seleccionado:</Text>
                  <View style={styles.selectedInfo}>
                    <Text>
                      Dr. {selectedDoctor.nombres} {selectedDoctor.apellidos}
                    </Text>
                    <Text>{selectedDoctor.especialidad?.especialidad}</Text>
                  </View>

                  <Text style={styles.formSectionTitle}>Seleccionar Día:</Text>
                  <View style={styles.calendarWrapper}>
                    <DateTimePicker
                      value={selectedDate ?? new Date()}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                      onChange={(_, d) => d && handleDatePicked(d)}
                      minimumDate={new Date()}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                      setSelectedDoctor(null);
                      setSelectedDate(null);
                      setDateSelected(false);
                      setSelectedHorario(null);
                      setHorarios([]);
                    }}
                  >
                    <Text style={styles.backButtonText}>Cambiar Doctor</Text>
                  </TouchableOpacity>
                </>
              ) : !selectedHorario ? (
                <>
                  <Text style={styles.formSectionTitle}>Día Seleccionado:</Text>
                  <View style={styles.selectedInfo}>
                    <Text>{selectedDate?.toLocaleDateString('es-ES')}</Text>
                  </View>

                  <Text style={styles.formSectionTitle}>Selecciona un Horario:</Text>
                  <View style={{ marginBottom: 12 }}>
                    {horarios.length === 0 ? (
                      <Text style={{ color: '#666' }}>No hay horarios disponibles para ese día</Text>
                    ) : (
                      horarios.map((item) => (
                        <SelectionCard
                          key={item.id}
                          item={item}
                          isSelected={selectedHorario?.id === item.id}
                          onPress={handleHorarioSelect}
                          title={`${item.horaInicio} - ${item.horaFin}`}
                          subtitle={`Estado: ${item.estado}`}
                          showEstado={false}
                        />
                      ))
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                      setSelectedHorario(null);
                      setDateSelected(false);
                    }}
                  >
                    <Text style={styles.backButtonText}>Cambiar Día</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                      setSelectedDoctor(null);
                      setSelectedDate(null);
                      setDateSelected(false);
                      setSelectedHorario(null);
                      setHorarios([]);
                    }}
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
                    <Text>
                      {selectedDate?.toLocaleDateString('es-ES')} — {selectedHorario.horaInicio} - {selectedHorario.horaFin}
                    </Text>
                  </View>

                  <Text style={styles.formSectionTitle}>Selecciona un Consultorio:</Text>
                  <View style={{ marginBottom: 12 }}>
                    {consultorios.length === 0 ? (
                      <Text style={{ color: '#666' }}>No hay consultorios disponibles</Text>
                    ) : (
                      consultorios.map((item) => (
                        <SelectionCard
                          key={item.id}
                          item={item}
                          isSelected={selectedConsultorio?.id === item.id}
                          onPress={handleConsultorioSelect}
                          title={`${item.codigo} - ${item.ubicacion}`}
                          subtitle={`Estado: ${item.estado}`}
                          showEstado={false}
                        />
                      ))
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                      setSelectedConsultorio(null);
                      setSelectedHorario(null);
                    }}
                  >
                    <Text style={styles.backButtonText}>Cambiar Horario</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                      setSelectedConsultorio(null);
                      setSelectedHorario(null);
                      setDateSelected(false);
                    }}
                  >
                    <Text style={styles.backButtonText}>Cambiar Día</Text>
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

                    <Text style={styles.confirmTitle}>Fecha:</Text>
                    <Text>{selectedDate?.toLocaleDateString('es-ES')}</Text>

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

                  <TouchableOpacity style={styles.backButton} onPress={() => setSelectedConsultorio(null)}>
                    <Text style={styles.backButtonText}>Cambiar Consultorio</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                      setSelectedConsultorio(null);
                      setSelectedHorario(null);
                    }}
                  >
                    <Text style={styles.backButtonText}>Cambiar Horario</Text>
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
              {selectedDoctor && dateSelected && selectedHorario && selectedConsultorio && (
                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSubmitCita}>
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
  list: { padding: 10 },
  listSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    marginBottom: 10,
  },
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
  calendarWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: { flex: 1, padding: 15, borderRadius: 5, marginHorizontal: 5 },
  cancelButton: { backgroundColor: '#6c757d' },
  saveButton: { backgroundColor: '#0c82ea' },
  cancelButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  saveButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  pendingSection: { marginBottom: 20 },
});
