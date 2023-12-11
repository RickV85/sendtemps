import NextAuth from "next-auth/next";
import nextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

const authOption: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    GoogleProvider ({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({account, profile}) {
      if (!profile) {
        throw new Error ('No Google profile for user.')
      }

      if (!account) {
        throw new Error('No Google account for user.')
      }

      const googleUserId = account?.userId;
      const googleUserEmail = profile.email;
      const googleUserName = profile.name;

      // Create logic here for the following:

      // API call to sendtemps.users, first a GET for the googleUserId
      // then if exists, check info matches above fetched from Google acct

      // If they do not match, run a patch, updating the user information
      // in the users table.

      // If does not exist, post new user to users table with
      // userId, email, and name

      // Return true for successful signIn flow
      return true;
    }
  }
}
  const handler = nextAuth(authOption);
  export {handler as GET, handler as POST};