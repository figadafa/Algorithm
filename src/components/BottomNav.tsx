import { MaterialIcons } from "@expo/vector-icons";
import { Href, usePathname, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { navItems } from "@/data/navItems";

interface BottomNavProps {
  bottomInset: number;
}

// Pemetaan label navigasi -> tujuan route (file-based routing)
const routeByLabel: Record<string, Href> = {
  Home: "/",
  Learn: "/learn",
  Achievement: "/achievement",
  Profile: "/profile",
};

// Menentukan item navigasi yang aktif berdasarkan pathname saat ini.
// Halaman detail course (/course/[id]) tetap menyorot item Home.
function isItemActive(pathname: string, route: Href): boolean {
  const target = typeof route === "string" ? route : "";
  if (target === "/") {
    return pathname === "/" || pathname.startsWith("/course");
  }
  return pathname === target;
}

export default function BottomNav({ bottomInset }: BottomNavProps) {
  const { colors } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const handlePress = (label: string) => {
    const route = routeByLabel[label];
    if (route) {
      router.push(route);
    }
  };

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
      {navItems.map((item) => {
        const route = routeByLabel[item.label];
        const active = route ? isItemActive(pathname, route) : false;

        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => handlePress(item.label)}
            style={styles.navItem}
          >
            <MaterialIcons
              name={item.icon}
              size={20}
              color={active ? colors.primary : colors.secondary}
            />
            <Text
              style={[
                styles.navLabel,
                { color: active ? colors.primary : colors.secondary },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
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
