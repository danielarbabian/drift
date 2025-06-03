'use client';

import { useEffect, useState } from 'react';
import { Settings, Info, Pause, Play, RotateCcw, X } from 'lucide-react';

type Particle = {
  id: number;
  left: number;
  top: number;
  animationDelay: number;
  animationDuration: number;
};

export default function OLEDScreensaver() {
  const [time, setTime] = useState(new Date());
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [use24Hour, setUse24Hour] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [enableClockBounce, setEnableClockBounce] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: i * 1.5,
      animationDuration: 20 + Math.random() * 20,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const pomodoroInterval = setInterval(() => {
      if (!isPaused) {
        setPomodoroTime((prev) => {
          if (prev <= 1) {
            const newIsBreak = !isBreak;
            setIsBreak(newIsBreak);
            setCycle((c) => c + 1);
            return newIsBreak ? 5 * 60 : 25 * 60;
          }
          return prev - 1;
        });
      }
    }, 1000);

    const enterFullscreen = () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };

    setTimeout(enterFullscreen, 1000);

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => setShowControls(false), 3000);
    };

    let mouseTimeout: NodeJS.Timeout;
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(clockInterval);
      clearInterval(pomodoroInterval);
      clearTimeout(mouseTimeout);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isBreak, isPaused]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: !use24Hour,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatPomodoroTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const resetPomodoro = () => {
    setPomodoroTime(25 * 60);
    setIsBreak(false);
    setCycle(0);
    setIsPaused(false);
  };

  const renderFloatingTime = (timeString: string) => {
    if (!enableClockBounce) {
      return timeString;
    }

    return timeString.split('').map((char, index) => (
      <span
        key={index}
        className="inline-block"
        style={{
          animation: `gentle-float-char 35s ease-in-out infinite`,
          animationDelay: `${index * 0.2}s`,
        }}
      >
        {char}
      </span>
    ));
  };

  const renderFloatingDate = (dateString: string) => {
    if (!enableClockBounce) {
      return dateString;
    }

    return dateString.split('').map((char, index) => (
      <span
        key={index}
        className="inline-block"
        style={{
          animation: `gentle-float-char 40s ease-in-out infinite`,
          animationDelay: `${index * 0.1}s`,
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <style jsx global>{`
        @keyframes gentle-float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(15px, -12px);
          }
          50% {
            transform: translate(-10px, 8px);
          }
          75% {
            transform: translate(12px, 5px);
          }
        }

        @keyframes gentle-float-char {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(3px, -2px);
          }
          50% {
            transform: translate(-2px, 2px);
          }
          75% {
            transform: translate(2px, 1px);
          }
        }
      `}</style>

      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 animate-gradient-shift" />
        <div className="absolute inset-0 bg-gradient-to-tl from-indigo-900/20 via-purple-900/20 to-pink-900/20 animate-gradient-shift-reverse" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-green-900/10 animate-gradient-horizontal" />
      </div>

      <div className="absolute inset-0">
        {isClient &&
          particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-white/10 rounded-full animate-float"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`,
              }}
            />
          ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center animate-subtle-shift">
        <div className="text-center">
          <div className="text-6xl md:text-8xl lg:text-9xl font-thin text-white/90 tracking-wider font-mono">
            {isClient ? renderFloatingTime(formatTime(time)) : '00:00:00'}
          </div>
          <div className="text-lg md:text-xl text-white/50 mt-4 tracking-widest">
            {isClient
              ? renderFloatingDate(
                  time.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                )
              : 'Loading...'}
          </div>
        </div>
      </div>

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
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {isPaused ? (
                      <Play size={16} className="text-white/70" />
                    ) : (
                      <Pause size={16} className="text-white/70" />
                    )}
                  </button>
                  <button
                    onClick={resetPomodoro}
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

      <div
        className={`absolute top-6 right-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 transition-colors"
        >
          <Settings size={18} className="text-white/70" />
        </button>
      </div>

      <div
        className={`absolute bottom-6 right-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={() => setShowInfo(true)}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 transition-colors"
        >
          <Info size={18} className="text-white/70" />
        </button>
      </div>

      {showSettings && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="bg-black/80 border border-white/10 rounded-2xl p-6 max-w-md w-full animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-white/90 font-medium">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-white/70 hover:text-white/90"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-white/70 mb-3 text-sm uppercase tracking-wider">
                  Clock Animation
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setEnableClockBounce(false)}
                    className={`px-4 py-2 rounded-lg border text-white ${
                      !enableClockBounce
                        ? 'bg-white/20 border-white/30'
                        : 'bg-black/40 border-white/10'
                    }`}
                  >
                    Static
                  </button>
                  <button
                    onClick={() => setEnableClockBounce(true)}
                    className={`px-4 py-2 rounded-lg border text-white ${
                      enableClockBounce
                        ? 'bg-white/20 border-white/30'
                        : 'bg-black/40 border-white/10'
                    }`}
                  >
                    Floating
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-white/70 mb-3 text-sm uppercase tracking-wider">
                  Time Format
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setUse24Hour(false)}
                    className={`px-4 py-2 rounded-lg border text-white ${
                      !use24Hour
                        ? 'bg-white/20 border-white/30'
                        : 'bg-black/40 border-white/10'
                    }`}
                  >
                    12-Hour
                  </button>
                  <button
                    onClick={() => setUse24Hour(true)}
                    className={`px-4 py-2 rounded-lg border text-white ${
                      use24Hour
                        ? 'bg-white/20 border-white/30'
                        : 'bg-black/40 border-white/10'
                    }`}
                  >
                    24-Hour
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-white/70 mb-3 text-sm uppercase tracking-wider">
                  Pomodoro Settings
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 text-sm block mb-1">
                      Work Duration
                    </label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white/80">
                      <option value="25">25 minutes</option>
                      <option value="20">20 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm block mb-1">
                      Break Duration
                    </label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white/80">
                      <option value="5">5 minutes</option>
                      <option value="10">10 minutes</option>
                      <option value="15">15 minutes</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-black/80 border border-white/10 rounded-2xl p-6 max-w-md w-full animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-white/90 font-medium">
                About This App
              </h2>
              <button
                onClick={() => setShowInfo(false)}
                className="text-white/70 hover:text-white/90"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-white/70">
              <p>
                This is an OLED-friendly screensaver designed to prevent screen
                burn-in while providing useful productivity tools.
              </p>
              <h3 className="text-white/90 font-medium mt-4">Features:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Dynamic background that constantly shifts to prevent pixel
                  burn-in
                </li>
                <li>Floating Pomodoro timer that moves across the screen</li>
                <li>Digital clock with customizable time format</li>
                <li>
                  Black background for OLED screens (black pixels are turned
                  off)
                </li>
                <li>
                  All elements shift position over time to prevent static
                  content
                </li>
              </ul>
              <p className="mt-4">
                Move your mouse to reveal controls. The app will automatically
                enter fullscreen mode for the best experience.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-8 left-8 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
      <div
        className="absolute top-8 right-8 w-2 h-2 bg-white/20 rounded-full animate-pulse"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute bottom-8 left-8 w-2 h-2 bg-white/20 rounded-full animate-pulse"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute bottom-8 right-8 w-2 h-2 bg-white/20 rounded-full animate-pulse"
        style={{ animationDelay: '3s' }}
      />
    </div>
  );
}
