import { memo } from 'react';
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

function SpotifyPlayerComponent({ showControls }: SpotifyPlayerProps) {
  const {
    isConnected,
    currentTrack,
    isLoading,
    playlists,
    playlistsLoading,
    webPlayerReady,
    isPremiumRequired,
    login,
    logout,
    togglePlayPause,
    skipTrack,
    startPlaylist,
  } = useSpotify();

  if (isLoading) {
    return null;
  }

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

  if (!currentTrack?.item) {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full">
          <div className="absolute animate-orbit-reverse">
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 shadow-2xl pointer-events-auto max-w-sm">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <Music className="text-green-400 mr-2" size={20} />
                  <span className="text-white/90 font-medium">Spotify</span>
                  {webPlayerReady && (
                    <div
                      className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"
                      title="Web Player Ready"
                    />
                  )}
                </div>

                {isPremiumRequired ? (
                  <div className="mb-3">
                    <div className="text-orange-400 text-xs mb-1 font-medium">
                      Premium Required
                    </div>
                    <div className="text-white/60 text-xs mb-3 leading-tight">
                      Play in Spotify app, use controls to switch playlists
                    </div>
                  </div>
                ) : (
                  !webPlayerReady && (
                    <div className="text-white/60 text-xs mb-3">
                      Initializing web player...
                    </div>
                  )
                )}

                {playlistsLoading ? (
                  <div className="text-white/60 text-sm">
                    Loading playlists...
                  </div>
                ) : playlists.length > 0 ? (
                  <div>
                    <div className="text-white/60 text-xs mb-3 uppercase tracking-wider">
                      Your Playlists
                      {webPlayerReady &&
                        !isPremiumRequired &&
                        ' • Ready to Play'}
                      {isPremiumRequired && ' • Controls Only'}
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {playlists.slice(0, 8).map((playlist) => (
                        <button
                          key={playlist.id}
                          onClick={async () => {
                            await startPlaylist(playlist.uri);
                          }}
                          disabled={!webPlayerReady && !isPremiumRequired}
                          className={`w-full text-left p-2 rounded-lg transition-colors cursor-pointer ${
                            webPlayerReady || isPremiumRequired
                              ? 'bg-white/5 hover:bg-white/10'
                              : 'bg-white/5 opacity-50 cursor-not-allowed'
                          }`}
                          title={
                            isPremiumRequired
                              ? 'Will switch to this playlist on your active Spotify device'
                              : undefined
                          }
                        >
                          <div className="flex items-center gap-3">
                            {playlist.images[0] && (
                              <img
                                src={playlist.images[0].url}
                                alt={playlist.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-white/90 text-sm font-medium truncate">
                                {playlist.name}
                              </div>
                              <div className="text-white/50 text-xs">
                                {playlist.tracks.total} tracks
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-white/60 text-sm">
                    No playlists found
                  </div>
                )}

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
              {track.album.images[0] && (
                <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden">
                  <img
                    src={track.album.images[0].url}
                    alt={track.album.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

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

export const SpotifyPlayer = memo(SpotifyPlayerComponent);
