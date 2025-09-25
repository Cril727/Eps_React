import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Usuarios from '../../../screens/admins/Usuarios';

const Stack = createNativeStackNavigator();

export function UsuariosStack() {
  return (
    <Stack.Navigator
        screenOptions={{
        headerStyle: { backgroundColor: '#0c82eaff' },
        headerTintColor: '#fff',
        headerTitleAlign: 'start',
      }}>
      <Stack.Screen
        name="AdminUsuarios"
        component={Usuarios}
        options={{ title: 'Gestión de Usuarios' }}
      />
    </Stack.Navigator>
  );
}