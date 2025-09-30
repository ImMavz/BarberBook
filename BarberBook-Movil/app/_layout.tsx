import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Login será la primera pantalla */}
      <Stack.Screen name="loginCliente" />
      <Stack.Screen name="signUpCliente" />
      <Stack.Screen name="registro_barbero" />
      <Stack.Screen name="home" />
    </Stack>
  );
}
