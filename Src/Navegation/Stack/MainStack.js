import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../../screens/pacientes/home';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{

        headerStyle: { backgroundColor: '#0c82eaff' },
        headerTintColor: '#fff',
        headerTitleAlign: 'start',
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: 'DashBoard' }}
      />
    </Stack.Navigator>
  );
}
