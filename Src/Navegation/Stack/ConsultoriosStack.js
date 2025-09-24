import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Consultorios from '../../../screens/pacientes/Consultorios';

const Stack = createNativeStackNavigator();

export function ConsultoriosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Consultorios" component={Consultorios} />
    </Stack.Navigator>
  );
}
