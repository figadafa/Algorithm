import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BORDER_RADIUS, useTheme } from "@/context/ThemeContext";

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

interface StreakCardProps {
  streak: number;
  completedDays: boolean[];
}

export default function StreakCard({ streak, completedDays }: StreakCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.streakCard,
        { backgroundColor: colors.primary, borderRadius: BORDER_RADIUS },
      ]}
    >
      <View style={styles.streakContent}>
        <View>
          <Text style={[styles.streakNumber, { color: colors.cardBackground }]}>
            {streak}
          </Text>
          <Text style={[styles.streakLabel, { color: colors.cardBackground }]}>
            DAY STREAK
          </Text>
        </View>
        <View style={styles.streakMessageContainer}>
          <Text
            style={[styles.streakMessageTitle, { color: colors.cardBackground }]}
          >
            {streak > 0 ? "Keep it up!" : "Your streak starts today"}
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
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <View key={`${day}-${index}`} style={styles.dayIndicator}>
            <Text style={[styles.dayText, { color: colors.cardBackground }]}>
              {day}
            </Text>
            <View
              style={[
                styles.circleIndicator,
                {
                  borderColor: colors.cardBackground,
                  backgroundColor: completedDays[index]
                    ? colors.cardBackground
                    : "transparent",
                  opacity: completedDays[index] ? 1 : 0.4,
                },
              ]}
            />
          </View>
        ))}
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
    marginBottom: 12,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: "bold",
  },
  streakLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  streakMessageContainer: {
    alignItems: "flex-end",
  },
  streakMessageTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  streakMessageSubtitle: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "right",
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 4,
  },
  dayIndicator: {
    alignItems: "center",
  },
  dayText: {
    fontSize: 12,
    marginBottom: 4,
  },
  circleIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
});
