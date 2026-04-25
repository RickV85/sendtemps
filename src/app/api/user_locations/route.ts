import { UserLocation } from '@/app/Classes/UserLocation';
import { authOptions } from '@/app/lib/authOptions';
import { sql, db } from '@vercel/postgres';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = request.nextUrl.searchParams.get('user_id');
  if (!userId) {
    return NextResponse.json({ error: 'Missing user_id parameter' }, { status: 400 });
  }

  if (session.user.id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const id = request.nextUrl.searchParams.get('id');
    let foundEntries;
    if (id) {
      const matchingLocs =
        await sql`SELECT * FROM sendtemps.user_locations WHERE user_id = ${userId} AND id = ${id};`;
      foundEntries = matchingLocs?.rows[0];
    } else {
      const matchingLocs =
        await sql`SELECT * FROM sendtemps.user_locations WHERE user_id = ${userId};`;
      foundEntries = matchingLocs?.rows;
    }

    return NextResponse.json(foundEntries, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const reqBody = await request.json();
    const newUserLoc = new UserLocation(
      undefined,
      reqBody.name,
      reqBody.latitude,
      reqBody.longitude,
      session.user.id,
      reqBody.poi_type,
      null,
      null,
    );
    await sql`INSERT INTO sendtemps.user_locations (name, latitude, longitude, user_id, poi_type, date_created, last_modified) VALUES (${newUserLoc.name}, ${newUserLoc.latitude}, ${newUserLoc.longitude}, ${newUserLoc.user_id}, ${newUserLoc.poi_type}, ${newUserLoc.date_created}, ${newUserLoc.last_modified})`;
    return NextResponse.json(
      `Success - New Location "${newUserLoc.name}" created for user: ${newUserLoc.user_id}`,
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const reqBody = await request.json();
    const validCols = ['name', 'poi_type'];

    if (!reqBody.id || !reqBody.changeCol || !validCols.includes(reqBody.changeCol)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { rows } = await sql`
      SELECT * FROM sendtemps.user_locations WHERE id = ${reqBody.id};
    `;
    const userLoc = rows[0] ?? null;

    if (!userLoc) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    if (userLoc.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const patchLoc = new UserLocation(
      userLoc.id,
      userLoc.name,
      userLoc.latitude,
      userLoc.longitude,
      userLoc.user_id,
      userLoc.poi_type,
      userLoc.date_created,
      userLoc.last_modified,
    );

    if (reqBody.changeCol === 'name') {
      patchLoc.updateName(reqBody.data);
    } else if (reqBody.changeCol === 'poi_type') {
      patchLoc.updatePOIType(reqBody.data);
    }
    patchLoc.updateLastModified();

    const client = await db.connect();

    if (reqBody.changeCol === 'name') {
      await client.sql`UPDATE sendtemps.user_locations 
        SET name = ${reqBody.data} 
        WHERE id = ${patchLoc.id} AND user_id = ${patchLoc.user_id};`;
    } else if (reqBody.changeCol === 'poi_type') {
      await client.sql`UPDATE sendtemps.user_locations 
        SET poi_type = ${reqBody.data} 
        WHERE id = ${patchLoc.id} AND user_id = ${patchLoc.user_id};`;
    }

    await client.sql`UPDATE sendtemps.user_locations 
      SET last_modified = ${patchLoc.last_modified} 
      WHERE id = ${patchLoc.id} AND user_id = ${patchLoc.user_id};`;

    client.release();

    return NextResponse.json({ patchLoc }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deleteLoc = await request.json();

    if (deleteLoc.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await sql`DELETE FROM sendtemps.user_locations 
      WHERE id = ${deleteLoc.id} AND user_id = ${deleteLoc.user_id};`;
    return NextResponse.json(
      `Success: User Location id: ${deleteLoc.id} for user_id: ${deleteLoc.user_id} successfully deleted`,
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
