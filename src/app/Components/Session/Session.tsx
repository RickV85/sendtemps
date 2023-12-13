import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Session() {
  const { data: session, status } = useSession();
  let userProfileImgUrl = session?.user.image ? session?.user.image : null;

  if (status === "authenticated" && session.user) {
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
                  sizes="(max-width: 768px) 5vw, 2vw"
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
