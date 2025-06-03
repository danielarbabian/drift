import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  LogOut,
} from 'lucide-react';
import { useSpotify } from '@/hooks/useSpotify';

interface SpotifyPlayerProps {
  showControls: boolean;
}

export function SpotifyPlayer({ showControls }: SpotifyPlayerProps) {
  const {
    isConnected,
    currentTrack,
    isLoading,
    login,
    logout,
    togglePlayPause,
    skipTrack,
  } = useSpotify();

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // If not connected, show login button
  if (!isConnected) {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full">
          <div className="absolute animate-orbit-reverse">
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 shadow-2xl pointer-events-auto">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Music className="text-green-400 mr-2" size={20} />
                  <span className="text-white/90 font-medium">Spotify</span>
                </div>
                <button
                  onClick={login}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-full transition-colors font-medium"
                >
                  Connect Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If connected but no track playing
  if (!currentTrack?.item) {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full">
          <div className="absolute animate-orbit-reverse">
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 shadow-2xl pointer-events-auto">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Music className="text-green-400 mr-2" size={20} />
                  <span className="text-white/90 font-medium">Spotify</span>
                </div>
                <div className="text-white/60 text-sm">No music playing</div>
                <div
                  className={`mt-3 flex justify-center transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <button
                    onClick={logout}
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <LogOut size={16} className="text-white/70" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const track = currentTrack.item;
  const progressPercentage =
    track.duration_ms > 0
      ? (currentTrack.progress_ms / track.duration_ms) * 100
      : 0;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="relative w-full h-full">
        <div className="absolute animate-orbit-reverse">
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 shadow-2xl pointer-events-auto max-w-xs">
            <div className="text-center">
              {/* Album Art */}
              {track.album.images[0] && (
                <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden">
                  <img
                    src={track.album.images[0].url}
                    alt={track.album.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Track Info */}
              <div className="mb-3">
                <div className="text-white/90 font-medium text-sm leading-tight">
                  {truncateText(track.name, 25)}
                </div>
                <div className="text-white/60 text-xs mt-1">
                  {truncateText(
                    track.artists.map((a) => a.name).join(', '),
                    30
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="w-full bg-white/10 rounded-full h-1">
                  <div
                    className="h-1 rounded-full bg-green-400/70 transition-all duration-1000"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(100, progressPercentage)
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>{formatTime(currentTrack.progress_ms)}</span>
                  <span>{formatTime(track.duration_ms)}</span>
                </div>
              </div>

              {/* Controls */}
              <div
                className={`flex justify-center space-x-3 transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <button
                  onClick={() => skipTrack('previous')}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <SkipBack size={16} className="text-white/70" />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {currentTrack.is_playing ? (
                    <Pause size={16} className="text-white/70" />
                  ) : (
                    <Play size={16} className="text-white/70" />
                  )}
                </button>
                <button
                  onClick={() => skipTrack('next')}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <SkipForward size={16} className="text-white/70" />
                </button>
                <button
                  onClick={logout}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <LogOut size={16} className="text-white/70" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
