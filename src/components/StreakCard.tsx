import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BORDER_RADIUS, useTheme } from "@/context/ThemeContext";

interface StreakCardProps {
  streak: number;
}

export default function StreakCard({ streak }: StreakCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.streakCard,
        { backgroundColor: colors.primary, borderRadius: BORDER_RADIUS },
      ]}
    >
      <View style={styles.streakContent}>
        <View style={styles.streakInfo}>
          <Text style={[styles.streakNumber, { color: colors.cardBackground }]}>
            {streak}
          </Text>
          <View style={styles.streakLabelContainer}>
            <MaterialIcons 
              name="local-fire-department" 
              size={24} 
              color={streak > 0 ? "#FF9500" : colors.cardBackground} 
              style={streak > 0 ? styles.fireIconActive : styles.fireIcon}
            />
            <Text style={[styles.streakLabel, { color: colors.cardBackground }]}>
              DAY STREAK
            </Text>
          </View>
        </View>
        <View style={styles.streakMessageContainer}>
          <Text
            style={[styles.streakMessageTitle, { color: colors.cardBackground }]}
          >
            {streak > 0 ? "Keep your streak alive!" : "Your streak starts today"}
          </Text>
          <Text
            style={[
              styles.streakMessageSubtitle,
              { color: colors.cardBackground },
            ]}
          >
            {streak > 0
              ? "Consistency is the key to success."
              : "One session. One step forward."}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  streakCard: {
    padding: 16,
    marginBottom: 20,
  },
  streakContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: "bold",
    marginRight: 8,
  },
  streakLabelContainer: {
    justifyContent: "center",
  },
  fireIcon: {
    marginBottom: 2,
    opacity: 0.5,
  },
  fireIconActive: {
    marginBottom: 2,
    shadowColor: "#FF9500",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.7,
  },
  streakMessageContainer: {
    alignItems: "flex-end",
    flex: 1,
    marginLeft: 16,
  },
  streakMessageTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },
  streakMessageSubtitle: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "right",
    marginTop: 4,
  },
});
