import BottomNav from "@/components/BottomNav";
import { LearningProgressProvider } from "@/context/LearningProgressContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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
      <BottomNav bottomInset={insets.bottom} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LearningProgressProvider>
          <RootLayoutContent />
        </LearningProgressProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
