import { useState, useEffect, useCallback } from 'react';
import { POMODORO_CONSTANTS } from '@/lib/constants';

export function usePomodoroTimer() {
  const [pomodoroTime, setPomodoroTime] = useState(
    POMODORO_CONSTANTS.WORK_DURATION
  );
  const [isBreak, setIsBreak] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const resetPomodoro = useCallback(() => {
    setPomodoroTime(POMODORO_CONSTANTS.WORK_DURATION);
    setIsBreak(false);
    setCycle(0);
    setIsPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  useEffect(() => {
    const pomodoroInterval = setInterval(() => {
      if (!isPaused) {
        setPomodoroTime((prev) => {
          if (prev <= 1) {
            const newIsBreak = !isBreak;
            setIsBreak(newIsBreak);
            setCycle((c) => c + 1);
            return newIsBreak
              ? POMODORO_CONSTANTS.BREAK_DURATION
              : POMODORO_CONSTANTS.WORK_DURATION;
          }
          return prev - 1;
        });
      }
    }, POMODORO_CONSTANTS.CLOCK_UPDATE_INTERVAL);

    return () => clearInterval(pomodoroInterval);
  }, [isBreak, isPaused]);

  return {
    pomodoroTime,
    isBreak,
    cycle,
    isPaused,
    resetPomodoro,
    togglePause,
  };
}
