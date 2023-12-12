import { useSession } from "next-auth/react";

export default function Session() {
  const { data: session, status } = useSession();
  console.log(session, status)

  if (status === "authenticated" && session.user) {
    return <p>Signed in as {session.user.name}</p>
  }

  return <a href="/api/auth/signin">Sign in</a>
}