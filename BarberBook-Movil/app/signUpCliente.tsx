import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import InputField from "../components/ui/inputField";
import Button from "../components/ui/button";
import { useAuthViewModel } from "../viewmodel/authViewModel";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function RegisterClient() {
  const router = useRouter();
  const { register } = useAuthViewModel();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const user = { nombre, apellido, email, password };
    const res = await register(user);
    if (res.success) {
      router.push("./loginCliente");
    }
  };

  return (
    <LinearGradient colors={["#35373D", "#42454C", "#4F535B", "#8E94A3"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }} 
    style={styles.container}>
      <Text style={styles.title}>BarberBook</Text>
      <Text style={styles.subtitle}>Agenda tus cortes</Text>

      <InputField placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <InputField placeholder="Apellido" value={apellido} onChangeText={setApellido} />
      <InputField placeholder="Correo electrónico" value={email} onChangeText={setEmail} />
      <InputField placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />

      <Button title="Registrarse" onPress={handleRegister} />

      <TouchableOpacity onPress={() => router.push("./loginCliente")}>
        <Text style={styles.link}>¿Ya tienes una cuenta? ¡Inicia sesión!</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f8f8f8" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", color: "#2D6FF7" },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20, color: "#2D6FF7" },
  link: { color: "#2D6FF7", textAlign: "center", marginTop: 12 }
});
