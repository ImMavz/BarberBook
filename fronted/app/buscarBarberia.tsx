import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, StyleSheet,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function BuscarBarberia() {
  const navigation = useNavigation();
  const route = useRoute();

  const initialQuery = (route.params as { initialQuery?: string })?.initialQuery || "";

  const [query, setQuery] = useState(initialQuery);
  const [resultados, setResultados] = useState([]);

  // 🔥 DATOS ESTÁTICOS (Aquí se cambia cuando conectes el backend)
  const barberias = [
    {
      id: 1,
      nombre: "Barbería 1",
      rating: 4.8,
      reviews: 124,
      distancia: "0.5 km",
      direccion: "Calle 123, Pradera, Valle del Cauca",
      estado: "Abierto",
      precio: "$5k - $30k",
      foto: "https://i.ibb.co/4YgVZ5Q/barberia1.jpg",
    },
    {
      id: 2,
      nombre: "Barbería 2",
      rating: 4.6,
      reviews: 89,
      distancia: "1.2 km",
      direccion: "Calle 123, Cali, Valle del Cauca",
      estado: "Cierra pronto",
      precio: "$10k - $30k",
      foto: "https://i.ibb.co/4YgVZ5Q/barberia1.jpg",
    },
    {
      id: 3,
      nombre: "Barbería 3",
      rating: 4.7,
      reviews: 156,
      distancia: "2.1 km",
      direccion: "Calle 123, Buga, Valle del Cauca",
      estado: "Abierto",
      precio: "$15k - $40k",
      foto: "https://i.ibb.co/4YgVZ5Q/barberia1.jpg",
    },
    {
      id: 4,
      nombre: "Barbería 4",
      rating: 4.9,
      reviews: 203,
      distancia: "0.8 km",
      direccion: "Calle 123, Medellín, Antioquia",
      estado: "Cerrado",
      precio: "$20k - $60k",
      foto: "https://i.ibb.co/4YgVZ5Q/barberia1.jpg",
    },
    {
      id: 5,
      nombre: "Barbería 5",
      rating: 4.5,
      reviews: 67,
      distancia: "3.5 km",
      direccion: "Calle 123, Bogotá, Cundinamarca",
      estado: "Abierto",
      precio: "$20k - $60k",
      foto: "https://i.ibb.co/4YgVZ5Q/barberia1.jpg",
    },
  ];

  // 🔎 BÚSQUEDA (coincidencia parcial)
  useEffect(() => {
    const q = query.toLowerCase();

    const filtrados = barberias.filter((b) =>
      b.nombre.toLowerCase().includes(q) ||
      b.direccion.toLowerCase().includes(q) ||
      b.estado.toLowerCase().includes(q)
    );

    setResultados(filtrados);
  }, [query]);

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Barberías encontradas</Text>

        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      {/* BUSCADOR */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#888" />
          <TextInput
            placeholder="Buscar barbería"
            value={query}
            onChangeText={setQuery}
            placeholderTextColor="#aaa"
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity style={styles.filterBtn}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>Filtros</Text>
        </TouchableOpacity>
      </View>

      {/* RESULTADOS */}
      <Text style={styles.resultText}>
        {resultados.length} resultados encontrados
      </Text>

      <ScrollView style={{ marginTop: 10 }}>

        {resultados.map((b) => (
          <View key={b.id} style={styles.card}>
            <Image source={{ uri: b.foto }} style={styles.image} />

            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.nombre}>{b.nombre}</Text>
              </View>

              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{b.rating}</Text>
                <Text style={styles.reviewText}>({b.reviews})</Text>
                <Text style={styles.distancia}>{b.distancia}</Text>
              </View>

              <Text style={styles.direccion}>{b.direccion}</Text>

              <View
                style={[
                  styles.estadoBox,
                  {
                    backgroundColor:
                      b.estado === "Abierto"
                        ? "rgba(52,199,89,0.15)"
                        : b.estado === "Cierra pronto"
                        ? "rgba(255,159,10,0.15)"
                        : "rgba(255,69,58,0.15)",
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      b.estado === "Abierto"
                        ? "#34C759"
                        : b.estado === "Cierra pronto"
                        ? "#FF9F0A"
                        : "#FF3B30",
                    fontWeight: "600",
                  }}
                >
                  {b.estado}
                </Text>
              </View>

              <Text style={styles.precio}>{b.precio}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// 🎨 ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 16,
  },

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
    backgroundColor: "#fff",
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
    backgroundColor: "#2B69FF",
    marginLeft: 10,
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: 10,
  },

  resultText: {
    marginTop: 15,
    fontSize: 14,
    color: "#777",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
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

  nombre: {
    fontSize: 16,
    fontWeight: "700",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  ratingText: { marginLeft: 4, fontWeight: "600" },

  reviewText: { marginLeft: 4, color: "#777" },

  distancia: { marginLeft: 10, color: "#777" },

  direccion: {
    marginTop: 4,
    color: "#777",
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
