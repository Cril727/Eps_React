import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Doctores from '../../../screens/pacientes/Doctores';


const Stack = createNativeStackNavigator();

export function DoctoresStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Doctores" component={Doctores} />
    </Stack.Navigator>
  );
}
