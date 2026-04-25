import { User } from '@/app/Classes/User';
import { authOptions } from '@/app/lib/authOptions';
import { sql } from '@vercel/postgres';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

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
  try {
    const reqUserData = await request.json();
    const foundUser = await findUserById(reqUserData.id);
    const newUser = new User(reqUserData.id, reqUserData.email, reqUserData.name, null, null, null);
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

  try {
    const userInfoToUpdate = await request.json();

    if (session.user.id !== userInfoToUpdate.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const previousUserData = await findUserById(userInfoToUpdate.id);

    if (!previousUserData) {
      return NextResponse.json(
        { error: `User id: ${userInfoToUpdate.id} not found` },
        {
          status: 404,
        },
      );
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
    if (userInfoToUpdate.email && user.email !== userInfoToUpdate.email) {
      user.updateEmail(userInfoToUpdate.email);
      isUpdated = true;
    }
    if (userInfoToUpdate.name && user.name !== userInfoToUpdate.name) {
      user.updateName(userInfoToUpdate.name);
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

      return NextResponse.json(`User id: ${user.id} updated successfully.`, {
        status: 200,
      });
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
