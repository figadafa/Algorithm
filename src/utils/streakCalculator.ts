// src/utils/streakCalculator.ts
interface StreakData {
  currentStreak: number;
  lastLearningDate: string | null; // YYYY-MM-DD format
}

export function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateStreak(
  currentStreak: number,
  lastLearningDate: string | null,
  completionDate: Date // The date when a session was completed
): StreakData {
  const todayStr = formatDateLocal(completionDate);
  const today = new Date(todayStr);

  if (lastLearningDate === null) {
    // First session ever
    return { currentStreak: 1, lastLearningDate: todayStr };
  }

  const lastDate = new Date(lastLearningDate);
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

  // Calculate difference in days
  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffTime / oneDay);

  if (diffDays === 0) {
    // Already learned today, streak doesn't change
    return { currentStreak, lastLearningDate };
  } else if (diffDays === 1) {
    // Learned on consecutive days
    return { currentStreak: currentStreak + 1, lastLearningDate: todayStr };
  } else {
    // Skipped a day or more, streak resets
    return { currentStreak: 1, lastLearningDate: todayStr };
  }
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
