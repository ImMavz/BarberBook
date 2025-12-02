import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="loginCliente" />
      <Stack.Screen name="signUpCliente" />
      <Stack.Screen name="HomeBarbero" />
      <Stack.Screen name="CitasAgendadas" />
      <Stack.Screen name="settingsBarberShop" />
      <Stack.Screen name="historialCitasBarbero" />
      <Stack.Screen name="estadisticas" />
      <Stack.Screen name="homeCliente" />
      <Stack.Screen name="agendarCita" />
    </Stack>
  );
}
