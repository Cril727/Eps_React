import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Pacientes from '../../../screens/pacientes/Pacientes';


const Stack = createNativeStackNavigator();

export function PacientesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Pacientes" component={Pacientes} />
    </Stack.Navigator>
  );
}
