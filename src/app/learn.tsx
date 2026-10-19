import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BORDER_RADIUS, useTheme } from "@/context/ThemeContext";
import { globalStyles } from "@/styles";

export default function LearnScreen() {
  const insets = useSafeAreaInsets();
  const { colors, darkMode } = useTheme();

  return (
    <View
      style={[
        styles.safeArea,
        { paddingTop: insets.top, backgroundColor: colors.background },
      ]}
    >
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={[globalStyles.sectionTitle, { color: colors.primary }]}>
          Learn
        </Text>
        <Text style={[globalStyles.subtitleText, { color: colors.text }]}>
          Welcome to the Learn page
        </Text>

        <View
          style={[
            styles.welcomeCard,
            globalStyles.shadow,
            {
              backgroundColor: colors.cardBackground,
              borderRadius: BORDER_RADIUS,
              borderColor: colors.border,
            },
          ]}
        >
          <MaterialIcons name="book" size={32} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.primary }]}>
            Your learning paths live here
          </Text>
          <Text style={[styles.cardDescription, { color: colors.text }]}>
            Materi pembelajaran sedang disiapkan. Stay tuned!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  welcomeCard: {
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
  },
});
