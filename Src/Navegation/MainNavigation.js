import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MainStack from './Stack/MainStack';
import { CitasStack } from './Stack/CitasStack';
import { EspecialidadesStack } from './Stack/EspecialidadStack';
import { DoctoresStack } from './Stack/DoctoresStack';
import { PacientesStack } from './Stack/PacientesStack';
import { ConsultoriosStack } from './Stack/ConsultoriosStack';

const Tab = createBottomTabNavigator();

export default function MainNavegation() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#2690a8ff',
          borderTopWidth: 1,
          borderTopColor: '#0e3b82ff',
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#0b6a92ff',
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
          tabBarLabel: 'DashBoard',
        }}
      />

      <Tab.Screen
        name="Especialidades"
        component={EspecialidadesStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" size={size} color={color} /> 
          ),
          tabBarLabel: 'Especialidades',
        }}
      />

      <Tab.Screen
        name="Doctores"
        component={DoctoresStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} /> 
          ),
          tabBarLabel: 'Doctores',
        }}
      />

      <Tab.Screen
        name="Pacientes"
        component={PacientesStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} /> 
          ),
          tabBarLabel: 'Pacientes',
        }}
      />

      <Tab.Screen
        name="Citas"
        component={CitasStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-number" size={size} color={color} />
          ),
          tabBarLabel: 'Citas',
        }}
      />

      <Tab.Screen
        name="Consultorios"
        component={ConsultoriosStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business" size={size} color={color} />
          ),
          tabBarLabel: 'Consultorios',
        }}
      />
    </Tab.Navigator>
  );
}
