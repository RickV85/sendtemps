import { UserLocation } from "@/app/Classes/UserLocation";
import { getUserLocationById } from "@/app/Util/APICalls";
import { sql, db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("user_id");
    const id = request.nextUrl.searchParams.get("id");
    let matchingLocs;
    let foundEntries;
    if (userId && id) {
      matchingLocs =
        await sql`SELECT * FROM sendtemps.user_locations WHERE user_id = ${userId} AND id = ${id};`;
      foundEntries = matchingLocs?.rows[0];
    } else if (userId && !id) {
      matchingLocs =
        await sql`SELECT * FROM sendtemps.user_locations WHERE user_id = ${userId};`;
      foundEntries = matchingLocs?.rows;
    }

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
      undefined,
      reqBody.name,
      reqBody.latitude,
      reqBody.longitude,
      reqBody.user_id,
      reqBody.poi_type,
      null,
      null
    );
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
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const validCols = ["name", "poi_type"];
    let userLoc = await getUserLocationById(reqBody.userId, reqBody.id);

    if (userLoc && validCols.includes(reqBody.changeCol)) {
      let patchLoc = new UserLocation(
        userLoc.id,
        userLoc.name,
        userLoc.latitude,
        userLoc.longitude,
        userLoc.user_id,
        userLoc.poi_type,
        userLoc.date_created,
        userLoc.last_modified
      );
      if (reqBody.changeCol === "name") {
        patchLoc.updateName(reqBody.data);
      } else if (reqBody.changeCol === "poi_type") {
        patchLoc.updatePOIType(reqBody.data);
      }
      patchLoc.updateLastModified();

      const client = await db.connect();
      if (reqBody.changeCol === "name") {
        await client.sql`UPDATE sendtemps.user_locations 
        SET name = ${reqBody.data} 
        WHERE id = ${patchLoc.id} AND user_id = ${patchLoc.user_id};`;
      }

      await client.sql`UPDATE sendtemps.user_locations 
        SET last_modified = ${patchLoc.last_modified} 
        WHERE id = ${patchLoc.id} AND user_id = ${patchLoc.user_id};`;

      return NextResponse.json({ patchLoc }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
