import { useSession } from "next-auth/react";

interface Props {
  setLoggedInUserInfo: Function
}

export default function Session ({ setLoggedInUserInfo }: Props) {
  const { data: session, status } = useSession();
  
  if (status === "authenticated" && session.user) {
    console.log(session, status)
    setLoggedInUserInfo(session);
    return <p>Signed in as {session.user.name}</p>
  }

  return <a href="/api/auth/signin">Sign in</a>
}