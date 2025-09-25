import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MiConsultorio from '../../../screens/doctores/MiConsultorio';

const Stack = createNativeStackNavigator();

export function MiConsultorioStack() {
  return (
      <Stack.Navigator
        screenOptions={{
        headerStyle: { backgroundColor: '#0c82eaff' },
        headerTintColor: '#fff',
        headerTitleAlign: 'start',
      }}>
      <Stack.Screen name="MiConsultorioScreen" component={MiConsultorio} options={{ title: 'Mi Consultorio' }} />
    </Stack.Navigator>
  );
}

export default MiConsultorioStack;