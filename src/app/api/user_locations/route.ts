import { sql, db } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { UserLocation } from '@/app/Classes/UserLocation';
import { authOptions } from '@/app/lib/authOptions';
import { parseBody } from '@/app/lib/parseBody';
import {
  createUserLocationSchema,
  deleteUserLocationSchema,
  patchUserLocationSchema,
} from '@/app/lib/schemas';

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

  const parsed = await parseBody(request, createUserLocationSchema);
  if (parsed.error) return parsed.error;

  try {
    const newUserLoc = new UserLocation(
      undefined,
      parsed.data.name,
      parsed.data.latitude,
      parsed.data.longitude,
      session.user.id,
      parsed.data.poi_type,
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

  const parsed = await parseBody(request, patchUserLocationSchema);
  if (parsed.error) return parsed.error;

  try {
    const { rows } = await sql`
      SELECT * FROM sendtemps.user_locations WHERE id = ${parsed.data.id};
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

    if (parsed.data.changeCol === 'name') {
      patchLoc.updateName(parsed.data.data);
    } else if (parsed.data.changeCol === 'poi_type') {
      patchLoc.updatePOIType(parsed.data.data);
    }
    patchLoc.updateLastModified();

    const client = await db.connect();

    if (parsed.data.changeCol === 'name') {
      await client.sql`UPDATE sendtemps.user_locations 
        SET name = ${parsed.data.data} 
        WHERE id = ${patchLoc.id} AND user_id = ${patchLoc.user_id};`;
    } else if (parsed.data.changeCol === 'poi_type') {
      await client.sql`UPDATE sendtemps.user_locations 
        SET poi_type = ${parsed.data.data} 
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

  const parsed = await parseBody(request, deleteUserLocationSchema);
  if (parsed.error) return parsed.error;

  try {
    if (parsed.data.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await sql`DELETE FROM sendtemps.user_locations 
      WHERE id = ${parsed.data.id} AND user_id = ${parsed.data.user_id};`;
    return NextResponse.json(
      `Success: User Location id: ${parsed.data.id} for user_id: ${parsed.data.user_id} successfully deleted`,
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
