import { UserLocation } from "@/app/Classes/UserLocation";
import { getUserLocationById } from "@/app/Util/APICalls";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("user_id");
    const id = request.nextUrl.searchParams.get("id");
    let matchingLocs;
    if (userId && id) {
      matchingLocs =
        await sql`SELECT * FROM sendtemps.user_locations WHERE user_id = ${userId} AND id = ${id};`;
    } else if (userId && !id) {
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
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const reqBody = await request.json();
    // reqBody : {
    // id: locId to change
    // userId: userId that created this location
    // changeCol: column name to change "name" or "poi_type"
    // data: what the user wants to change the col to
    // }
    const validCols = ["name", "poi_type"];
    const userLoc = await getUserLocationById(reqBody.userId, reqBody.id);

    if (userLoc && validCols.includes(reqBody.changeCol)) {
      const updateQuery = sql`
        UPDATE sendtemps.user_locations
        SET ${reqBody.changeCol} = ${reqBody.data}
        WHERE id = ${reqBody.id} AND user_id = ${reqBody.userId};
      `;
      await updateQuery;

      if (reqBody.changeCol === "name") {
        userLoc.updateName(reqBody.data);
      } else if (reqBody.changeCol === "poi_type") {
        userLoc.updatePOIType(reqBody.data);
      }
      userLoc.updateLastModified();
      console.log(userLoc);
      return NextResponse.json({ userLoc }, { status: 200 });
    } else {
      throw new Error("An error occurred while updating your location.");
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
