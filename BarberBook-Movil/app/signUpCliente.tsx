import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import InputField from "../components/ui/inputField";
import Button from "../components/ui/button";
import { useAuthViewModel } from "../viewmodel/authViewModel";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function SignUpCliente() {
  const router = useRouter();
  const { register } = useAuthViewModel();

  const [activeTab, setActiveTab] = useState<"cliente" | "dueno">("cliente");
  const [underlineAnim] = useState(new Animated.Value(0));

  // Campos cliente
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSwitch = (tab: "cliente" | "dueno") => {
    setActiveTab(tab);
    Animated.timing(underlineAnim, {
      toValue: tab === "cliente" ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();

    // 👉 Si es dueño, redirige al formulario de signup dueño
    if (tab === "dueno") {
      router.push("./signUpDueno");
    }
  };

  const handleRegister = async () => {
    const user = { nombre, apellido, email, password, rol: "cliente" };
    const res = await register(user);
    if (res.success) {
      router.push("./loginCliente");
    }
  };

  return (
    <LinearGradient
      colors={["#35373D", "#42454C", "#4F535B", "#8E94A3"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>BarberBook</Text>
      <Text style={styles.subtitle}>Agenda tus cortes</Text>

      {/* White Card */}
      <View style={styles.card}>
        {/* Switch Cliente/Dueño */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={{ flex: 1, alignItems: "center" }} onPress={() => handleSwitch("cliente")}>
            <Text style={[styles.tabText, activeTab === "cliente" && styles.activeTab]}>Cliente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, alignItems: "center" }} onPress={() => handleSwitch("dueno")}>
            <Text style={[styles.tabText, activeTab === "dueno" && styles.activeTab]}>Dueño</Text>
          </TouchableOpacity>

          <Animated.View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "50%",
              height: 2,
              backgroundColor: "#2D6FF7",
              transform: [{ translateX: underlineAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 180] }) }],
            }}
          />
        </View>

        {/* Formulario cliente */}
        <InputField placeholder="Nombre" value={nombre} onChangeText={setNombre} />
        <InputField placeholder="Apellido" value={apellido} onChangeText={setApellido} />
        <InputField placeholder="Correo electrónico" value={email} onChangeText={setEmail} />
        <InputField placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />

        <Button title="Registrarse" onPress={handleRegister} />

        <TouchableOpacity onPress={() => router.push("./loginCliente")}>
          <Text style={styles.link}>¿Ya tienes una cuenta? ¡Inicia sesión!</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", color: "#fff" },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20, color: "#fff" },

  // White card igual al login
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  link: { color: "#2D6FF7", textAlign: "center", marginTop: 12 },
  tabContainer: { flexDirection: "row", marginBottom: 20, position: "relative" },
  tabText: { fontWeight: "bold", color: "#999" },
  activeTab: { color: "#2D6FF7" },
});
