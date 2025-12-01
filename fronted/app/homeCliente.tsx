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
  buscarBarberia: undefined;
  historialCliente: undefined;
  homeCliente: undefined;
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeCliente() {
  const navigation = useNavigation<Nav>();

  // 🔥 BACKEND: Cambiar IP cuando sea necesario
  const API_URL = "http://192.168.80.14:3000";

  // 🔥 Usuario logueado
  const [usuario, setUsuario] = useState<any>(null);

  // 🔥 Próxima cita (vendrá del backend)
  const [proximaCita, setProximaCita] = useState<any>(null);

  // ======================================================
  // 🔥 Cargar usuario y cita próxima desde el backend
  // ======================================================
  useEffect(() => {
    (async () => {
      try {
        const u = await getUsuario();

        if (!u) {
          Alert.alert("Error", "No hay usuario logueado");
          return;
        }

        setUsuario(u);
        cargarProximaCita(u.id);

      } catch (e) {
        console.log("❌ Error cargando usuario:", e);
      }
    })();
  }, []);

  // ======================================================
  // 🔥 Cargar PRÓXIMA CITA desde backend
  // ======================================================
  const cargarProximaCita = async (clienteId: number) => {
    try {
      const token = await getToken();

      if (!token) return;

      const res = await axios.get(`${API_URL}/appointments/cliente/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data || res.data.length === 0) {
        setProximaCita(null);
        return;
      }

      // Ordenar por fecha + hora
      const ordenadas = res.data.sort((a: any, b: any) => {
        const fechaA = new Date(`${a.fecha}T${a.horaInicio}`);
        const fechaB = new Date(`${b.fecha}T${b.horaInicio}`);
        return fechaA.getTime() - fechaB.getTime();
      });

      setProximaCita(ordenadas[0]);

    } catch (error: any) {
      console.log("❌ Error cargando próxima cita:", error.response?.data || error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="cut-outline" size={32} color="#6A5AE0" />

        <View style={{ marginLeft: 10 }}>
          <Text style={styles.clientName}>
            {usuario ? `Bienvenido, ${usuario.nombre}` : "Cargando..."}
          </Text>
          <Text style={styles.welcome}>Agenda cita con el peluquero</Text>
        </View>

        <TouchableOpacity
          style={{ marginLeft: "auto" }}
          onPress={() => navigation.navigate("historialCliente")}
        >
          <View style={styles.historialButton}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>Historial</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* BUSCADOR */}
      <TouchableOpacity
        style={styles.searchBox}
        onPress={() => navigation.navigate("buscarBarberia")}
      >
        <Ionicons name="search-outline" size={22} color="#777" />
        <Text style={{ marginLeft: 6, color: "#777" }}>
          Busca peluquerías
        </Text>
      </TouchableOpacity>

      {/* CITAS AGENDADAS */}
      <Text style={styles.sectionTitle}>Citas agendadas</Text>

      {proximaCita ? (
        <View style={styles.citaBox}>
          <Ionicons name="cut-outline" size={26} color="#6A5AE0" />

          <View style={{ marginLeft: 10 }}>
            <Text style={styles.citaNombre}>
              {proximaCita.barbero?.usuario?.nombre || "Mi barbero"}
            </Text>
            <Text style={styles.citaServicio}>
              {proximaCita.servicio?.nombre || "Servicio"}
            </Text>
          </View>

          <Text style={styles.citaTiempo}>Hace 2h</Text>
        </View>
      ) : (
        <Text style={{ color: "#777", marginBottom: 15 }}>
          No tienes citas próximas
        </Text>
      )}

      {/* CÓMO USAR BARBERBOOK */}
      <Text style={styles.sectionTitle}>¿Cómo usar BarberBook?</Text>

      <View style={styles.stepCard}>
        <View style={styles.stepCircle}><Text style={styles.stepNumber}>1</Text></View>
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.stepTitle}>Busca una peluquería</Text>
          <Text style={styles.stepDesc}>
            Pon el nombre o ubicación en el buscador
          </Text>
        </View>
      </View>

      <View style={styles.stepCard}>
        <View style={styles.stepCircle}><Text style={styles.stepNumber}>2</Text></View>
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.stepTitle}>Escoge el servicio</Text>
          <Text style={styles.stepDesc}>
            Selecciona el servicio disponible que tengan
          </Text>
        </View>
      </View>

      <View style={styles.stepCard}>
        <View style={styles.stepCircle}><Text style={styles.stepNumber}>3</Text></View>
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.stepTitle}>Separa tu cita</Text>
          <Text style={styles.stepDesc}>
            Escoge día y hora para confirmar
          </Text>
        </View>
      </View>

      <View style={{ height: 35 }} />
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
    paddingVertical: 40,
  },

  historialButton: {
    backgroundColor: "#6A5AE0",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  clientName: {
    fontSize: 20,
    fontWeight: "700",
  },
  welcome: {
    fontSize: 14,
    color: "#666",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 15,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 10,
  },

  citaBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  citaNombre: {
    fontSize: 15,
    fontWeight: "600",
  },
  citaServicio: {
    fontSize: 12,
    color: "#777",
  },
  citaTiempo: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#999",
  },

  stepCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumber: {
    fontWeight: "700",
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  stepDesc: {
    fontSize: 12,
    color: "#777",
  },
});
