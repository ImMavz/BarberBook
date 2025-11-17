import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function HistorialCitas() {
  const navigation = useNavigation();

  // datos de prueba

  const historial = [
    {
      fecha: "19/10/24",
      citas: [
        {
          id: 1,
          nombre: "Carlos Mendoza",
          servicio: "Corte de pelo + Barba",
          hora: "9:00 AM",
          duracion: "45 min",
          precio: "$25k",
          estado: "Completado",
          foto: "https://i.pravatar.cc/150?img=32"
        },
        {
          id: 2,
          nombre: "Miguel Torres",
          servicio: "Corte de pelo",
          hora: "11:30 AM",
          duracion: "30 min",
          precio: "$20k",
          estado: "Cancelado",
          foto: "https://i.pravatar.cc/150?img=12"
        },
        {
          id: 3,
          nombre: "Carlos Mendoza",
          servicio: "Corte de pelo + Barba",
          hora: "7:00 PM",
          duracion: "45 min",
          precio: "$25k",
          estado: "Completado",
          foto: "https://i.pravatar.cc/150?img=32"
        }
      ]
    },
    {
      fecha: "18/10/24",
      citas: [
        {
          id: 4,
          nombre: "Carlos Mendoza",
          servicio: "Corte de pelo + Barba",
          hora: "9:00 AM",
          duracion: "45 min",
          precio: "$25k",
          estado: "Completado",
          foto: "https://i.pravatar.cc/150?img=32"
        },
        {
          id: 5,
          nombre: "Miguel Torres",
          servicio: "Corte de pelo",
          hora: "11:30 AM",
          duracion: "30 min",
          precio: "$20k",
          estado: "Cancelado",
          foto: "https://i.pravatar.cc/150?img=12"
        },
        {
          id: 6,
          nombre: "Carlos Mendoza",
          servicio: "Corte de pelo + Barba",
          hora: "7:00 PM",
          duracion: "45 min",
          precio: "$25k",
          estado: "Completado",
          foto: "https://i.pravatar.cc/150?img=32"
        }
      ]
    }
  ];

  // Colores de estado
  const stateColors: any = {
    Completado: "#34C759",
    Cancelado: "#FF3B30",
    Pendiente: "#B0B0B0"
  };

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Historial de citas</Text>

        <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
      </View>

      {/* HISTORIAL POR FECHAS */}
      {historial.map((dia) => (
        <View key={dia.fecha} style={{ marginBottom: 20 }}>
          <Text style={styles.dateTitle}>Citas del {dia.fecha}</Text>

          {dia.citas.map((cita) => (
            <View key={cita.id} style={styles.card}>
              <Image source={{ uri: cita.foto }} style={styles.avatar} />

              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.name}>{cita.nombre}</Text>
                <Text style={styles.service}>{cita.servicio}</Text>

                <View
                  style={[
                    styles.statusTag,
                    { backgroundColor: stateColors[cita.estado] }
                  ]}
                >
                  <Text style={styles.statusText}>{cita.estado}</Text>
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.time}>{cita.hora}</Text>
                <Text style={styles.duration}>{cita.duracion}</Text>
                <Text style={styles.price}>{cita.precio}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

// ──────────────────────────────────────────────
// STYLES
// ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5FA",
  },

  header: {
    width: "100%",
    backgroundColor: "#3B6EF6",
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
    color: "#fff",
  },

  dateTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 15,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginHorizontal: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 3,
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
    color: "#666",
    marginBottom: 6,
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

  time: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3B6EF6",
  },

  duration: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  price: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 6,
  },
});
