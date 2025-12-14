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
import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import { API_BASE_URL } from "../config/env";
import { getToken } from "../utils/authStorage";
import { Colors } from "../constants/theme";
import { useColorScheme } from "react-native";

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
                    price: Number(total), // El total ya viene completo desde la BD
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

    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const textColor = themeColors.text;
    const backgroundColor = themeColors.background;
    const iconColor = colorScheme === 'dark' ? '#fff' : '#000'; // Or use themeColors.icon

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: colorScheme === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }]}>
                    <Ionicons name="card-outline" size={60} color={textColor} />
                </View>

                <Text style={[styles.title, { color: textColor }]}>Método de Pago</Text>
                <Text style={[styles.subtitle, { color: textColor }]}>
                    Selecciona cómo deseas pagar tu servicio de{"\n"}
                    <Text style={{ fontWeight: "700", color: "#4facfe" }}>{serviceName}</Text>
                </Text>
                <Text style={[styles.price, { color: "#00d2ff" }]}>Total: ${total}</Text>

                <View style={styles.buttonsContainer}>
                    {/* BOTÓN CASH */}
                    <TouchableOpacity
                        style={[
                            styles.card,
                            {
                                backgroundColor: colorScheme === 'dark' ? "rgba(255, 255, 255, 0.05)" : "#f0f0f0",
                                borderColor: colorScheme === 'dark' ? "rgba(255,255,255,0.1)" : "#e0e0e0"
                            }
                        ]}
                        onPress={handleCashPayment}
                        disabled={loading}
                    >
                        <Ionicons name="cash-outline" size={32} color={textColor} />
                        <View style={styles.textWrapper}>
                            <Text style={[styles.cardTitle, { color: textColor }]}>Efectivo / En Tienda</Text>
                            <Text style={[styles.cardDesc, { color: colorScheme === 'dark' ? "rgba(255,255,255,0.8)" : "#666" }]}>Paga al finalizar el servicio</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={colorScheme === 'dark' ? "#ccc" : "#999"} />
                    </TouchableOpacity>

                    {/* BOTÓN MERCADOPAGO */}
                    <TouchableOpacity
                        style={[styles.card, styles.mpCard]}
                        onPress={handleMercadoPago}
                        disabled={loading}
                    >
                        <Ionicons name="wallet-outline" size={32} color="#fff" />
                        <View style={styles.textWrapper}>
                            <Text style={[styles.cardTitle, { color: '#fff' }]}>Pago Anticipado</Text>
                            <Text style={[styles.cardDesc, { color: "rgba(255,255,255,0.9)" }]}>Mercado Pago (PSE, Tarjetas)</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#eee" />
                    </TouchableOpacity>
                </View>

                {loading && <ActivityIndicator size="large" color="#4facfe" style={{ marginTop: 20 }} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    // background removed
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
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
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
    // cashCard removed
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
    },
    cardDesc: {
        fontSize: 14,
    },
});
