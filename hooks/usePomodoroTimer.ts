import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [isCompleted, setIsCompleted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const createNotificationSound = () => {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    audioRef.current = { play: createNotificationSound } as HTMLAudioElement;
  }, []);

  const playCompletionSound = useCallback(() => {
    try {
      if (audioRef.current?.play) {
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error playing completion sound:', error);
    }
  }, []);

  const resetPomodoro = useCallback(() => {
    setPomodoroTime(workDuration);
    setIsBreak(false);
    setCycle(0);
    setIsPaused(false);
    setIsCompleted(false);
  }, [workDuration]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
    if (isCompleted) {
      setIsCompleted(false);
    }
  }, [isCompleted]);

  useEffect(() => {
    const pomodoroInterval = setInterval(() => {
      if (!isPaused) {
        setPomodoroTime((prev) => {
          if (prev <= 1) {
            setIsCompleted(true);
            playCompletionSound();

            setTimeout(() => {
              const newIsBreak = !isBreak;
              setIsBreak(newIsBreak);
              setCycle((c) => c + 1);
              setIsCompleted(false);
              return newIsBreak ? breakDuration : workDuration;
            }, 3000);

            return 0;
          }
          return prev - 1;
        });
      }
    }, POMODORO_CONSTANTS.CLOCK_UPDATE_INTERVAL);

    return () => clearInterval(pomodoroInterval);
  }, [isBreak, isPaused, workDuration, breakDuration, playCompletionSound]);

  useEffect(() => {
    if (!isPaused && !isCompleted) {
      setPomodoroTime(isBreak ? breakDuration : workDuration);
    }
  }, [workDuration, breakDuration, isBreak, isPaused, isCompleted]);

  return {
    pomodoroTime,
    isBreak,
    cycle,
    isPaused,
    isCompleted,
    resetPomodoro,
    togglePause,
  };
}
