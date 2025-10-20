import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { searchSpotifyTrack } from "@/lib/spotify"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { queries } = await request.json()

    if (!Array.isArray(queries)) {
      return NextResponse.json({ error: "Queries must be an array" }, { status: 400 })
    }

    const spotifyToken = await getSpotifyAccessToken()

    if (!spotifyToken) {
      return NextResponse.json({ error: "Failed to authenticate with Spotify" }, { status: 500 })
    }

    // Search for tracks in parallel
    const trackPromises = queries.map((query: string) => searchSpotifyTrack(query, spotifyToken))

    const tracks = await Promise.all(trackPromises)

    // Filter out null results
    const validTracks = tracks.filter((track) => track !== null)

    return NextResponse.json({ tracks: validTracks })
  } catch (error) {
    console.error("[v0] Error searching tracks:", error)
    return NextResponse.json({ error: "Failed to search tracks" }, { status: 500 })
  }
}

async function getSpotifyAccessToken(): Promise<string | null> {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
        ).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("[v0] Error getting Spotify token:", error)
    return null
  }
}
