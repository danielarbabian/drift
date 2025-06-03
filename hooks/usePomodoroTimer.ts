import { useState, useEffect, useCallback } from 'react';
import { POMODORO_CONSTANTS } from '@/lib/constants';

interface UsePomodoroTimerProps {
  workDuration?: number;
  breakDuration?: number;
}

export function usePomodoroTimer({
  workDuration = POMODORO_CONSTANTS.WORK_DURATION,
  breakDuration = POMODORO_CONSTANTS.BREAK_DURATION,
}: UsePomodoroTimerProps = {}) {
  const [pomodoroTime, setPomodoroTime] = useState(workDuration);
  const [isBreak, setIsBreak] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const resetPomodoro = useCallback(() => {
    setPomodoroTime(workDuration);
    setIsBreak(false);
    setCycle(0);
    setIsPaused(false);
  }, [workDuration]);

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
            return newIsBreak ? breakDuration : workDuration;
          }
          return prev - 1;
        });
      }
    }, POMODORO_CONSTANTS.CLOCK_UPDATE_INTERVAL);

    return () => clearInterval(pomodoroInterval);
  }, [isBreak, isPaused, workDuration, breakDuration]);

  useEffect(() => {
    if (!isPaused) {
      setPomodoroTime(isBreak ? breakDuration : workDuration);
    }
  }, [workDuration, breakDuration, isBreak, isPaused]);

  return {
    pomodoroTime,
    isBreak,
    cycle,
    isPaused,
    resetPomodoro,
    togglePause,
  };
}
