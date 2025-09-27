import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({
  title,
  onAdd,
  addIcon = 'add',
  addText = 'Nuevo',
  showAdd = true,
  backgroundColor = '#0c82ea'
}) => {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      <Text style={styles.title}>{title}</Text>
      {showAdd && onAdd && (
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Ionicons name={addIcon} size={24} color="white" />
          <Text style={styles.addButtonText}>{addText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold'
  },
});

export default Header;