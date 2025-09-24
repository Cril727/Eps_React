import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sistema Medico</Text>
      <Text>Panel de Control</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 2, alignItems: 'start', justifyContent: 'start' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
});
