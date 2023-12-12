import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  setLoggedInUserInfo: Function;
}

export default function Session({ setLoggedInUserInfo }: Props) {
  const { data: session, status } = useSession();
  let userProfileImgUrl = session?.user.image ? session?.user.image : null;

  if (status === "authenticated" && session.user) {
    setLoggedInUserInfo(session);
  }

  if (status !== "loading") {
    return (
      <div className="user-profile-div">
        {session?.user ? (
          <div className="user-profile-welcome-div">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
              }}
            >
              <p className="user-profile-welcome">{session.user.name}</p>
              <Link href="/api/auth/signout">
                <p id="logoutProfileLink">Sign Out</p>
              </Link>
            </div>
            <div id="userProfileImg">
              {userProfileImgUrl ? (
                <Image
                  src={userProfileImgUrl}
                  alt={"User's Google profile picture"}
                  fill={true}
                  priority={true}
                  style={{ borderRadius: "5px" }}
                />
              ) : null}
            </div>
          </div>
        ) : (
          <Link href="/api/auth/signin">
            <button className="user-profile-login-button">Sign in!</button>
          </Link>
        )}
      </div>
    );
  }
}
