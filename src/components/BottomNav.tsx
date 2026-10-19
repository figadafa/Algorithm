import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { navItems } from "@/data/navItems";

interface BottomNavProps {
  bottomInset: number;
  onPress: (label: string) => void;
}

export default function BottomNav({ bottomInset, onPress }: BottomNavProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.bottomNavigation,
        {
          paddingBottom: bottomInset,
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
        },
      ]}
    >
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
            color={item.isActive ? colors.primary : colors.secondary}
          />
          <Text
            style={[
              styles.navLabel,
              { color: item.isActive ? colors.primary : colors.secondary },
            ]}
          >
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
    borderTopWidth: 1,
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
    marginTop: 2,
  },
});
