import { memo, useCallback, useMemo } from 'react';
import { ANIMATION_CONSTANTS } from '@/lib/constants';

interface ClockProps {
  time: Date;
  isClient: boolean;
  use24Hour: boolean;
  enableClockBounce: boolean;
}

function ClockComponent({
  time,
  isClient,
  use24Hour,
  enableClockBounce,
}: ClockProps) {
  const formatTime = useCallback(
    (date: Date) => {
      return date.toLocaleTimeString('en-US', {
        hour12: !use24Hour,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    },
    [use24Hour]
  );

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const renderFloatingTime = useCallback(
    (timeString: string) => {
      if (!enableClockBounce) {
        return timeString;
      }

      return timeString.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block"
          style={{
            animation: `gentle-float-char ${ANIMATION_CONSTANTS.TIME_ANIMATION_DURATION}s ease-in-out infinite`,
            animationDelay: `${
              index * ANIMATION_CONSTANTS.TIME_ANIMATION_DELAY_MULTIPLIER
            }s`,
          }}
        >
          {char}
        </span>
      ));
    },
    [enableClockBounce]
  );

  const renderFloatingDate = useCallback(
    (dateString: string) => {
      if (!enableClockBounce) {
        return dateString;
      }

      return dateString.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block"
          style={{
            animation: `gentle-float-char ${ANIMATION_CONSTANTS.DATE_ANIMATION_DURATION}s ease-in-out infinite`,
            animationDelay: `${
              index * ANIMATION_CONSTANTS.DATE_ANIMATION_DELAY_MULTIPLIER
            }s`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    },
    [enableClockBounce]
  );

  const timeDisplay = useMemo(() => {
    if (!isClient) return '00:00:00';
    return renderFloatingTime(formatTime(time));
  }, [isClient, time, renderFloatingTime, formatTime]);

  const dateDisplay = useMemo(() => {
    if (!isClient) return 'Loading...';
    return renderFloatingDate(formatDate(time));
  }, [isClient, time, renderFloatingDate, formatDate]);

  return (
    <div className="absolute inset-0 flex items-center justify-center animate-subtle-shift">
      <div className="text-center">
        <div className="text-6xl md:text-8xl lg:text-9xl font-thin text-white/90 tracking-wider font-mono">
          {timeDisplay}
        </div>
        <div className="text-lg md:text-xl text-white/50 mt-4 tracking-widest">
          {dateDisplay}
        </div>
      </div>
    </div>
  );
}

export const Clock = memo(ClockComponent);
