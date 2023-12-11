import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/Classes/User";

const findUserById = async (userId: string) => {
  const { rows } = await sql`SELECT * FROM sendtemps.users 
WHERE id = ${userId};`;
  return rows[0];
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
    const foundUser = await findUserById(reqUserData.id);
    const newUser = new User(
      +reqUserData.id,
      reqUserData.email,
      reqUserData.name
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
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
