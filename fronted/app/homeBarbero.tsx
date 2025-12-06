import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { getUsuario, getToken } from "../utils/authStorage";

export default function HomeBarbero() {
  const navigation = useNavigation();
  

  const API_URL = "http://192.168.80.14:3000";
  //const API_URL = "http://192.168.1.32:3000" //API Juanito
  const [usuario, setUsuario] = useState<any>(null);
  const [barbero, setBarbero] = useState<any>(null);
  const [citasHoy, setCitasHoy] = useState(0);
  const [ganancias, setGanancias] = useState(0);
  const [calificacion] = useState(4.8);
  const [actividadReciente, setActividadReciente] = useState([]);

  // ============================
  // 📌 Cargar usuario local
  // ============================
  const cargarUsuario = async () => {
    const u = await getUsuario();
    setUsuario(u);
  };

  // ============================
  // 📌 CARGAR DATOS DEL BARBERO
  // ============================
  const cargarBarbero = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await axios.get(`${API_URL}/barbers/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setBarbero(data);

      // --- CITAS DE HOY ---
      const hoy = new Date().toISOString().split("T")[0];
      const citasDeHoy = data.citas.filter((c: any) => c.fecha === hoy);
      setCitasHoy(citasDeHoy.length);

      // --- GANANCIAS ---
      const total = citasDeHoy.reduce((acc: number, c: any) => acc + (c.servicio?.precio || 0), 0);
      setGanancias(total);

      // --- ACTIVIDAD RECIENTE (últimas 5 citas) ---
      const recientes = data.citas
        .sort((a: any, b: any) => new Date(`${b.fecha}T${b.horaInicio}`).getTime() - new Date(`${a.fecha}T${a.horaInicio}`).getTime())
        .slice(0, 5)
        .map((c: any) => ({
          id: c.id,
          nombre: c.cliente.nombre,
          descripcion: `${c.servicio?.nombre} - $${c.servicio?.precio}`,
          hace: c.fecha,
          foto: c.cliente.fotoPerfil || "https://i.pravatar.cc/150?img=5",
          completado: c.estado === "completada",
        }));

      setActividadReciente(recientes);

    } catch (err: any) {
      console.log("❌ Error cargando info barbero:", err.response?.data || err.message);
    }
  };
  
  // ============================
  // 📌 useEffect
  // ============================
  useEffect(() => {
    cargarUsuario();
    cargarBarbero();
  }, []);

  // Si no ha cargado el usuario aún
  if (!usuario) {
    return <Text>Cargando...</Text>;
  }
  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={{ uri: barbero?.fotoPerfil || "https://i.pravatar.cc/150?img=1" }}
          style={styles.avatar}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.barberName}>{usuario.barbershopName}</Text>
          <Text style={styles.welcome}>Bienvenido, {usuario.nombre}</Text>
        </View>

        <TouchableOpacity
          style={{ marginLeft: "auto" }}
          onPress={() => navigation.navigate("perfilBarbero")}
        >
          <Ionicons name="settings-outline" size={26} color="#333" />
        </TouchableOpacity>

      </View>

      {/* ESTADÍSTICAS */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: "#f1ecfc" }]}>
          <Text style={styles.statNumber}>{citasHoy}</Text>
          <Text style={styles.statLabel}>Citas hoy</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: "#e8f9ec" }]}>
          <Text style={styles.statNumber}>${ganancias}</Text>
          <Text style={styles.statLabel}>Ganancias</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: "#fff5e6" }]}>
          <Text style={styles.statNumber}>{calificacion}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

  {/* OPCIONES */}
  <View style={{ width: "100%", paddingHorizontal: 16, marginTop: 20 }}>

    {/* 🔹 FILA: Citas agendadas + Historial */}
    <View style={styles.rowOptions}>

      {/* Citas agendadas */}
      <TouchableOpacity
        onPress={() => navigation.navigate("citasAgendadas")}
        style={styles.cardOption}
      >
        <Ionicons name="calendar" size={36} color="#6A5AE0" />
        <Text style={styles.cardTitle}>Citas agendadas</Text>
        <Text style={styles.cardSubtitle}>{citasHoy} Hoy</Text>
      </TouchableOpacity>

      {/* Historial */}
      <TouchableOpacity
        onPress={() => navigation.navigate("historialCitasBarbero")}
        style={styles.cardOption}
      >
        <Ionicons name="time-outline" size={36} color="#3ECF8E" />
        <Text style={styles.cardTitle}>Historial</Text>
        <Text style={styles.cardSubtitle}>Citas completadas</Text>
      </TouchableOpacity>

    </View>

    {/* Estadísticas */}
    <TouchableOpacity
      onPress={() => navigation.navigate("estadisticas")}
      style={styles.statsCard}
    >
      <Ionicons name="stats-chart" size={36} color="#FF9F43" />
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.cardTitle}>Estadísticas</Text>
        <Text style={styles.cardSubtitle}>Analíticas del barbero</Text>
      </View>
      <Ionicons name="chevron-forward" size={26} color="#777" style={{ marginLeft: "auto" }} />
    </TouchableOpacity>

  </View>


      {/* ACTIVIDAD RECIENTE */}
      <Text style={styles.sectionTitle}>Actividad reciente</Text>

      {actividadReciente.map((item: any) => (
        <View key={item.id} style={styles.activityItem}>
          <Image source={{ uri: item.foto }} style={styles.activityAvatar} />

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.activityName}>{item.nombre}</Text>
            <Text style={styles.activityDesc}>{item.descripcion}</Text>
          </View>

          {item.completado && (
            <Ionicons name="checkmark" size={26} color="green" />
          )}

          <Text style={styles.activityTime}>{item.hace}</Text>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, backgroundColor: "#f5f6f8" },
  header: { flexDirection: "row", alignItems: "center", paddingVertical: 40 },
  avatar: { width: 55, height: 55, borderRadius: 50 },
  barberName: { fontSize: 15, fontWeight: "700" },
  welcome: { fontSize: 14, color: "#666" },

  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statBox: { width: "32%", padding: 15, borderRadius: 12, alignItems: "center" },
  statNumber: { fontSize: 22, fontWeight: "700" },
  statLabel: { fontSize: 12, color: "#666" },

  cardOption: {
    width: "48%",
    backgroundColor: "#fff",
    paddingVertical: 24,
    borderRadius: 20,
    alignItems: "center",
    elevation: 3,
  },
  cardTitle: { marginTop: 10, fontSize: 18, fontWeight: "600" },
  cardSubtitle: { marginTop: 4, color: "#777", fontSize: 12 },
  rowOptions: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  marginBottom: 10,
  },

  statsCard: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 24,
    borderRadius: 20,
    alignItems: "flex-start",
    elevation: 3,
    marginTop: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 10,
  },

  activityItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  activityAvatar: { width: 45, height: 45, borderRadius: 50 },
  activityName: { fontSize: 15, fontWeight: "600" },
  activityDesc: { fontSize: 12, color: "#666" },
  activityTime: { fontSize: 11, color: "#aaa" },
});
