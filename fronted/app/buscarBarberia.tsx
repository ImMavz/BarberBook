import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, StyleSheet,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

const API_URL = "http://192.168.80.14:3000"; // ← cámbialo si usas ngrok

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


export default function BuscarBarberia() {

  const navigation = useNavigation();
  const route = useRoute();

  const initialQuery = (route.params as { initialQuery?: string })?.initialQuery || "";

  const [query, setQuery] = useState(initialQuery);
  const [resultados, setResultados] = useState<Barberia[]>([]);

    // 📌 TRAER BARBERÍAS DESDE EL BACKEND
  useEffect(() => {
    const cargarBarberias = async () => {
      try {
        const res = await axios.get(`${API_URL}/barbershops`);

        // Mapear cada barbería a lo que necesita el frontend
        const formateadas = res.data.map((b: any) => ({
          id: b.id,
          nombre: b.nombre,
          direccion: b.direccion,
          foto: b.foto || "https://i.ibb.co/4YgVZ5Q/barberia1.jpg",

          // ⭐ Cálculo del rating con base en reseñas
          rating:
            b.reseñas?.length > 0
              ? b.reseñas.reduce((acc: number, r: any) => acc + r.rating, 0) /
                b.reseñas.length
              : 4.5,

          reviews: b.reseñas?.length || 0,

          // 🔧 Valores por defecto hasta que tengas datos reales
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

  useEffect(() => {
    const q = query.toLowerCase();

    setResultados((prev) =>
      prev.filter((b: any) =>
        b.nombre.toLowerCase().includes(q) ||
        b.direccion.toLowerCase().includes(q)
      )
    );
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
