import { Pause, Play, RotateCcw } from 'lucide-react';

interface PomodoroTimerProps {
  pomodoroTime: number;
  isBreak: boolean;
  cycle: number;
  isPaused: boolean;
  showControls: boolean;
  onPauseToggle: () => void;
  onReset: () => void;
}

export function PomodoroTimer({
  pomodoroTime,
  isBreak,
  cycle,
  isPaused,
  showControls,
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

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="relative w-full h-full">
        <div className="absolute animate-orbit">
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 shadow-2xl pointer-events-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-mono text-white/90 mb-1">
                {formatPomodoroTime(pomodoroTime)}
              </div>
              <div className="text-xs md:text-sm text-white/60 uppercase tracking-wider">
                {isBreak ? 'Break' : 'Focus'} • Cycle{' '}
                {Math.floor(cycle / 2) + 1}
              </div>
              <div className="w-full bg-white/10 rounded-full h-1 mt-3">
                <div
                  className={`h-1 rounded-full transition-all duration-1000 ${
                    isBreak ? 'bg-green-400/70' : 'bg-red-400/70'
                  }`}
                  style={{
                    width: `${
                      (((isBreak ? 5 * 60 : 25 * 60) - pomodoroTime) /
                        (isBreak ? 5 * 60 : 25 * 60)) *
                      100
                    }%`,
                  }}
                />
              </div>

              <div
                className={`mt-3 flex justify-center space-x-3 transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <button
                  onClick={onPauseToggle}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {isPaused ? (
                    <Play size={16} className="text-white/70" />
                  ) : (
                    <Pause size={16} className="text-white/70" />
                  )}
                </button>
                <button
                  onClick={onReset}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <RotateCcw size={16} className="text-white/70" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
