'use server';

import { cookies } from 'next/headers';

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI =
  process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:3000';

export async function exchangeSpotifyCode(code: string) {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI || '',
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      const cookieStore = await cookies();
      cookieStore.set('spotify_access_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: data.expires_in,
      });

      if (data.refresh_token) {
        cookieStore.set('spotify_refresh_token', data.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30,
        });
      }

      return { success: true };
    }

    return { success: false, error: 'Failed to exchange code' };
  } catch (error) {
    console.error('Error exchanging Spotify code:', error);
    return { success: false, error: 'Exchange failed' };
  }
}

export async function refreshSpotifyToken() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('spotify_refresh_token')?.value;

    if (!refreshToken) {
      return { success: false, error: 'No refresh token' };
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      cookieStore.set('spotify_access_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: data.expires_in,
      });

      return { success: true };
    }

    return { success: false, error: 'Failed to refresh token' };
  } catch (error) {
    console.error('Error refreshing Spotify token:', error);
    return { success: false, error: 'Refresh failed' };
  }
}

export async function getSpotifyAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get('spotify_access_token')?.value || null;
}

export async function clearSpotifyTokens() {
  const cookieStore = await cookies();
  cookieStore.delete('spotify_access_token');
  cookieStore.delete('spotify_refresh_token');
  return { success: true };
}

export async function fetchCurrentTrack() {
  try {
    const accessToken = await getSpotifyAccessToken();

    if (!accessToken) {
      return { success: false, error: 'No access token' };
    }

    const response = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      return { success: true, data };
    } else if (response.status === 204) {
      return { success: true, data: null };
    } else if (response.status === 401) {
      const refreshResult = await refreshSpotifyToken();
      if (refreshResult.success) {
        return fetchCurrentTrack();
      }
      return { success: false, error: 'Authentication failed' };
    }

    return { success: false, error: 'Failed to fetch track' };
  } catch (error) {
    console.error('Error fetching current track:', error);
    return { success: false, error: 'Fetch failed' };
  }
}

export async function controlPlayback(
  action: 'play' | 'pause' | 'next' | 'previous'
) {
  try {
    const accessToken = await getSpotifyAccessToken();

    if (!accessToken) {
      return { success: false, error: 'No access token' };
    }

    const endpoint = `https://api.spotify.com/v1/me/player/${action}`;
    const method = action === 'next' || action === 'previous' ? 'POST' : 'PUT';

    const response = await fetch(endpoint, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204 || response.status === 200) {
      return { success: true };
    } else if (response.status === 401) {
      const refreshResult = await refreshSpotifyToken();
      if (refreshResult.success) {
        return controlPlayback(action);
      }
      return { success: false, error: 'Authentication failed' };
    }

    return { success: false, error: 'Control action failed' };
  } catch (error) {
    console.error('Error controlling playback:', error);
    return { success: false, error: 'Control failed' };
  }
}

export async function checkSpotifyConnection() {
  const accessToken = await getSpotifyAccessToken();
  return { isConnected: !!accessToken };
}

export async function getUserPlaylists() {
  try {
    const accessToken = await getSpotifyAccessToken();

    if (!accessToken) {
      return { success: false, error: 'No access token' };
    }

    const response = await fetch(
      'https://api.spotify.com/v1/me/playlists?limit=20',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      return { success: true, data: data.items };
    } else if (response.status === 401) {
      const refreshResult = await refreshSpotifyToken();
      if (refreshResult.success) {
        return getUserPlaylists();
      }
      return { success: false, error: 'Authentication failed' };
    }

    return { success: false, error: 'Failed to fetch playlists' };
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return { success: false, error: 'Fetch failed' };
  }
}

export async function playPlaylist(playlistUri: string, deviceId?: string) {
  try {
    const accessToken = await getSpotifyAccessToken();

    if (!accessToken) {
      return { success: false, error: 'No access token' };
    }

    const body = {
      context_uri: playlistUri,
    };

    let url = 'https://api.spotify.com/v1/me/player/play';
    if (deviceId) {
      url += `?device_id=${deviceId}`;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.status === 204 || response.status === 200) {
      return { success: true };
    } else if (response.status === 401) {
      const refreshResult = await refreshSpotifyToken();
      if (refreshResult.success) {
        return playPlaylist(playlistUri, deviceId);
      }
      return { success: false, error: 'Authentication failed' };
    } else if (response.status === 404) {
      return { success: false, error: 'No active device' };
    } else {
      const errorData = await response.text();
      if (response.status === 403 && errorData.includes('Premium required')) {
        return {
          success: false,
          error: 'Failed to start playlist: 403 Premium required',
        };
      }

      return {
        success: false,
        error: `Failed to start playlist: ${response.status}`,
      };
    }
  } catch (error) {
    console.error('Error starting playlist:', error);
    return { success: false, error: 'Play failed' };
  }
}

export async function getSpotifyAccessTokenForClient() {
  return await getSpotifyAccessToken();
}

export async function getUserProfile() {
  try {
    const accessToken = await getSpotifyAccessToken();

    if (!accessToken) {
      return { success: false, error: 'No access token' };
    }

    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      return { success: true, data };
    } else if (response.status === 401) {
      const refreshResult = await refreshSpotifyToken();
      if (refreshResult.success) {
        return getUserProfile();
      }
      return { success: false, error: 'Authentication failed' };
    }

    return { success: false, error: 'Failed to fetch user profile' };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, error: 'Fetch failed' };
  }
}

export async function transferPlayback(deviceId: string) {
  try {
    const accessToken = await getSpotifyAccessToken();

    if (!accessToken) {
      return { success: false, error: 'No access token' };
    }

    console.log('Attempting to transfer playback to device:', deviceId);

    const response = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false,
      }),
    });

    console.log('Transfer playback response status:', response.status);

    if (response.status === 204 || response.status === 200) {
      return { success: true };
    } else if (response.status === 401) {
      const refreshResult = await refreshSpotifyToken();
      if (refreshResult.success) {
        return transferPlayback(deviceId);
      }
      return { success: false, error: 'Authentication failed' };
    } else if (response.status === 404) {
      return {
        success: false,
        error: 'Device not found - try again in a moment',
      };
    } else {
      const errorText = await response.text();
      console.log('Transfer playback error response:', errorText);
      return { success: false, error: `Transfer failed: ${response.status}` };
    }
  } catch (error) {
    console.error('Error transferring playback:', error);
    return { success: false, error: 'Transfer failed' };
  }
}
