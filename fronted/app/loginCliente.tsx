import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from "react-native";
import InputField from "../components/ui/inputField";
import Button from "../components/ui/button";
import { useAuthViewModel } from "../viewmodel/authViewModel";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginCliente() {
  const router = useRouter();
  const { login } = useAuthViewModel();

  const [activeTab, setActiveTab] = useState<"cliente" | "dueno">("cliente");
  const [underlineAnim] = useState(new Animated.Value(0));

  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");

  const handleSwitch = (tab: "cliente" | "dueno") => {
    setActiveTab(tab);
    Animated.timing(underlineAnim, {
      toValue: tab === "cliente" ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();

    if (tab === "dueno") {
      router.push("./loginDueno");
    }
  };

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const res = await login(identifier, password);

    if (res.success) {
      console.log("Login correcto");
      router.push("./homeCliente");  // Cambia a tu pantalla real
    } else {
      Alert.alert("Error", res.message || "Credenciales incorrectas");
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

      <View style={styles.card}>
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

        <InputField 
          placeholder="Correo o Cédula"
          value={identifier} 
          onChangeText={setIdentifier} 
        />
        <InputField 
          placeholder="Contraseña" 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />

        <Button title="Iniciar sesión" onPress={handleLogin} />

        <TouchableOpacity onPress={() => router.push("./signUpCliente")}>
          <Text style={styles.link}>¿No tienes cuenta? ¡Regístrate!</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", color: "#fff" },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20, color: "#fff" },

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
