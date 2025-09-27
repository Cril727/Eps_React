import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ActionButtons = ({
  onEdit,
  onDelete,
  editIcon = 'pencil',
  deleteIcon = 'trash',
  editColor = '#ffc107',
  deleteColor = '#dc3545'
}) => {
  return (
    <View style={styles.actions}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: editColor }]}
        onPress={onEdit}
      >
        <Ionicons name={editIcon} size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: deleteColor }]}
        onPress={onDelete}
      >
        <Ionicons name={deleteIcon} size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
});

export default ActionButtons;