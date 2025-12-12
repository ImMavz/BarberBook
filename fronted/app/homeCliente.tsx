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
  const [citas, setCitas] = useState<any[]>([]);

  // Filtros disponibles
  const [filtro, setFiltro] = useState<"hoy" | "mañana" | "semana" | "mes">("hoy");

  const TITULOS = {
    hoy: "Citas de Hoy",
    mañana: "Citas de Mañana",
    semana: "Citas de Esta Semana",
    mes: "Citas de Este Mes",
  };

  // ====================================================
  // Cargar usuario + citas
  // ====================================================
  useEffect(() => {
    (async () => {
      try {
        const u = await getUsuario();
        if (!u) {
          Alert.alert("Error", "No hay usuario logueado");
          return;
        }
        setUsuario(u);
        cargarCitas(u.id, "hoy");
      } catch (e) {
        console.log("❌ Error cargando usuario:", e);
      }
    })();
  }, []);

  // ====================================================
  // Cargar citas del cliente
  // ====================================================
  const cargarCitas = async (
    clienteId: number,
    rango: "hoy" | "mañana" | "semana" | "mes"
  ) => {
    try {
      const token = await getToken();
      const res = await axios.get(`${API_URL}/appointments/cliente`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let filtradas = filtrarPorRango(res.data, rango);
      filtradas = ordenarPorFechaYHora(filtradas);

      setFiltro(rango);
      setCitas(filtradas);
    } catch (err) {
      console.log("❌ Error cargando citas:", err);
    }
  };

  // ====================================================
  // Filtrado tipo CitasAgendadas
  // ====================================================
  const filtrarPorRango = (citas: any[], rango: any) => {
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);

    const en7dias = new Date(hoy);
    en7dias.setDate(hoy.getDate() + 7);

    const en30dias = new Date(hoy);
    en30dias.setDate(hoy.getDate() + 30);

    return citas.filter((c) => {
      const fechaCita = new Date(c.fecha + "T00:00:00");
      switch (rango) {
        case "hoy":
          return fechaCita.toDateString() === hoy.toDateString();
        case "mañana":
          return fechaCita.toDateString() === mañana.toDateString();
        case "semana":
          return fechaCita >= hoy && fechaCita <= en7dias;
        case "mes":
          return fechaCita >= hoy && fechaCita <= en30dias;
      }
    });
  };

  const ordenarPorFechaYHora = (citas: any[]) => {
    return citas.sort((a, b) => {
    const f1 = new Date(`${a.fecha}T${a.horaInicio}:00`);
    const f2 = new Date(`${b.fecha}T${b.horaInicio}:00`);
      return f1.getTime() - f2.getTime();
    });
  };

  // Formatos
  const formatearFecha = (fecha: string) => {
    const d = new Date(fecha + "T00:00:00");
    return d.toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };


  const themeIcon = theme === "dark" ? "sunny-outline" : "moon-outline";

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="cut-outline" size={32} color={colors.text} />

        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.clientName, { color: colors.text }]}>
            {usuario ? `Bienvenido, ${usuario.nombre}` : "Cargando..."}
          </Text>
          <Text style={[styles.welcome, { color: colors.textSecondary }]}>
            Agenda citas rápidamente
          </Text>
        </View>

        <TouchableOpacity onPress={toggleTheme} style={{ marginLeft: "auto" }}>
          <Ionicons name={themeIcon} size={28} color={colors.text} />
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

      {/* TÍTULO SEGÚN FILTRO */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {TITULOS[filtro]}
      </Text>

      {/* Citas */}
      {citas.length === 0 ? (
        <Text style={{ color: colors.textSecondary, marginBottom: 15 }}>
          No tienes citas en este rango
        </Text>
      ) : (
        citas.map((cita, index) => (
          <View key={index} style={[styles.citaBox, { backgroundColor: colors.card }]}>
            <Ionicons name="cut-outline" size={26} color={colors.text} />
            <View style={{ marginLeft: 10 }}>
              <Text style={[styles.citaNombre, { color: colors.text }]}>
                {cita.barbero?.barberia?.nombre}
              </Text>

              <Text style={[styles.citaServicio, { color: colors.textSecondary }]}>
                Barbero: {cita.barbero?.usuario?.nombre}
              </Text>

              <Text style={[styles.citaServicio, { color: colors.textSecondary }]}>
                Servicio: {cita.servicio?.nombre}
              </Text>

              <Text style={[styles.citaFecha, { color: colors.textSecondary }]}>
                {formatearFecha(cita.fecha)}
              </Text>

              <Text style={[styles.citaHora, { color: colors.textSecondary }]}>
                {cita.horaInicio}
              </Text>
            </View>
          </View>
        ))
      )}

      {/* FILTROS */}
      <View style={styles.filtros}>
        {["hoy", "mañana", "semana", "mes"].map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => cargarCitas(usuario.id, r as any)}
          >
            <Text style={{ 
              color: colors.text, 
              fontWeight: filtro === r ? "700" : "400" 
            }}>
              {r.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 35 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", paddingVertical: 35 },
  clientName: { fontSize: 20, fontWeight: "700" },
  welcome: { fontSize: 14 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 15,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 25, marginBottom: 10 },
  citaBox: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  citaNombre: { fontSize: 16, fontWeight: "700" },
  citaServicio: { fontSize: 13 },
  citaFecha: { marginTop: 4, fontSize: 12 },
  citaHora: { fontSize: 12 },
  filtros: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 20,
  },
});
