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
  import { registerUser } from "../../Src/Services/AuthService";

  export default function Register({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [rol, setRol] = useState("");

    const handleRegister = async () => {
      if (password !== confirmPassword) {
        Alert.alert("Error", "Las contraseñas no coinciden");
        return;
      }
      if (!name || !email || !password || !rol) {
        Alert.alert("Error", "Todos los campos son obligatorios");
        return;
      }
      const result = await registerUser(name, email, password, rol);
      if (result.success) {
        Alert.alert("Éxito", result.message);
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", result.message);
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
              label="Nombre Completo"
              placeholder="Ej: Juan Pérez"
              value={name}
              onChangeText={setName}
            />
            <TextInputComponent
              label="Correo Electrónico"
              placeholder="ejemplo@email.com"
              value={email}
              onChangeText={setEmail}
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
            <TextInputComponent
              label="Rol"
              placeholder="Ej: admin, user"
              value={rol}
              onChangeText={setRol}
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
    borderTopColor: "#28ad4eff",
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
    backgroundColor: "#42a34fff",
    paddingVertical: 14,
    borderRadius: 999,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#20af24ff",
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
    color: "#2b845eff",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
