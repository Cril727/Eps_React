  import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    ScrollView,
    View,
  } from "react-native";
  import { useState } from "react";
  import TextInputComponent from "../../components/TextInputComponent";
  import { registerPatient } from "../../Src/Services/AuthService";

  export default function Register({ navigation }) {
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async () => {
      if (password !== confirmPassword) {
        Alert.alert("Error", "Las contraseñas no coinciden");
        return;
      }
      if (!nombres || !apellidos || !email || !telefono || !password) {
        Alert.alert("Error", "Todos los campos son obligatorios");
        return;
      }
      const result = await registerPatient(nombres, apellidos, email, telefono, password);
      if (result.success) {
        Alert.alert("Éxito", result.message);
        navigation.navigate("Login");
      } else {
        // Handle validation errors
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join('\n');
          Alert.alert("Error de validación", errorMessages);
        } else {
          Alert.alert("Error", result.message);
        }
      }
    };

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Tarjeta central */}
        <View style={styles.card}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Regístrate para continuar</Text>

          {/* Inputs */}
          <View style={styles.form}>
            <TextInputComponent
              label="Nombres"
              placeholder="Ej: Juan Carlos"
              value={nombres}
              onChangeText={setNombres}
            />
            <TextInputComponent
              label="Apellidos"
              placeholder="Ej: Pérez García"
              value={apellidos}
              onChangeText={setApellidos}
            />
            <TextInputComponent
              label="Correo Electrónico"
              placeholder="ejemplo@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInputComponent
              label="Teléfono"
              placeholder="Ej: 3001234567"
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
            />
            <TextInputComponent
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInputComponent
              label="Confirmar Contraseña"
              placeholder="Repita la contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {/* Botón */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Registrarme</Text>
          </TouchableOpacity>

          {/* Link */}
          <Text style={styles.footerText}>
            ¿Ya tienes cuenta?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Login")}
            >
              Inicia sesión
            </Text>
          </Text>
        </View>
      </ScrollView>
    );
  }

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f1fcffff",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E6E1FF",
    alignItems: "center",
    borderTopWidth: 4,
    borderTopColor: "#2890adff",
    elevation: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: 0.2,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    width: "100%",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#428ea3ff",
    paddingVertical: 14,
    borderRadius: 999,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#ffffffff",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  footerText: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
  },
  link: {
    color: "#2b7484ff",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
