'use client';

import { useEffect, useState, useCallback } from 'react';
import { Clock } from '@/components/screensaver/Clock';
import { FloatingParticles } from '@/components/screensaver/FloatingParticles';
import { PomodoroTimer } from '@/components/screensaver/PomodoroTimer';
import { SettingsDialog } from '@/components/screensaver/SettingsDialog';
import { InfoDialog } from '@/components/screensaver/InfoDialog';
import { ControlButtons } from '@/components/screensaver/ControlButtons';
import { BackgroundGradients } from '@/components/screensaver/BackgroundGradients';
import { CornerIndicators } from '@/components/screensaver/CornerIndicators';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';
import { useScreensaverControls } from '@/hooks/useScreensaverControls';
import { POMODORO_CONSTANTS } from '@/lib/constants';

export default function OLEDScreensaver() {
  const [time, setTime] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [use24Hour, setUse24Hour] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [enableClockBounce, setEnableClockBounce] = useState(true);

  const { showControls } = useScreensaverControls();
  const { pomodoroTime, isBreak, cycle, isPaused, resetPomodoro, togglePause } =
    usePomodoroTimer();

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

      <PomodoroTimer
        pomodoroTime={pomodoroTime}
        isBreak={isBreak}
        cycle={cycle}
        isPaused={isPaused}
        showControls={showControls}
        onPauseToggle={togglePause}
        onReset={resetPomodoro}
      />

      <ControlButtons
        showControls={showControls}
        onSettingsClick={handleSettingsClick}
        onInfoClick={handleInfoClick}
      />

      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        enableClockBounce={enableClockBounce}
        setEnableClockBounce={setEnableClockBounce}
        use24Hour={use24Hour}
        setUse24Hour={setUse24Hour}
      />

      <InfoDialog open={showInfo} onOpenChange={setShowInfo} />

      <CornerIndicators />
    </div>
  );
}
