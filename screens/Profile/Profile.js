import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logout, getUserInfo } from '../../Src/Services/AuthService';
import { DeviceEventEmitter } from 'react-native';
import { useTheme } from '../../Src/Services/ThemeContext';

export default function Profile({ navigation }) {
  const { theme } = useTheme();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    initializeProfile();

    // Listen for profile updates
    const subscription = DeviceEventEmitter.addListener('tokenUpdated', () => {
      initializeProfile();
    });

    return () => subscription.remove();
  }, []);

  const initializeProfile = async () => {
    const userInfo = await getUserInfo();
    if (userInfo && userInfo.role) {
      setUserRole(userInfo.role);
      setUserProfile(userInfo);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };


  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (result.success) {
            } else {
              Alert.alert('Error', result.message);
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { userProfile, userRole });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={100} color="#0c82eaff" />
        </View>
        <Text style={[styles.name, { color: theme.colors.text }]}>
          {userProfile?.nombres} {userProfile?.apellidos}
        </Text>
        <Text style={styles.role}>
          {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
        </Text>
      </View>

      <View style={[styles.infoContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.infoItem}>
          <Ionicons name="mail" size={20} color={theme.colors.textSecondary} />
          <View style={styles.infoText}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Email</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{userProfile?.email}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="call" size={20} color={theme.colors.textSecondary} />
          <View style={styles.infoText}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Teléfono</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{userProfile?.telefono}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="person" size={20} color={theme.colors.textSecondary} />
          <View style={styles.infoText}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Rol</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Ionicons name="create" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Configuracion')}>
          <Ionicons name="settings" size={20} color="#fff" />
          <Text style={styles.settingsButtonText}>Configuración</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: '#0c82eaff',
    fontWeight: '500',
  },
  infoContainer: {
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
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
  actionsContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  editButton: {
    backgroundColor: '#0c82eaff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  settingsButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});