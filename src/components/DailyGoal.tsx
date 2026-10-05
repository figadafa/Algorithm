import { Pressable, StyleSheet, Text, View } from "react-native";
import { BORDER_RADIUS, COLORS } from "./theme";

interface DailyGoalProps {
  onStartLearning: () => void;
}

export default function DailyGoal({ onStartLearning }: DailyGoalProps) {
  return (
    <View>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Daily Goal</Text>
      </View>
      <View style={styles.dailyGoalCard}>
        <Text style={styles.dailyGoalTitle}>
          Start your first learning session
        </Text>
        <Text style={styles.dailyGoalSubtitle}>
          A little learning today goes a long way.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onStartLearning}
          style={styles.startButton}
        >
          <Text style={styles.startButtonText}>START →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitleContainer: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  dailyGoalCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dailyGoalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  dailyGoalSubtitle: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginBottom: 12,
  },
  startButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
});
