import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Citas from '../../../screens/pacientes/Citas';

const Stack = createNativeStackNavigator();

export default function ActivityStack() {
  return (
    <Stack.Navigator       screenOptions={{

        headerStyle: { backgroundColor: '#0c82eaff' },
        headerTintColor: '#fff',
        headerTitleAlign: 'start',
      }}>
      <Stack.Screen name="Actividad" component={Citas} options={{ title: 'Actividades' }} />
    </Stack.Navigator>
  );
}
