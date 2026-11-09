import { LearningMaterial } from "@/api/learningMaterials";
import { BORDER_RADIUS, useTheme } from "@/context/ThemeContext";
import { globalStyles } from "@/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface LearningMaterialsListProps {
  materials: LearningMaterial[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function LearningMaterialsList({
  materials,
  loading,
  error,
  onRetry,
}: LearningMaterialsListProps) {
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={styles.messageContainer}>
        <Text style={{ color: colors.text }}>Memuat materi...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text style={[styles.message, { color: colors.text }]}>{error}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.retryText}>Coba lagi</Text>
        </Pressable>
      </View>
    );
  }

  if (materials.length === 0) {
    return (
      <View style={styles.messageContainer}>
        <Text style={{ color: colors.text }}>
          Belum ada materi untuk kategori ini.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {materials.map((material) => (
        <View
          key={material.id}
          style={[
            styles.materialCard,
            globalStyles.shadow,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              borderRadius: BORDER_RADIUS,
            },
          ]}
        >
          <MaterialIcons name="menu-book" size={22} color={colors.primary} />
          <View style={styles.materialText}>
            <Text style={[styles.materialTitle, { color: colors.primary }]}>
              {material.judul}
            </Text>
            <Text style={[styles.materialUrl, { color: colors.secondary }]}>
              {material.url}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    marginTop: 16,
  },
  materialCard: {
    alignItems: "center",
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  materialText: {
    flex: 1,
  },
  materialTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  materialUrl: {
    fontSize: 11,
    marginTop: 4,
  },
  messageContainer: {
    alignItems: "center",
    marginTop: 24,
    padding: 16,
  },
  message: {
    textAlign: "center",
  },
  retryButton: {
    borderRadius: BORDER_RADIUS / 2,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
