import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { BarChart, PieChart, LineChart } from "react-native-chart-kit";
import { getToken, getUsuario } from "../utils/authStorage";
import { useTheme } from "./context/ThemeContext";

const screenWidth = Dimensions.get("window").width;

const API_URL = "http://192.168.80.14:3000";

interface StatsBarbero {
  reservas: number;
  ingresos: number;
}


export default function Estadisticas() {
  const { colors, isDark } = useTheme();

  

  // Estados globales
  const [loading, setLoading] = useState(true);
  const [citasMes, setCitasMes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [barberos, setBarberos] = useState([]);
  const [estadisticasBarbero, setEstadisticasBarbero] = useState<StatsBarbero | null>(null);


  const now = new Date();
  const mesActual = now.getMonth() + 1; // 1-12
  const añoActual = now.getFullYear();

  const coloresPie = [
  "#D4A017",
  "#A3542B",
  "#444",
  "#888",
  "#3B6EF6",
  "#FF7F50",
  "#6A5ACD",
  "#2E8B57",
  "#FF6347",
];

  

  useEffect(() => {
    cargarDatos();
  }, []);

  
  // Backend
const cargarDatos = async () => {
  try {
    const token = await getToken();
    const usuario = await getUsuario();

    if (!usuario || !usuario.barbershopId) {
      console.log("No hay barbería asociada");
      return;
    }

    // 1) Citas del barbero (todas)
    const resCitas = await axios.get(
      `${API_URL}/appointments/barbershop/${usuario.barbershopId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const citasFiltradas = resCitas.data.filter((c: any) => {
      const f = new Date(c.fecha);
      return f.getMonth() + 1 === mesActual && f.getFullYear() === añoActual;
    });

    setCitasMes(citasFiltradas);

    // 2) Servicios
    const resServicios = await axios.get(`${API_URL}/services`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setServicios(resServicios.data);

    // 3) Barberos de la barbería
    const resBarberos = await axios.get(
      `${API_URL}/barbers/barbershop/${usuario.barbershopId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 4) Agregar estadísticas a cada barbero
    const barberosConStats = resBarberos.data.map((b: any) => {
      const citasDelBarbero = citasFiltradas.filter(
        (c: any) => c.barbero?.id === b.id
      );

      const ingresos = citasDelBarbero.reduce((acc: number, c: any) => {
        const precio = Number(c.servicio?.precio ?? 0);
        return acc + (isNaN(precio) ? 0 : precio);
      }, 0);

      return {
        ...b,
        citasMes: citasDelBarbero.length,
        ingresos,
      };
    });


    setBarberos(barberosConStats);

    // 5) Estadísticas del barbero LOGEADO
    const citasBarbero = citasFiltradas.filter(
      (c: any) => c.barbero?.id === usuario.barberoId
    );

    const ingresosBarbero = citasBarbero.reduce((acc: number, c: any) => {
      const precio = Number(c.servicio?.precio ?? 0);
      return acc + (isNaN(precio) ? 0 : precio);
    }, 0);

    setEstadisticasBarbero({
      reservas: citasBarbero.length,
      ingresos: ingresosBarbero,
    });

    setLoading(false);
  } catch (err) {
    console.log("❌ Error cargando estadísticas:", err);
    setLoading(false);
  }
};


  
  // calculos estadísticos


  const totalReservas = citasMes.length;

    const ingresosTotales = citasMes.reduce((acc: number, c: any) => {
      const precio = Number(c.servicio?.precio ?? 0);
      return acc + (isNaN(precio) ? 0 : precio);
    }, 0);


  // horas mas solicitadas
  
  const horasFrecuentes: any = {};

  citasMes.forEach((c: any) => {
    const hora = c.horaInicio?.slice(0, 5); // ej: "14:00"
    if (!horasFrecuentes[hora]) horasFrecuentes[hora] = 0;
    horasFrecuentes[hora]++;
  });

  const horasLabels = Object.keys(horasFrecuentes);
  const horasValues = Object.values(horasFrecuentes).map((v: any) => Number.isFinite(v) ? v : 0);



  
  // servicios mas populares
  
  const serviciosFrecuentes: any = {};

  citasMes.forEach((c: any) => {
    const nombre = c.servicio?.nombre;
    if (!nombre) return;
    if (!serviciosFrecuentes[nombre]) serviciosFrecuentes[nombre] = 0;
    serviciosFrecuentes[nombre]++;
  });

  const serviciosPieData =
    Object.keys(serviciosFrecuentes).map((nombre, i) => ({
      name: nombre || "Servicio",
      population: Number(serviciosFrecuentes[nombre] ?? 0),
      color: coloresPie[i % coloresPie.length],
      legendFontColor: colors.text,
      legendFontSize: 12,
    }));

  // ingresos semanales del mes
  
  const ingresosPorSemana = [0, 0, 0, 0];

  citasMes.forEach((c: any) => {
    const fecha = new Date(c.fecha);
    const semana = Math.floor((fecha.getDate() - 1) / 7);

    const precio = Number(c.servicio?.precio ?? 0);
    ingresosPorSemana[semana] += isNaN(precio) ? 0 : precio;
  });

  
  // configuración de gráficos (modo oscuro/claro)
  
  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.text,
    labelColor: () => colors.textSecondary,
  };

  
  // pantalla de carga
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  //funcion principal

  console.log({
  horasValues,
  ingresosPorSemana,
  serviciosPieData,
  ingresosTotales
});


  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>

      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Ionicons name="stats-chart" size={24} color="#fff" />
        <Text style={styles.headerTitle}>Estadísticas</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* TARJETA PRINCIPAL */}
      <View style={[styles.bigCard, { backgroundColor: colors.primary }]}>
        <View>
          <Text style={styles.bigCardTitle}>Total Reservaciones</Text>
          <Text style={styles.bigCardNumber}>{totalReservas}</Text>
        </View>
        <Ionicons name="calendar" size={32} color="#fff" />
      </View>

      {/* KPIs */}
      <View style={styles.kpiRow}>
        <View style={[styles.kpiBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.kpiLabel, { color: colors.text }]}>Ingresos</Text>
          <Text style={[styles.kpiValue, { color: colors.text }]}>
            ${ingresosTotales}
          </Text>
        </View>

        <View style={[styles.kpiBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.kpiLabel, { color: colors.text }]}>
            Reservas Barbero
          </Text>
          <Text style={[styles.kpiValue, { color: colors.text }]}>
            {estadisticasBarbero?.reservas}
          </Text>
        </View>
      </View>

      {/* BARBEROS */}
      <Text style={[styles.title, { color: colors.text }]}>Estadísticas por Barbero</Text>

      {barberos.map((b: any) => (
        <View key={b.id} style={[styles.barberoCard, { backgroundColor: colors.card }]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: b.foto || "https://i.pravatar.cc/150" }}
              style={styles.avatar}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={[styles.barberoNombre, { color: colors.text }]}>
                {b.nombre}
              </Text>
            </View>
          </View>

          <View style={styles.barberoStatsRow}>
            <Text style={[styles.barberoSmallNumber, { color: colors.text }]}>
              {b.citasMes || 0}
            </Text>
            <Text style={[styles.barberoSmallLabel, { color: colors.textSecondary }]}>
              Reservas
            </Text>

            <Text style={[styles.barberoSmallNumber, { color: "green" }]}>
              ${b.ingresos || 0}
            </Text>
            <Text style={[styles.barberoSmallLabel, { color: colors.textSecondary }]}>
              Ingresos
            </Text>
          </View>
        </View>
      ))}

      {/* HORAS MÁS SOLICITADAS */}
      <Text style={[styles.title, { color: colors.text }]}>Horas más solicitadas</Text>
      <BarChart
        data={{
          labels: horasLabels,
          datasets: [{ data: horasValues }],
        }}
        width={screenWidth - 20}
        height={250}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={chartConfig}
        style={styles.chart}
      />


      {/* SERVICIOS MÁS POPULARES */}
      <Text style={[styles.title, { color: colors.text }]}>Servicios más populares</Text>

      <PieChart
        data={serviciosPieData}
        width={screenWidth - 20}
        height={220}
        accessor="population"
        backgroundColor="transparent"
        chartConfig={chartConfig}
        paddingLeft="15"
      />

      {/* INGRESOS DEL MES (SEMANAS) */}
      <Text style={[styles.title, { color: colors.text }]}>Ingresos del mes</Text>

      <LineChart
        data={{
          labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
          datasets: [{ data: ingresosPorSemana }],
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


const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 45,
  },
  headerTitle: { color: "#fff", marginLeft: 10, fontSize: 18, fontWeight: "700" },

  bigCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bigCardTitle: { color: "#fff", fontSize: 14 },
  bigCardNumber: { color: "#fff", fontSize: 36, fontWeight: "bold" },

  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  kpiBox: {
    width: "48%",
    padding: 18,
    borderRadius: 16,
  },
  kpiLabel: { fontSize: 13 },
  kpiValue: { fontSize: 20, marginTop: 4, fontWeight: "700" },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginLeft: 16,
    marginBottom: 10,
  },

  barberoCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  avatar: { width: 50, height: 50, borderRadius: 50 },

  barberoNombre: { fontSize: 16, fontWeight: "700" },

  barberoStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  barberoSmallNumber: { fontSize: 18, fontWeight: "700" },
  barberoSmallLabel: { fontSize: 11 },

  chart: {
    marginVertical: 10,
    borderRadius: 16,
    alignSelf: "center",
  },
});
