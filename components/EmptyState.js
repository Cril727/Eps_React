import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EmptyState = ({
  icon = 'document-outline',
  title = 'No hay datos',
  message = 'No se encontraron elementos para mostrar.',
  iconSize = 64,
  iconColor = '#ccc'
}) => {
  return (
    <View style={styles.center}>
      <Ionicons name={icon} size={iconSize} color={iconColor} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default EmptyState;