import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminCitas from '../../../screens/admins/AdminCitas';

const Stack = createNativeStackNavigator();

export function AdminCitasStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0c82eaff' },
        headerTintColor: '#fff',
        headerTitleAlign: 'start',
      }}>
      <Stack.Screen name="AdminCitas" component={AdminCitas} options={{ title: 'Gestión de Citas' }} />
    </Stack.Navigator>
  );
}