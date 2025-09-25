import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Pacientes from '../../../screens/admins/Pacientes';


const Stack = createNativeStackNavigator();

export function PacientesStack() {
  return (
      <Stack.Navigator       
        screenOptions={{
        headerStyle: { backgroundColor: '#0c82eaff' },
        headerTintColor: '#fff',
        headerTitleAlign: 'start',
      }}>
      <Stack.Screen name="AdminPacientes" component={Pacientes} options={{ title: 'Gestión de Pacientes' }} />
    </Stack.Navigator>
  );
}
