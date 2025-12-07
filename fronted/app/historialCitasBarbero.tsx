import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { getToken, getUsuario } from "../utils/authStorage";
import { useTheme } from "./context/ThemeContext";

const API_URL = "http://192.168.80.14:3000";

interface Cita {
  id: number;
  fecha: string;
  horaInicio: string;
  cliente: any;
  servicio: any;
  estado: string;

  reviewRating?: number | null; 
}

export default function HistorialCitas() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [historialAgrupado, setHistorialAgrupado] = useState<any>({});
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  
  const cargarHistorial = async () => {
    try {
      const usuario = await getUsuario();
      const token = await getToken();

      if (!usuario.barberoId) return;

      const res = await axios.get(
        `${API_URL}/appointments/barbero/${usuario.barberoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const hoy = new Date();

      const pasadas: Cita[] = res.data.filter((cita: Cita) => {
        const fechaCita = new Date(cita.fecha);
        return fechaCita < hoy;
      });

      const citasConResena: Cita[] = pasadas.map((cita: Cita, index: number) => {
          if (cita.estado === 'completado') {
              if (index % 2 === 0) {
                 
                  cita.reviewRating = 3.5 + (index % 3) * 0.5; 
              } else {
                  cita.reviewRating = null; 
              }
          }
          return cita;
      });

      const agrupado: any = {};

      citasConResena.forEach((cita: Cita) => {
        const fecha = new Date(cita.fecha).toLocaleDateString("es-CO", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        if (!agrupado[fecha]) agrupado[fecha] = [];
        agrupado[fecha].push(cita);
      });

      setHistorialAgrupado(agrupado);
    } catch (err) {
      console.log("❌ Error historial:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);


  const stateColors: any = {
    completado: "#34C759",
    cancelado: "#FF3B30",
    pendiente: "#A5A7AE",
  };
  
  // 💡 Función para ver la reseña (solo console.log por ahora)
  const verResena = (cita: Cita) => {
    if (cita.estado === 'completado' && cita.reviewRating) {
        alert(`Reseña de ${cita.cliente?.nombre}: ${cita.reviewRating.toFixed(1)} estrellas`);
        // navigation.navigate('verResena', { citaId: cita.id }); 
    } else {
        alert("Esta cita aún no tiene reseña.");
    }
  };


  const CitaCard = ({ cita }: { cita: Cita }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Image
        source={{ uri: cita.cliente?.fotoPerfil || "https://i.pravatar.cc/150" }}
        style={styles.avatar}
      />

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={[styles.name, { color: colors.text }]}>
          {cita.cliente?.nombre}
        </Text>

        <Text style={[styles.service, { color: colors.textSecondary }]}>
          {cita.servicio?.nombre}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <View
              style={[
                styles.statusTag,
                { backgroundColor: stateColors[cita.estado] || "#999" },
              ]}
            >
              <Text style={styles.statusText}>{cita.estado}</Text>
            </View>
            
            {cita.estado === "completado" && (
                <TouchableOpacity onPress={() => verResena(cita)} style={styles.reviewButton}>
                    <Ionicons 
                        name={cita.reviewRating ? "star" : "star-outline"} 
                        size={18} 
                        color={cita.reviewRating ? "#FFD700" : colors.textSecondary}
                    />
                    <Text style={[styles.reviewText, { color: colors.textSecondary }]}>
                        {cita.reviewRating ? cita.reviewRating.toFixed(1) : "Sin calificar"}
                    </Text>
                </TouchableOpacity>
            )}

        </View>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={[styles.time, { color: "#3B6EF6" }]}>
          {cita.horaInicio}
        </Text>

        <Text style={[styles.price, { color: colors.text }]}>
          ${cita.servicio?.precio} COP
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Historial de Citas
        </Text>

        <Ionicons name="time-outline" size={24} color={colors.text} />
      </View>

      {Object.keys(historialAgrupado).length === 0 && (
        <Text
          style={{
            textAlign: "center",
            marginTop: 40,
            color: colors.textSecondary,
          }}
        >
          No hay citas anteriores.
        </Text>
      )}

      {Object.entries(historialAgrupado).map(([fecha, citas]: any) => {
        const mostrarTodas = expandedDays[fecha] === true;
        const citasMostradas = mostrarTodas ? citas : citas.slice(0, 3);

        return (
          <View key={fecha} style={{ marginBottom: 20 }}>
            <Text
              style={[
                styles.dateTitle,
                { color: colors.text, paddingHorizontal: 15 },
              ]}
            >
              Citas del {fecha}
            </Text>

            {citasMostradas.map((cita: Cita) => (
              <CitaCard key={cita.id} cita={cita} />
            ))}

            {citas.length > 3 && (
              <TouchableOpacity
                onPress={() =>
                  setExpandedDays((prev) => ({
                    ...prev,
                    [fecha]: !prev[fecha],
                  }))
                }
                style={{ alignItems: "center", marginTop: 6 }}
              >
                <Text style={{ color: "#3B6EF6", fontWeight: "600" }}>
                  {mostrarTodas ? "Mostrar menos ▲" : "Mostrar todas ▼"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingTop: 55,
    paddingBottom: 18,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  dateTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 20,
  },

  card: {
    flexDirection: "row",
    padding: 12,
    marginHorizontal: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
  },

  service: {
    fontSize: 13,
  },
  
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 2,
  },

  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10, 
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,

    backgroundColor: 'rgba(0,0,0,0.1)', 
  },
  reviewText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
  },


  time: {
    fontSize: 15,
    fontWeight: "700",
  },

  price: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "700",
  },
});