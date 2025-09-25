import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserInfo } from '../../Src/Services/AuthService';

export default function Home({ navigation }) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const userInfo = await getUserInfo();
        setUserRole(userInfo?.role);
      } catch (error) {
        console.error('Error loading user role:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserRole();
  }, []);

  const getMenuItems = () => {
    if (userRole === 'doctor') {
      return [
        {
          title: 'Mis Citas',
          subtitle: 'Ver y gestionar citas',
          icon: 'calendar',
          screen: 'MisCitas',
          color: '#0c82ea'
        },
        {
          title: 'Mi Consultorio',
          subtitle: 'Ver información de consultorio',
          icon: 'business',
          screen: 'MiConsultorio',
          color: '#28a745'
        },
        {
          title: 'Mi Perfil',
          subtitle: 'Ver y editar información',
          icon: 'person',
          screen: 'Perfil',
          color: '#6c757d'
        },
      ];
    } else {
      // Default patient menu
      return [
        {
          title: 'Mis Citas',
          subtitle: 'Ver y gestionar citas',
          icon: 'calendar',
          screen: 'MisCitas',
          color: '#0c82ea'
        },
        {
          title: 'Mi Perfil',
          subtitle: 'Ver y editar información',
          icon: 'person',
          screen: 'Perfil',
          color: '#28a745'
        },
      ];
    }
  };

  const menuItems = getMenuItems();

  const handleNavigate = (screenName) => {
    navigation.navigate(screenName);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const getTitle = () => {
    switch (userRole) {
      case 'doctor':
        return 'Panel de Doctor';
      case 'admin':
        return 'Panel Administrativo';
      default:
        return 'Sistema Médico';
    }
  };

  const getSubtitle = () => {
    switch (userRole) {
      case 'doctor':
        return 'Bienvenido a tu panel de control médico';
      case 'admin':
        return 'Gestión del sistema médico';
      default:
        return 'Bienvenido a tu panel de control';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getTitle()}</Text>
        <Text style={styles.subtitle}>{getSubtitle()}</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuCard, { borderLeftColor: item.color }]}
            onPress={() => handleNavigate(item.screen)}
          >
            <View style={styles.menuContent}>
              <Ionicons name={item.icon} size={40} color={item.color} />
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Información Importante</Text>
        <Text style={styles.infoText}>
          • Recuerda confirmar tus citas con anticipación{'\n'}
          • Puedes reprogramar citas desde la sección "Mis Citas"{'\n'}
          • Mantén tu perfil actualizado para una mejor atención
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
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
  menuContainer: {
    padding: 20,
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    marginLeft: 15,
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
