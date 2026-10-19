import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BORDER_RADIUS, useTheme } from "@/context/ThemeContext";
import { globalStyles } from "@/styles";

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
  const { colors } = useTheme();
  return (
    <Pressable accessibilityRole="button" style={[styles.courseCard, globalStyles.shadow, { backgroundColor: colors.cardBackground, borderRadius: BORDER_RADIUS, borderColor: colors.border }]}>
      <MaterialIcons
        name={learningPath.icon}
        size={24}
        color={colors.primary}
      />
      <View style={styles.courseTextContainer}>
        <Text style={[styles.courseTitle, { color: colors.primary }]}>{learningPath.title}</Text>
        <Text style={[styles.courseDescription, { color: colors.text }]}>
          {learningPath.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  courseCard: {
    width: "48%",
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  courseTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  courseDescription: {
    fontSize: 11,
  },
});
