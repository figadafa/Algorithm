import { MaterialIcons } from "@expo/vector-icons";

export interface NavItem {
  id: number;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  isActive: boolean;
}

export const navItems: NavItem[] = [
  { id: 1, label: "Home", icon: "home", isActive: true },
  { id: 2, label: "Learn", icon: "book", isActive: false },
  { id: 3, label: "Achievement", icon: "emoji-events", isActive: false },
  { id: 4, label: "Profile", icon: "person", isActive: false },
];
