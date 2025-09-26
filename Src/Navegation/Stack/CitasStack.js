import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Citas from '../../../screens/doctores/Citas';


const Stack = createNativeStackNavigator();

export function CitasStack() {
  return (
      <Stack.Navigator       
        screenOptions={{
        headerStyle: { backgroundColor: '#0c82eaff' },
        headerTintColor: '#fff',
        headerTitleAlign: 'start',
      }}>
      <Stack.Screen name="Citas" component={Citas} />
    </Stack.Navigator>
  );
}
