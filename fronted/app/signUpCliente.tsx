import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Picker } from "@react-native-picker/picker";

import InputField from "../components/ui/inputField";
import Button from "../components/ui/button";
import { useAuthViewModel } from "../viewmodel/authViewModel";
import { useRouter } from "expo-router";

export default function SignUp() {
  const router = useRouter();
  const { register, loading } = useAuthViewModel();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [rol, setRol] = useState<"cliente" | "barbero" | "dueño">("cliente");

  const handleRegister = async () => {
    if (!nombre || !correo || !password || !rol) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const user = {
      nombre,
      correo,
      contraseña: password,
      rol,
    };

    const res = await register(user);

    if (res.success) {
      Alert.alert("Usuario creado con éxito 🎉");
      router.push("/loginCliente"); // tu login unificado
    } else {
      Alert.alert("Error", JSON.stringify(res.error));
    }
  };

  return (
    <LinearGradient
      colors={["#2B2D42", "#3B3D4D", "#50525D", "#7A7E8A"]}
      style={styles.gradient}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
        extraHeight={120}
      >
        {/* LOGO */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Únete a BarberBook</Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <InputField
            placeholder="Nombre completo"
            value={nombre}
            onChangeText={setNombre}
          />

          <InputField
            placeholder="Correo electrónico"
            value={correo}
            onChangeText={setCorreo}
          />

          <InputField
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* SELECTOR DE ROL */}
          <Text style={styles.label}>Registrarme como</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={rol}
              onValueChange={(value) =>
                setRol(value as "cliente" | "barbero" | "dueño")
              }
              style={styles.picker}
            >
              <Picker.Item label="Cliente" value="cliente" />
              <Picker.Item label="Barbero" value="barbero" />
              <Picker.Item label="Dueño" value="dueño" />
            </Picker>
          </View>

          <Button
            title={loading ? "Registrando..." : "Registrarse"}
            onPress={handleRegister}
            disabled={loading}
          />

          <TouchableOpacity onPress={() => router.push("/loginCliente")}>
            <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
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

  // LOGO
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
    fontSize: 30,
    color: "#fff",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    color: "#e3e3e3",
    marginTop: 4,
  },

  // CARD
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  label: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },

  pickerContainer: {
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    marginTop: 6,
    marginBottom: 16,
  },

  picker: {
    height: 50,
    width: "100%",
  },

  link: {
    color: "#2D6FF7",
    textAlign: "center",
    marginTop: 15,
  },
});
