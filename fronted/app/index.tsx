import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import InputField from "../components/ui/inputField";
import Button from "../components/ui/button";
import { useAuthViewModel } from "../viewmodel/authViewModel";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const { login } = useAuthViewModel();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const res = await login(identifier, password);

    if (!res.success) {
      Alert.alert("Error", res.error?.message || "Credenciales incorrectas");
      return;
    }

    console.log("Login correcto", res.data);

    const data = res.data;
    const rol = data.usuario.rol;

    await AsyncStorage.setItem("token", data.access_token);
    await AsyncStorage.setItem("user", JSON.stringify(data.usuario));

    if (rol === "cliente") router.push("/homeCliente");
    if (rol === "barbero") router.push("/homeBarbero");
    if (rol === "dueño") router.push("/settingsBarberShop");
  };

  return (
    <LinearGradient
      colors={["#2B2D42", "#3B3D4D", "#50525D", "#7A7E8A"]}
      style={styles.gradient}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
        extraHeight={100}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>BarberBook</Text>
          <Text style={styles.subtitle}>Tu look, siempre a tiempo</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar sesión</Text>

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

          <Button title="Ingresar" onPress={handleLogin} />

          <TouchableOpacity onPress={() => router.push("/signUpCliente")}>
            <Text style={styles.link}>¿No tienes cuenta? Regístrate aquí</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 22,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    color: "#e3e3e3",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },

  link: {
    color: "#2D6FF7",
    textAlign: "center",
    marginTop: 15,
  },
});

