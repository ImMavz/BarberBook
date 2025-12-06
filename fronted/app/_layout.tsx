import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="loginCliente" />
          <Stack.Screen name="signUpCliente" />
          <Stack.Screen name="homeBarbero" />
          <Stack.Screen name="citasAgendadas" />
          <Stack.Screen name="settingsBarberShop" />
          <Stack.Screen name="historialCitasBarbero" />
          <Stack.Screen name="estadisticas" />
          <Stack.Screen name="homeCliente" />
          <Stack.Screen name="agendarCita" />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
