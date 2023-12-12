import nextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

const authOption: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (!profile) {
        throw new Error("No Google profile for user.");
      }

      if (!account) {
        throw new Error("No Google account for user.");
      }

      const googleUserInfo = {
        id: Number(profile.sub),
        email: profile.email,
        name: profile.name,
      };

      const postReq = async () => {
        try {
          const res = await fetch("http://localhost:3000/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(googleUserInfo),
          });
          if (res.ok) {
            const data = res.json();
            return data;
          }
        } catch (error) {
          console.error(error)
          throw new Error();
        }
      };

      postReq();

      return true;
    },
  },
};
const handler = nextAuth(authOption);
export { handler as GET, handler as POST, handler as PATCH };
