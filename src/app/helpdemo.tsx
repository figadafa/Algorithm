import { BORDER_RADIUS, useTheme } from "@/context/ThemeContext";
import { globalStyles } from "@/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
          Help
        </Text>
        <Text style={[globalStyles.subtitleText, { color: colors.text }]}>
          Welcome to the Help Center page
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
          <MaterialIcons name="help" size={32} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.primary }]}>
            Find bug or need Something?
          </Text>
          <Text style={[styles.cardDescription, { color: colors.text }]}>
            Help center is under maintenanced. Stay tuned!
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
