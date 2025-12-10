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
import { useTheme } from "./context/ThemeContext";
import { API_BASE_URL } from "../config/env";

type RootStackParamList = {
  buscarBarberia: undefined;
  historialCliente: undefined;
  homeCliente: undefined;
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeCliente() {
  const navigation = useNavigation<Nav>();
  const { colors, theme, toggleTheme } = useTheme();

  const API_URL = API_BASE_URL;
  
  const [usuario, setUsuario] = useState<any>(null);
  const [proximaCita, setProximaCita] = useState<any>(null);

  // ======================================================
  // Cargar usuario y cita
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

      // Ordenamos por fecha y hora
      const ordenadas = res.data.sort((a: any, b: any) => {
        const fechaA = new Date(`${a.fecha}T${a.horaInicio}`);
        const fechaB = new Date(`${b.fecha}T${b.horaInicio}`);
        return fechaA.getTime() - fechaB.getTime();
      });

      setProximaCita(ordenadas[0]);
    } catch (error) {
      console.log("❌ Error cargando próxima cita:", error);
    }
  };

  // ======================================================
  // ICONO DEL TEMA
  // ======================================================
  const themeIcon = theme === "dark" ? "sunny-outline" : "moon-outline";

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* HEADER */}
      <View style={styles.header}>

        {/* TIJERA — ahora usa colors.text */}
        <Ionicons name="cut-outline" size={32} color={colors.text} />

        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.clientName, { color: colors.text }]}>
            {usuario ? `Bienvenido, ${usuario.nombre}` : "Cargando..."}
          </Text>
          <Text style={[styles.welcome, { color: colors.textSecondary }]}>
            Agenda cita con el peluquero
          </Text>
        </View>

        {/* BOTÓN LUNA/SOL */}
        <TouchableOpacity onPress={toggleTheme} style={{ marginLeft: "auto", marginRight: 10 }}>
          <Ionicons name={themeIcon} size={28} color={colors.text} />
        </TouchableOpacity>

        {/* BOTÓN HISTORIAL */}
        <TouchableOpacity onPress={() => navigation.navigate("historialCliente")}>
          <View style={[styles.historialButton, { backgroundColor: colors.primary }]}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>Historial</Text>
          </View>
        </TouchableOpacity>

      </View>

      {/* BUSCADOR */}
      <TouchableOpacity
        style={[styles.searchBox, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate("buscarBarberia")}
      >
        <Ionicons name="search-outline" size={22} color={colors.textSecondary} />
        <Text style={{ marginLeft: 6, color: colors.textSecondary }}>
          Busca peluquerías
        </Text>
      </TouchableOpacity>

      {/* CITAS AGENDADAS */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Citas agendadas</Text>

      {proximaCita ? (
        <View style={[styles.citaBox, { backgroundColor: colors.card }]}>

          {/* Icono tijera también dinámico */}
          <Ionicons name="cut-outline" size={26} color={colors.text} />

          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.citaNombre, { color: colors.text }]}>
              {proximaCita.barbero?.usuario?.nombre || "Mi barbero"}
            </Text>
            <Text style={[styles.citaServicio, { color: colors.textSecondary }]}>
              {proximaCita.servicio?.nombre || "Servicio"}
            </Text>
          </View>

          <Text style={[styles.citaTiempo, { color: colors.textSecondary }]}>Próxima</Text>
        </View>
      ) : (
        <Text style={{ color: colors.textSecondary, marginBottom: 15 }}>
          No tienes citas próximas
        </Text>
      )}

      {/* PASOS */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        ¿Cómo usar BarberBook?
      </Text>

      {[1, 2, 3].map((num) => (
        <View key={num} style={[styles.stepCard, { backgroundColor: colors.card }]}>
          <View style={[styles.stepCircle, { backgroundColor: colors.cardSec }]}>
            <Text style={[styles.stepNumber, { color: colors.text }]}>{num}</Text>
          </View>

          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              {num === 1 && "Busca una peluquería"}
              {num === 2 && "Escoge el servicio"}
              {num === 3 && "Separa tu cita"}
            </Text>

            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
              {num === 1 && "Pon el nombre o ubicación en el buscador"}
              {num === 2 && "Selecciona el servicio disponible que tengan"}
              {num === 3 && "Escoge día y hora para confirmar"}
            </Text>
          </View>

        </View>
      ))}

      <View style={{ height: 35 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 35,
  },

  historialButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginLeft: 1,
  },

  clientName: {
    fontSize: 20,
    fontWeight: "700",
  },
  welcome: {
    fontSize: 14,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  citaTiempo: {
    marginLeft: "auto",
    fontSize: 12,
  },

  stepCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  },
});


