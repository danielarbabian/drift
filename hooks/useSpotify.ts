import { useState, useEffect, useCallback } from 'react';
import {
  exchangeSpotifyCode,
  clearSpotifyTokens,
  controlPlayback,
  checkSpotifyConnection,
  getUserPlaylists,
  playPlaylist,
  getSpotifyAccessTokenForClient,
} from '@/lib/spotify-actions';
import { useSpotifyWebPlayer } from './useSpotifyWebPlayer';

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
  'user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative streaming user-read-email user-read-private';

export function useSpotify() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [playlistsFetched, setPlaylistsFetched] = useState(false);

  const { deviceId, isReady, currentTrack } = useSpotifyWebPlayer(accessToken);

  const isPremiumRequired = false;

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await checkSpotifyConnection();
        setIsConnected(result.isConnected);

        if (result.isConnected) {
          const token = await getSpotifyAccessTokenForClient();
          setAccessToken(token);
        }
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
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        try {
          const result = await exchangeSpotifyCode(code);
          if (result.success) {
            setIsConnected(true);
            const token = await getSpotifyAccessTokenForClient();
            setAccessToken(token);

            window.location.href = '/';
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
        setPlaylistsFetched(true);
      } else if (result.error === 'Authentication failed') {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setPlaylistsLoading(false);
    }
  }, [isConnected]);

  const logout = useCallback(async () => {
    try {
      await clearSpotifyTokens();
      setIsConnected(false);
      setPlaylists([]);
      setAccessToken(null);
      setPlaylistsFetched(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, []);

  const startPlaylist = useCallback(
    async (playlistUri: string) => {
      if (!isConnected) return { success: false, error: 'Not connected' };
      if (!isReady || !deviceId)
        return { success: false, error: 'Web player not ready' };

      try {
        const result = await playPlaylist(playlistUri, deviceId);

        if (result.success) {
          return { success: true };
        } else {
          return { success: false, error: result.error };
        }
      } catch (error) {
        console.error('Error starting playlist:', error);
        return { success: false, error: 'Network error' };
      }
    },
    [isConnected, deviceId, isReady]
  );

  const login = useCallback(() => {
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', SPOTIFY_CLIENT_ID || '');
    authUrl.searchParams.append('scope', SPOTIFY_SCOPES);
    authUrl.searchParams.append('redirect_uri', SPOTIFY_REDIRECT_URI || '');
    authUrl.searchParams.append('show_dialog', 'true');

    window.location.href = authUrl.toString();
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (!isConnected || !currentTrack) return;

    const action = currentTrack.is_playing ? 'pause' : 'play';

    try {
      const result = await controlPlayback(action);
      if (!result.success && result.error === 'Authentication failed') {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  }, [isConnected, currentTrack]);

  const skipTrack = useCallback(
    async (direction: 'next' | 'previous') => {
      if (!isConnected) return;

      try {
        const result = await controlPlayback(direction);
        if (!result.success && result.error === 'Authentication failed') {
          setIsConnected(false);
        }
      } catch (error) {
        console.error('Error skipping track:', error);
      }
    },
    [isConnected]
  );

  useEffect(() => {
    if (isConnected && !playlistsFetched) {
      fetchPlaylists();
    }
  }, [isConnected, fetchPlaylists, playlistsFetched]);

  return {
    isConnected,
    currentTrack,
    isLoading,
    playlists,
    playlistsLoading,
    webPlayerReady: isReady,
    isPremiumRequired,
    login,
    logout,
    togglePlayPause,
    skipTrack,
    fetchPlaylists,
    startPlaylist,
  };
}
