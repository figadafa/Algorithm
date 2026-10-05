import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import CourseCard, { type LearningPath } from "../components/CourseCard";
import DailyGoal from "../components/DailyGoal";
import Header from "../components/Header";
import StreakCard from "../components/StreakCard";
import { COLORS } from "../components/theme";

const learningPaths: LearningPath[] = [
  { id: 1, title: "RPL", description: "Build software", icon: "code" },
  { id: 2, title: "Game", description: "Create games", icon: "sports-esports" },
  { id: 3, title: "Data", description: "Explore data & AI", icon: "storage" },
  {
    id: 4,
    title: "Network",
    description: "Secure systems",
    icon: "security",
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const handleStartLearning = () => {
    console.log("Start Learning button pressed!");
  };

  const handleNotificationPress = () => {
    console.log("Notification icon pressed!");
  };

  const handleNavPress = (label: string) => {
    console.log(`Navigation item "${label}" pressed!`);
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Header onNotificationPress={handleNotificationPress} />
        <StreakCard />
        <DailyGoal onStartLearning={handleStartLearning} />

        <View style={styles.sectionTitleContainer}>
          <View>
            <Text style={styles.sectionTitle}>Explore Courses</Text>
            <Text style={styles.subtitleText}>Find something to learn</Text>
          </View>
        </View>
        <View style={styles.courseGrid}>
          {learningPaths.map((path) => (
            <CourseCard key={path.id} learningPath={path} />
          ))}
        </View>
      </ScrollView>

      <BottomNav
        bottomInset={insets.bottom}
        onPress={(label) => handleNavPress(label)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollViewContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  sectionTitleContainer: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  subtitleText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  courseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
