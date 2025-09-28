import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TextInputComponent from '../../components/TextInputComponent';
import { getUserInfo } from '../../Src/Services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';

export default function EditProfile({ navigation, route }) {
  // ✅ Evita crash si no llegan params
  const { userProfile, userRole } = route?.params ?? {};

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombres: userProfile?.nombres || '',
    apellidos: userProfile?.apellidos || '',
    telefono: userProfile?.telefono || '',
    email: userProfile?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Limpia el error del campo cuando el usuario escribe
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombres.trim()) {
      newErrors.nombres = 'El nombre es requerido';
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const currentUserInfo = await getUserInfo();

      if (!currentUserInfo) {
        Alert.alert('Error', 'No se pudo obtener la información del usuario');
        return;
      }

      const updatedUserInfo = {
        ...currentUserInfo,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
        email: formData.email,
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      DeviceEventEmitter.emit('tokenUpdated');

      Alert.alert('Éxito', 'Perfil actualizado correctamente');

      //  delay para evitar warnings
      setTimeout(() => {
        if (isMountedRef.current) navigation.goBack();
      }, 100);

    } catch (error) {
      if (isMountedRef.current) {
        Alert.alert('Error', 'Error al actualizar el perfil');
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  //Fallback seguro para el rol
  const roleLabelRaw = (userRole ?? 'usuario') + '';
  const roleLabel =
    roleLabelRaw.charAt(0).toUpperCase() + roleLabelRaw.slice(1);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={80} color="#0c82eaff" />
        <Text style={styles.title}>Editar Perfil</Text>
        <Text style={styles.subtitle}>Actualiza tu información personal</Text>
      </View>

      <View style={styles.form}>
        <TextInputComponent
          placeholder="Nombres"
          value={formData.nombres}
          onChangeText={(value) => handleInputChange('nombres', value)}
          error={errors.nombres}
          leftIcon="person"
        />

        <TextInputComponent
          placeholder="Apellidos"
          value={formData.apellidos}
          onChangeText={(value) => handleInputChange('apellidos', value)}
          error={errors.apellidos}
          leftIcon="person"
        />

        <TextInputComponent
          placeholder="Teléfono"
          value={formData.telefono}
          onChangeText={(value) => handleInputChange('telefono', value)}
          error={errors.telefono}
          leftIcon="call"
          keyboardType="phone-pad"
        />

        <TextInputComponent
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          error={errors.email}
          leftIcon="mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Rol:</Text>
          <Text style={styles.roleValue}>{roleLabel}</Text>
        </View>

        <View style={styles.passwordSection}>
          <Text style={styles.sectionTitle}>Cambiar Contraseña (Opcional)</Text>

          <TextInputComponent
            placeholder="Nueva contraseña"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            error={errors.password}
            leftIcon="lock-closed"
            secureTextEntry
          />

          <TextInputComponent
            placeholder="Confirmar nueva contraseña"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            error={errors.confirmPassword}
            leftIcon="lock-closed"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  roleContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  roleValue: {
    fontSize: 18,
    color: '#0c82eaff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roleNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  passwordSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#0c82eaff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
