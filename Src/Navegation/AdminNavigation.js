import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MainStack from './Stack/MainStack';
import { CitasStack } from './Stack/CitasStack';
import { AdminCitasStack } from './Stack/AdminCitasStack';
import { EspecialidadesStack } from './Stack/EspecialidadStack';
import { DoctoresStack } from './Stack/DoctoresStack';
import { PacientesStack } from './Stack/PacientesStack';
import { ConsultoriosStack } from './Stack/ConsultoriosStack';
import { UsuariosStack } from './Stack/UsuariosStack';
import { ProfileStack } from './Stack/ProfileStack';

const Tab = createBottomTabNavigator();

export default function AdminNavigation() {
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
          tabBarLabel: 'Dashboard',
        }}
      />

      <Tab.Screen
        name="Usuarios"
        component={UsuariosStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-circle" size={size} color={color} />
          ),
          tabBarLabel: 'Usuarios',
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
        name="Consultorios"
        component={ConsultoriosStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business" size={size} color={color} />
          ),
          tabBarLabel: 'Consultorios',
        }}
      />

      <Tab.Screen
        name="Citas"
        component={AdminCitasStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
          tabBarLabel: 'Citas',
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
