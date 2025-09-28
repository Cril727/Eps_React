import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MainStack from './Stack/MainStack';
import { PacienteCitasStack } from './Stack/PacienteCitasStack';
import { EspecialidadesStack } from './Stack/EspecialidadStack';
import { DoctoresStack } from './Stack/DoctoresStack';
import { ProfileStack } from './Stack/ProfileStack';

const Tab = createBottomTabNavigator();

export default function PacienteNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'rgba(31, 33, 37, 1)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(14, 59, 130, 1)',
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#ffffffff',
        tabBarInactiveTintColor: '#d9e0e9ff',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={MainStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} /> 
          ),
          tabBarLabel: 'Inicio',
        }}
      />

      <Tab.Screen
        name="MisCitas"
        component={PacienteCitasStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-number" size={size} color={color} />
          ),
          tabBarLabel: 'Mis Citas',
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
          tabBarLabel: 'Mi Perfil',
        }}
      />
    </Tab.Navigator>
  );
}