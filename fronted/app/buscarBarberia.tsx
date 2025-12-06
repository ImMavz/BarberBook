import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useTheme } from "./context/ThemeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const API_URL = "http://192.168.80.14:3000";

interface Barberia {
  id: number;
  nombre: string;
  direccion: string;
  rating: number;
  reviews: number;
  distancia: string;
  estado: string;
  precio: string;
  foto: string;
}

type RootStackParamList = {
  agendarCita: { barberiaId: number };   // ← ESTE ES EL QUE FALTABA
};
type Nav = NativeStackNavigationProp<RootStackParamList>;


export default function BuscarBarberia() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();

  const initialQuery =
    (route.params as { initialQuery?: string })?.initialQuery || "";

  const [query, setQuery] = useState(initialQuery);
  const [resultados, setResultados] = useState<Barberia[]>([]);

  // =========================================
  //   Cargar barberías
  // =========================================
  useEffect(() => {
    const cargarBarberias = async () => {
      try {
        const res = await axios.get(`${API_URL}/barbershops`);

        const formateadas = res.data.map((b: any) => ({
          id: b.id,
          nombre: b.nombre,
          direccion: b.direccion,
          foto: b.foto || "https://i.ibb.co/4YgVZ5Q/barberia1.jpg",
          rating:
            b.reseñas?.length > 0
              ? b.reseñas.reduce((acc: number, r: any) => acc + r.rating, 0) /
                b.reseñas.length
              : 4.5,
          reviews: b.reseñas?.length || 0,
          distancia: "1 km",
          estado: "Abierto",
          precio: "$10k - $30k",
        }));

        setResultados(formateadas);
      } catch (error) {
        console.log("❌ Error cargando barberías:", error);
      }
    };

    cargarBarberias();
  }, []);

  // =========================================
  //  BUSCADOR EN TIEMPO REAL
  // =========================================
  useEffect(() => {
    const q = query.toLowerCase();

    setResultados((prev) =>
      prev.filter(
        (b: any) =>
          b.nombre.toLowerCase().includes(q) ||
          b.direccion.toLowerCase().includes(q)
      )
    );
  }, [query]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Barberías encontradas
        </Text>

        <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
      </View>

      {/* BUSCADOR */}
      <View style={styles.searchRow}>
        <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder="Buscar barbería"
            value={query}
            onChangeText={setQuery}
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text }]}
          />
        </View>

        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.primary }]}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>Filtros</Text>
        </TouchableOpacity>
      </View>

      {/* RESULTADOS */}
      <Text style={[styles.resultText, { color: colors.textSecondary }]}>
        {resultados.length} resultados encontrados
      </Text>

      <ScrollView style={{ marginTop: 10 }}>
        {resultados.map((b) => (
          <TouchableOpacity
            key={b.id}
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("agendarCita", { barberiaId: b.id })}

          >
            <Image source={{ uri: b.foto }} style={styles.image} />

            <View style={{ flex: 1, marginLeft: 12 }}>
              
              <Text style={[styles.nombre, { color: colors.text }]}>
                {b.nombre}
              </Text>

              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={[styles.ratingText, { color: colors.text }]}>{b.rating}</Text>
                <Text style={[styles.reviewText, { color: colors.textSecondary }]}>
                  ({b.reviews})
                </Text>
                <Text style={[styles.distancia, { color: colors.textSecondary }]}>
                  {b.distancia}
                </Text>
              </View>

              <Text style={[styles.direccion, { color: colors.textSecondary }]}>
                {b.direccion}
              </Text>

              <View
                style={[
                  styles.estadoBox,
                  { backgroundColor: "rgba(52,199,89,0.15)" },
                ]}
              >
                <Text style={{ color: "#34C759", fontWeight: "600" }}>
                  {b.estado}
                </Text>
              </View>

              <Text style={[styles.precio, { color: colors.text }]}>
                {b.precio}
              </Text>

            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  header: {
    paddingTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  searchRow: {
    flexDirection: "row",
    marginTop: 20,
  },

  searchBox: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    marginLeft: 10,
    width: "85%",
    fontSize: 16,
  },

  filterBtn: {
    marginLeft: 10,
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: 10,
  },

  resultText: {
    marginTop: 15,
    fontSize: 14,
  },

  card: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 3,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  nombre: { fontSize: 16, fontWeight: "700" },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  ratingText: { marginLeft: 4, fontWeight: "600" },

  reviewText: { marginLeft: 4 },

  distancia: { marginLeft: 10 },

  direccion: {
    marginTop: 4,
    width: "90%",
  },

  estadoBox: {
    marginTop: 6,
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  precio: {
    marginTop: 8,
    fontWeight: "700",
    fontSize: 16,
  },
});
