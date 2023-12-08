import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const defaultLocations =
      await sql`SELECT * FROM weather_wise.default_locations;`;
    const defaultLocRows = defaultLocations.rows;
    const response = NextResponse.json(defaultLocRows, { status: 200 });
    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
