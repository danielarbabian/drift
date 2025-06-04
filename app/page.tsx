'use client';

import { useEffect, useState, useCallback } from 'react';
import { Clock } from '@/components/screensaver/Clock';
import { FloatingParticles } from '@/components/screensaver/FloatingParticles';
import { PomodoroTimer } from '@/components/screensaver/PomodoroTimer';
import { SpotifyPlayer } from '@/components/screensaver/SpotifyPlayer';
import { TodoList } from '@/components/screensaver/TodoList';
import { SettingsDialog } from '@/components/screensaver/SettingsDialog';
import { InfoDialog } from '@/components/screensaver/InfoDialog';
import { ControlButtons } from '@/components/screensaver/ControlButtons';
import { BackgroundGradients } from '@/components/screensaver/BackgroundGradients';
import { CornerIndicators } from '@/components/screensaver/CornerIndicators';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';
import { useScreensaverControls } from '@/hooks/useScreensaverControls';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { POMODORO_CONSTANTS } from '@/lib/constants';

export default function OLEDScreensaver() {
  const [time, setTime] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [use24Hour, setUse24Hour] = useLocalStorage(
    'screensaver-use24Hour',
    true
  );
  const [enableClockBounce, setEnableClockBounce] = useLocalStorage(
    'screensaver-enableClockBounce',
    true
  );
  const [workDuration, setWorkDuration] = useLocalStorage(
    'screensaver-workDuration',
    POMODORO_CONSTANTS.WORK_DURATION
  );
  const [breakDuration, setBreakDuration] = useLocalStorage(
    'screensaver-breakDuration',
    POMODORO_CONSTANTS.BREAK_DURATION
  );
  const [showSpotifyPlayer, setShowSpotifyPlayer] = useLocalStorage(
    'screensaver-showSpotifyPlayer',
    true
  );
  const [showPomodoroTimer, setShowPomodoroTimer] = useLocalStorage(
    'screensaver-showPomodoroTimer',
    true
  );
  const [showTodoList, setShowTodoList] = useLocalStorage(
    'screensaver-showTodoList',
    true
  );

  const { showControls, isFullscreen, toggleFullscreen } =
    useScreensaverControls();
  const {
    pomodoroTime,
    isBreak,
    cycle,
    isPaused,
    isCompleted,
    resetPomodoro,
    togglePause,
  } = usePomodoroTimer({
    workDuration,
    breakDuration,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTime(new Date());
    }, POMODORO_CONSTANTS.CLOCK_UPDATE_INTERVAL);

    return () => clearInterval(clockInterval);
  }, []);

  const handleSettingsClick = useCallback(() => setShowSettings(true), []);
  const handleInfoClick = useCallback(() => setShowInfo(true), []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <style jsx global>{`
        @keyframes gentle-float-char {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(12px, -8px);
          }
          50% {
            transform: translate(-10px, 6px);
          }
          75% {
            transform: translate(8px, -4px);
          }
        }
      `}</style>

      <BackgroundGradients />
      <FloatingParticles isClient={isClient} />

      <Clock
        time={time}
        isClient={isClient}
        use24Hour={use24Hour}
        enableClockBounce={enableClockBounce}
      />

      {showPomodoroTimer && (
        <PomodoroTimer
          pomodoroTime={pomodoroTime}
          isBreak={isBreak}
          cycle={cycle}
          isPaused={isPaused}
          isCompleted={isCompleted}
          showControls={showControls}
          workDuration={workDuration}
          breakDuration={breakDuration}
          onPauseToggle={togglePause}
          onReset={resetPomodoro}
        />
      )}

      {showSpotifyPlayer && <SpotifyPlayer showControls={showControls} />}

      <ControlButtons
        showControls={showControls}
        isFullscreen={isFullscreen}
        onSettingsClick={handleSettingsClick}
        onInfoClick={handleInfoClick}
        onFullscreenToggle={toggleFullscreen}
      />

      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        enableClockBounce={enableClockBounce}
        setEnableClockBounce={setEnableClockBounce}
        use24Hour={use24Hour}
        setUse24Hour={setUse24Hour}
        workDuration={workDuration}
        setWorkDuration={setWorkDuration}
        breakDuration={breakDuration}
        setBreakDuration={setBreakDuration}
        showSpotifyPlayer={showSpotifyPlayer}
        setShowSpotifyPlayer={setShowSpotifyPlayer}
        showPomodoroTimer={showPomodoroTimer}
        setShowPomodoroTimer={setShowPomodoroTimer}
        showTodoList={showTodoList}
        setShowTodoList={setShowTodoList}
      />

      <InfoDialog open={showInfo} onOpenChange={setShowInfo} />

      {showTodoList && <TodoList showControls={showControls} />}
    </div>
  );
}
