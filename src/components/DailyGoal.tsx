import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BORDER_RADIUS, useTheme } from "@/context/ThemeContext";
import { globalStyles } from "@/styles";

interface DailyGoalProps {
  isCompleted: boolean;
  onStartLearning: () => void;
}

export default function DailyGoal({
  isCompleted,
  onStartLearning,
}: DailyGoalProps) {
  const { colors } = useTheme();

  return (
    <View>
      <View style={styles.sectionTitleContainer}>
        <Text style={[globalStyles.sectionTitle, { color: colors.primary }]}>
          Daily Goal
        </Text>
      </View>
      <View
        style={[
          styles.dailyGoalCard,
          globalStyles.shadow,
          {
            backgroundColor: colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.dailyGoalTitle, { color: colors.primary }]}>
          {isCompleted
            ? "Daily Goal Reached!"
            : "Start your first learning session"}
        </Text>
        <Text style={[styles.dailyGoalSubtitle, { color: colors.text }]}>
          {isCompleted
            ? "Great job! Come back tomorrow for more."
            : "A little learning today goes a long way."}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onStartLearning}
          disabled={isCompleted}
          style={[
            styles.startButton,
            {
              backgroundColor: isCompleted ? colors.secondary : colors.primary,
              borderRadius: BORDER_RADIUS / 2,
              opacity: isCompleted ? 0.7 : 1,
            },
          ]}
        >
          <Text
            style={[styles.startButtonText, { color: colors.cardBackground }]}
          >
            {isCompleted ? "COMPLETED" : "START →"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitleContainer: {
    marginBottom: 12,
  },
  dailyGoalCard: {
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  dailyGoalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  dailyGoalSubtitle: {
    fontSize: 13,
    marginBottom: 12,
  },
  startButton: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
