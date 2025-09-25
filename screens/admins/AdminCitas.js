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
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CitasService from '../../Src/Services/CitasService';
import PacientesService from '../../Src/Services/PacientesService';
import DoctoresService from '../../Src/Services/DoctoresService';
import ConsultoriosService from '../../Src/Services/ConsultoriosService';

export default function AdminCitas() {
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCita, setEditingCita] = useState(null);
  const [formData, setFormData] = useState({
    fechaHora: '',
    estado: 'Programada',
    novedad: '',
    paciente_id: '',
    doctor_id: '',
    consultorio_id: '',
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateTimeString, setDateTimeString] = useState('');

  useEffect(() => {
    loadCitas();
    loadPacientes();
    loadDoctores();
    loadConsultorios();
  }, []);

  const loadCitas = async () => {
    try {
      setLoading(true);
      const response = await CitasService.getCitas();
      setCitas(response.citasMedicas || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const loadPacientes = async () => {
    try {
      const response = await PacientesService.getPacientes();
      setPacientes(response.pacientes || []);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    }
  };

  const loadDoctores = async () => {
    try {
      const response = await DoctoresService.getDoctores();
      setDoctores(response.doctores || []);
    } catch (error) {
      console.error('Error al cargar doctores:', error);
    }
  };

  const loadConsultorios = async () => {
    try {
      const response = await ConsultoriosService.getConsultorios();
      setConsultorios(response.consultorios || []);
    } catch (error) {
      console.error('Error al cargar consultorios:', error);
    }
  };

  const handleCreate = () => {
    setEditingCita(null);
    const now = new Date();
    setSelectedDate(now);
    setSelectedTime(now);
    setDateTimeString('');
    setFormData({
      fechaHora: '',
      estado: 'Programada',
      novedad: '',
      paciente_id: '',
      doctor_id: '',
      consultorio_id: '',
    });
    setModalVisible(true);
  };

  const handleEdit = (cita) => {
    setEditingCita(cita);
    const citaDate = new Date(cita.fechaHora);
    setSelectedDate(citaDate);
    setSelectedTime(citaDate);
    setDateTimeString(formatDateTime(cita.fechaHora));

    setFormData({
      fechaHora: cita.fechaHora,
      estado: cita.estado,
      novedad: cita.novedad || '',
      paciente_id: cita.paciente_id?.toString() || '',
      doctor_id: cita.doctor_id?.toString() || '',
      consultorio_id: cita.consultorio_id?.toString() || '',
    });
    setModalVisible(true);
  };

  const handleDelete = (cita) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta cita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await CitasService.deleteCita(cita.id);
              loadCitas();
              Alert.alert('Éxito', 'Cita eliminada correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la cita');
            }
          },
        },
      ]
    );
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedDate(selectedDate);
      updateDateTimeString(selectedDate, selectedTime);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setSelectedTime(selectedTime);
      updateDateTimeString(selectedDate, selectedTime);
    }
  };

  const updateDateTimeString = (date, time) => {
    const combinedDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );

    const formatted = combinedDateTime.toISOString().slice(0, 16).replace('T', ' ');
    setDateTimeString(formatDateTime(combinedDateTime.toISOString()));

    setFormData(prev => ({
      ...prev,
      fechaHora: formatted
    }));
  };

  const handleSubmit = async () => {
    if (!formData.fechaHora || !formData.paciente_id || !formData.doctor_id || !formData.consultorio_id) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        novedad: formData.novedad || 'Cita creada por administrador', // Default value if empty
        paciente_id: parseInt(formData.paciente_id),
        doctor_id: parseInt(formData.doctor_id),
        consultorio_id: parseInt(formData.consultorio_id),
      };

      if (editingCita) {
        await CitasService.updateCita(editingCita.id, dataToSend);
        Alert.alert('Éxito', 'Cita actualizada correctamente');
      } else {
        await CitasService.createCita(dataToSend);
        Alert.alert('Éxito', 'Cita creada correctamente');
      }
      setModalVisible(false);
      loadCitas();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error al guardar la cita');
    }
  };

  const getPacienteName = (id) => {
    const paciente = pacientes.find(p => p.id === id);
    return paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'Paciente desconocido';
  };

  const getDoctorName = (id) => {
    const doctor = doctores.find(d => d.id === id);
    return doctor ? `Dr. ${doctor.nombres} ${doctor.apellidos}` : 'Doctor desconocido';
  };

  const getConsultorioInfo = (id) => {
    const consultorio = consultorios.find(c => c.id === id);
    return consultorio ? `${consultorio.codigo} - ${consultorio.ubicacion}` : 'Consultorio desconocido';
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Programada':
        return '#ffc107';
      case 'Completada':
        return '#28a745';
      case 'Rechazada':
        return '#dc3545';
      default:
        return '#6c757d';
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
        <Text style={styles.pacienteName}>
          {getPacienteName(item.paciente_id)}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado) }]}>
          <Text style={styles.statusText}>{item.estado}</Text>
        </View>
      </View>

      <Text style={styles.doctorName}>
        {getDoctorName(item.doctor_id)}
      </Text>

      <Text style={styles.fechaText}>
        {formatDateTime(item.fechaHora)}
      </Text>

      <Text style={styles.consultorioText}>
        {getConsultorioInfo(item.consultorio_id)}
      </Text>

      {item.novedad && (
        <Text style={styles.novedadText}>
          Nota: {item.novedad}
        </Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="pencil" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash" size={20} color="white" />
        </TouchableOpacity>
      </View>
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
        <Text style={styles.title}>Gestión de Citas</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Nueva Cita</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={citas}
        renderItem={renderCita}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No hay citas registradas</Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setShowDatePicker(false);
          setShowTimePicker(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCita ? 'Editar Cita' : 'Nueva Cita'}
            </Text>

            <ScrollView style={styles.form}>
              <View style={styles.dateTimeContainer}>
                <Text style={styles.sectionTitle}>Fecha y Hora</Text>

                <View style={styles.pickerRow}>
                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Ionicons name="calendar" size={20} color="#0c82ea" />
                    <Text style={styles.dateTimeButtonText}>
                      {selectedDate.toLocaleDateString('es-ES')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Ionicons name="time" size={20} color="#0c82ea" />
                    <Text style={styles.dateTimeButtonText}>
                      {selectedTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                </View>

                {dateTimeString ? (
                  <Text style={styles.selectedDateTime}>
                    Fecha y hora seleccionada: {dateTimeString}
                  </Text>
                ) : null}

                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                )}

                {showTimePicker && (
                  <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Paciente:</Text>
                <Picker
                  selectedValue={formData.paciente_id}
                  onValueChange={(value) => setFormData({ ...formData, paciente_id: value })}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccionar paciente..." value="" />
                  {pacientes.map((paciente) => (
                    <Picker.Item
                      key={paciente.id}
                      label={`${paciente.nombres} ${paciente.apellidos}`}
                      value={paciente.id.toString()}
                    />
                  ))}
                </Picker>
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Doctor:</Text>
                <Picker
                  selectedValue={formData.doctor_id}
                  onValueChange={(value) => setFormData({ ...formData, doctor_id: value })}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccionar doctor..." value="" />
                  {doctores.map((doctor) => (
                    <Picker.Item
                      key={doctor.id}
                      label={`Dr. ${doctor.nombres} ${doctor.apellidos}`}
                      value={doctor.id.toString()}
                    />
                  ))}
                </Picker>
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Consultorio:</Text>
                <Picker
                  selectedValue={formData.consultorio_id}
                  onValueChange={(value) => setFormData({ ...formData, consultorio_id: value })}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccionar consultorio..." value="" />
                  {consultorios.map((consultorio) => (
                    <Picker.Item
                      key={consultorio.id}
                      label={`${consultorio.codigo} - ${consultorio.ubicacion}`}
                      value={consultorio.id.toString()}
                    />
                  ))}
                </Picker>
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Estado:</Text>
                <Picker
                  selectedValue={formData.estado}
                  onValueChange={(value) => setFormData({ ...formData, estado: value })}
                  style={styles.picker}
                >
                  <Picker.Item label="Programada" value="Programada" />
                  <Picker.Item label="Completada" value="Completada" />
                  <Picker.Item label="Rechazada" value="Rechazada" />
                </Picker>
              </View>

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Novedad (opcional)"
                value={formData.novedad}
                onChangeText={(text) => setFormData({ ...formData, novedad: text })}
                multiline
                numberOfLines={3}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.saveButtonText}>
                  {editingCita ? 'Actualizar' : 'Crear'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0c82ea',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  infoText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '500',
  },
  list: {
    padding: 10,
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
  pacienteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  doctorName: {
    fontSize: 14,
    color: '#0c82ea',
    fontWeight: '500',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fechaText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  consultorioText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  novedadText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  adminNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  adminNoteText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 5,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: '#ffc107',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  dateTimeContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 5,
  },
  dateTimeButtonText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  selectedDateTime: {
    fontSize: 14,
    color: '#0c82ea',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 5,
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#0c82ea',
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});