import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { globalStyles } from "@/styles";

interface HeaderProps {
  onNotificationPress: () => void;
}

export default function Header({ onNotificationPress }: HeaderProps) {
  const { colors, darkMode, toggleTheme } = useTheme();
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    // Fungsi untuk menentukan sapaan berdasarkan waktu
    const updateGreeting = () => {
      const hours = new Date().getHours();
      if (hours < 12) {
        setGreeting("Good Morning");
      } else if (hours < 17) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    // Jalankan sekali saat mount
    updateGreeting();

    // Perbarui setiap menit untuk memastikan sapaan tetap akurat
    const intervalId = setInterval(updateGreeting, 60000);

    // Cleanup interval saat komponen unmount
    return () => clearInterval(intervalId);
  }, []); // Dependency array kosong agar interval hanya dibuat sekali

  return (
    <View style={styles.headerContainer}>
      <View>
        <Text style={[styles.greetingText, { color: colors.primary }]}>
          {greeting}
        </Text>
        <Text style={[globalStyles.subtitleText, { color: colors.text }]}>
          Ready to start learning?
        </Text>
      </View>
      <View style={styles.headerActions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            darkMode ? "Switch to light mode" : "Switch to dark mode"
          }
          onPress={toggleTheme}
          style={[
            styles.iconButton,
            globalStyles.shadow,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <MaterialIcons
            name={darkMode ? "light-mode" : "dark-mode"}
            size={20}
            color={colors.primary}
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={onNotificationPress}
          style={[
            styles.iconButton,
            globalStyles.shadow,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <MaterialIcons name="notifications" size={20} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 4,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
  },
});
