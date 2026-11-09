// src/storage/streakStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_KEY = '@daily_learning_streak';
const LAST_LEARNING_DATE_KEY = '@last_learning_date';

export async function saveStreakData(streak: number, lastLearningDate: string | null) {
  try {
    await AsyncStorage.setItem(STREAK_KEY, streak.toString());
    await AsyncStorage.setItem(LAST_LEARNING_DATE_KEY, lastLearningDate || '');
  } catch (e) {
    console.error('Failed to save streak data', e);
  }
}

export async function loadStreakData(): Promise<{ streak: number; lastLearningDate: string | null }> {
  try {
    const storedStreak = await AsyncStorage.getItem(STREAK_KEY);
    const storedLastLearningDate = await AsyncStorage.getItem(LAST_LEARNING_DATE_KEY);

    const streak = storedStreak ? parseInt(storedStreak, 10) : 0;
    const lastLearningDate = storedLastLearningDate === '' ? null : storedLastLearningDate;

    return { streak, lastLearningDate };
  } catch (e) {
    console.error('Failed to load streak data', e);
    return { streak: 0, lastLearningDate: null };
  }
}
