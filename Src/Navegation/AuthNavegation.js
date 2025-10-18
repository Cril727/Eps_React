import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "../../screens/Auth/login";
import Register from "../../screens/Auth/register";
import ForgotPassword from "../../screens/Auth/forgotPassword";


const Stack = createNativeStackNavigator(); 

export default function AuthNavegation() {
  return (
    <Stack.Navigator >
        <Stack.Screen name="Login"
        component={Login}
         options={{title: 'Iniciar sesión'}} />


         <Stack.Screen name="Register"
         component={Register}
         options={{title: 'Crear cuenta'}}
         />

         <Stack.Screen name="ForgotPassword"
         component={ForgotPassword}
         options={{title: 'Recuperar contraseña'}}
         />

    </Stack.Navigator>
  );
}