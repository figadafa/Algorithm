
import React, { useEffect } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CourseCard from "@/components/CourseCard";
import DailyGoal from "@/components/DailyGoal";
import Header from "@/components/Header";
import StreakCard from "@/components/StreakCard";
import { useLearningProgress } from "@/context/LearningProgressContext";
import { useTheme } from "@/context/ThemeContext";
import { learningPaths } from "@/data/learningPaths";
import { globalStyles } from "@/styles";

function HomeScreenContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, darkMode } = useTheme();

  const {
    streak,
    completedDays,
    dailyGoalCompleted,
    progressPercentage,
    handleStartLearning,
  } = useLearningProgress();

  useEffect(() => {
    if (dailyGoalCompleted) {
      console.log("Mantap! Kamu telah menyelesaikan target hari ini. 🔥");
    }
  }, [dailyGoalCompleted]);

  const handleNotificationPress = () => {
    console.log("Notification icon pressed!");
  };

  const handleCoursePress = (id: number) => {
    router.push({
      pathname: "/course/[id]",
      params: { id: String(id) },
    });
  };

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
          backgroundColor: colors.background,
        },
      ]}
    >
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Header onNotificationPress={handleNotificationPress} />

        <StreakCard streak={streak} completedDays={completedDays} />

        <DailyGoal
          isCompleted={dailyGoalCompleted}
          onStartLearning={handleStartLearning}
        />

        <View style={styles.sectionTitleContainer}>
          <View>
            <Text
              style={[globalStyles.sectionTitle, { color: colors.primary }]}
            >
              Explore Courses
            </Text>

            <Text style={[globalStyles.subtitleText, { color: colors.text }]}>
              Progress minggu ini: {progressPercentage}%
            </Text>
          </View>
        </View>

        <View style={styles.courseGrid}>
          {learningPaths.map((path) => (
            <CourseCard
              key={path.id}
              learningPath={path}
              onPress={() => handleCoursePress(path.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default function HomeScreen() {
  return <HomeScreenContent />;
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
  sectionTitleContainer: {
    marginBottom: 12,
  },
  courseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
