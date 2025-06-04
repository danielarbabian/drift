import { memo, useState } from 'react';
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

  const [playlistError, setPlaylistError] = useState<string | null>(null);
  const [loadingPlaylist, setLoadingPlaylist] = useState<string | null>(null);

  const handlePlaylistClick = async (playlist: any) => {
    setLoadingPlaylist(playlist.id);
    setPlaylistError(null);

    try {
      const result = await startPlaylist(playlist.uri);
      if (!result.success) {
        setPlaylistError(result.error || 'Failed to start playlist');
        setTimeout(() => setPlaylistError(null), 5000);
      }
    } catch (error) {
      setPlaylistError('Error starting playlist');
      setTimeout(() => setPlaylistError(null), 5000);
    } finally {
      setLoadingPlaylist(null);
    }
  };

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
                      Web Player Issue
                    </div>
                    <div className="text-white/60 text-xs mb-3 leading-tight">
                      If you have Premium, try playing music in the Spotify app
                      first, then use these controls
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
                      Your Playlists ({playlists.length})
                      {webPlayerReady &&
                        !isPremiumRequired &&
                        ' • Ready to Play'}
                      {isPremiumRequired && ' • App Controls'}
                    </div>
                    <div className="relative">
                      <div className="max-h-52 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
                        {playlists.map((playlist) => (
                          <button
                            key={playlist.id}
                            onClick={async () => {
                              await handlePlaylistClick(playlist);
                            }}
                            disabled={
                              (!webPlayerReady && !isPremiumRequired) ||
                              loadingPlaylist === playlist.id
                            }
                            className={`w-full text-left p-2 rounded-lg transition-colors cursor-pointer ${
                              webPlayerReady || isPremiumRequired
                                ? 'bg-white/5 hover:bg-white/10'
                                : 'bg-white/5 opacity-50 cursor-not-allowed'
                            } ${
                              loadingPlaylist === playlist.id
                                ? 'opacity-50'
                                : ''
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
                                  className="w-8 h-8 rounded object-cover flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="text-white/90 text-sm font-medium truncate">
                                  {loadingPlaylist === playlist.id
                                    ? 'Starting...'
                                    : playlist.name}
                                </div>
                                <div className="text-white/50 text-xs">
                                  {playlist.tracks.total} tracks
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                      {playlists.length > 4 && (
                        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none rounded-b-lg" />
                      )}
                    </div>
                    {playlistError && (
                      <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <div className="text-red-300 text-xs">
                          {playlistError}
                        </div>
                      </div>
                    )}
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
