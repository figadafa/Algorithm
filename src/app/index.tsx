import { MaterialIcons } from "@expo/vector-icons";
import {
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Design Tokens
const COLORS = {
  background: "#F8F8F8", // Light gray/off-white
  primary: "#2B2B40", // Dark navy
  accent: "#FF8C00", // Orange
  card: "#FFFFFF", // White
  secondaryText: "#808090", // Muted blue-gray
  borderColor: "#E0E0E0", // Light border for cards
};

const BORDER_RADIUS = 12;
const PADDING_HORIZONTAL = 16;

// Interfaces
interface LearningPath {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

interface NavItem {
  id: number;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  isActive: boolean;
}

// Dummy Data
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

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

const navItems: NavItem[] = [
  { id: 1, label: "Home", icon: "home", isActive: true },
  { id: 2, label: "Learn", icon: "book", isActive: false },
  { id: 3, label: "Achievement", icon: "emoji-events", isActive: false },
  { id: 4, label: "Profile", icon: "person", isActive: false },
];

const HomeScreen = () => {
  const insets = useSafeAreaInsets();

  const handleStartLearning = () => {
    console.log("Start Learning button pressed!");
  };

  const handleNotificationPress = () => {
    console.log("Notification icon pressed!");
  };

  const handleNavPress = (item: NavItem) => {
    console.log(`Navigation item "${item.label}" pressed!`);
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.greetingText}>Good Morning</Text>
            <Text style={styles.subtitleText}>Ready to start learning?</Text>
          </View>
          <Pressable
            onPress={handleNotificationPress}
            style={styles.notificationButton}
          >
            <MaterialIcons
              name="notifications"
              size={20}
              color={COLORS.primary}
            />
          </Pressable>
        </View>

        {/* Streak Card */}
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
              <View key={index} style={styles.dayIndicator}>
                <Text style={styles.dayText}>{day}</Text>
                <View style={styles.circleIndicator} />
              </View>
            ))}
          </View>
        </View>

        {/* Daily Goal */}
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
          <Pressable onPress={handleStartLearning} style={styles.startButton}>
            <Text style={styles.startButtonText}>START →</Text>
          </Pressable>
        </View>

        {/* Explore Courses */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Explore Courses</Text>
          <Text style={styles.subtitleText}>Find something to learn</Text>
        </View>
        <View style={styles.courseGrid}>
          {learningPaths.map((path) => (
            <Pressable key={path.id} style={styles.courseCard}>
              <MaterialIcons
                name={path.icon}
                size={24}
                color={COLORS.primary}
              />
              <View style={styles.courseTextContainer}>
                <Text style={styles.courseTitle}>{path.title}</Text>
                <Text style={styles.courseDescription}>{path.description}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNavigation, { paddingBottom: insets.bottom }]}>
        {navItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => handleNavPress(item)}
            style={styles.navItem}
          >
            <MaterialIcons
              name={item.icon}
              size={20}
              color={item.isActive ? COLORS.primary : COLORS.secondaryText}
            />
            <Text
              style={[
                styles.navLabel,
                item.isActive && { color: COLORS.primary },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollViewContent: {
    paddingVertical: 12,
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingBottom: 90,
  },
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
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
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
  courseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  courseCard: {
    width: "48%",
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  courseTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  courseDescription: {
    fontSize: 11,
    color: COLORS.secondaryText,
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
    paddingVertical: 8,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  navLabel: {
    fontSize: 9,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
});

export default HomeScreen;
