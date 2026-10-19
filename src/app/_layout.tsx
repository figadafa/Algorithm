import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNav from "@/components/BottomNav";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

// Komponen ini berada di dalam ThemeProvider & SafeAreaProvider,
// sehingga aman memanggil useTheme() dan useSafeAreaInsets().
function RootLayoutContent() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
      {/* BottomNav global: highlight & navigasi ditangani di dalam komponen */}
      <BottomNav bottomInset={insets.bottom} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
