import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DoctoresService from '../../Src/Services/DoctoresService';
import { getUserInfo } from '../../Src/Services/AuthService';
import { useTheme } from '../../Src/Services/ThemeContext';

export default function MiConsultorio() {
  const { theme } = useTheme();
  const [consultorio, setConsultorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const initializeScreen = async () => {
      const userInfo = await getUserInfo();
      setUserRole(userInfo?.role);

      if (userInfo?.role === 'doctor') {
        loadMiConsultorio();
      }
    };

    initializeScreen();
  }, []);

  const loadMiConsultorio = async () => {
    try {
      setLoading(true);
      const response = await DoctoresService.getMiConsultorio();
      setConsultorio(response.consultorio);
    } catch (error) {
      if (error.response?.status === 404) {
        setConsultorio(null); // No consultorio
      } else {
        Alert.alert('Error', 'No se pudo cargar la información del consultorio');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Cargando información del consultorio...</Text>
      </View>
    );
  }

  if (!consultorio) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.textSecondary }}>No tienes un consultorio asignado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name="business" size={60} color="#0c82eaff" />
        <Text style={[styles.title, { color: theme.colors.text }]}>Mi Consultorio</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Información de tu espacio de trabajo</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow }]}>
          <View style={styles.infoItem}>
            <Ionicons name="key" size={24} color="#0c82ea" />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Código</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{consultorio.codigo}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="location" size={24} color="#0c82ea" />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Ubicación</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{consultorio.ubicacion}</Text>
            </View>
          </View>

          {consultorio.piso && (
            <View style={styles.infoItem}>
              <Ionicons name="layers" size={24} color="#0c82ea" />
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Piso</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{consultorio.piso}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity style={[styles.refreshButton, { backgroundColor: theme.colors.primary }]} onPress={loadMiConsultorio}>
        <Ionicons name="refresh" size={20} color="#fff" />
        <Text style={styles.refreshButtonText}>Actualizar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  infoCard: {
    borderRadius: 10,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  infoText: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});