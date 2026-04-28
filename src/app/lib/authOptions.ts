import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL!;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      if (!user) {
        throw new Error('No Google user retrieved.');
      }

      const googleUserInfo = {
        email: user.email,
        id: user.id,
        name: user.name,
      };

      const usersUrl = new URL('/api/users', NEXTAUTH_URL).toString();

      const userPostReq = async () => {
        const res = await fetch(usersUrl, {
          body: JSON.stringify(googleUserInfo),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (res.status === 201) {
          return true;
        } else if (res.status === 409) {
          return false;
        } else {
          const errorData = await res.json();
          console.error('userPostReq error response:', errorData);
          throw new Error(`userPostReq response was not ok: ${res.status}`);
        }
      };

      const userPatchReq = async () => {
        const res = await fetch(usersUrl, {
          body: JSON.stringify(googleUserInfo),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error('userPatchReq error Response:', errorData);
          throw new Error(`userPatchReq API response was not ok: ${res.status}`);
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
        console.error('Error in user creation/updating process:', error);
        return false;
      }
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async session({ session, token }) {
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
