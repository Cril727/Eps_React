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
import { resetPassword } from "../../Src/Services/AuthService";
import { useState } from "react";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    console.log("🚀 Iniciando proceso de reset password");
    console.log("📧 Email a enviar:", email);

    if (!email) {
      console.log("❌ Error: Email vacío");
      Alert.alert("Campo requerido", "Ingresa tu correo electrónico");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Error: Email inválido");
      Alert.alert("Correo inválido", "Ingresa un correo electrónico válido");
      return;
    }

    try {
      console.log("⏳ Enviando solicitud al servidor...");
      setLoading(true);
      const result = await resetPassword(email.trim());

      console.log("📨 Respuesta del servidor:", result);

      if (result.success) {
        console.log("✅ Reset password exitoso");
        const message = result.temporary_password
          ? `Tu contraseña ha sido restablecida. La contraseña temporal es: ${result.temporary_password}`
          : "Se ha enviado una contraseña temporal a tu correo electrónico. Revisa tu bandeja de entrada.";

        Alert.alert(
          "Solicitud enviada",
          message,
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        console.log("❌ Error en respuesta:", result.message);
        Alert.alert(
          "Error",
          result.message || "Ocurrió un error al procesar tu solicitud"
        );
      }
    } catch (e) {
      console.log("💥 Error en catch:", e);
      console.log("💥 Error response:", e.response?.data);
      Alert.alert("Error", "Ocurrió un error al procesar tu solicitud");
    } finally {
      setLoading(false);
      console.log("🏁 Proceso finalizado");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresa tu correo electrónico y te enviaremos una contraseña temporal
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Enviar Contraseña Temporal</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.backText}>Volver al Inicio de Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#f1fcffff", justifyContent: "center", alignItems: "center", padding: 24 },
  card: { width: "100%", maxWidth: 400, backgroundColor: "#FFFFFF", borderRadius: 18, padding: 22, borderWidth: 1, borderColor: "#E6E1FF", alignItems: "center", borderTopWidth: 4, borderTopColor: "#2878adff", elevation: 2 },
  title: { fontSize: 26, fontWeight: "800", color: "#0F172A", letterSpacing: 0.2, marginBottom: 6, textAlign: "center" },
  subtitle: { fontSize: 14, color: "#6B7280", marginBottom: 20, textAlign: "center" },
  input: { width: "100%", paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: "#E6E1FF", marginBottom: 12, backgroundColor: "#fff" },
  button: { backgroundColor: "#6bb0d8ff", paddingVertical: 14, borderRadius: 999, width: "100%", alignItems: "center", marginBottom: 16, borderWidth: 2, borderColor: "#ffffffff" },
  buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16, letterSpacing: 0.4, textTransform: "uppercase" },
  backText: { fontSize: 14, color: "#317abaff", fontWeight: "700", textDecorationLine: "underline" },
});