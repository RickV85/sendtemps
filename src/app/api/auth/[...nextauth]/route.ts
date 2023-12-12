import nextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
    async signIn({ user, account, profile }) {
      // console.log("signIn", { user });
      // console.log("signIn", { account });
      // console.log("signIn", { profile });
      if (!user) {
        throw new Error("No Google user retrieved.");
      }

      const googleUserInfo = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      const userPostReq = async () => {
        const res = await fetch("http://localhost:3000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(googleUserInfo),
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
        const res = await fetch("http://localhost:3000/api/users", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(googleUserInfo),
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
          console.log(`User exists, running patch to update with Google info`)
          await userPatchReq();
        } else if (postResult === true) {
          console.log(`New user created from Google info`)
        }

        return true;
      } catch (error) {
        console.error("Error in user creation/updating process:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Could use url for a redirect to a specific page in app?

      // Allows relative callback URLs
      // if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      // else if (new URL(url).origin === baseUrl) return url
      return baseUrl;
    },
    async session({ session, user, token }) {
      // This in invoked when using: getSession(), useSession(), /api/auth/session
      // Send properties to the client, like an access_token and user id from a provider.

      // Here is the token object
      // token: {
      //   name: 'Rick Vermeil',
      //   email: 'rickv85@gmail.com',
      //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocIU_vGeBXJ-WYlYmJtNxXZxMn_xu28PZaUXqeusF3XxOBE=s96-c',
      //   sub: '101000928729222042760',
      //   iat: 1702392337,
      //   exp: 1704984337,
      //   jti: '3ef9a969-f276-49ed-a645-688981616a0f'
      // }

      // Assign those values here, update @/types/next-auth.d.ts
      // with any new data added to session
      if (session && token.sub) {
        session.user.id = token.sub
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      // console.log("jwt", { token });
      // console.log("jwt", { user });
      // console.log("jwt", { account });
      // console.log("jwt", { profile });

      // if (profile) {
      // Look up user by email?
      // if (!user) {
      //   throw new Error();
      // }
      // }
      return token;
    },
  },
};
const handler = nextAuth(authOption);
export { handler as GET, handler as POST };
