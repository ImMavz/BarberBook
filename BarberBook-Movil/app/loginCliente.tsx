import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import InputField from "../components/ui/inputField";
import Button from "../components/ui/button";
import { useAuthViewModel } from "../viewmodel/authViewModel";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginClient() {
  const router = useRouter();
  const { login } = useAuthViewModel();

  const [identifier, setIdentifier] = useState(""); // correo o cedula
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await login(identifier, password);
    if (res.success) {
      console.log("Login correcto");
      // Redirigir a home/dashboard
    }
  };

  return (
    <LinearGradient colors={["#35373D", "#42454C", "#4F535B", "#8E94A3"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}>
      <Text style={styles.title}>BarberBook</Text>
      <Text style={styles.subtitle}>Agenda tus cortes</Text>

      <InputField placeholder="Correo o Cédula" value={identifier} onChangeText={setIdentifier} />
      <InputField placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />

      <Button title="Iniciar sesión" onPress={handleLogin} />

      <TouchableOpacity onPress={() => router.push("./signUpCliente")}>
        <Text style={styles.link}>¿No tienes cuenta? ¡Regístrate!</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20},
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", color: "#2D6FF7" },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20, color: "#2D6FF7" },
  link: { color: "#2D6FF7", textAlign: "center", marginTop: 12 }
});
