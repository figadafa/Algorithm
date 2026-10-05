import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BORDER_RADIUS, COLORS } from "./theme";

export interface LearningPath {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

interface CourseCardProps {
  learningPath: LearningPath;
}

export default function CourseCard({ learningPath }: CourseCardProps) {
  return (
    <Pressable accessibilityRole="button" style={styles.courseCard}>
      <MaterialIcons
        name={learningPath.icon}
        size={24}
        color={COLORS.primary}
      />
      <View style={styles.courseTextContainer}>
        <Text style={styles.courseTitle}>{learningPath.title}</Text>
        <Text style={styles.courseDescription}>
          {learningPath.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
});
