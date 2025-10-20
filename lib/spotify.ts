interface SpotifyTrack {
  name: string
  artist: string
  album: string
  uri: string
  preview_url?: string
}

export async function searchSpotifyTrack(query: string, accessToken: string): Promise<SpotifyTrack | null> {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (!response.ok) {
      console.error("[v0] Spotify search failed:", response.status)
      return null
    }

    const data = await response.json()
    const track = data.tracks?.items?.[0]

    if (!track) return null

    return {
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
      album: track.album.name,
      uri: track.uri,
      preview_url: track.preview_url,
    }
  } catch (error) {
    console.error("[v0] Error searching Spotify:", error)
    return null
  }
}

export async function createSpotifyPlaylist(
  name: string,
  description: string,
  trackUris: string[],
  accessToken: string,
): Promise<{ id: string; url: string } | null> {
  try {
    // Get user profile
    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!profileResponse.ok) {
      console.error("[v0] Failed to get user profile:", profileResponse.status)
      return null
    }

    const profile = await profileResponse.json()

    // Create playlist
    const createResponse = await fetch(`https://api.spotify.com/v1/users/${profile.id}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        public: false,
      }),
    })

    if (!createResponse.ok) {
      console.error("[v0] Failed to create playlist:", createResponse.status)
      return null
    }

    const playlist = await createResponse.json()

    // Add tracks to playlist
    if (trackUris.length > 0) {
      const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: trackUris,
        }),
      })

      if (!addTracksResponse.ok) {
        console.error("[v0] Failed to add tracks:", addTracksResponse.status)
      }
    }

    return {
      id: playlist.id,
      url: playlist.external_urls.spotify,
    }
  } catch (error) {
    console.error("[v0] Error creating Spotify playlist:", error)
    return null
  }
}
