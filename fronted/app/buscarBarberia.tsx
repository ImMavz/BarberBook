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
import { API_BASE_URL } from "@env";

const API_URL = API_BASE_URL;

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
  const [todasLasBarberias, setTodasLasBarberias] = useState<Barberia[]>([]);
  const [resultados, setResultados] = useState<Barberia[]>([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // FILTROS
  const [serviciosDisponibles, setServiciosDisponibles] = useState<string[]>([]);
  const [filtroServicio, setFiltroServicio] = useState<string | null>(null);

  const [rangoPrecio, setRangoPrecio] = useState({ min: 0, max: 100000 });
  const [duracionMax, setDuracionMax] = useState(60);

  const [soloDisponiblesHoy, setSoloDisponiblesHoy] = useState(false);

  
  const aplicarFiltros = () => {
    let filtradas = [...todasLasBarberias];

    // --- FILTRO POR SERVICIO ---
    if (filtroServicio) {
      filtradas = filtradas.filter((b: any) =>
        b.servicios?.some((s: any) => s.nombre === filtroServicio)
      );
    }

    // --- FILTRO POR PRECIO ---
    filtradas = filtradas.filter((b: any) => {
      const precios = b.servicios?.map((s: any) => s.precio) || [];
      const precioMin = Math.min(...precios);
      const precioMax = Math.max(...precios);
      return precioMin >= rangoPrecio.min && precioMax <= rangoPrecio.max;
    });

    // --- FILTRO POR DURACIÓN ---
    filtradas = filtradas.filter((b: any) =>
      b.servicios?.some((s: any) => s.duracion <= duracionMax)
    );

    // --- FILTRO POR DISPONIBILIDAD HOY ---
    if (soloDisponiblesHoy) {
      const diaActual = new Date()
        .toLocaleDateString("es-ES", { weekday: "long" })
        .toLowerCase(); // ejemplo: "lunes", "martes", "miércoles"

      filtradas = filtradas.filter((b: any) => {
        if (!b.horarios_globales) return false;

        // Obtener horario del día actual
        const horario = b.horarios_globales[diaActual];

        // Está disponible si existe y no es vacío
        return typeof horario === "string" && horario.trim() !== "";
      });
    }


    setResultados(filtradas);
    setMostrarFiltros(false);
  };

  // =========================================
  //   Cargar barberías
  // =========================================
  useEffect(() => {
    const cargarBarberias = async () => {
      try {
        const res = await axios.get(`${API_URL}/barbershops`);
        // Cargar servicios
        const serviciosRes = await axios.get(`${API_URL}/services`);
        setServiciosDisponibles(serviciosRes.data.map((s: any) => s.nombre));

        const formateadas = res.data.map((b: any) => ({
          id: b.id,
          nombre: b.nombre,
          direccion: b.direccion,
          foto: b.foto || "https://i.ibb.co/4YgVZ5Q/barberia1.jpg",

          // ⭐ Estos dos campos son necesarios para los filtros
          servicios: b.servicios || [],
          horarios_globales: b.horariosGlobales || {},


          rating:
            b.reseñas?.length > 0
              ? b.reseñas.reduce((acc: number, r: any) => acc + r.rating, 0) /
                b.reseñas.length
              : 4.5,
          reviews: b.reseñas?.length || 0,
          distancia: "1 km",
          estado: "Abierto",

          // NO inventes precios aquí (los filtros usan valores reales)
          // Mejor eliminamos esto y usamos el precio real en filtros
          precio: null,
        }));


        setTodasLasBarberias(formateadas);
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
    const q = query.trim().toLowerCase();

    const filtradas = todasLasBarberias.filter(
      (b) =>
        b.nombre.toLowerCase().includes(q) ||
        b.direccion.toLowerCase().includes(q)
    );

    setResultados(filtradas);
  }, [query, todasLasBarberias]);
  
  const limpiarFiltros = () => {
    setFiltroServicio(null);
    setRangoPrecio({ min: 0, max: 100000 });
    setDuracionMax(60);
    setSoloDisponiblesHoy(false);

    setResultados(todasLasBarberias); // restaurar lista completa
    setMostrarFiltros(false);
  };


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

        <TouchableOpacity
          style={[styles.filterBtn, { backgroundColor: colors.primary }]}
          onPress={() => setMostrarFiltros(true)}
        >
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

      {mostrarFiltros && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "90%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
              Filtros
            </Text>

            {/* FILTRO POR SERVICIO */}
            <Text style={{ marginBottom: 6 }}>Servicio</Text>
            {serviciosDisponibles.map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setFiltroServicio(s)}
                style={{
                  padding: 10,
                  backgroundColor: filtroServicio === s ? "#2196F3" : "#eee",
                  borderRadius: 6,
                  marginBottom: 6,
                }}
              >
                <Text style={{ color: filtroServicio === s ? "#fff" : "#000" }}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}

            {/* PRECIO */}
            <Text style={{ marginTop: 15, marginBottom: 6 }}>
              Rango de precio (mín - máx)
            </Text>
            <TextInput
              keyboardType="numeric"
              placeholder="Precio mínimo"
              value={String(rangoPrecio.min)}
              onChangeText={(v) =>
                setRangoPrecio((prev) => ({ ...prev, min: Number(v) }))
              }
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 8,
                borderRadius: 6,
                marginBottom: 6,
              }}
            />
            <TextInput
              keyboardType="numeric"
              placeholder="Precio máximo"
              value={String(rangoPrecio.max)}
              onChangeText={(v) =>
                setRangoPrecio((prev) => ({ ...prev, max: Number(v) }))
              }
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 8,
                borderRadius: 6,
              }}
            />

            {/* DURACIÓN */}
            <Text style={{ marginTop: 15, marginBottom: 6 }}>
              Duración máxima (minutos)
            </Text>
            <TextInput
              keyboardType="numeric"
              placeholder="Ej: 30"
              value={String(duracionMax)}
              onChangeText={(v) => setDuracionMax(Number(v))}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 8,
                borderRadius: 6,
              }}
            />

            {/* DISPONIBILIDAD HOY */}
            <TouchableOpacity
              onPress={() => setSoloDisponiblesHoy(!soloDisponiblesHoy)}
              style={{
                marginTop: 20,
                padding: 12,
                backgroundColor: soloDisponiblesHoy ? "#4CAF50" : "#eee",
                borderRadius: 8,
              }}
            >
              <Text style={{ textAlign: "center", color: soloDisponiblesHoy ? "#fff" : "#000" }}>
                Solo barberías disponibles HOY
              </Text>
            </TouchableOpacity>

            {/* BOTONES */}
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: "#ccc",
                  borderRadius: 8,
                  marginRight: 8,
                }}
                onPress={() => setMostrarFiltros(false)}
              >
                <Text style={{ textAlign: "center" }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: "#FF6B6B",
                  borderRadius: 8,
                  marginRight: 8,
                }}
                onPress={limpiarFiltros}
              >
                <Text style={{ textAlign: "center", color: "#fff", fontWeight: "600" }}>
                  Limpiar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: "#2196F3",
                  borderRadius: 8,
                }}
                onPress={aplicarFiltros}
              >
                <Text style={{ textAlign: "center", color: "#fff", fontWeight: "600" }}>
                  Aplicar
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      )}


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
