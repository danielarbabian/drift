import { useState, useEffect, useCallback, useRef } from 'react';
import { POMODORO_CONSTANTS } from '@/lib/constants';

export function useScreensaverControls() {
  const [showControls, setShowControls] = useState<boolean>(false);
  const mouseTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleMouseMove = useCallback((): void => {
    setShowControls(true);
    if (mouseTimeoutRef.current) {
      clearTimeout(mouseTimeoutRef.current);
    }
    mouseTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, POMODORO_CONSTANTS.CONTROLS_HIDE_DELAY);
  }, []);

  const enterFullscreen = useCallback(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(
      enterFullscreen,
      POMODORO_CONSTANTS.FULLSCREEN_DELAY
    );

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
    };
  }, [handleMouseMove, enterFullscreen]);

  return { showControls };
}
