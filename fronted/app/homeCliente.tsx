import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { getToken, getUsuario } from "../utils/authStorage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  agendarCita: undefined;
  misCitas: undefined;
  historialCliente: undefined;
  homeCliente: undefined;
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeCliente() {
  const navigation = useNavigation<Nav>();

  const API_URL = "http://192.168.1.32:3000";

  const [usuario, setUsuario] = useState<any>(null);
  const [proximaCita, setProximaCita] = useState<any>(null);

  // Cargar usuario logeado
  useEffect(() => {
    (async () => {
      const u = await getUsuario();
      if (!u) {
        Alert.alert("Error", "No hay usuario logueado");
        return;
      }
      setUsuario(u);
      cargarProximaCita(u.id);
    })();
  }, []);

  // =============================
  // 👉 FUNCIÓN PARA CARGAR PRÓXIMA CITA
  // =============================
  const cargarProximaCita = async (clienteId: number) => {
    try {
      const token = await getToken();

      if (!token) {
        console.log("⚠️ Usuario no logeado");
        return;
      }

      const res = await axios.get(`${API_URL}/appointments/cliente/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data || res.data.length === 0) {
        setProximaCita(null);
        return;
      }

      // Ordenar por fecha + horaInicio
      const ordenadas = res.data.sort((a: any, b: any) => {
        const fechaA = new Date(`${a.fecha}T${a.horaInicio}`);
        const fechaB = new Date(`${b.fecha}T${b.horaInicio}`);
        return fechaA.getTime() - fechaB.getTime();
      });

      setProximaCita(ordenadas[0]);

    } catch (error: any) {
      console.log("❌ Error cargando citas:", error.response?.data || error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=1" }}
          style={styles.avatar}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.clientName}>Hola, {usuario?.nombre || "Cliente"}</Text>
          <Text style={styles.welcome}>Bienvenido a BarberBook</Text>
        </View>

        <TouchableOpacity style={{ marginLeft: "auto" }}>
          <Ionicons name="settings-outline" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      {/* TARJETA PRÓXIMA CITA */}
      <View style={styles.nextAppointmentBox}>
        <Ionicons name="calendar-outline" size={36} color="#6A5AE0" />
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>Próxima cita</Text>

          {proximaCita ? (
            <>
              <Text style={{ marginTop: 4, color: "#555", fontSize: 15 }}>
                📅 {proximaCita.fecha} — {proximaCita.horaInicio}
              </Text>
              <Text style={{ color: "#777", marginTop: 4 }}>
                ✂️ Con: {proximaCita.barbero?.usuario?.nombre || "Barbero"}
              </Text>
            </>
          ) : (
            <Text style={{ marginTop: 4, color: "#555" }}>
              No tienes citas próximas
            </Text>
          )}
        </View>
      </View>

      {/* OPCIONES PRINCIPALES */}
      <View style={styles.optionsGrid}>
        
        {/* AGENDAR CITA */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("agendarCita")}
        >
          <Ionicons name="add-circle-outline" size={36} color="#6A5AE0" />
          <Text style={styles.optionTitle}>Agendar cita</Text>
          <Text style={styles.optionSubtitle}>Elige barbero y servicio</Text>
        </TouchableOpacity>

        {/* MIS CITAS */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("misCitas")}
        >
          <Ionicons name="calendar-clear-outline" size={36} color="#3ECF8E" />
          <Text style={styles.optionTitle}>Mis citas</Text>
          <Text style={styles.optionSubtitle}>Próximas y pendientes</Text>
        </TouchableOpacity>

        {/* HISTORIAL */}
        <TouchableOpacity
          style={[styles.optionCard, { width: "100%" }]}
          onPress={() => navigation.navigate("historialCliente")}
        >
          <Ionicons name="time-outline" size={36} color="#F7A325" />
          <Text style={styles.optionTitle}>Historial</Text>
          <Text style={styles.optionSubtitle}>Tus servicios anteriores</Text>
        </TouchableOpacity>

      </View>

      {/* CONTENIDO EXTRA (opcional) */}
      <View style={{ height: 40 }} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "#f5f6f8",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 25,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  clientName: {
    fontSize: 20,
    fontWeight: "700",
  },
  welcome: {
    fontSize: 14,
    color: "#666",
  },

  nextAppointmentBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
  },

  optionsGrid: {
    marginTop: 20,
  },

  optionCard: {
    backgroundColor: "#fff",
    width: "48%",
    paddingVertical: 24,
    borderRadius: 20,
    alignItems: "center",
    elevation: 3,
    marginBottom: 16,
  },

  optionTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
  },
  optionSubtitle: {
    marginTop: 4,
    color: "#777",
    fontSize: 12,
  },
});
