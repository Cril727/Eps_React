import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../Src/Services/ThemeContext';

const AppointmentCard = ({
  item,
  userRole,
  onApprove,
  onReject,
  formatDateTime
}) => {
  const { theme } = useTheme();

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Programada':
        return '#ffc107';
      case 'Completada':
        return '#28a745';
      case 'Rechazada':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <View style={[styles.citaCard, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow }]}>
      <View style={styles.citaHeader}>
        {userRole === 'doctor' ? (
          <Text style={[styles.doctorName, { color: theme.colors.text }]}>
            Paciente: {item.paciente?.nombres} {item.paciente?.apellidos}
          </Text>
        ) : (
          <Text style={[styles.doctorName, { color: theme.colors.text }]}>
            Dr. {item.doctor?.nombres} {item.doctor?.apellidos}
          </Text>
        )}
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado) }]}
        >
          <Text style={styles.statusText}>{item.estado}</Text>
        </View>
      </View>

      {userRole !== 'doctor' && (
        <Text style={styles.especialidadText}>
          {item.doctor?.especialidad?.especialidad}
        </Text>
      )}

      <Text style={[styles.fechaText, { color: theme.colors.textSecondary }]}>{formatDateTime(item.fechaHora)}</Text>

      <Text style={[styles.consultorioText, { color: theme.colors.textSecondary }]}>
        Consultorio: {item.consultorio?.codigo} - {item.consultorio?.ubicacion}
      </Text>

      {!!item.novedad && <Text style={[styles.novedadText, { color: theme.colors.textSecondary }]}>Nota: {item.novedad}</Text>}

      {userRole === 'doctor' && item.estado === 'Programada' && (
        <View style={styles.doctorActions}>
          <TouchableOpacity
            style={[styles.doctorActionButton, styles.approveButton]}
            onPress={() => onApprove(item.id)}
          >
            <Ionicons name="checkmark" size={16} color="white" />
            <Text style={styles.doctorActionText}>Aprobar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.doctorActionButton, styles.rejectButton]}
            onPress={() => onReject(item.id)}
          >
            <Ionicons name="close" size={16} color="white" />
            <Text style={styles.doctorActionText}>Rechazar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  citaCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  doctorName: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  especialidadText: { fontSize: 14, color: '#0c82ea', fontWeight: '500', marginBottom: 4 },
  fechaText: { fontSize: 14, marginBottom: 4 },
  consultorioText: { fontSize: 14, marginBottom: 4 },
  novedadText: { fontSize: 14, fontStyle: 'italic' },
  doctorActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  doctorActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  approveButton: { backgroundColor: '#28a745' },
  rejectButton: { backgroundColor: '#dc3545' },
  doctorActionText: { color: 'white', fontWeight: 'bold', marginLeft: 5 },
});

export default AppointmentCard;