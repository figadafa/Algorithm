import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BORDER_RADIUS, useTheme } from "@/context/ThemeContext";
import { learningPaths } from "@/data/learningPaths";
import { globalStyles } from "@/styles";

export default function CourseDetailScreen() {
  const insets = useSafeAreaInsets();
  const { colors, darkMode } = useTheme();
  const router = useRouter();

  // Ambil parameter dinamis dari route /course/[id]
  const { id } = useLocalSearchParams<{ id: string }>();

  // Cari learning path berdasarkan id
  const course = learningPaths.find(
    (path) => path.id === Number(id)
  );

  const handleBack = () => {
    router.back();
  };

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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={[styles.backButton, { backgroundColor: colors.cardBackground }]}
        >
          <MaterialIcons name="arrow-back" size={20} color={colors.primary} />
          <Text style={[styles.backButtonText, { color: colors.primary }]}>
            Back
          </Text>
        </Pressable>

        {course ? (
          <>
            <Text style={[globalStyles.sectionTitle, { color: colors.primary }]}>
              {course.title}
            </Text>
            <Text style={[globalStyles.subtitleText, { color: colors.text }]}>
              {course.description}
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
              <MaterialIcons
                name={course.icon}
                size={32}
                color={colors.primary}
              />
              <Text style={[styles.cardTitle, { color: colors.primary }]}>
                Welcome to {course.title}
              </Text>
              <Text style={[styles.cardDescription, { color: colors.text }]}>
                Detail materi untuk jalur belajar ini sedang disiapkan.
              </Text>
            </View>
          </>
        ) : (
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
            <MaterialIcons name="error-outline" size={32} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.primary }]}>
              Course not found
            </Text>
            <Text style={[styles.cardDescription, { color: colors.text }]}>
              Learning path dengan id "{String(id)}" tidak ditemukan.
            </Text>
          </View>
        )}
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS / 2,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
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
