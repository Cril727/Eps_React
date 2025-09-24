import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  View,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { loginUser } from "../../Src/Services/AuthService";
import { useState } from "react";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos requeridos", "Ingresa correo y contraseña");
      return;
    }

    try {
      setLoading(true);
      const result = await loginUser(email.trim(), password);

      if (result.success) {
        Alert.alert("Inicio de sesión", "¡Éxito!");
        // No es necesario navegar aquí si tu AppNavigation conmutea por token.
        // Si quisieras forzar navegación: navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
      } else {
        Alert.alert(
          "Error al iniciar sesión",
          result.message || "Ocurrió un error al iniciar la sesión"
        );
      }
    } catch (e) {
      console.log("Error inesperado en login: ", e);
      Alert.alert("Error", "Ocurrió un error al iniciar la sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Accede a tu cuenta</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <TouchableOpacity
          onPress={() => Alert.alert("Recuperar", "Función no implementada")}
          disabled={loading}
        >
          <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}             // <-- ahora correcto
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          ¿No tienes cuenta?{" "}
          <Text
            style={styles.link}
            onPress={() => !loading && navigation.navigate("Register")}
          >
            Regístrate
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#f1fcffff", justifyContent: "center", alignItems: "center", padding: 24 },
  card: { width: "100%", maxWidth: 400, backgroundColor: "#FFFFFF", borderRadius: 18, padding: 22, borderWidth: 1, borderColor: "#E6E1FF", alignItems: "center", borderTopWidth: 4, borderTopColor: "#28ad4eff", elevation: 2 },
  title: { fontSize: 26, fontWeight: "800", color: "#0F172A", letterSpacing: 0.2, marginBottom: 6, textAlign: "center" },
  subtitle: { fontSize: 14, color: "#6B7280", marginBottom: 20, textAlign: "center" },
  input: { width: "100%", paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: "#E6E1FF", marginBottom: 12, backgroundColor: "#fff" },
  forgotPassword: { alignSelf: "flex-end", fontSize: 13, color: "#3a64edff", textDecorationLine: "underline", marginBottom: 18 },
  button: { backgroundColor: "#42a34fff", paddingVertical: 14, borderRadius: 999, width: "100%", alignItems: "center", marginBottom: 16, borderWidth: 2, borderColor: "#20af24ff" },
  buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16, letterSpacing: 0.4, textTransform: "uppercase" },
  footerText: { fontSize: 14, color: "#4B5563", textAlign: "center" },
  link: { color: "#2b845eff", fontWeight: "700", textDecorationLine: "underline" },
});
