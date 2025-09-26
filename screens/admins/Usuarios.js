import React, { useState, useEffect, useCallback } from 'react';
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
import UserService from '../../Src/Services/UserService';
import RolesService from '../../Src/Services/RolesService';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    password: '',
    rol_id: '',
  });

  useEffect(() => {
    loadUsuarios();
    loadRoles();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUsers();
      setUsuarios(response.users || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = useCallback(async () => {
    try {
      const response = await RolesService.getRoles();
      const rolesData = response.roles || [];
      // Remove duplicates based on id
      const uniqueRoles = [...new Map(rolesData.map(rol => [rol.id, rol])).values()];
      setRoles(uniqueRoles);
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
  }, []);


  const handleCreate = () => {
    setEditingUsuario(null);
    setFormData({
      nombres: '',
      apellidos: '',
      email: '',
      telefono: '',
      password: '',
      rol_id: 1, // Admin role by default (ID 1 in database as number)
    });
    setModalVisible(true);
  };

  const handleEdit = (usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      telefono: usuario.telefono,
      password: '', // Don't show existing password
      rol_id: usuario.rol_id?.toString() || '',
    });
    setModalVisible(true);
  };

  const handleDelete = (usuario) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar a ${usuario.nombres} ${usuario.apellidos}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await UserService.deleteUser(usuario.id);
              loadUsuarios();
              Alert.alert('Éxito', 'Usuario eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el usuario');
            }
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!formData.nombres.trim() || !formData.email.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const dataToSend = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email: formData.email,
        telefono: formData.telefono,
        rol_id: parseInt(formData.rol_id),
      };

      // Only include password for new users or when explicitly set
      if (!editingUsuario && formData.password) {
        dataToSend.password = formData.password;
      } else if (editingUsuario && formData.password && formData.password.trim() !== '') {
        dataToSend.password = formData.password;
      }

      if (editingUsuario) {
        await UserService.actualizarPerfilAdmin(editingUsuario.id, dataToSend);
        Alert.alert('Éxito', 'Usuario actualizado correctamente');
      } else {
        await UserService.createUser(dataToSend);
        Alert.alert('Éxito', 'Usuario creado correctamente');
      }
      setModalVisible(false);
      loadUsuarios();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error al guardar el usuario');
    }
  };

  const getRolName = (id) => {
    const rol = roles.find(r => r.id === id);
    return rol ? rol.rol : 'Sin rol';
  };

  const renderUsuario = ({ item }) => (
    <View style={styles.usuarioCard}>
      <View style={styles.usuarioInfo}>
        <Text style={styles.usuarioName}>
          {item.nombres} {item.apellidos}
        </Text>
        <Text style={styles.usuarioEmail}>{item.email}</Text>
        <Text style={styles.usuarioPhone}>{item.telefono}</Text>
        <View style={[styles.rolBadge, getRolColor(item.rol_id)]}>
          <Text style={styles.rolText}>{getRolName(item.rol_id)}</Text>
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

  const getRolColor = (rolId) => {
    const rolName = getRolName(rolId).toLowerCase();
    switch (rolName) {
      case 'admin':
        return { backgroundColor: '#dc3545' };
      case 'doctor':
        return { backgroundColor: '#0c82ea' };
      case 'paciente':
        return { backgroundColor: '#28a745' };
      default:
        return { backgroundColor: '#6c757d' };
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando usuarios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Nuevo Usuario</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={usuarios}
        renderItem={renderUsuario}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No hay usuarios registrados</Text>
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
              {editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
            </Text>

            <ScrollView style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Nombres *"
                value={formData.nombres}
                onChangeText={(text) => setFormData({ ...formData, nombres: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Apellidos *"
                value={formData.apellidos}
                onChangeText={(text) => setFormData({ ...formData, apellidos: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email *"
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


              {!editingUsuario && (
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña *"
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry
                />
              )}
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
                  {editingUsuario ? 'Actualizar' : 'Crear'}
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
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
  usuarioCard: {
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
  usuarioInfo: {
    flex: 1,
  },
  usuarioName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  usuarioEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  usuarioPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  rolBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  rolText: {
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