import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("user_id");
  try {
    const { rows } = await sql`SELECT * FROM sendtemps.users 
    WHERE id = ${userId};`;
    if (rows.length > 1) {
      throw new Error (`More than one user found for id: ${userId}`)
    }
    const foundUser = rows[0];
    let response;
    if (foundUser) {
      response = NextResponse.json(foundUser, { status: 200 });
    } else {
      response = NextResponse.json(`No user found with id: ${userId}`, { status: 200 });
    }
    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}