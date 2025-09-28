import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavegation from './MainNavigation';
import AdminNavigation from './AdminNavigation';
import DoctorNavigation from './DoctorNavigation';
import PacienteNavigation from './PacienteNavigation';
import AuthNavegation from './AuthNavegation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, DeviceEventEmitter } from 'react-native';
import { getUserInfo } from '../Services/AuthService';


export default function AppNavegation() {

  const [isLoadind, setIsLoading] = React.useState(true)
  const [userToken, setUserToken] = React.useState(null);
  const [userRole, setUserRole] = React.useState(null);
  const appState = React.useRef(AppState.currentState)

  const loadToken = async ()=>{
    try {
      const token = await AsyncStorage.getItem('userToken')
      const userInfo = await getUserInfo();

      setUserToken(token)
      setUserRole(userInfo?.role || null);

    } catch (error) {
    }finally{
      setIsLoading(false)
    }
  };

  useEffect(()=>{
    loadToken();
  },[])


  useEffect(() =>{
    const handleAppChange = (nextAppState) =>{
      if(appState.current.match(/inactive|background/) && nextAppState === 'active'){
        loadToken();
      }
      appState.current = nextAppState;
    }

    const suscription = AppState.addEventListener('change', handleAppChange)
    return () => suscription.remove();
  },[])


  useEffect(()=>{
    const interval = setInterval(()=>{
      if(AppState.currentState === 'active'){
        loadToken();
      }
    },2000);
    return () => clearInterval(interval)
  },[]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('tokenUpdated', loadToken);
    return () => subscription.remove();
  }, []);

  const renderNavigation = () => {
    if (!userToken) {
      return <AuthNavegation />;
    }

    // Redirigir según el rol del usuario
    switch (userRole) {
      case 'admin':
        return <AdminNavigation />;
      case 'doctor':
        return <DoctorNavigation />;
      case 'paciente':
        return <PacienteNavigation />;
      default:
        return <PacienteNavigation />;
    }
  };

  return (
    <NavigationContainer>
      {renderNavigation()}
    </NavigationContainer>
  );
}
