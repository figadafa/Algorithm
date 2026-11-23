// src/storage/streakStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const streakKey = (userId: string) => `@daily_learning_streak:${userId}`;
const lastLearningDateKey = (userId: string) => `@last_learning_date:${userId}`;

export async function saveStreakData(
  userId: string,
  streak: number,
  lastLearningDate: string | null,
) {
  try {
    await AsyncStorage.setItem(streakKey(userId), streak.toString());
    await AsyncStorage.setItem(lastLearningDateKey(userId), lastLearningDate || '');
  } catch (e) {
    console.error('Failed to save streak data', e);
  }
}

export async function loadStreakData(
  userId: string,
): Promise<{ streak: number; lastLearningDate: string | null }> {
  try {
    const storedStreak = await AsyncStorage.getItem(streakKey(userId));
    const storedLastLearningDate = await AsyncStorage.getItem(lastLearningDateKey(userId));

    const streak = storedStreak ? parseInt(storedStreak, 10) : 0;
    const lastLearningDate = storedLastLearningDate === '' ? null : storedLastLearningDate;

    return { streak, lastLearningDate };
  } catch (e) {
    console.error('Failed to load streak data', e);
    return { streak: 0, lastLearningDate: null };
  }
}
