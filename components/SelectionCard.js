import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SelectionCard = ({
  item,
  isSelected,
  onPress,
  title,
  subtitle,
  showEstado = false
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.optionCard,
        isSelected && styles.selectedOption,
      ]}
      onPress={() => onPress(item)}
    >
      <Text style={styles.optionTitle}>
        {title}
      </Text>
      <Text style={styles.optionSubtitle}>
        {subtitle}
        {showEstado && item.estado && ` - Estado: ${item.estado}`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  selectedOption: { backgroundColor: '#e3f2fd', borderColor: '#0c82ea' },
  optionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  optionSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
});

export default SelectionCard;