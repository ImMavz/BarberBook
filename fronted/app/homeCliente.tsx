import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
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

  // 👉 Cambia IP por la tuya
  const API_URL = "http://192.168.1.32:3000";

  // 👉 Luego esto vendrá del login
  const CLIENTE_ID = 1;

  const [proximaCita, setProximaCita] = useState<string | null>(null);

  const [barberosSugeridos, setBarberosSugeridos] = useState([
    { id: 1, nombre: "Carlos Barbero", especialidad: "Cortes - Degradados", foto: "https://i.pravatar.cc/150?img=12" },
    { id: 2, nombre: "David Barber", especialidad: "Barba + Corte", foto: "https://i.pravatar.cc/150?img=5" },
  ]);

  const [actividadReciente, setActividadReciente] = useState([
    {
      id: 1,
      descripcion: "Recordatorio de cita para mañana a las 10am",
      hace: "Hace 1h",
      icono: "notifications-outline",
    },
    {
      id: 2,
      descripcion: "Tuviste una cita con Carlos - Corte básico",
      hace: "Ayer",
      icono: "cut-outline",
    },
  ]);

  // =============================
  // 👉 FUNCIÓN PARA CARGAR CITAS
  // =============================
  const cargarCitas = async () => {
    try {
      const res = await axios.get(`${API_URL}/appointments/cliente/${CLIENTE_ID}`);

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

      const cita = ordenadas[0];
      setProximaCita(`${cita.fecha} • ${cita.horaInicio}`);
    } catch (err: any) {
      console.log("❌ Error cargando citas:", err.response?.data || err.message);
    }
  };

  // 👉 Cargar citas al abrir la pantalla
  useEffect(() => {
    cargarCitas();
  }, []);

  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=1" }}
          style={styles.avatar}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.clientName}>Hola, Juan</Text>
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

          <Text style={{ marginTop: 4, color: "#555" }}>
            {proximaCita ?? "No tienes citas próximas"}
          </Text>
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

      {/* BARBEROS SUGERIDOS */}
      <Text style={styles.sectionTitle}>Barberos sugeridos</Text>

      {barberosSugeridos.map((b) => (
        <View key={b.id} style={styles.barberItem}>
          <Image source={{ uri: b.foto }} style={styles.barberAvatar} />

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.barberName}>{b.nombre}</Text>
            <Text style={styles.barberSpecialty}>{b.especialidad}</Text>
          </View>

          <Ionicons name="chevron-forward" size={24} color="#777" />
        </View>
      ))}

      {/* ACTIVIDAD RECIENTE */}
      <Text style={styles.sectionTitle}>Actividad reciente</Text>

      {actividadReciente.map((item) => (
        <View key={item.id} style={styles.activityItem}>
          <Ionicons name={item.icono as any} size={28} color="#6A5AE0" />

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.activityDesc}>{item.descripcion}</Text>
          </View>

          <Text style={styles.activityTime}>{item.hace}</Text>
        </View>
      ))}

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

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 30,
    marginBottom: 10,
  },

  barberItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  barberAvatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  barberName: {
    fontSize: 15,
    fontWeight: "600",
  },
  barberSpecialty: {
    color: "#777",
    marginTop: 2,
    fontSize: 12,
  },

  activityItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },

  activityDesc: {
    fontSize: 12,
    color: "#666",
  },

  activityTime: {
    fontSize: 11,
    color: "#aaa",
    marginLeft: 10,
  },
});
