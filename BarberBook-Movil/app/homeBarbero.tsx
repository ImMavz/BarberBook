import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  homeBarbero: undefined;
  citasAgendadas: undefined;
  historialCitasBarbero: undefined;
};

type Nav = NativeStackNavigationProp<RootStackParamList>;


export default function HomeBarbero() {
  
  // Cambiar para conectar al backend
  const [citasHoy, setCitasHoy] = useState(8);
  const [ganancias, setGanancias] = useState(206000);
  const [calificacion, setCalificacion] = useState(4.8);
  const [citasAgendadas, setCitasAgendadas] = useState(8);

  const [actividadReciente, setActividadReciente] = useState([
    {
      id: 1,
      nombre: "Joseph",
      descripcion: "Corte de pelo - $20k",
      hace: "Hace: 2h",
      foto: "https://i.pravatar.cc/150?img=32"
    },
    {
      id: 2,
      nombre: "Cesar",
      descripcion: "Barba - $10k",
      hace: "Hace: 4h",
      foto: "https://i.pravatar.cc/150?img=12",
      completado: true
    },
    {
      id: 3,
      nombre: "Samuel",
      descripcion: "Agendado para el 12 de septiembre 4pm - Corte de pelo",
      hace: "Hace: 2m",
      foto: "https://i.pravatar.cc/150?img=5"
    }
  ]);

  const navigation = useNavigation<Nav>();


  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=1" }}
          style={styles.avatar}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.barberName}>Donde dieguito</Text>
          <Text style={styles.welcome}>Bienvenido, Samuel</Text>
        </View>

        <TouchableOpacity style={{ marginLeft: "auto" }}>
          <Ionicons name="settings-outline" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      {/* ESTADÍSTICAS */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: "#f1ecfc" }]}>
          <Text style={styles.statNumber}>{citasHoy}</Text>
          <Text style={styles.statLabel}>Citas para hoy</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: "#e8f9ec" }]}>
          <Text style={styles.statNumber}>${ganancias / 1000}k</Text>
          <Text style={styles.statLabel}>Ganancias</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: "#fff5e6" }]}>
          <Text style={styles.statNumber}>{calificacion}</Text>
          <Text style={styles.statLabel}>Calificación</Text>
        </View>
      </View>

      {/* PANEL DE OPCIONES */}
        {/* GRID PRINCIPAL: 2 ARRIBA – 1 ABAJO */}
        <View style={{ width: "100%", paddingHorizontal: 16, marginTop: 20 }}>

        {/* FILA SUPERIOR → 2 TARJETAS */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            
            {/* Citas Agendadas */}
            <TouchableOpacity onPress={() => navigation.navigate("citasAgendadas")}
            style={{
                width: "48%",
                backgroundColor: "#fff",
                paddingVertical: 24,
                borderRadius: 20,
                alignItems: "center",
                elevation: 3,
            }}
            >
            <Ionicons name="calendar" size={36} color="#6A5AE0" />
            <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "600" }}>
                Citas Agendadas
            </Text>
            <Text style={{ marginTop: 4, color: "#777" }}>{citasHoy} Hoy</Text>
            </TouchableOpacity>

            {/* Historial */}
            <TouchableOpacity onPress={() => navigation.navigate("historialCitasBarbero")}
            style={{
                width: "48%",
                backgroundColor: "#fff",
                paddingVertical: 24,
                borderRadius: 20,
                alignItems: "center",
                elevation: 3,
            }}
            >
            <Ionicons name="refresh" size={36} color="#3ECF8E" />
            <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "600" }}>
                Historial
            </Text>
            <Text style={{ marginTop: 4, color: "#777" }}>Citas pasadas</Text>
            </TouchableOpacity>

        </View>

        {/* TARJETA INFERIOR -> ESTADÍSTICAS */}
        <TouchableOpacity
            style={{
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
            }}
        >
            <View>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>Estadísticas</Text>
            <Text style={{ marginTop: 4, color: "#777" }}>
                Analíticas del negocio
            </Text>
            </View>

            <Ionicons name="chevron-forward" size={26} color="#777" />
        </TouchableOpacity>
        </View>

      {/* ACTIVIDAD RECIENTE */}
      <Text style={styles.sectionTitle}>Actividad reciente</Text>

      {actividadReciente.map((item) => (
        <View key={item.id} style={styles.activityItem}>
          <Image source={{ uri: item.foto }} style={styles.activityAvatar} />

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.activityName}>{item.nombre}</Text>
            <Text style={styles.activityDesc}>{item.descripcion}</Text>
          </View>

          {item.completado && (
            <Ionicons name="checkmark" size={26} color="green" style={{ marginRight: 6 }} />
          )}

          <Text style={styles.activityTime}>{item.hace}</Text>
        </View>
      ))}

      <View style={{ height: 30 }} />
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
  barberName: {
    fontSize: 20,
    fontWeight: "700",
  },
  welcome: {
    fontSize: 14,
    color: "#666",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    width: "32%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },

  optionsContainer: {
    marginTop: 25,
  },
  optionBox: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  optionTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  optionSubtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
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
  activityAvatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  activityName: {
    fontSize: 15,
    fontWeight: "600",
  },
  activityDesc: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  activityTime: {
    fontSize: 11,
    color: "#aaa",
    marginLeft: 10,
  },
});
