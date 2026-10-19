import { MaterialIcons } from "@expo/vector-icons";

export interface LearningPath {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

export const learningPaths: LearningPath[] = [
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
