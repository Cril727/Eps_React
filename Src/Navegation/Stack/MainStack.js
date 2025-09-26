import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../../screens/pacientes/home';
import AdminDashboard from '../../../screens/admins/AdminDashboard';
import { getUserInfo, getUserProfile } from '../../Services/AuthService';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  const [userRole, setUserRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // const userInfo = getUserProfile();
  // console.log(userInfo);

  React.useEffect(() => {
    
    const loadUserRole = async () => {
      try {
        const userInfo = await getUserInfo();
        setUserRole(userInfo?.role);
      } catch (error) {
        console.error('Error loading user role:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserRole();
  }, []);

  if (loading) {
    return null; // Or a loading component
  }

  const DashboardComponent = userRole === 'admin' ? AdminDashboard : Home;
  const title = userRole === 'admin' ? `Bienvenido ${''} 👋` : 'Dashboard';

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
        component={DashboardComponent}
        options={{ title: title }}
      />
    </Stack.Navigator>
  );
}
