import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
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
      } finally {
        setLoading(false);
      }
    };
    loadUserRole();
  }, []);

  const getMenuItems = () => {
    if (userRole === 'doctor') {
      return [
        { title: 'Mis Citas', subtitle: 'Ver y gestionar citas', icon: 'calendar', screen: 'MisCitas', color: '#00796b' },
        { title: 'Mi Perfil', subtitle: 'Ver y editar información', icon: 'person', screen: 'Perfil', color: '#455a64' },
      ];
    }
    return [
      { title: 'Mis Citas', subtitle: 'Ver y gestionar citas', icon: 'calendar', screen: 'MisCitas', color: '#1976d2' },
      { title: 'Mi Perfil', subtitle: 'Ver y editar información', icon: 'person', screen: 'Perfil', color: '#388e3c' },
    ];
  };

  const menuItems = useMemo(() => getMenuItems(), [userRole]);
  const handleNavigate = (screenName) => navigation.navigate(screenName);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const getTitle = () => (userRole === 'doctor' ? 'Panel de Doctor' : userRole === 'admin' ? 'Panel Administrativo' : 'Sistema Médico');
  const getSubtitle = () => (userRole === 'doctor' ? 'Bienvenido a tu panel de control médico' : userRole === 'admin' ? 'Gestión del sistema médico' : 'Bienvenido a tu panel de control');

  const renderItem = ({ item }) => (
    <TouchableOpacity
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
  );

  return (
    <FlatList
      data={menuItems}
      keyExtractor={(_, i) => String(i)}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 24 }}
      ListHeaderComponent={
        <>
          <View style={styles.header}>
            <Text style={styles.title}>{getTitle()}</Text>
            <Text style={styles.subtitle}>{getSubtitle()}</Text>
          </View>
          <View style={styles.menuContainer} />
        </>
      }
      ListFooterComponent={
        <View style={styles.tipsContainer}>
          <Ionicons name="medkit" size={32} color="#d32f2f" style={{ marginBottom: 10 }} />
          <Text style={styles.tipsTitle}>Tips de Salud</Text>
          <Text style={styles.tipsText}>
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
  container: { flex: 1, backgroundColor: '#fafafa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#1976d2', padding: 20, paddingTop: 40, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#e3f2fd' },
  menuContainer: { paddingHorizontal: 20, paddingTop: 20 },
  menuCard: {
    backgroundColor: 'white', borderRadius: 10, padding: 20, marginHorizontal: 20, marginBottom: 15,
    flexDirection: 'row', alignItems: 'center', borderLeftWidth: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  menuContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  menuText: { marginLeft: 15, flex: 1 },
  menuTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 2 },
  menuSubtitle: { fontSize: 14, color: '#666' },
  tipsContainer: {
    backgroundColor: '#fff3f3', margin: 20, padding: 20, borderRadius: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
    alignItems: 'center'
  },
  tipsTitle: { fontSize: 18, fontWeight: '700', color: '#d32f2f', marginBottom: 10 },
  tipsText: { fontSize: 14, color: '#444', lineHeight: 20, textAlign: 'center' },
});
