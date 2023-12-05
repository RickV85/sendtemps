import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const defaultLocations =
      await sql`SELECT * FROM weather_wise.default_locations;`;
    const defaultLocRows = defaultLocations.rows;
    const response = NextResponse.json(defaultLocRows, { status: 200 });
    // Added no-cache for build phase, change to "Cache-Control", "public, max-age=3600"
    // or similar to cache request
    response.headers.set("Cache-Control", "no-cache");
    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
