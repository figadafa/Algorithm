import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { useAuth } from '@/context/AuthContext';
import { calculateStreak, isSameDay, formatDateLocal } from '@/utils/streakCalculator';
import { saveStreakData, loadStreakData } from '@/storage/streakStorage';

interface LearningProgressContextType {
  streak: number;
  dailyGoalCompleted: boolean;
  isDailyGoalActive: boolean;
  progressPercentage: number;
  startDailyGoalSession: () => void;
  completeLearningSession: () => Promise<void>;
}

interface StreakSnapshot {
  userId: string;
  streak: number;
  lastLearningDate: string | null;
  dailyGoalCompleted: boolean;
}

const EMPTY_SNAPSHOT: StreakSnapshot = {
  userId: '',
  streak: 0,
  lastLearningDate: null,
  dailyGoalCompleted: false,
};

const LearningProgressContext = createContext<LearningProgressContextType | undefined>(undefined);

export const LearningProgressProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const userId = user?.id ?? '';

  const [snapshot, setSnapshot] = useState<StreakSnapshot>(EMPTY_SNAPSHOT);
  const [isDailyGoalActive, setIsDailyGoalActive] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Flag "sudah dimuat": ref dipakai supaya efek save tidak menulis nilai default
  // sebelum data user baru selesai dimuat (atau saat user logout/berganti).
  const loadedForUserId = useRef<string | null>(null);

  // Snapshot milik user lain dianggap tidak aktif → tampilkan nilai default.
  const activeSnapshot = snapshot.userId === userId ? snapshot : EMPTY_SNAPSHOT;
  const streak = activeSnapshot.streak;
  const lastLearningDate = activeSnapshot.lastLearningDate;
  const dailyGoalCompleted = activeSnapshot.dailyGoalCompleted;

  useEffect(() => {
    let cancelled = false;
    // Ref diubah sinkron (bukan setState) untuk langsung memblokir efek save.
    loadedForUserId.current = null;

    if (!userId) return () => { cancelled = true; };

    const loadForUser = async () => {
      const { streak: storedStreak, lastLearningDate: storedLastLearningDate } = await loadStreakData(userId);

      const today = new Date();
      const todayStr = formatDateLocal(today);

      let effectiveStreak = storedStreak;

      // Logika putusnya streak dipertahankan dari implementasi sebelumnya.
      if (storedLastLearningDate) {
        const lastDate = new Date(storedLastLearningDate);
        const diffTime = new Date(todayStr).getTime() - lastDate.getTime();
        const diffDays = Math.round(diffTime / (24 * 60 * 60 * 1000));

        if (diffDays > 1) {
          effectiveStreak = 0;
          await saveStreakData(userId, 0, storedLastLearningDate);
        }
      }

      if (cancelled) return;

      setSnapshot({
        userId,
        streak: effectiveStreak,
        lastLearningDate: storedLastLearningDate,
        dailyGoalCompleted: storedLastLearningDate
          ? isSameDay(today, new Date(storedLastLearningDate))
          : false,
      });
      loadedForUserId.current = userId;
      setDataLoaded(true);
    };

    void loadForUser();
    return () => { cancelled = true; };
  }, [userId]);

  // Jangan menulis storage sebelum data user aktif selesai dimuat,
  // dan jangan menulis sama sekali saat user null.
  useEffect(() => {
    if (!userId || !dataLoaded || loadedForUserId.current !== userId) return;
    void saveStreakData(userId, streak, lastLearningDate);
  }, [userId, dataLoaded, streak, lastLearningDate]);

  const progressPercentage = useMemo(() => {
    return dailyGoalCompleted ? 100 : 0;
  }, [dailyGoalCompleted]);

  const startDailyGoalSession = useCallback(() => {
    console.log('Daily learning goal started.');
    setIsDailyGoalActive(true);
  }, []);

  const completeLearningSession = useCallback(async () => {
    if (!isDailyGoalActive && dailyGoalCompleted) return;
    if (!userId) return;

    const today = new Date();
    const currentDayStr = formatDateLocal(today);

    let nextStreak = streak;
    let nextLastLearningDate = lastLearningDate;

    // Only update streak if not already completed today
    if (lastLearningDate !== currentDayStr) {
      const { currentStreak: newStreak, lastLearningDate: newLastLearningDate } = calculateStreak(
        streak,
        lastLearningDate,
        today
      );
      nextStreak = newStreak;
      nextLastLearningDate = newLastLearningDate;
    }

    setSnapshot({
      userId,
      streak: nextStreak,
      lastLearningDate: nextLastLearningDate,
      dailyGoalCompleted: true,
    });
    setIsDailyGoalActive(false);
  }, [isDailyGoalActive, dailyGoalCompleted, lastLearningDate, streak, userId]);

  return (
    <LearningProgressContext.Provider
      value={{ streak, dailyGoalCompleted, isDailyGoalActive, progressPercentage, startDailyGoalSession, completeLearningSession }}
    >
      {children}
    </LearningProgressContext.Provider>
  );
};

export const useLearningProgress = () => {
  const context = useContext(LearningProgressContext);
  if (!context) {
    throw new Error('useLearningProgress must be used within a LearningProgressProvider');
  }
  return context;
};
