import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (callback: (token: string) => void) => void;
        volume: number;
      }) => SpotifyPlayer;
    };
  }
}

interface SpotifyPlayer {
  addListener: (event: string, callback: (data: any) => void) => void;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  getCurrentState: () => Promise<any>;
  getVolume: () => Promise<number>;
  nextTrack: () => Promise<void>;
  pause: () => Promise<void>;
  previousTrack: () => Promise<void>;
  resume: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  setName: (name: string) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  togglePlay: () => Promise<void>;
}

export function useSpotifyWebPlayer(accessToken: string | null) {
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPremiumRequired, setIsPremiumRequired] = useState(false);

  const loadSDK = useCallback(() => {
    if (isSDKLoaded || document.querySelector('script[src*="sdk.scdn.co"]')) {
      setIsSDKLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      setIsSDKLoaded(true);
    };
  }, [isSDKLoaded]);

  const initializePlayer = useCallback(() => {
    if (!window.Spotify || !accessToken || player) return;

    const newPlayer = new window.Spotify.Player({
      name: 'drift',
      getOAuthToken: (cb) => {
        cb(accessToken);
      },
      volume: 0.5,
    });

    newPlayer.addListener('ready', ({ device_id }) => {
      setDeviceId(device_id);
      setIsReady(true);
      setError(null);
      setIsPremiumRequired(false);
    });

    newPlayer.addListener('not_ready', ({ device_id }) => {
      setIsReady(false);
    });

    newPlayer.addListener('initialization_error', ({ message }) => {
      console.error('Failed to initialize:', message);
      setError(message);
    });

    newPlayer.addListener('authentication_error', ({ message }) => {
      console.error('Failed to authenticate:', message);
      setError(message);
    });

    newPlayer.addListener('account_error', ({ message }) => {
      console.error('Failed to validate Spotify account:', message);
      setError(message);
      if (message.includes('premium users only')) {
        setIsPremiumRequired(true);
      }
    });

    newPlayer.addListener('playback_error', ({ message }) => {
      console.error('Failed to perform playback:', message);
      setError(message);
    });

    newPlayer.connect();
    setPlayer(newPlayer);
  }, [accessToken, player]);

  useEffect(() => {
    loadSDK();
  }, [loadSDK]);

  useEffect(() => {
    if (isSDKLoaded && accessToken && !player) {
      const initTimeout = setTimeout(initializePlayer, 100);
      return () => clearTimeout(initTimeout);
    }
  }, [isSDKLoaded, accessToken, player, initializePlayer]);

  useEffect(() => {
    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [player]);

  return {
    player,
    deviceId,
    isReady,
    isSDKLoaded,
    error,
    isPremiumRequired,
  };
}
