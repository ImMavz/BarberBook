import React, { useState } from "react";
import {View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";

export default function HomeCliente() {
  const navigation = useNavigation<NavigationProp<any>>();

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
});
