import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const defaultLocations =
      await sql`SELECT * FROM weather_wise.default_locations;`;
    const defaultLocRows = defaultLocations.rows;
    const response = NextResponse.json(defaultLocRows, { status: 200 });
    // Added cache max age of 10 min for build phase, 
    // change to "Cache-Control", "public, max-age=3600"
    // for one hour, or maybe more for production
    response.headers.set("Cache-Control", "public, max-age=600");
    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
