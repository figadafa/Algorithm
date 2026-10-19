import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CourseCard from "@/components/CourseCard";
import DailyGoal from "@/components/DailyGoal";
import Header from "@/components/Header";
import StreakCard from "@/components/StreakCard";
import { useTheme } from "@/context/ThemeContext";
import { learningPaths } from "@/data/learningPaths";
import { globalStyles } from "@/styles";

function HomeScreenContent() {
  const insets = useSafeAreaInsets();
  const { colors, darkMode } = useTheme();
  const router = useRouter();

  // 1. useState dengan generic eksplisit
  const [streak, setStreak] = useState<number>(0);
  const [completedDays, setCompletedDays] = useState<boolean[]>(
    new Array(7).fill(false)
  );
  const [dailyGoalCompleted, setDailyGoalCompleted] = useState<boolean>(false);

  // 2. useMemo untuk menghitung persentase hari selesai
  const progressPercentage = useMemo(() => {
    const completedCount = completedDays.filter((day) => day).length;
    return Math.round((completedCount / 7) * 100);
  }, [completedDays]);

  // 3. useEffect untuk pesan penyemangat saat daily goal selesai
  useEffect(() => {
    if (dailyGoalCompleted) {
      console.log("Mantap! Kamu telah menyelesaikan target hari ini. 🔥");
    }
  }, [dailyGoalCompleted]);

  // Logika Start Learning
  const handleStartLearning = () => {
    // Ambil indeks hari saat ini (Senin=0, Minggu=6)
    const currentDayIndex = (new Date().getDay() + 6) % 7;

    // Set goal hari ini selesai
    setDailyGoalCompleted(true);

    // Update streak dan completedDays jika hari ini belum ditandai selesai
    // Ini simulasi streak sederhana: hanya bertambah sekali per hari saat tombol ditekan
    if (!completedDays[currentDayIndex]) {
      const newCompletedDays = [...completedDays];
      newCompletedDays[currentDayIndex] = true;
      setCompletedDays(newCompletedDays);
      setStreak((prev) => prev + 1);
    }
  };

  const handleNotificationPress = () => {
    console.log("Notification icon pressed!");
  };

  // Logika navigasi ke detail course (/course/[id])
  const handleCoursePress = (id: number) => {
    router.push({ pathname: "/course/[id]", params: { id: String(id) } });
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
