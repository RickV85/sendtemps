import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("user_id");
    const { rows } = await sql`SELECT * FROM sendtemps.users 
    WHERE id = ${userId};`;
    if (rows.length > 1) {
      throw new Error(`More than one user found for id: ${userId}`);
    }
    const foundUser = rows[0];
    let response;
    if (foundUser) {
      response = NextResponse.json(foundUser, { status: 200 });
    } else {
      response = NextResponse.json(`No user found with id: ${userId}`, {
        status: 200,
      });
    }
    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newUser = await request.json();
    console.log(newUser);
    const findUserById = async () => {
      const { rows } = await sql`SELECT * FROM sendtemps.users 
    WHERE id = ${newUser.id};`;
      return rows.length ? true : false;
    };
    const userFound = await findUserById();
    console.log({ userFound });
    let response;
    if (!userFound) {
      await sql`INSERT INTO sendtemps.users (id, email, name, last_login, date_created, last_modified) VALUES (${newUser.id}, ${newUser.email}, ${newUser.name}, ${newUser.last_login}, ${newUser.date_created}, ${newUser.last_modified})`;
      response = NextResponse.json(`New user created with id: ${newUser.id}`, {
        status: 201,
      });
    } else if (userFound) {
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
