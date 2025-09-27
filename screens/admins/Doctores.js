import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import DoctoresService from '../../Src/Services/DoctoresService';
import EspecialidadesService from '../../Src/Services/EspecialidadesService';

export default function Doctores() {
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    estado: 'Activo',
    rol_id: 2, // Doctor role
    especialidad_id: '',
  });

  useEffect(() => {
    loadDoctores();
    loadEspecialidades();
  }, []);

  const loadDoctores = async () => {
    try {
      setLoading(true);
      const response = await DoctoresService.getDoctores();
      setDoctores(response.doctores || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los doctores');
    } finally {
      setLoading(false);
    }
  };

  const loadEspecialidades = async () => {
    try {
      const response = await EspecialidadesService.getEspecialidades();
      setEspecialidades(response.especialidad || []);
    } catch (error) {
      console.error('Error al cargar especialidades:', error);
    }
  };

  const handleCreate = () => {
    setEditingDoctor(null);
    setFormData({
      nombres: '',
      apellidos: '',
      email: '',
      telefono: '',
      estado: 'Activo',
      rol_id: 2,
      especialidad_id: '',
    });
    setModalVisible(true);
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      nombres: doctor.nombres,
      apellidos: doctor.apellidos,
      email: doctor.email,
      telefono: doctor.telefono,
      estado: doctor.estado,
      password: '', // Don't show existing password
      rol_id: doctor.rol_id,
      especialidad_id: doctor.especialidad_id?.toString() || '',
    });
    setModalVisible(true);
  };

  const handleDelete = (doctor) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar al Dr. ${doctor.nombres} ${doctor.apellidos}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await DoctoresService.deleteDoctor(doctor.id);
              loadDoctores();
              Alert.alert('Éxito', 'Doctor eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el doctor');
            }
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.nombres.trim() || !formData.apellidos.trim() || !formData.email.trim() || !formData.especialidad_id) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        especialidad_id: parseInt(formData.especialidad_id),
      };

      // Remove password if empty for updates
      if (!dataToSend.password || dataToSend.password.trim() === '') {
        delete dataToSend.password;
      }

      if (editingDoctor) {
        await DoctoresService.updateDoctor(editingDoctor.id, dataToSend);
        Alert.alert('Éxito', 'Doctor actualizado correctamente');
      } else {
        await DoctoresService.createDoctor(dataToSend);
        Alert.alert('Éxito', 'Doctor creado correctamente');
      }
      setModalVisible(false);
      loadDoctores();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error al guardar el doctor');
    }
  };

  const getEspecialidadName = (id) => {
    const especialidad = especialidades.find(e => e.id === id);
    return especialidad ? especialidad.especialidad : 'Sin especialidad';
  };

  const renderDoctor = ({ item }) => (
    <View style={styles.doctorCard}>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>
          Dr. {item.nombres} {item.apellidos}
        </Text>
        <Text style={styles.doctorEspecialidad}>
          {getEspecialidadName(item.especialidad_id)}
        </Text>
        <Text style={styles.doctorEmail}>{item.email}</Text>
        <Text style={styles.doctorPhone}>{item.telefono}</Text>
        <View style={[styles.statusBadge, item.estado === 'Activo' ? styles.activeBadge : styles.inactiveBadge]}>
          <Text style={styles.statusText}>{item.estado}</Text>
        </View>
      </View>
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
        <Text>Cargando doctores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Nuevo Doctor</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={doctores}
        renderItem={renderDoctor}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No hay doctores registrados</Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingDoctor ? 'Editar Doctor' : 'Nuevo Doctor'}
            </Text>

            <ScrollView style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Nombres"
                value={formData.nombres}
                onChangeText={(text) => setFormData({ ...formData, nombres: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Apellidos"
                value={formData.apellidos}
                onChangeText={(text) => setFormData({ ...formData, apellidos: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={formData.telefono}
                onChangeText={(text) => setFormData({ ...formData, telefono: text })}
                keyboardType="phone-pad"
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Especialidad:</Text>
                <Picker
                  selectedValue={formData.especialidad_id}
                  onValueChange={(value) => setFormData({ ...formData, especialidad_id: value })}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccionar especialidad..." value="" />
                  {especialidades.map((esp) => (
                    <Picker.Item key={esp.id} label={esp.especialidad} value={esp.id.toString()} />
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
                  <Picker.Item label="Activo" value="Activo" />
                  <Picker.Item label="Inactivo" value="Inactivo" />
                </Picker>
              </View>

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
                  {editingDoctor ? 'Actualizar' : 'Crear'}
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
    backgroundColor: '#ffffffff',
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
  list: {
    padding: 10,
  },
  doctorCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  doctorEspecialidad: {
    fontSize: 14,
    color: '#0c82ea',
    fontWeight: '500',
    marginTop: 2,
  },
  doctorEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  doctorPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  activeBadge: {
    backgroundColor: '#28a745',
  },
  inactiveBadge: {
    backgroundColor: '#dc3545',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
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