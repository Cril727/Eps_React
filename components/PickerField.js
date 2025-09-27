import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PickerField = ({
  label,
  selectedValue,
  onValueChange,
  items = [],
  placeholder = 'Seleccionar...',
  error
}) => {
  return (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerLabel}>{label}:</Text>
      <View style={[styles.pickerWrapper, error && styles.pickerError]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          <Picker.Item label={placeholder} value="" />
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f8f9fa',
  },
  pickerError: {
    borderColor: '#dc3545',
  },
  picker: {
    height: 50,
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4,
  },
});

export default PickerField;