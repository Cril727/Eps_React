import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavegation from './MainNavigation';
import AuthNavegation from './AuthNavegation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, DeviceEventEmitter } from 'react-native';


export default function AppNavegation() {

  const [isLoadind, setIsLoading] = React.useState(true)
  const [userToken, setUserToken] = React.useState(null);
  const appState = React.useRef(AppState.currentState)

  const loadToken = async ()=>{
    try {
      const token = await AsyncStorage.getItem('userToken')
      setUserToken(token)
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

  return (
    <NavigationContainer>
      {userToken ? <MainNavegation /> : <AuthNavegation />}
    </NavigationContainer>
  );
}
