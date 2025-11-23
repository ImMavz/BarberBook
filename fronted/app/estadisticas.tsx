import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Estadisticas() {
  // ──────────────────────────────────────────────
  // 🔥 DATOS ESTÁTICOS (CAMBIAR CON EL BACKEND)
  // ‣ Aquí es donde vas a reemplazar con datos reales
  // ──────────────────────────────────────────────

  const totalReservas = 342;
  const ingresos = 8450;
  const rating = 4.8;

  // Ejemplo de datos por barbero (Cambiar más adelante)
  const barberos = [
    {
      id: 1,
      nombre: "Carlos Martínez",
      rating: 4.9,
      reservas: 89,
      ingresos: 2340,
      horas: 32,
      foto: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 2,
      nombre: "Miguel Rodríguez",
      rating: 4.7,
      reservas: 76,
      ingresos: 1980,
      horas: 28,
      foto: "https://i.pravatar.cc/150?img=15",
    },
    {
      id: 3,
      nombre: "Luis García",
      rating: 4.8,
      reservas: 67,
      ingresos: 1750,
      horas: 24,
      foto: "https://i.pravatar.cc/150?img=20",
    },
  ];

  return (
    <ScrollView style={styles.container}>

      {/* ────────────────────────────────────────────── */}
      {/* HEADER */}
      {/* ────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Ionicons name="stats-chart" size={24} color="#fff" />
        <Text style={styles.headerTitle}>Estadísticas</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ────────────────────────────────────────────── */}
      {/* TARJETA PRINCIPAL */}
      {/* ────────────────────────────────────────────── */}
      <View style={styles.bigCard}>
        <View>
          <Text style={styles.bigCardTitle}>Total Reservaciones</Text>
          <Text style={styles.bigCardNumber}>{totalReservas}</Text>
          <Text style={styles.bigCardSub}>+12% vs mes anterior</Text>
        </View>
        <Ionicons name="calendar" size={32} color="#fff" />
      </View>

      {/* KPIs */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiLabel}>Ingresos</Text>
          <Text style={styles.kpiValue}>${ingresos}</Text>
        </View>

        <View style={styles.kpiBox}>
          <Text style={styles.kpiLabel}>Rating Promedio</Text>
          <Text style={styles.kpiValue}>{rating}</Text>
        </View>
      </View>

      {/* ────────────────────────────────────────────── */}
      {/* ESTADÍSTICAS POR BARBERO */}
      {/* ────────────────────────────────────────────── */}
      <Text style={styles.title}>Estadísticas por Barbero</Text>

      {barberos.map((b) => (
        <View key={b.id} style={styles.barberoCard}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Image
                  source={{ uri: b.foto }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
            </View>

            <View style={{ marginLeft: 10 }}>
              <Text style={styles.barberoNombre}>{b.nombre}</Text>
              <Text style={styles.barberoRating}>⭐ {b.rating}</Text>
            </View>
          </View>

          <View style={styles.barberoStatsRow}>
            <Text style={styles.barberoSmallNumber}>{b.reservas}</Text>
            <Text style={styles.barberoSmallLabel}>Reservas</Text>

            <Text style={[styles.barberoSmallNumber, { color: "green" }]}>
              ${b.ingresos}
            </Text>
            <Text style={styles.barberoSmallLabel}>Ingresos</Text>

            <Text style={[styles.barberoSmallNumber, { color: "#8455FF" }]}>
              {b.horas}h
            </Text>
            <Text style={styles.barberoSmallLabel}>Horas</Text>
          </View>
        </View>
      ))}

      {/* ────────────────────────────────────────────── */}
      {/* HORAS MÁS SOLICITADAS (GRÁFICO BARRAS) */}
      {/* ────────────────────────────────────────────── */}
      <Text style={styles.title}>Horas Más Solicitadas</Text>

      <BarChart
        data={{
          labels: ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"],
          datasets: [{ data: [10, 20, 35, 40, 30, 25, 50, 45, 25] }],
        }}
        width={screenWidth - 20}
        height={250}
        chartConfig={chartConfig}
        style={styles.chart}
        yAxisLabel=""
        yAxisSuffix=""
      />

      {/* ────────────────────────────────────────────── */}
      {/* SERVICIOS MÁS POPULARES (GRÁFICO DONA) */}
      {/* ────────────────────────────────────────────── */}
      <Text style={styles.title}>Servicios Más Populares</Text>

      <PieChart
        data={[
          { name: "Corte Clásico", population: 45, color: "#D4A017", legendFontColor: "#333", legendFontSize: 12 },
          { name: "Barba", population: 28, color: "#A3542B", legendFontColor: "#333", legendFontSize: 12 },
          { name: "Corte + Barba", population: 18, color: "#444", legendFontColor: "#333", legendFontSize: 12 },
          { name: "Otros", population: 9, color: "#888", legendFontColor: "#333", legendFontSize: 12 },
        ]}
        width={screenWidth - 20}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      {/* ────────────────────────────────────────────── */}
      {/* INGRESOS POR MES (LÍNEA) */}
      {/* ────────────────────────────────────────────── */}
      <Text style={styles.title}>Ingresos del Mes</Text>

      <LineChart
        data={{
          labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
          datasets: [{ data: [1750, 2000, 2350, 2100] }],
        }}
        width={screenWidth - 20}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ──────────────────────────────────────────────
// CONFIGURACIÓN DE ESTILOS Y GRÁFICOS
// ──────────────────────────────────────────────

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: () => "#666",
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6f8" },

  header: {
    backgroundColor: "#3875f6",
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 45,
  },
  headerTitle: { color: "#fff", marginLeft: 10, fontSize: 18, fontWeight: "700" },

  bigCard: {
    backgroundColor: "#3875f6",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bigCardTitle: { color: "#fff", fontSize: 14 },
  bigCardNumber: { color: "#fff", fontSize: 36, fontWeight: "bold" },
  bigCardSub: { color: "#dce3ff", marginTop: 4 },

  kpiRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16 },
  kpiBox: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    elevation: 2,
  },
  kpiLabel: { fontSize: 13, color: "#777" },
  kpiValue: { fontSize: 20, marginTop: 4, fontWeight: "700" },

  title: { fontSize: 18, fontWeight: "700", marginTop: 20, marginLeft: 16, marginBottom: 10 },

  barberoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    marginBottom: 12,
  },
  avatarContainer: { width: 50, height: 50 },
  avatar: { width: 50, height: 50, borderRadius: 50, overflow: "hidden" },
  barberoNombre: { fontSize: 16, fontWeight: "700" },
  barberoRating: { fontSize: 12, color: "#777" },

  barberoStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  barberoSmallNumber: { fontSize: 18, fontWeight: "700", textAlign: "center" },
  barberoSmallLabel: { fontSize: 11, color: "#666", marginTop: -3 },

  chart: {
    marginVertical: 10,
    borderRadius: 16,
    alignSelf: "center",
  },
});
