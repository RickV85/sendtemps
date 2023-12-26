import { UserLocation } from "@/app/Classes/UserLocation";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("user_id");
    const locId = request.nextUrl.searchParams.get("locId");
    let matchingLocs;
    if (userId && locId) {
      matchingLocs =
        await sql`SELECT * FROM sendtemps.user_locations WHERE user_id = ${userId} AND id = ${locId};`;
    } else if (userId && !locId) {
      matchingLocs =
        await sql`SELECT * FROM sendtemps.user_locations WHERE user_id = ${userId};`;
    }
    const foundEntries = matchingLocs?.rows;
    const response = NextResponse.json(foundEntries, { status: 200 });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const newUserLoc = new UserLocation(
      reqBody.name,
      reqBody.latitude,
      reqBody.longitude,
      reqBody.user_id,
      reqBody.poi_type,
      null,
      null
    );
    console.log(newUserLoc);
    let response;
    if (newUserLoc) {
      await sql`INSERT INTO sendtemps.user_locations (name, latitude, longitude, user_id, poi_type, date_created, last_modified) VALUES (${newUserLoc.name}, ${newUserLoc.latitude}, ${newUserLoc.longitude}, ${newUserLoc.user_id}, ${newUserLoc.poi_type}, ${newUserLoc.date_created}, ${newUserLoc.last_modified})`;
      response = NextResponse.json(
        `Success - New Location "${newUserLoc.name}" created for user: ${newUserLoc.user_id}`,
        { status: 201 }
      );
    }
    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const reqBody = await request.json();
    // reqBody.loc will contain userLoc data
    const userLoc = new UserLocation(
      reqBody.loc.name,
      reqBody.loc.latitude,
      reqBody.loc.longitude,
      reqBody.loc.user_id,
      reqBody.loc.poi_type,
      reqBody.loc.date_created,
      reqBody.loc.last_modified
    );
    // reqBody.change will have { type: "change type here", data: "data to change to"}
    const update = reqBody.change;

    userLoc.updateLastModified();
    // return userLoc to FE to use immediately, update state
    return NextResponse.json({ userLoc }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
