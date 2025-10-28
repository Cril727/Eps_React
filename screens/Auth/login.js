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
import { useTheme } from "../../Src/Services/ThemeContext";

export default function Login({ navigation }) {
  const { theme } = useTheme();
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
      } else {
        Alert.alert(
          "Error al iniciar sesión",
          result.message || "Ocurrió un error al iniciar la sesión"
        );
      }
    } catch (e) {
      Alert.alert("Error", "Ocurrió un error al iniciar la sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Bienvenido</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Accede a tu cuenta</Text>

        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
          placeholder="Correo electrónico"
          placeholderTextColor={theme.colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
          placeholder="Contraseña"
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          disabled={loading}
        >
          <Text style={[styles.forgotPassword, { color: theme.colors.primary }]}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
          ¿No tienes cuenta?{" "}
          <Text
            style={[styles.link, { color: theme.colors.primary }]}
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
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  card: { width: "100%", maxWidth: 400, borderRadius: 18, padding: 22, borderWidth: 1, alignItems: "center", borderTopWidth: 4, borderTopColor: "#2878adff", elevation: 2 },
  title: { fontSize: 26, fontWeight: "800", letterSpacing: 0.2, marginBottom: 6, textAlign: "center" },
  subtitle: { fontSize: 14, marginBottom: 20, textAlign: "center" },
  input: { width: "100%", paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  forgotPassword: { alignSelf: "flex-end", fontSize: 13, textDecorationLine: "underline", marginBottom: 18 },
  button: { backgroundColor: "#6bb0d8ff", paddingVertical: 14, borderRadius: 999, width: "100%", alignItems: "center", marginBottom: 16, borderWidth: 2, borderColor: "#ffffffff" },
  buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16, letterSpacing: 0.4, textTransform: "uppercase" },
  footerText: { fontSize: 14, textAlign: "center" },
  link: { fontWeight: "700", textDecorationLine: "underline" },
});
