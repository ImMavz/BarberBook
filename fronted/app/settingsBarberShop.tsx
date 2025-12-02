import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function SettingsBarberShop() {
  const router = useRouter();
  const [owner, setOwner] = useState<any>(null);

  // Obtener datos del dueño desde el backend con el token
  const fetchOwner = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No hay token guardado");
        return;
      }

      const response = await fetch("http://192.168.1.32:3000/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Dueño cargado:", data);

      setOwner(data);
    } catch (error) {
      console.log("Error cargando dueño:", error);
    }
  };

  useEffect(() => {
    fetchOwner();
  }, []);

  // Generar inicial del avatar
  const getInitial = (name: string) => {
    if (!name) return "";
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* NAVBAR */}
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>Configuración</Text>
      </View>

      {/* PERFIL DEL DUEÑO */}
      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitial(owner?.nombre)}</Text>
        </View>

        <Text style={styles.ownerName}>{owner?.nombre || "Cargando..."}</Text>
        <Text style={styles.ownerEmail}>{owner?.correo || ""}</Text>
      </View>

      {/* OPCIONES DE CONFIGURACIÓN */}
      <View style={styles.menuContainer}>

        {/* Barbería */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("manageBarbershops")}
        >
          <View style={styles.iconCircle}>
            <Icon name="home-outline" size={40} color="#1E3A8A" />
          </View>
          <Text style={styles.cardText}>Barbería</Text>
        </TouchableOpacity>

        {/* Servicios */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("manageServices")}
        >
          <View style={styles.iconCircle}>
            <Icon name="cut-outline" size={40} color="#1E3A8A" />
          </View>
          <Text style={styles.cardText}>Servicios</Text>
        </TouchableOpacity>

        {/* Barberos */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("manageBarbers")}
        >
          <View style={styles.iconCircle}>
            <Icon name="people-outline" size={40} color="#1E3A8A" />
          </View>
          <Text style={styles.cardText}>Barberos</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

// ======== ESTILOS ========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  navbar: {
    width: "100%",
    backgroundColor: "#1E3A8A",
    paddingVertical: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  navbarText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },

  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  avatar: {
    width: 95,
    height: 95,
    borderRadius: 50,
    backgroundColor: "#1E40AF",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 45,
    color: "#fff",
    fontWeight: "bold",
  },

  ownerName: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },

  ownerEmail: {
    fontSize: 14,
    color: "#6B7280",
  },

  menuContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 18,
    elevation: 5,
  },

  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },

  cardText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E3A8A",
  },
});
