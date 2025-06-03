import { useState, useEffect, useCallback } from 'react';
import {
  exchangeSpotifyCode,
  clearSpotifyTokens,
  fetchCurrentTrack,
  controlPlayback,
  checkSpotifyConnection,
  getUserPlaylists,
  playPlaylist,
} from '@/lib/spotify-actions';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  duration_ms: number;
}

interface SpotifyPlayerState {
  is_playing: boolean;
  progress_ms: number;
  item: SpotifyTrack | null;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  uri: string;
  images: { url: string; width: number; height: number }[];
  tracks: {
    total: number;
  };
}

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
const SPOTIFY_SCOPES =
  'user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative';

export function useSpotify() {
  const [currentTrack, setCurrentTrack] = useState<SpotifyPlayerState | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await checkSpotifyConnection();
        setIsConnected(result.isConnected);
      } catch (error) {
        console.error('Error checking Spotify connection:', error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code && !isConnected) {
        try {
          const result = await exchangeSpotifyCode(code);
          if (result.success) {
            setIsConnected(true);
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          }
        } catch (error) {
          console.error('Error exchanging code:', error);
        }
      }
    };

    if (!isLoading) {
      handleCallback();
    }
  }, [isConnected, isLoading]);

  const fetchPlaylists = useCallback(async () => {
    if (!isConnected) return;

    setPlaylistsLoading(true);
    try {
      const result = await getUserPlaylists();
      if (result.success) {
        setPlaylists(result.data);
      } else if (result.error === 'Authentication failed') {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setPlaylistsLoading(false);
    }
  }, [isConnected]);

  const startPlaylist = useCallback(
    async (playlistUri: string) => {
      if (!isConnected) return;

      try {
        const result = await playPlaylist(playlistUri);
        if (result.success) {
          setTimeout(refreshCurrentTrack, 1000);
        } else if (result.error === 'Authentication failed') {
          setIsConnected(false);
          setCurrentTrack(null);
        }
      } catch (error) {
        console.error('Error starting playlist:', error);
      }
    },
    [isConnected]
  );

  const login = useCallback(() => {
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', SPOTIFY_CLIENT_ID || '');
    authUrl.searchParams.append('scope', SPOTIFY_SCOPES);
    authUrl.searchParams.append('redirect_uri', SPOTIFY_REDIRECT_URI || '');

    window.location.href = authUrl.toString();
  }, []);

  const logout = useCallback(async () => {
    try {
      await clearSpotifyTokens();
      setIsConnected(false);
      setCurrentTrack(null);
      setPlaylists([]);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, []);

  const refreshCurrentTrack = useCallback(async () => {
    if (!isConnected) return;

    try {
      const result = await fetchCurrentTrack();
      if (result.success) {
        setCurrentTrack(result.data);
      } else if (result.error === 'Authentication failed') {
        setIsConnected(false);
        setCurrentTrack(null);
      }
    } catch (error) {
      console.error('Error fetching current track:', error);
    }
  }, [isConnected]);

  const togglePlayPause = useCallback(async () => {
    if (!isConnected || !currentTrack) return;

    const action = currentTrack.is_playing ? 'pause' : 'play';

    try {
      const result = await controlPlayback(action);
      if (result.success) {
        setTimeout(refreshCurrentTrack, 500);
      } else if (result.error === 'Authentication failed') {
        setIsConnected(false);
        setCurrentTrack(null);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  }, [isConnected, currentTrack, refreshCurrentTrack]);

  const skipTrack = useCallback(
    async (direction: 'next' | 'previous') => {
      if (!isConnected) return;

      try {
        const result = await controlPlayback(direction);
        if (result.success) {
          setTimeout(refreshCurrentTrack, 1000);
        } else if (result.error === 'Authentication failed') {
          setIsConnected(false);
          setCurrentTrack(null);
        }
      } catch (error) {
        console.error('Error skipping track:', error);
      }
    },
    [isConnected, refreshCurrentTrack]
  );

  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(refreshCurrentTrack, 5000);
    refreshCurrentTrack();

    return () => clearInterval(interval);
  }, [isConnected, refreshCurrentTrack]);

  useEffect(() => {
    if (isConnected) {
      fetchPlaylists();
    }
  }, [isConnected, fetchPlaylists]);

  return {
    isConnected,
    currentTrack,
    isLoading,
    playlists,
    playlistsLoading,
    login,
    logout,
    togglePlayPause,
    skipTrack,
    fetchPlaylists,
    startPlaylist,
  };
}
