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
import ConsultoriosService from '../../Src/Services/ConsultoriosService';
import DoctoresService from '../../Src/Services/DoctoresService';

export default function Consultorios() {
  const [consultorios, setConsultorios] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingConsultorio, setEditingConsultorio] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    ubicacion: '',
    piso: '',
    doctor_id: '',
  });

  useEffect(() => {
    loadConsultorios();
    loadDoctores();
  }, []);

  const loadConsultorios = async () => {
    try {
      setLoading(true);
      const response = await ConsultoriosService.getConsultorios();
      setConsultorios(response.consultorios || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los consultorios');
    } finally {
      setLoading(false);
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

  const handleCreate = () => {
    setEditingConsultorio(null);
    setFormData({
      codigo: '',
      ubicacion: '',
      piso: '',
      doctor_id: '',
    });
    setModalVisible(true);
  };

  const handleEdit = (consultorio) => {
    setEditingConsultorio(consultorio);
    setFormData({
      codigo: consultorio.codigo,
      ubicacion: consultorio.ubicacion,
      piso: consultorio.piso?.toString() || '',
      doctor_id: consultorio.doctor_id?.toString() || '',
    });
    setModalVisible(true);
  };

  const handleDelete = (consultorio) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar el consultorio ${consultorio.codigo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await ConsultoriosService.deleteConsultorio(consultorio.id);
              loadConsultorios();
              Alert.alert('Éxito', 'Consultorio eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el consultorio');
            }
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!formData.codigo.trim() || !formData.ubicacion.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        piso: parseInt(formData.piso) || null,
        doctor_id: formData.doctor_id ? parseInt(formData.doctor_id) : null,
      };

      if (editingConsultorio) {
        await ConsultoriosService.updateConsultorio(editingConsultorio.id, dataToSend);
        Alert.alert('Éxito', 'Consultorio actualizado correctamente');
      } else {
        await ConsultoriosService.createConsultorio(dataToSend);
        Alert.alert('Éxito', 'Consultorio creado correctamente');
      }
      setModalVisible(false);
      loadConsultorios();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error al guardar el consultorio');
    }
  };

  const getDoctorName = (id) => {
    const doctor = doctores.find(d => d.id === id);
    return doctor ? `Dr. ${doctor.nombres} ${doctor.apellidos}` : 'Sin asignar';
  };

  const renderConsultorio = ({ item }) => (
    <View style={styles.consultorioCard}>
      <View style={styles.consultorioInfo}>
        <Text style={styles.consultorioCodigo}>{item.codigo}</Text>
        <Text style={styles.consultorioUbicacion}>{item.ubicacion}</Text>
        <Text style={styles.consultorioPiso}>Piso: {item.piso || 'N/A'}</Text>
        <Text style={styles.consultorioDoctor}>
          {getDoctorName(item.doctor_id)}
        </Text>
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
        <Text>Cargando consultorios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Consultorios</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Nuevo Consultorio</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={consultorios}
        renderItem={renderConsultorio}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No hay consultorios registrados</Text>
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
              {editingConsultorio ? 'Editar Consultorio' : 'Nuevo Consultorio'}
            </Text>

            <ScrollView style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Código del consultorio *"
                value={formData.codigo}
                onChangeText={(text) => setFormData({ ...formData, codigo: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Ubicación *"
                value={formData.ubicacion}
                onChangeText={(text) => setFormData({ ...formData, ubicacion: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Piso"
                value={formData.piso}
                onChangeText={(text) => setFormData({ ...formData, piso: text })}
                keyboardType="numeric"
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Doctor asignado (opcional):</Text>
                <Picker
                  selectedValue={formData.doctor_id}
                  onValueChange={(value) => setFormData({ ...formData, doctor_id: value })}
                  style={styles.picker}
                >
                  <Picker.Item label="Sin asignar" value="" />
                  {doctores.map((doctor) => (
                    <Picker.Item
                      key={doctor.id}
                      label={`Dr. ${doctor.nombres} ${doctor.apellidos}`}
                      value={doctor.id.toString()}
                    />
                  ))}
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
                  {editingConsultorio ? 'Actualizar' : 'Crear'}
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
  list: {
    padding: 10,
  },
  consultorioCard: {
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
  consultorioInfo: {
    flex: 1,
  },
  consultorioCodigo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  consultorioUbicacion: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  consultorioPiso: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  consultorioDoctor: {
    fontSize: 14,
    color: '#0c82ea',
    fontWeight: '500',
    marginTop: 4,
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
