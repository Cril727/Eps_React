import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Especialidades from '../../../screens/pacientes/Especialidad';

const Stack = createNativeStackNavigator();

export function EspecialidadesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Especialidades" component={Especialidades} />
    </Stack.Navigator>
  );
}
