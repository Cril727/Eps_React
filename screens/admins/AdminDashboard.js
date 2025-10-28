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
import { useTheme } from '../../Src/Services/ThemeContext';

export default function AdminDashboard({ navigation }) {
  const { theme } = useTheme();
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
      color: theme.isDarkMode ? '#2d3748' : '#fde78dff',
      iconColor: theme.isDarkMode ? '#fbbf24' : '#f59e0b',
      screen: 'Especialidades',
    },
    {
      title: 'Doctores',
      count: counts.doctores,
      icon: 'person',
      color: theme.isDarkMode ? '#1a365d' : '#a9f1ccff',
      iconColor: theme.isDarkMode ? '#38b2ac' : '#10b981',
      screen: 'Doctores',
    },
    {
      title: 'Pacientes',
      count: counts.pacientes,
      icon: 'people',
      color: theme.isDarkMode ? '#2b6cb0' : '#82b6fbff',
      iconColor: theme.isDarkMode ? '#63b3ed' : '#3b82f6',
      screen: 'Pacientes',
    },
    {
      title: 'Citas',
      count: counts.citas,
      icon: 'calendar',
      color: theme.isDarkMode ? '#742a2a' : '#fabddfff',
      iconColor: theme.isDarkMode ? '#fc8181' : '#ef4444',
      screen: 'Citas',
    },
    {
      title: 'Consultorios',
      count: counts.consultorios,
      icon: 'business',
      color: theme.isDarkMode ? '#553c9a' : '#d3affaff',
      iconColor: theme.isDarkMode ? '#a78bfa' : '#8b5cf6',
      screen: 'Consultorios',
    },
  ];

  const handleNavigate = (screenName) => {
    navigation.navigate(screenName);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Cargando dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} tintColor={theme.colors.primary} />
      }
    >
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.title}>Panel de Administración</Text>
        <Text style={[styles.subtitle, { color: theme.colors.surface }]}>Sistema Médico EPS</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Estadísticas Generales</Text>
        <View style={styles.cardsGrid}>
          {dashboardCards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.statCard, { backgroundColor: card.color, shadowColor: theme.colors.shadow }]}
              onPress={() => handleNavigate(card.screen)}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name={card.icon} size={32} color={card.iconColor} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.cardCount, { color: theme.colors.text }]}>{card.count}</Text>
                  <Text style={[styles.cardTitle, { color: theme.colors.textSecondary }]}>{card.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Acciones Rápidas</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => handleNavigate('Usuarios')}
          >
            <Ionicons name="people-circle" size={20} color="white" />
            <Text style={styles.actionButtonText}>Gestionar Usuarios</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary }]}
            onPress={() => handleNavigate('Citas')}
          >
            <Ionicons name="add-circle" size={20} color={theme.colors.primary} />
            <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>Nueva Cita</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
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
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  cardsGrid: {
  },
  statCard: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 15,
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
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 14,
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
    borderWidth: 1,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    fontWeight: '600',
    marginLeft: 8,
  },
});