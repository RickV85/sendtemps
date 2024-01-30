import nextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL!;

const authOptions: NextAuthOptions = {
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
    async signIn({ user }) {
      if (!user) {
        throw new Error("No Google user retrieved.");
      }

      const googleUserInfo = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      const userPostReq = async () => {
        const res = await fetch(`${NEXTAUTH_URL}api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(googleUserInfo),
          credentials: "include",
        });

        if (res.status === 201) {
          return true;
        } else if (res.status === 409) {
          return false;
        } else {
          const errorData = await res.json();
          console.error("userPostReq error response:", errorData);
          throw new Error(`userPostReq response was not ok: ${res.status}`);
        }
      };

      const userPatchReq = async () => {
        const res = await fetch(`${NEXTAUTH_URL}api/users`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(googleUserInfo),
          credentials: "include",
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("userPatchReq error Response:", errorData);
          throw new Error(
            `userPatchReq API response was not ok: ${res.status}`
          );
        }
        return true;
      };

      try {
        const postResult = await userPostReq();

        if (postResult === false) {
          console.log(`User exists, running patch to update with Google info`);
          await userPatchReq();
        } else if (postResult === true) {
          console.log(`New user created from Google info`);
        }

        return true;
      } catch (error) {
        console.error("Error in user creation/updating process:", error);
        return false;
      }
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async session({ session, token }) {
      // This in invoked when using: getSession(), useSession(), /api/auth/session
      // Send properties to the client, like an access_token and user id from a provider.
      // Assign those values here, update @/types/next-auth.d.ts
      // with any new data added to session
      if (session && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
};
const handler = nextAuth(authOptions);
export { handler as GET, handler as POST };
