import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "./theme";

interface HeaderProps {
  onNotificationPress: () => void;
}

export default function Header({ onNotificationPress }: HeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.greetingText}>Good Morning</Text>
        <Text style={styles.subtitleText}>Ready to start learning?</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        onPress={onNotificationPress}
        style={styles.notificationButton}
      >
        <MaterialIcons name="notifications" size={20} color={COLORS.primary} />
      </Pressable>
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
    color: COLORS.primary,
  },
  subtitleText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  notificationButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
