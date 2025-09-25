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
      
      console.log("Token cargado:", !!token);
      console.log("Rol del usuario:", userInfo?.role);
    } catch (error) {
      console.log("Error al cargar el token desde AsyncStorage", error)
    }finally{
      setIsLoading(false)
    }
  };


  //Se ejecuta cuando el componente se monta 
  useEffect(()=>{
    loadToken();
  },[])

  //Se ejecuta cuando hay cambio de estado en la app  (inactivo, activo, background)
  useEffect(() =>{
    const handleAppChange = (nextAppState) =>{
      if(appState.current.match(/inactive|background/) && nextAppState === 'active'){
        console.log("La aplicacion ha vuelto al primer plano, verificando el token")
        loadToken();
      }
      appState.current = nextAppState;
    }

    const suscription = AppState.addEventListener('change', handleAppChange)
    return () => suscription.remove();
  },[])


  //Se ejecuta en un intervalo de 2 segundos
  useEffect(()=>{
    const interval = setInterval(()=>{
      if(AppState.currentState === 'active'){
        loadToken();
      }
    },2000);
    return () => clearInterval(interval)
  },[]);

  //Escucha el evento de actualización de token
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
        console.log("Navegando a AdminNavigation");
        return <AdminNavigation />;
      case 'doctor':
        console.log("Navegando a DoctorNavigation");
        return <DoctorNavigation />;
      case 'paciente':
        console.log("Navegando a PacienteNavigation");
        return <PacienteNavigation />;
      default:
        console.log("Rol no reconocido, usando navegación por defecto");
        return <PacienteNavigation />; // Por defecto, usar navegación de paciente
    }
  };

  return (
    <NavigationContainer>
      {renderNavigation()}
    </NavigationContainer>
  );
}
