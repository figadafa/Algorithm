import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "./theme";

interface NavItem {
  id: number;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  isActive: boolean;
}

interface BottomNavProps {
  bottomInset: number;
  onPress: (label: string) => void;
}

const navItems: NavItem[] = [
  { id: 1, label: "Home", icon: "home", isActive: true },
  { id: 2, label: "Learn", icon: "book", isActive: false },
  { id: 3, label: "Achievement", icon: "emoji-events", isActive: false },
  { id: 4, label: "Profile", icon: "person", isActive: false },
];

export default function BottomNav({ bottomInset, onPress }: BottomNavProps) {
  return (
    <View style={[styles.bottomNavigation, { paddingBottom: bottomInset }]}>
      {navItems.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          onPress={() => onPress(item.label)}
          style={styles.navItem}
        >
          <MaterialIcons
            name={item.icon}
            size={20}
            color={item.isActive ? COLORS.primary : COLORS.secondaryText}
          />
          <Text style={[styles.navLabel, item.isActive && styles.activeLabel]}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
  activeLabel: {
    color: COLORS.primary,
  },
});
