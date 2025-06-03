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
      if (use24Hour) {
        return {
          time: date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          period: '',
        };
      } else {
        const timeString = date.toLocaleTimeString('en-US', {
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        const parts = timeString.split(' ');
        return {
          time: parts[0],
          period: parts[1] || '',
        };
      }
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

  const renderFloatingPeriod = useCallback(
    (periodString: string) => {
      if (!enableClockBounce || !periodString) {
        return periodString;
      }

      return periodString.split('').map((char, index) => (
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
    if (!isClient) return { time: '00:00:00', period: '' };
    const formatted = formatTime(time);
    return {
      time: renderFloatingTime(formatted.time),
      period: renderFloatingPeriod(formatted.period),
    };
  }, [isClient, time, renderFloatingTime, renderFloatingPeriod, formatTime]);

  const dateDisplay = useMemo(() => {
    if (!isClient) return 'Loading...';
    return renderFloatingDate(formatDate(time));
  }, [isClient, time, renderFloatingDate, formatDate]);

  return (
    <div className="absolute inset-0 flex items-center justify-center animate-subtle-shift">
      <div className="text-center">
        <div className="text-6xl md:text-8xl lg:text-9xl font-thin text-white/90 tracking-wider font-mono">
          {timeDisplay.time}
          {timeDisplay.period && (
            <span className="ml-3 text-4xl md:text-5xl lg:text-6xl">
              {timeDisplay.period}
            </span>
          )}
        </div>
        <div className="text-lg md:text-xl text-white/50 mt-4 tracking-widest">
          {dateDisplay}
        </div>
      </div>
    </div>
  );
}

export const Clock = memo(ClockComponent);
