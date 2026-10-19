import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

interface LearningProgressContextType {
  streak: number;
  completedDays: boolean[];
  dailyGoalCompleted: boolean;
  progressPercentage: number;
  handleStartLearning: () => void;
}

const LearningProgressContext = createContext<LearningProgressContextType | undefined>(undefined);

export const LearningProgressProvider = ({ children }: { children: ReactNode }) => {
  const [streak, setStreak] = useState<number>(0);
  const [completedDays, setCompletedDays] = useState<boolean[]>(new Array(7).fill(false));
  const [dailyGoalCompleted, setDailyGoalCompleted] = useState<boolean>(false);

  const progressPercentage = useMemo(() => {
    const completedCount = completedDays.filter((day) => day).length;
    return Math.round((completedCount / 7) * 100);
  }, [completedDays]);

  const handleStartLearning = () => {
    const currentDayIndex = (new Date().getDay() + 6) % 7;
    setDailyGoalCompleted(true);
    if (!completedDays[currentDayIndex]) {
      const newCompletedDays = [...completedDays];
      newCompletedDays[currentDayIndex] = true;
      setCompletedDays(newCompletedDays);
      setStreak((prev) => prev + 1);
    }
  };

  return (
    <LearningProgressContext.Provider 
      value={{ streak, completedDays, dailyGoalCompleted, progressPercentage, handleStartLearning }}
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
