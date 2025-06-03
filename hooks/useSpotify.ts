import { useState, useEffect, useCallback } from 'react';
import {
  exchangeSpotifyCode,
  clearSpotifyTokens,
  fetchCurrentTrack,
  controlPlayback,
  checkSpotifyConnection,
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

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
const SPOTIFY_SCOPES =
  'user-read-playback-state user-modify-playback-state user-read-currently-playing';

export function useSpotify() {
  const [currentTrack, setCurrentTrack] = useState<SpotifyPlayerState | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  return {
    isConnected,
    currentTrack,
    isLoading,
    login,
    logout,
    togglePlayPause,
    skipTrack,
  };
}
