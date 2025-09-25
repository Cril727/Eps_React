import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Doctores from '../../../screens/admins/Doctores';


const Stack = createNativeStackNavigator();

export function DoctoresStack() {
  return (
      <Stack.Navigator       
        screenOptions={{
        headerStyle: { backgroundColor: '#0c82eaff' },
        headerTintColor: '#fff',
        headerTitleAlign: 'start',
      }}>
      <Stack.Screen name="AdminDoctores" component={Doctores} options={{ title: 'Gestión de Doctores' }} />
    </Stack.Navigator>
  );
}
