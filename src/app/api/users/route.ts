import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/Classes/User";

const findUserById = async (userId: string) => {
  try {
    const { rows } = await sql`SELECT * FROM sendtemps.users WHERE id = ${userId};`;
    return rows[0] || null;
  } catch (error) {
    console.error("Error in findUserById:", error);
    throw error;
  }
};

export async function GET(request: NextRequest) {
  try {
    const userId = await request.nextUrl.searchParams.get("user_id");
    if (userId) {
      const foundUser = await findUserById(userId);
      let response;
      if (foundUser) {
        response = NextResponse.json(foundUser, { status: 200 });
      } else {
        response = NextResponse.json(`No user found with id: ${userId}`, {
          status: 200,
        });
      }
      return response;
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const reqUserData = await request.json();
    console.log({reqUserData})
    const foundUser = await findUserById(reqUserData.id);
    console.log({foundUser})
    const newUser = new User(
      reqUserData.id,
      reqUserData.email,
      reqUserData.name,
      null,
      null,
      null
    );
    let response;
    if (!foundUser) {
      await sql`INSERT INTO sendtemps.users (id, email, name, last_login, date_created, last_modified) VALUES (${newUser.id}, ${newUser.email}, ${newUser.name}, ${newUser.last_login}, ${newUser.date_created}, ${newUser.last_modified})`;
      response = NextResponse.json(`New user created with id: ${newUser.id}`, {
        status: 201,
      });
    } else {
      response = NextResponse.json(
        `User with id: ${newUser.id} already exists, no new user created.`,
        {
          status: 409,
        }
      );
    }
    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userInfoToUpdate = await request.json();
    const previousUserData = await findUserById(userInfoToUpdate.id);

    if (!previousUserData) {
      return NextResponse.json(`User id: ${userInfoToUpdate.id} not found`, {
        status: 404,
      });
    }

    const user = new User(
      previousUserData.id,
      previousUserData.email,
      previousUserData.name,
      previousUserData.last_login,
      previousUserData.date_created,
      previousUserData.last_modified
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
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}