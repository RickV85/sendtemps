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

      // if (!account) {
      //   throw new Error("No Google account for user.");
      // }

      const googleUserInfo = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      console.log({ googleUserInfo });

      let userCreateUpdateSuccess;
      let userAlreadyExists;

      const userPostReq = async () => {
        try {
          const res = await fetch("http://localhost:3000/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(googleUserInfo),
          });
          if (!res.ok) {
            if (res.status === 409) {
              userAlreadyExists = true;
            } else {
              userCreateUpdateSuccess = false;
              const errorData = await res.json();
              console.error("Post user error Response:", errorData);
              throw new Error(`Post req API response was not ok: ${res.status}`);
            }
          }
          if (res.status === 201) {
            userAlreadyExists = false;
          }
          const data = await res.json();
          return data;
        } catch (error) {
          throw error;
        }
      };

      // Needs await to make sure the last conditional
      // is determining whether the user can login or not
      const userPostReqResult = await userPostReq()
        .then((result) => {
          const postSuccess = {
            success: true,
            message: `Successful userPostReq:, ${result}`
          }
          return postSuccess;
        })
        .catch((error) => {
          const postFailure = {
            success: false,
            message: `Failed userPostReq:, ${error}`
          }
          return postFailure;
        });

      await console.log({userPostReqResult})

      // Put patch req here with .then chaining off post?


      if (userCreateUpdateSuccess === false) {
        console.error("USER NOT ALLOWED TO LOGIN - GOOGLE OAUTH / DB FAILURE");
        return false;
      } else {
        return true;
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

      // Assign those values to the session like this:
      // session.accessToken = token.accessToken
      // session.user.id = token.sub
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
