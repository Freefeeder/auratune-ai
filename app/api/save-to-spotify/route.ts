import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, tracks } = await request.json()

    if (!name || !Array.isArray(tracks)) {
      return NextResponse.json({ error: "Invalid playlist data" }, { status: 400 })
    }

    // This functionality requires users to connect their Spotify account
    // For now, we'll return the playlist data without saving to Spotify
    return NextResponse.json({
      success: true,
      message: "Playlist generated successfully",
      note: "To save to Spotify, please connect your Spotify account in settings",
      playlist: {
        name,
        description,
        tracks,
      },
    })
  } catch (error) {
    console.error("[v0] Error processing playlist:", error)
    return NextResponse.json({ error: "Failed to process playlist" }, { status: 500 })
  }
}
