import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
// { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavegation from "./Src/Navegation/AppNavegation";

// Pantallas
import citas from "./Src/Navegation/Stack/CitasStack"
import Login from "./screens/Auth/login";
import Register from "./screens/Auth/register";

//wconst Stack = createNativeStackNavigator();

export default function App() {
  //return (
  //  <NavigationContainer>
  //    <Stack.Navigator initialRouteName="Login">
  //      <Stack.Screen
  //        name="Login"
  //        component={Login}
  //        options={{ headerShown: false }}
  //      />
  //      <Stack.Screen name="Register" component={Register} />
  //    </Stack.Navigator>
  //    <StatusBar style="auto" />
  //  </NavigationContainer>
  //);
 return (
   <>
     <StatusBar style="auto" />
     <AppNavegation />
   </>
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
