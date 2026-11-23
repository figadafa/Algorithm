import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
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
import LearningMaterialsList from "@/components/LearningMaterialsList";
import { learningPaths } from "@/data/learningPaths";
import { useLearningMaterials } from "@/hooks/useLearningMaterials";
import { globalStyles } from "@/styles";

export default function LearnScreen() {
  const insets = useSafeAreaInsets();
  const { colors, darkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(
    learningPaths[0].title
  );
  const { materials, loading, error, retry } = useLearningMaterials();
  const categoryMaterials = materials.filter(
    (material) => material.kategori === selectedCategory
  );

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
          Learn
        </Text>
        <Text style={[globalStyles.subtitleText, { color: colors.text }]}>
          Pilih kategori untuk melihat materi pembelajaran
        </Text>

        <View style={styles.categoryTabs}>
          {learningPaths.map((path) => {
            const selected = path.title === selectedCategory;
            return (
              <Pressable
                key={path.id}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => setSelectedCategory(path.title)}
                style={[
                  styles.categoryTab,
                  {
                    backgroundColor: selected
                      ? colors.primary
                      : colors.cardBackground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <MaterialIcons
                  name={path.icon}
                  size={18}
                  color={selected ? "#ffffff" : colors.primary}
                />
                <Text
                  style={[
                    styles.categoryTabText,
                    { color: selected ? "#ffffff" : colors.text },
                  ]}
                >
                  {path.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.resultCount, { color: colors.secondary }]}>
          {loading
            ? "Memuat daftar materi..."
            : `${categoryMaterials.length} materi`}
        </Text>
        <LearningMaterialsList
          materials={categoryMaterials}
          loading={loading}
          error={error}
          onRetry={retry}
        />
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
  categoryTabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 20,
  },
  categoryTab: {
    alignItems: "center",
    borderRadius: BORDER_RADIUS / 2,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  resultCount: {
    fontSize: 12,
    marginTop: 18,
  },
});
