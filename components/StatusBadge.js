import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusBadge = ({ status, type = 'default' }) => {
  const getStatusConfig = (status, type) => {
    const statusLower = status?.toLowerCase();

    switch (type) {
      case 'appointment':
        switch (statusLower) {
          case 'programada':
            return { backgroundColor: '#ffc107', text: 'Programada' };
          case 'completada':
            return { backgroundColor: '#28a745', text: 'Completada' };
          case 'rechazada':
            return { backgroundColor: '#dc3545', text: 'Rechazada' };
          default:
            return { backgroundColor: '#6c757d', text: status || 'Desconocido' };
        }

      case 'user':
        switch (statusLower) {
          case 'admin':
            return { backgroundColor: '#dc3545', text: 'Admin' };
          case 'doctor':
            return { backgroundColor: '#0c82ea', text: 'Doctor' };
          case 'paciente':
            return { backgroundColor: '#28a745', text: 'Paciente' };
          default:
            return { backgroundColor: '#6c757d', text: 'Sin rol' };
        }

      case 'active':
        switch (statusLower) {
          case 'activo':
            return { backgroundColor: '#28a745', text: 'Activo' };
          case 'inactivo':
            return { backgroundColor: '#dc3545', text: 'Inactivo' };
          default:
            return { backgroundColor: '#6c757d', text: status || 'Desconocido' };
        }

      default:
        return { backgroundColor: '#6c757d', text: status || 'Desconocido' };
    }
  };

  const config = getStatusConfig(status, type);

  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
      <Text style={styles.text}>{config.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default StatusBadge;