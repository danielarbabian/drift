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
  const [currentTrack, setCurrentTrack] = useState<SpotifyPlayerState | null>(
    null
  );
  const [localPosition, setLocalPosition] = useState(0);

  useEffect(() => {
    if (!currentTrack?.is_playing) return;

    const interval = setInterval(() => {
      setLocalPosition((prev) => prev + 300);
    }, 300);

    return () => clearInterval(interval);
  }, [currentTrack?.is_playing]);

  useEffect(() => {
    if (!accessToken) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new window.Spotify.Player({
        name: 'drift',
        getOAuthToken: (cb) => cb(accessToken),
        volume: 0.5,
      });

      newPlayer.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id);
        setIsReady(true);
      });

      newPlayer.addListener('not_ready', ({ device_id }) => {
        setIsReady(false);
      });

      newPlayer.addListener('player_state_changed', (state) => {
        if (!state) {
          setCurrentTrack(null);
          setLocalPosition(0);
          return;
        }

        const track = state.track_window.current_track;
        if (!track) {
          setCurrentTrack(null);
          setLocalPosition(0);
          return;
        }

        setLocalPosition(state.position);

        setCurrentTrack({
          is_playing: !state.paused,
          progress_ms: state.position,
          item: {
            id: track.id,
            name: track.name,
            artists: track.artists.map((artist: any) => ({
              name: artist.name,
            })),
            album: {
              name: track.album.name,
              images: track.album.images || [],
            },
            duration_ms: track.duration_ms,
          },
        });
      });

      newPlayer.connect();
      setPlayer(newPlayer);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken]);

  const currentTrackWithLivePosition = currentTrack
    ? {
        ...currentTrack,
        progress_ms: localPosition,
      }
    : null;

  return {
    player,
    deviceId,
    isReady,
    currentTrack: currentTrackWithLivePosition,
    isPremiumRequired: false,
  };
}
