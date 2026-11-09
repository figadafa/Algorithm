import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
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

const LearningProgressContext = createContext<LearningProgressContextType | undefined>(undefined);

export const LearningProgressProvider = ({ children }: { children: ReactNode }) => {
  const [streak, setStreak] = useState<number>(0);
  const [lastLearningDate, setLastLearningDate] = useState<string | null>(null);
  const [dailyGoalCompleted, setDailyGoalCompleted] = useState<boolean>(false);
  const [isDailyGoalActive, setIsDailyGoalActive] = useState<boolean>(false); 

  // Load streak data on component mount
  useEffect(() => {
    const fetchStreakData = async () => {
      const { streak: storedStreak, lastLearningDate: storedLastLearningDate } = await loadStreakData();
      
      const today = new Date();
      const todayStr = formatDateLocal(today);

      let effectiveStreak = storedStreak;

      // Check if streak is broken
      if (storedLastLearningDate) {
        const lastDate = new Date(storedLastLearningDate);
        const diffTime = new Date(todayStr).getTime() - lastDate.getTime();
        const diffDays = Math.round(diffTime / (24 * 60 * 60 * 1000));

        if (diffDays > 1) {
          // Streak broken
          effectiveStreak = 0;
          await saveStreakData(0, storedLastLearningDate);
        }
        setDailyGoalCompleted(isSameDay(today, lastDate));
      }

      setStreak(effectiveStreak);
      setLastLearningDate(storedLastLearningDate);
    };
    fetchStreakData();
  }, []);

  // Save streak data whenever streak or lastLearningDate changes
  useEffect(() => {
    saveStreakData(streak, lastLearningDate);
  }, [streak, lastLearningDate]);

  const progressPercentage = useMemo(() => {
    return dailyGoalCompleted ? 100 : 0;
  }, [dailyGoalCompleted]);

  const startDailyGoalSession = useCallback(() => {
    console.log('Daily learning goal started.');
    setIsDailyGoalActive(true);
  }, []);

  const completeLearningSession = useCallback(async () => {
    if (!isDailyGoalActive && dailyGoalCompleted) {
      return;
    }

    const today = new Date();
    const currentDayStr = formatDateLocal(today);

    // Only update streak if not already completed today
    if (lastLearningDate !== currentDayStr) {
      const { currentStreak: newStreak, lastLearningDate: newLastLearningDate } = calculateStreak(
        streak,
        lastLearningDate,
        today
      );
      setStreak(newStreak);
      setLastLearningDate(newLastLearningDate);
    }
    setDailyGoalCompleted(true);
    setIsDailyGoalActive(false);
  }, [streak, lastLearningDate, isDailyGoalActive, dailyGoalCompleted]);

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
