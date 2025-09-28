import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import AppNavegation from "./Src/Navegation/AppNavegation";


export default function App() {
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
