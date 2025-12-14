import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { getUsuario, getToken } from "../utils/authStorage";
import { useTheme } from "./context/ThemeContext";
import { LightTheme, DarkTheme } from "./theme/theme";
import { API_BASE_URL } from "../config/env";

export default function HomeBarbero() {
  const navigation = useNavigation();

  // Tema dinámico
  const { theme, colors } = useTheme();

  
  const API_URL = API_BASE_URL;
  
  const [usuario, setUsuario] = useState<any>(null);
  const [barbero, setBarbero] = useState<any>(null);
  const [citasHoy, setCitasHoy] = useState(0);
  
  
  const [gananciasHoy, setGananciasHoy] = useState(0); 
  const [rating, setRating] = useState(0); 
  
  const [actividadReciente, setActividadReciente] = useState<any[]>([]);

  const cargarUsuario = async () => {
    const u = await getUsuario();
    setUsuario(u);
  };

  const cargarBarbero = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await axios.get(`${API_URL}/barbers/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setBarbero(data);

      const hoy = new Date().toISOString().split("T")[0];

      // 1. Citas de Hoy 
      const citasCompletadasHoy = data.citas.filter(
        (c: any) =>
          c.fecha === hoy &&
          (c.estado === "confirmada" || c.estado === "completada")
      );
      setCitasHoy(citasCompletadasHoy.length);

      // 2. Ganancias de HOY
      const totalGananciasHoy = citasCompletadasHoy.reduce(
        (acc: number, c: any) => acc + (c.servicio?.precio || 0),
        0
      );
      setGananciasHoy(totalGananciasHoy);
      
      
      const promedioRating = data.promedioRating || data.rating || 4.5;
      setRating(promedioRating);

      // --- ACTIVIDAD RECIENTE ---
      const recientes = data.citas
        .sort(
          (a: any, b: any) =>
            new Date(`${b.fecha}T${b.horaInicio}`).getTime() -
            new Date(`${a.fecha}T${a.horaInicio}`).getTime()
        )        
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
      console.log(
        "❌ Error cargando info barbero:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    cargarUsuario();
    cargarBarbero();
  }, []);

  if (!usuario || !barbero) return <Text>Cargando...</Text>;

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background }, 
      ]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={{
            uri: barbero?.fotoPerfil || "https://i.pravatar.cc/150?img=1",
          }}
          style={styles.avatar}
        />

        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.barberName, { color: colors.text }]}>
            {usuario.barbershopName}
          </Text>

          <Text style={[styles.welcome, { color: colors.textSecondary }]}>
            Bienvenido, {usuario.nombre}
          </Text>
        </View>

        <TouchableOpacity
          style={{ marginLeft: "auto" }}
          onPress={() => navigation.navigate("perfilBarbero")}
        >
          {/* 💡 */}
          <Ionicons
            name="settings-outline"
            size={26}
            color={colors.text} // Dinámico
          />
        </TouchableOpacity>
      </View>

      {/* ESTADÍSTICAS */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {citasHoy}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Citas hoy
          </Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            ${gananciasHoy}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Ganancias
          </Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {rating.toFixed(1)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Rating
          </Text>
        </View>
      </View>

      {/* OPCIONES */}
      <View style={{ width: "100%", paddingHorizontal: 16, marginTop: 20 }}>
        <View style={styles.rowOptions}>
          {/* Citas agendadas */}
          <TouchableOpacity
            onPress={() => navigation.navigate("citasAgendadas")}
            style={[styles.cardOption, { backgroundColor: colors.card }]}
          >
            {/* 💡 */}
            <Ionicons name="calendar-sharp" size={36} color="#6A5AE0" />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Citas agendadas
            </Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
              {citasHoy} Hoy
            </Text>
          </TouchableOpacity>

          {/* Historial */}
          <TouchableOpacity
            onPress={() => navigation.navigate("historialCitasBarbero")}
            style={[styles.cardOption, { backgroundColor: colors.card }]}
          >
            {/* 💡 */}
            <Ionicons name="file-tray-full-outline" size={36} color="#3ECF8E" />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Historial
            </Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
              Citas completadas
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("estadisticas")}
          style={[styles.statsCard, { backgroundColor: colors.card }]}
        >
          {/* 💡 */}
          <Ionicons name="bar-chart-outline" size={36} color="#FF9F43" />
          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Estadísticas
            </Text>
            <Text
              style={[styles.cardSubtitle, { color: colors.textSecondary }]}
            >
              Analíticas del barbero
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={26}
            color={colors.textSecondary}
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>
      </View>

      {/* ACTIVIDAD RECIENTE */}
      <Text
        style={[styles.sectionTitle, { color: colors.text, marginTop: 25 }]}
      >
        Actividad reciente
      </Text>

      {actividadReciente.map((item: any) => (
        <View
          key={item.id}
          style={[styles.activityItem, { backgroundColor: colors.card }]}
        >
          <Image source={{ uri: item.foto }} style={styles.activityAvatar} />

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.activityName, { color: colors.text }]}>
              {item.nombre}
            </Text>
            <Text
              style={[styles.activityDesc, { color: colors.textSecondary }]}
            >
              {item.descripcion}
            </Text>
          </View>

          {item.completado && (
            <Ionicons name="checkmark" size={26} color="green" />
          )}

          <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
            {item.hace}
          </Text>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", paddingVertical: 40 },
  avatar: { width: 55, height: 55, borderRadius: 50 },
  barberName: { fontSize: 15, fontWeight: "700" },
  welcome: { fontSize: 14 },

  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statBox: {
    width: "32%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  statNumber: { fontSize: 22, fontWeight: "700" },
  statLabel: { fontSize: 12 },

  cardOption: {
    width: "48%",
    paddingVertical: 24,
    borderRadius: 20,
    alignItems: "center",
    elevation: 2,
  },
  cardTitle: { marginTop: 10, fontSize: 18, fontWeight: "600" },
  cardSubtitle: { marginTop: 4, fontSize: 12 },

  rowOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },

  statsCard: {
    width: "100%",
    paddingVertical: 24,
    borderRadius: 20,
    elevation: 2,
    marginTop: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },

  activityItem: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  activityAvatar: { width: 45, height: 45, borderRadius: 50 },
  activityName: { fontSize: 15, fontWeight: "600" },
  activityDesc: { fontSize: 12 },
  activityTime: { fontSize: 11 },
});

