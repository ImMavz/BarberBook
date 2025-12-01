<<<<<<< HEAD
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
=======
import React, { useState } from "react";
import {View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
>>>>>>> 40f97b88fdf641dc9821260ef7cd9e2827c4ec58

export default function HomeCliente() {
  const navigation = useNavigation<NavigationProp<any>>();

<<<<<<< HEAD
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
=======
  // 🔥 Cuando conectes backend, reemplaza estos datos aquí:
  const [citasAgendadas] = useState<
    {
      id: number;
      barberia: string;
      descripcion: string;
      hace: string;
      icon: React.ComponentProps<typeof Ionicons>["name"];
    }[]
  >([
    {
      id: 1,
      barberia: "Donde dieguito",
      descripcion: "Corte de pelo - $20k",
      hace: "Hace: 2h",
      icon: "cut-outline",
    },
  ]);

  const [search, setSearch] = useState("");

  return (
    <ScrollView style={styles.container}>
      {/* HEADER SUPERIOR */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.logoBox}>
          <Ionicons name="cut-outline" size={30} color="#2B69FF" />
        </TouchableOpacity>
>>>>>>> 40f97b88fdf641dc9821260ef7cd9e2827c4ec58

        <TouchableOpacity
          onPress={() => navigation.navigate("Historial" as never)}
          style={styles.historialBtn}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>📘 Historial</Text>
        </TouchableOpacity>
      </View>

      {/* PERFIL */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=40" }}
          style={styles.avatar}
        />

<<<<<<< HEAD
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
=======
        <Text style={styles.welcome}>Bienvenido, Joseph</Text>
        <Text style={styles.subText}>¡Agenda citas de manera sencilla!</Text>
      </View>

      {/* BUSCADOR */}
      <TouchableOpacity
        style={styles.searchBox}
        onPress={() =>
          navigation.navigate("buscarBarberia", { initialQuery: search })
        }
      >
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput
          placeholder="Busca peluquerías"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />
      </TouchableOpacity>

      {/* CITAS AGENDADAS */}
      <Text style={styles.sectionTitle}>Citas agendadas</Text>

      {citasAgendadas.map((cita) => (
        <View key={cita.id} style={styles.citaCard}>
          <Ionicons name={cita.icon} size={30} color="#2B69FF" />

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.citaBarberia}>{cita.barberia}</Text>
            <Text style={styles.citaDesc}>{cita.descripcion}</Text>
          </View>

          <Text style={styles.citaTime}>{cita.hace}</Text>
        </View>
      ))}

      {/* COMO USAR BARBERBOOK */}
      <Text style={styles.sectionTitle}>¿Cómo usar BarberBook?</Text>

      <View style={styles.step}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>1</Text>
        </View>
        <View>
          <Text style={styles.stepTitle}>Busca una peluquería</Text>
          <Text style={styles.stepDesc}>
            Pon el nombre o ubicación de la peluquería en el buscador
          </Text>
>>>>>>> 40f97b88fdf641dc9821260ef7cd9e2827c4ec58
        </View>
      </View>

      <View style={styles.step}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>2</Text>
        </View>
        <View>
          <Text style={styles.stepTitle}>Escoge el servicio</Text>
          <Text style={styles.stepDesc}>
            Selecciona el servicio disponible que tengan disponible
          </Text>
        </View>
      </View>

<<<<<<< HEAD
      {/* CONTENIDO EXTRA (opcional) */}
=======
      <View style={styles.step}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>3</Text>
        </View>
        <View>
          <Text style={styles.stepTitle}>Separa tu cita</Text>
          <Text style={styles.stepDesc}>
            Escoge el día y la hora, dale confirmar y listo!
          </Text>
        </View>
      </View>

>>>>>>> 40f97b88fdf641dc9821260ef7cd9e2827c4ec58
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// 🎨 ESTILOS EXACTOS
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F5F6FA", paddingTop: 30 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoBox: { padding: 5 },

  historialBtn: {
    backgroundColor: "#2B69FF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
  },

  profileSection: {
    marginTop: 20,
    alignItems: "center",
  },

  avatar: { width: 80, height: 80, borderRadius: 50 },

  welcome: { fontSize: 22, fontWeight: "700", marginTop: 10 },

  subText: { color: "#777", marginTop: 4 },

  searchBox: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  input: {
    marginLeft: 8,
    fontSize: 16,
    width: "90%",
  },
<<<<<<< HEAD
=======

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 12,
  },

  citaCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  citaBarberia: { fontWeight: "700", fontSize: 16 },

  citaDesc: { color: "#666", marginTop: 2 },

  citaTime: { fontSize: 12, color: "#777" },

  step: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },

  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#2B69FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  stepNumberText: { color: "#fff", fontWeight: "700" },

  stepTitle: { fontWeight: "700", fontSize: 16 },

  stepDesc: { color: "#666", width: "85%" },
>>>>>>> 40f97b88fdf641dc9821260ef7cd9e2827c4ec58
});
