import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import { API_BASE_URL } from "../config/env";
import { getToken } from "../utils/authStorage";

const API_URL = API_BASE_URL;

export default function MetodoPago() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { appointmentId, total, barberId, serviceName } = params;

    const [loading, setLoading] = useState(false);

    const handleCashPayment = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            // Registrar pago en efectivo (pendiente)
            await axios.post(
                `${API_URL}/payments`,
                {
                    monto: Number(total),
                    estado: "pendiente",
                    metodo: "cash",
                    barberoId: Number(barberId),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert(
                "Pago en tienda",
                "Pagarás en efectivo directamente en la barbería. ¡Gracias por tu reserva!",
                [{ text: "Entendido", onPress: () => router.replace("/homeCliente") }]
            );
        } catch (error) {
            console.log("Error creando pago cash:", error);
            Alert.alert("Error", "No se pudo registrar el pago.");
        } finally {
            setLoading(false);
        }
    };

    const handleMercadoPago = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            // Crear preferencia de pago
            const res = await axios.post(
                `${API_URL}/payments/preference`,
                {
                    title: `Servicio: ${serviceName}`,
                    quantity: 1,
                    price: Number(total) * 1000, // Asumiendo que 'total' está en miles (ej: 25 => 25000)
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { init_point } = res.data;
            if (init_point) {
                // Abrir navegador para pagar
                await WebBrowser.openBrowserAsync(init_point);
                // Opcional: Podríamos navegar a home o preguntar si ya pagó
                router.replace("/homeCliente");
            }
        } catch (error) {
            console.log("Error creando preferencia MP:", error);
            Alert.alert("Error", "No se pudo iniciar el pago con Mercado Pago.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#0f0c29", "#302b63", "#24243e"]}
                style={styles.background}
            />

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="card-outline" size={60} color="#fff" />
                </View>

                <Text style={styles.title}>Método de Pago</Text>
                <Text style={styles.subtitle}>
                    Selecciona cómo deseas pagar tu servicio de{"\n"}
                    <Text style={{ fontWeight: "700", color: "#4facfe" }}>{serviceName}</Text>
                </Text>
                <Text style={styles.price}>Total: ${total}k</Text>

                <View style={styles.buttonsContainer}>
                    {/* BOTÓN CASH */}
                    <TouchableOpacity
                        style={[styles.card, styles.cashCard]}
                        onPress={handleCashPayment}
                        disabled={loading}
                    >
                        <Ionicons name="cash-outline" size={32} color="#fff" />
                        <View style={styles.textWrapper}>
                            <Text style={styles.cardTitle}>Efectivo / En Tienda</Text>
                            <Text style={styles.cardDesc}>Paga al finalizar el servicio</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#ccc" />
                    </TouchableOpacity>

                    {/* BOTÓN MERCADOPAGO */}
                    <TouchableOpacity
                        style={[styles.card, styles.mpCard]}
                        onPress={handleMercadoPago}
                        disabled={loading}
                    >
                        <Ionicons name="wallet-outline" size={32} color="#fff" />
                        <View style={styles.textWrapper}>
                            <Text style={styles.cardTitle}>Pago Anticipado</Text>
                            <Text style={styles.cardDesc}>Mercado Pago (PSE, Tarjetas)</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#ccc" />
                    </TouchableOpacity>
                </View>

                {loading && <ActivityIndicator size="large" color="#4facfe" style={{ marginTop: 20 }} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    iconContainer: {
        marginBottom: 20,
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: 20,
        borderRadius: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#ccc",
        textAlign: "center",
        marginBottom: 30,
        lineHeight: 24,
    },
    price: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#00d2ff",
        marginBottom: 40,
    },
    buttonsContainer: {
        width: "100%",
        gap: 16,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    cashCard: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    mpCard: {
        backgroundColor: "#009ee3", // MercadoPago Blue
        borderColor: "#009ee3",
    },
    textWrapper: {
        flex: 1,
        marginLeft: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    cardDesc: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
    },
});
