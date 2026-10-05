import { StyleSheet, Text, View } from "react-native";
import { BORDER_RADIUS, COLORS } from "./theme";

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

export default function StreakCard() {
  return (
    <View style={styles.streakCard}>
      <View style={styles.streakContent}>
        <View>
          <Text style={styles.streakNumber}>0</Text>
          <Text style={styles.streakLabel}>DAY STREAK</Text>
        </View>
        <View style={styles.streakMessageContainer}>
          <Text style={styles.streakMessageTitle}>
            Your streak starts today
          </Text>
          <Text style={styles.streakMessageSubtitle}>
            One session. One step forward.
          </Text>
        </View>
      </View>
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <View key={`${day}-${index}`} style={styles.dayIndicator}>
            <Text style={styles.dayText}>{day}</Text>
            <View style={styles.circleIndicator} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  streakCard: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS,
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
    color: COLORS.card,
  },
  streakLabel: {
    fontSize: 12,
    color: COLORS.card,
    opacity: 0.7,
  },
  streakMessageContainer: {
    alignItems: "flex-end",
  },
  streakMessageTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.card,
  },
  streakMessageSubtitle: {
    fontSize: 12,
    color: COLORS.card,
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
    color: COLORS.card,
    marginBottom: 4,
  },
  circleIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.card,
    opacity: 0.4,
  },
});
