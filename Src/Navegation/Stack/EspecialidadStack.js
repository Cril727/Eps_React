import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Especialidades from '../../../screens/admins/Especialidad';

const Stack = createNativeStackNavigator();

export function EspecialidadesStack() {
  return (
    <Stack.Navigator
          screenOptions={{
        headerStyle: { backgroundColor: '#0c82eaff' },
        headerTintColor: '#fff',
        headerTitleAlign: 'start',
      }}>
      <Stack.Screen name="AdminEspecialidades" component={Especialidades} options={{ title: 'Gestión de Especialidades' }} />
    </Stack.Navigator>
  );
}
