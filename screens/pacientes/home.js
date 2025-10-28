import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserInfo } from '../../Src/Services/AuthService';
import { useTheme } from '../../Src/Services/ThemeContext';

export default function Home({ navigation }) {
  const { theme } = useTheme();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const userInfo = await getUserInfo();
        setUserRole(userInfo?.role);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    loadUserRole();
  }, []);

  const getMenuItems = () => {
    if (userRole === 'doctor') {
      return [
        { title: 'Mis Citas', subtitle: 'Ver y gestionar citas', icon: 'calendar', screen: 'MisCitas', color: theme.isDarkMode ? '#4ade80' : '#00796b' },
        { title: 'Mi Perfil', subtitle: 'Ver y editar información', icon: 'person', screen: 'Perfil', color: theme.isDarkMode ? '#94a3b8' : '#455a64' },
        { title: 'Mis Horarios', subtitle: 'Gestionar horarios de atención', icon: 'time', screen: 'Horarios', color: theme.isDarkMode ? '#fbbf24' : '#f59e0b' },
        { title: 'Mi Consultorio', subtitle: 'Información de mi espacio', icon: 'business', screen: 'MiConsultorio', color: theme.isDarkMode ? '#a78bfa' : '#7c3aed' },
      ];
    }
    return [
      { title: 'Mis Citas', subtitle: 'Ver y gestionar citas', icon: 'calendar', screen: 'MisCitas', color: theme.isDarkMode ? '#60a5fa' : '#1976d2' },
      { title: 'Mi Perfil', subtitle: 'Ver y editar información', icon: 'person', screen: 'Perfil', color: theme.isDarkMode ? '#4ade80' : '#388e3c' },
    ];
  };

  const menuItems = useMemo(() => getMenuItems(), [userRole]);
  const handleNavigate = (screenName) => navigation.navigate(screenName);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Cargando...</Text>
      </View>
    );
  }

  const getTitle = () => (userRole === 'doctor' ? 'Panel de Doctor' : userRole === 'admin' ? 'Panel Administrativo' : 'Sistema Médico');
  const getSubtitle = () => (userRole === 'doctor' ? 'Bienvenido a tu panel de control médico' : userRole === 'admin' ? 'Gestión del sistema médico' : 'Bienvenido a tu panel de control');

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.menuCard, { borderLeftColor: item.color, backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow }]}
      onPress={() => handleNavigate(item.screen)}
    >
      <View style={styles.menuContent}>
        <Ionicons name={item.icon} size={40} color={item.color} />
        <View style={styles.menuText}>
          <Text style={[styles.menuTitle, { color: theme.colors.text }]}>{item.title}</Text>
          <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>{item.subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={menuItems}
      keyExtractor={(_, i) => String(i)}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 24, backgroundColor: theme.colors.background }}
      style={{ backgroundColor: theme.colors.background }}
      ListHeaderComponent={
        <>
          <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.title}>{getTitle()}</Text>
            <Text style={[styles.subtitle, { color: theme.colors.surface }]}>{getSubtitle()}</Text>
          </View>
          <View style={styles.menuContainer} />
        </>
      }
      ListFooterComponent={
        <View style={[styles.tipsContainer, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow }]}>
          <Ionicons name="medkit" size={32} color={theme.isDarkMode ? '#ef4444' : '#d32f2f'} style={{ marginBottom: 10 }} />
          <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>Tips de Salud</Text>
          <Text style={[styles.tipsText, { color: theme.colors.textSecondary }]}>
            • Mantente hidratado durante el día{'\n'}
            • Realiza al menos 30 minutos de ejercicio diario{'\n'}
            • No olvides tus chequeos médicos periódicos
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, paddingTop: 40, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  subtitle: { fontSize: 16 },
  menuContainer: { paddingHorizontal: 20, paddingTop: 20 },
  menuCard: {
    borderRadius: 10, padding: 20, marginHorizontal: 20, marginBottom: 15,
    flexDirection: 'row', alignItems: 'center', borderLeftWidth: 5,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  menuContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  menuText: { marginLeft: 15, flex: 1 },
  menuTitle: { fontSize: 18, fontWeight: '600', marginBottom: 2 },
  menuSubtitle: { fontSize: 14 },
  tipsContainer: {
    margin: 20, padding: 20, borderRadius: 10,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
    alignItems: 'center'
  },
  tipsTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  tipsText: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
});
