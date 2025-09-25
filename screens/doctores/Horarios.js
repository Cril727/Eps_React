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
import { getUserInfo } from '../../Src/Services/AuthService';

export default function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [formData, setFormData] = useState({
    horaInicio: '08:00',
    horaFin: '17:00',
    estado: 'Activo',
  });

  useEffect(() => {
    const initializeScreen = async () => {
      const userInfo = await getUserInfo();
      setUserRole(userInfo?.role);

      if (userInfo?.role === 'doctor') {
        loadMisHorarios();
      }
    };

    initializeScreen();
  }, []);

  const loadMisHorarios = async () => {
    try {
      setLoading(true);
      const response = await DoctoresService.getMisHorarios();
      setHorarios(response.horarios || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los horarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingHorario(null);
    setFormData({
      horaInicio: '08:00',
      horaFin: '17:00',
      estado: 'Activo',
    });
    setModalVisible(true);
  };

  const handleEdit = (horario) => {
    setEditingHorario(horario);
    setFormData({
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      estado: horario.estado,
    });
    setModalVisible(true);
  };

  const handleDelete = (horario) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar este horario (${horario.horaInicio} - ${horario.horaFin})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await DoctoresService.deleteHorario(horario.id);
              loadMisHorarios();
              Alert.alert('Éxito', 'Horario eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el horario');
            }
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!formData.horaInicio || !formData.horaFin) {
      Alert.alert('Error', 'Por favor completa las horas de inicio y fin');
      return;
    }

    try {
      const userInfo = await getUserInfo();
      const dataToSend = { ...formData, doctor_id: userInfo.id };

      if (editingHorario) {
        await DoctoresService.updateHorario(editingHorario.id, dataToSend);
        Alert.alert('Éxito', 'Horario actualizado correctamente');
      } else {
        await DoctoresService.createHorario(dataToSend);
        Alert.alert('Éxito', 'Horario creado correctamente');
      }
      setModalVisible(false);
      loadMisHorarios();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error al guardar el horario');
    }
  };

  const renderHorario = ({ item }) => (
    <View style={styles.horarioCard}>
      <View style={styles.horarioInfo}>
        <Text style={styles.horarioTime}>
          {item.horaInicio} - {item.horaFin}
        </Text>
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
        <Text>Cargando horarios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Horarios</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Nuevo Horario</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={horarios}
        renderItem={renderHorario}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No tienes horarios configurados</Text>
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
              {editingHorario ? 'Editar Horario' : 'Nuevo Horario'}
            </Text>

            <ScrollView style={styles.form}>
               <Text style={styles.inputLabel}>Hora de Inicio</Text>
               <View style={styles.timePickerContainer}>
                 <View style={styles.timePicker}>
                   <Text style={styles.timePickerLabel}>Hora</Text>
                   <Picker
                     selectedValue={formData.horaInicio.split(':')[0]}
                     onValueChange={(value) => {
                       const minutes = formData.horaInicio.split(':')[1] || '00';
                       setFormData({ ...formData, horaInicio: `${value}:${minutes}` });
                     }}
                     style={styles.picker}
                   >
                     {Array.from({ length: 24 }, (_, i) => (
                       <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i.toString().padStart(2, '0')} />
                     ))}
                   </Picker>
                 </View>
                 <View style={styles.timePicker}>
                   <Text style={styles.timePickerLabel}>Minutos</Text>
                   <Picker
                     selectedValue={formData.horaInicio.split(':')[1] || '00'}
                     onValueChange={(value) => {
                       const hours = formData.horaInicio.split(':')[0];
                       setFormData({ ...formData, horaInicio: `${hours}:${value}` });
                     }}
                     style={styles.picker}
                   >
                     {Array.from({ length: 60 }, (_, i) => (
                       <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i.toString().padStart(2, '0')} />
                     ))}
                   </Picker>
                 </View>
               </View>
               <Text style={styles.timeDisplay}>Hora seleccionada: {formData.horaInicio}</Text>

               <Text style={styles.inputLabel}>Hora de Fin</Text>
               <View style={styles.timePickerContainer}>
                 <View style={styles.timePicker}>
                   <Text style={styles.timePickerLabel}>Hora</Text>
                   <Picker
                     selectedValue={formData.horaFin.split(':')[0]}
                     onValueChange={(value) => {
                       const minutes = formData.horaFin.split(':')[1] || '00';
                       setFormData({ ...formData, horaFin: `${value}:${minutes}` });
                     }}
                     style={styles.picker}
                   >
                     {Array.from({ length: 24 }, (_, i) => (
                       <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i.toString().padStart(2, '0')} />
                     ))}
                   </Picker>
                 </View>
                 <View style={styles.timePicker}>
                   <Text style={styles.timePickerLabel}>Minutos</Text>
                   <Picker
                     selectedValue={formData.horaFin.split(':')[1] || '00'}
                     onValueChange={(value) => {
                       const hours = formData.horaFin.split(':')[0];
                       setFormData({ ...formData, horaFin: `${hours}:${value}` });
                     }}
                     style={styles.picker}
                   >
                     {Array.from({ length: 60 }, (_, i) => (
                       <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i.toString().padStart(2, '0')} />
                     ))}
                   </Picker>
                 </View>
               </View>
               <Text style={styles.timeDisplay}>Hora seleccionada: {formData.horaFin}</Text>

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Estado:</Text>
                <View style={styles.statusOptions}>
                  <TouchableOpacity
                    style={[
                      styles.statusOption,
                      formData.estado === 'Activo' && styles.selectedStatus,
                    ]}
                    onPress={() => setFormData({ ...formData, estado: 'Activo' })}
                  >
                    <Text style={formData.estado === 'Activo' ? styles.selectedStatusText : styles.statusText}>
                      Activo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusOption,
                      formData.estado === 'Inactivo' && styles.selectedStatus,
                    ]}
                    onPress={() => setFormData({ ...formData, estado: 'Inactivo' })}
                  >
                    <Text style={formData.estado === 'Inactivo' ? styles.selectedStatusText : styles.statusText}>
                      Inactivo
                    </Text>
                  </TouchableOpacity>
                </View>
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
                  {editingHorario ? 'Actualizar' : 'Crear'}
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
  horarioCard: {
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
  horarioInfo: {
    flex: 1,
  },
  horarioTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  statusOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusOption: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedStatus: {
    backgroundColor: '#0c82ea',
    borderColor: '#0c82ea',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  selectedStatusText: {
    color: 'white',
    fontWeight: 'bold',
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
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timePicker: {
    flex: 1,
    marginHorizontal: 5,
  },
  timePickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
    textAlign: 'center',
  },
  timeDisplay: {
    fontSize: 14,
    color: '#0c82ea',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    height: 40,
  },
});