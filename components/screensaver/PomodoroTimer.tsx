import { Pause, Play, RotateCcw } from 'lucide-react';

interface PomodoroTimerProps {
  pomodoroTime: number;
  isBreak: boolean;
  cycle: number;
  isPaused: boolean;
  isCompleted: boolean;
  showControls: boolean;
  workDuration: number;
  breakDuration: number;
  onPauseToggle: () => void;
  onReset: () => void;
}

export function PomodoroTimer({
  pomodoroTime,
  isBreak,
  cycle,
  isPaused,
  isCompleted,
  showControls,
  workDuration,
  breakDuration,
  onPauseToggle,
  onReset,
}: PomodoroTimerProps) {
  const formatPomodoroTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const currentDuration = isBreak ? breakDuration : workDuration;
  const progressPercentage =
    ((currentDuration - pomodoroTime) / currentDuration) * 100;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="relative w-full h-full">
        <div className="absolute animate-orbit">
          <div
            className={`relative backdrop-blur-sm rounded-2xl px-6 py-4 shadow-2xl pointer-events-auto transition-all duration-500 ${
              isCompleted
                ? 'bg-gradient-to-br from-emerald-900/40 via-green-800/30 to-teal-900/40 border-2 border-emerald-400/60 shadow-emerald-400/30 shadow-2xl animate-pulse scale-110'
                : 'bg-black/40 border border-white/10'
            }`}
          >
            {isCompleted && (
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className="absolute top-2 left-4 w-1 h-1 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute top-4 right-6 w-1 h-1 bg-green-300 rounded-full animate-ping delay-150 opacity-75"></div>
                <div className="absolute bottom-6 left-6 w-1 h-1 bg-teal-300 rounded-full animate-ping delay-300 opacity-75"></div>
                <div className="absolute bottom-3 right-4 w-1 h-1 bg-emerald-300 rounded-full animate-ping delay-500 opacity-75"></div>
                <div className="absolute top-6 left-1/2 w-1 h-1 bg-green-400 rounded-full animate-ping delay-700 opacity-75"></div>
              </div>
            )}

            <div className="text-center relative z-10">
              <div
                className={`text-2xl md:text-3xl font-mono mb-1 transition-all duration-500 ${
                  isCompleted
                    ? 'text-emerald-300 font-bold tracking-wider drop-shadow-lg animate-pulse scale-105'
                    : 'text-white/90'
                }`}
              >
                {formatPomodoroTime(pomodoroTime)}
              </div>

              {isCompleted && (
                <div className="mb-3 relative">
                  <div className="text-emerald-300 text-lg font-bold mb-1 animate-bounce">
                    ✨ {isBreak ? 'Break' : 'Focus'} Complete! ✨
                  </div>
                  <div className="text-emerald-200/80 text-sm font-medium animate-pulse">
                    Great work! Time to {isBreak ? 'focus' : 'take a break'}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent animate-pulse"></div>
                </div>
              )}

              <div
                className={`text-xs md:text-sm uppercase tracking-wider transition-colors duration-300 ${
                  isCompleted
                    ? 'text-emerald-200/90 font-medium'
                    : 'text-white/60'
                }`}
              >
                {isBreak ? 'Break' : 'Focus'} • Cycle{' '}
                {Math.floor(cycle / 2) + 1}
              </div>

              <div
                className={`w-full rounded-full h-2 mt-3 transition-all duration-500 ${
                  isCompleted ? 'bg-emerald-900/40' : 'bg-white/10'
                }`}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-1000 relative overflow-hidden ${
                    isCompleted
                      ? 'bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400'
                      : isBreak
                      ? 'bg-green-400/70'
                      : 'bg-red-400/70'
                  }`}
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, isCompleted ? 100 : progressPercentage)
                    )}%`,
                  }}
                >
                  {isCompleted && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  )}
                </div>
              </div>

              <div
                className={`mt-4 flex justify-center space-x-3 transition-all duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <button
                  onClick={onPauseToggle}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {isPaused ? (
                    <Play
                      size={16}
                      className={
                        isCompleted ? 'text-emerald-300' : 'text-white/70'
                      }
                    />
                  ) : (
                    <Pause
                      size={16}
                      className={
                        isCompleted ? 'text-emerald-300' : 'text-white/70'
                      }
                    />
                  )}
                </button>
                <button
                  onClick={onReset}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <RotateCcw
                    size={16}
                    className={
                      isCompleted ? 'text-emerald-300' : 'text-white/70'
                    }
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
