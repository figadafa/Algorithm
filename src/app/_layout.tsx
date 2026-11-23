import BottomNav from "@/components/BottomNav";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LearningProgressProvider } from "@/context/LearningProgressContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// Komponen ini berada di dalam semua provider, aman memanggil useTheme(),
// useAuth(), useSafeAreaInsets(), useSegments(), dan useRouter().
function RootLayoutContent() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const inAuthGroup = segments[0] === "(auth)";

  // Overlay dipakai saat sesi dipulihkan dan saat redirect masih tertunda.
  // Nilainya diturunkan langsung dari kondisi guard, tanpa setState di effect.
  const needsRedirect =
    !loading && ((!user && !inAuthGroup) || (user && inAuthGroup));
  const showOverlay = loading || needsRedirect;

  useEffect(() => {
    // RULE 1: sesi masih dipulihkan — jangan redirect dulu.
    if (loading) return;

    // RULE 2 & 4: tanpa user di luar grup auth (termasuk setelah logout),
    // kunci kembali ke /login.
    if (!user && !inAuthGroup) {
      router.replace("/login");
      return;
    }

    // RULE 3: sudah login tapi masih di grup auth → masuk ke Home.
    if (user && inAuthGroup) {
      router.replace("/");
    }
  }, [user, loading, inAuthGroup, router]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* <Stack> HARUS selalu dirender, jangan diganti spinner. */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />

      {user && !loading && !inAuthGroup ? (
        <BottomNav bottomInset={insets.bottom} />
      ) : null}

      {showOverlay ? (
        <View style={[styles.overlay, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <LearningProgressProvider>
            <RootLayoutContent />
          </LearningProgressProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
