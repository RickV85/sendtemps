import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = await request.nextUrl.searchParams.get("user_id");
    const userLocations =
      await sql`SELECT * FROM sendtemps.user_locations WHERE user_id = ${userId};`;
    const userLocRows = userLocations.rows;
    const response = NextResponse.json(userLocRows, { status: 200 });
    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
