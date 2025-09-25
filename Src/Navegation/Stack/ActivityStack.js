import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Horarios from '../../../screens/doctores/Horarios';


const Stack = createNativeStackNavigator();

export default function ActivityStack() {
  return (
    <Stack.Navigator
        screenOptions={{
        headerStyle: { backgroundColor: '#0c82eaff' },
        headerTintColor: '#fff',
        headerTitleAlign: 'start',
      }}>
      <Stack.Screen name="HorariosScreen" component={Horarios} options={{ title: 'Mis Horarios' }} />
    </Stack.Navigator>
  );
}
