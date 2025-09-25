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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EspecialidadesService from '../../Src/Services/EspecialidadesService';

export default function Especialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEspecialidad, setEditingEspecialidad] = useState(null);
  const [especialidad, setEspecialidad] = useState('');

  useEffect(() => {
    loadEspecialidades();
  }, []);

  const loadEspecialidades = async () => {
    try {
      setLoading(true);
      const response = await EspecialidadesService.getEspecialidades();
      setEspecialidades(response.especialidad || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las especialidades');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingEspecialidad(null);
    setEspecialidad('');
    setModalVisible(true);
  };

  const handleEdit = (item) => {
    setEditingEspecialidad(item);
    setEspecialidad(item.especialidad);
    setModalVisible(true);
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar la especialidad "${item.especialidad}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await EspecialidadesService.deleteEspecialidad(item.id);
              loadEspecialidades();
              Alert.alert('Éxito', 'Especialidad eliminada correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la especialidad');
            }
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!especialidad.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre de la especialidad');
      return;
    }

    try {
      if (editingEspecialidad) {
        await EspecialidadesService.updateEspecialidad(editingEspecialidad.id, {
          especialidad: especialidad.trim(),
        });
        Alert.alert('Éxito', 'Especialidad actualizada correctamente');
      } else {
        await EspecialidadesService.createEspecialidad({
          especialidad: especialidad.trim(),
        });
        Alert.alert('Éxito', 'Especialidad creada correctamente');
      }
      setModalVisible(false);
      loadEspecialidades();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error al guardar la especialidad');
    }
  };

  const renderEspecialidad = ({ item }) => (
    <View style={styles.especialidadCard}>
      <View style={styles.especialidadInfo}>
        <Text style={styles.especialidadName}>{item.especialidad}</Text>
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
        <Text>Cargando especialidades...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Especialidades</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Nueva Especialidad</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={especialidades}
        renderItem={renderEspecialidad}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No hay especialidades registradas</Text>
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
              {editingEspecialidad ? 'Editar Especialidad' : 'Nueva Especialidad'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre de la especialidad"
              value={especialidad}
              onChangeText={setEspecialidad}
              autoCapitalize="words"
            />

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
                  {editingEspecialidad ? 'Actualizar' : 'Crear'}
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
  especialidadCard: {
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
  especialidadInfo: {
    flex: 1,
  },
  especialidadName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
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