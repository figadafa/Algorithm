import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BORDER_RADIUS, useTheme } from "@/context/ThemeContext";
import { globalStyles } from "@/styles";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, darkMode, toggleTheme } = useTheme();

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
          Profile
        </Text>
        <Text style={[globalStyles.subtitleText, { color: colors.text }]}>
          Welcome to the Profile page
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
          <MaterialIcons name="person" size={32} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.primary }]}>
            Your account
          </Text>
          <Text style={[styles.cardDescription, { color: colors.text }]}>
            Pengaturan akun & statistikmu akan muncul di sini.
          </Text>
        </View>

        <Text
          style={[
            globalStyles.sectionTitle,
            { color: colors.primary, marginTop: 24, marginBottom: 12, fontSize: 18 },
          ]}
        >
          Pengaturan
        </Text>

        <View
          style={[
            styles.settingRow,
            globalStyles.shadow,
            {
              backgroundColor: colors.cardBackground,
              borderRadius: BORDER_RADIUS,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.settingIcon}>
            <MaterialIcons
              name={darkMode ? "dark-mode" : "light-mode"}
              size={24}
              color={colors.primary}
            />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              Dark Mode
            </Text>
            <Text style={[styles.settingDescription, { color: colors.secondary }]}>
              {darkMode ? "Tema gelap aktif" : "Tema terang aktif"}
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.cardBackground}
          />
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
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 2,
  },
});
