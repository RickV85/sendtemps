import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { User } from '@/app/Classes/User';
import { authOptions } from '@/app/lib/authOptions';
import { parseBody } from '@/app/lib/parseBody';
import { createUserSchema, patchUserSchema } from '@/app/lib/schemas';

const findUserById = async (userId: string) => {
  try {
    const { rows } = await sql`SELECT * FROM sendtemps.users WHERE id = ${userId};`;
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

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
    const foundUser = await findUserById(userId);
    if (foundUser) {
      return NextResponse.json(foundUser, { status: 200 });
    } else {
      return NextResponse.json({ error: `No user found with id: ${userId}` }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// Called internally by NextAuth's signIn callback — intentionally unauthenticated.
export async function POST(request: NextRequest) {
  const parsed = await parseBody(request, createUserSchema);
  if (parsed.error) return parsed.error;

  try {
    const foundUser = await findUserById(parsed.data.id);
    const newUser = new User(parsed.data.id, parsed.data.email, parsed.data.name, null, null, null);
    if (!foundUser) {
      await sql`INSERT INTO sendtemps.users (id, email, name, last_login, date_created, last_modified) VALUES (${newUser.id}, ${newUser.email}, ${newUser.name}, ${newUser.last_login}, ${newUser.date_created}, ${newUser.last_modified})`;
      return NextResponse.json(`New user created with id: ${newUser.id}`, {
        status: 201,
      });
    } else {
      return NextResponse.json(`User with id: ${newUser.id} already exists, no new user created.`, {
        status: 409,
      });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = await parseBody(request, patchUserSchema);
  if (parsed.error) return parsed.error;

  try {
    if (session.user.id !== parsed.data.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const previousUserData = await findUserById(parsed.data.id);

    if (!previousUserData) {
      return NextResponse.json({ error: `User id: ${parsed.data.id} not found` }, { status: 404 });
    }

    const user = new User(
      previousUserData.id,
      previousUserData.email,
      previousUserData.name,
      previousUserData.last_login,
      previousUserData.date_created,
      previousUserData.last_modified,
    );

    let isUpdated = false;
    if (parsed.data.email && user.email !== parsed.data.email) {
      user.updateEmail(parsed.data.email);
      isUpdated = true;
    }
    if (parsed.data.name && user.name !== parsed.data.name) {
      user.updateName(parsed.data.name);
      isUpdated = true;
    }

    if (isUpdated) {
      user.updateLastModifiedToNow();
      user.updateLastLoginToNow();

      await sql`
        UPDATE sendtemps.users 
        SET email = ${user.email}, name = ${user.name}, last_modified = ${user.last_modified}, last_login = ${user.last_login} 
        WHERE id = ${user.id};
      `;

      return NextResponse.json(`User id: ${user.id} updated successfully.`, { status: 200 });
    } else {
      user.updateLastLoginToNow();

      await sql`
        UPDATE sendtemps.users 
        SET last_login = ${user.last_login} 
        WHERE id = ${user.id};
      `;

      return NextResponse.json(
        `New user data for id: ${user.id} matches previous user data from database. New login: ${user.last_login}`,
        { status: 200 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
