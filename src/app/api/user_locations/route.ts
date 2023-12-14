import { UserLocation } from "@/app/Classes/UserLocation";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET (request: NextRequest) {
  try {
    const userId = await request.nextUrl.searchParams.get("user_id");
    // Could provide another searchParam for id number
    // then if that param, send an individual location
    const userLocations =
      await sql`SELECT * FROM sendtemps.user_locations WHERE user_id = ${userId};`;
    const userLocRows = userLocations.rows;
    console.log(userLocations)
    const response = NextResponse.json(userLocRows, { status: 200 });
    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST (request: NextRequest) {
  try {
    const newUserLocation = await request.json();
    console.log(newUserLocation);
    let response;
    // Could add a sql query here to see if this has already been created
    if (newUserLocation) {
      await sql`INSERT INTO sendtemps.user_locations (name, latitude, longitude, date_created, last_modified) VALUES (${newUserLocation.name}, ${newUserLocation.latitude}, ${newUserLocation.longitude}, ${newUserLocation.date_created}, ${newUserLocation.last_modified})`;
      response = NextResponse.json(`New location "${newUserLocation.name} created for user: ${newUserLocation.user_id}`, { status: 201 });
    }
    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
