import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserInfo } from '../../Src/Services/AuthService';
import EspecialidadesService from '../../Src/Services/EspecialidadesService';
import DoctoresService from '../../Src/Services/DoctoresService';
import PacientesService from '../../Src/Services/PacientesService';
import ConsultoriosService from '../../Src/Services/ConsultoriosService';
import CitasService from '../../Src/Services/CitasService';

export default function AdminDashboard({ navigation }) {
  const [counts, setCounts] = useState({
    especialidades: 0,
    doctores: 0,
    pacientes: 0,
    citas: 0,
    consultorios: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load all counts in parallel
      const [
        especialidadesRes,
        doctoresRes,
        pacientesRes,
        citasRes,
        consultoriosRes,
      ] = await Promise.all([
        EspecialidadesService.getEspecialidades(),
        DoctoresService.getDoctores(),
        PacientesService.getPacientes(),
        CitasService.getCitas(),
        ConsultoriosService.getConsultorios(),
      ]);

      setCounts({
        especialidades: especialidadesRes.especialidad?.length || 0,
        doctores: doctoresRes.doctores?.length || 0,
        pacientes: pacientesRes.pacientes?.length || 0,
        citas: citasRes.citasMedicas?.length || 0,
        consultorios: consultoriosRes.consultorios?.length || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const dashboardCards = [
    {
      title: 'Especialidades',
      count: counts.especialidades,
      icon: 'star',
      color: '#fde78dff', // Pastel yellow
      iconColor: '#f59e0b', // Darker yellow for icon
      screen: 'Especialidades',
    },
    {
      title: 'Doctores',
      count: counts.doctores,
      icon: 'person',
      color: '#a9f1ccff', // Pastel green
      iconColor: '#10b981', // Darker green for icon
      screen: 'Doctores',
    },
    {
      title: 'Pacientes',
      count: counts.pacientes,
      icon: 'people',
      color: '#82b6fbff', // Pastel blue
      iconColor: '#3b82f6', // Darker blue for icon
      screen: 'Pacientes',
    },
    {
      title: 'Citas',
      count: counts.citas,
      icon: 'calendar',
      color: '#fabddfff', // Pastel pink/red
      iconColor: '#ef4444', // Darker red for icon
      screen: 'Citas',
    },
    {
      title: 'Consultorios',
      count: counts.consultorios,
      icon: 'business',
      color: '#d3affaff', // Pastel purple
      iconColor: '#8b5cf6', // Darker purple for icon
      screen: 'Consultorios',
    },
  ];

  const handleNavigate = (screenName) => {
    navigation.navigate(screenName);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Administración</Text>
        <Text style={styles.subtitle}>Sistema Médico EPS</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Estadísticas Generales</Text>
        <View style={styles.cardsGrid}>
          {dashboardCards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.statCard, { backgroundColor: card.color }]}
              onPress={() => handleNavigate(card.screen)}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name={card.icon} size={32} color={card.iconColor} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.cardCount}>{card.count}</Text>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => handleNavigate('Usuarios')}
          >
            <Ionicons name="people-circle" size={20} color="white" />
            <Text style={styles.actionButtonText}>Gestionar Usuarios</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => handleNavigate('Citas')}
          >
            <Ionicons name="add-circle" size={20} color="#0c82ea" />
            <Text style={styles.secondaryButtonText}>Nueva Cita</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#0c82ea',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#e3f2fd',
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  cardsGrid: {
    // Changed to vertical list layout
  },
  statCard: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  cardCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  quickActions: {
    padding: 20,
    paddingTop: 0,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#0c82ea',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#0c82ea',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#0c82ea',
    fontWeight: '600',
    marginLeft: 8,
  },
});