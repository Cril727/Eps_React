import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../../../screens/Profile/Profile';
import EditProfile from '../../../screens/Profile/EditProfile';

const Stack = createNativeStackNavigator();

export function ProfileStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerStyle: { backgroundColor: '#0c82eaff' },
        headerTintColor: '#fff',
        headerTitleAlign: 'start',
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={Profile} 
        options={{ title: 'Mi Perfil' }} 
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfile} 
        options={{ title: 'Editar Perfil' }} 
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;