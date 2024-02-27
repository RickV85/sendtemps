import { updateUserInfo } from "@/app/Util/DatabaseApiCalls";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Session() {
  const { data: session, status } = useSession();
  let userProfileImgUrl = session?.user.image ? session?.user.image : null;

  useEffect(() => {
    if (status === "authenticated" && session.user.id) {
      const userInfo = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      };

      const updateUserLastLogin = async () => {
        try {
          updateUserInfo(userInfo);
        } catch (error) {
          // No need for user to know if failed,
          // just updating their last login date/time
          console.error(error);
        }
      };
      updateUserLastLogin();
    }
  }, [session, status]);

  return (
    <div className="user-profile-div">
      {status === "authenticated" ? (
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
                sizes="10vw"
                style={{ borderRadius: "5px" }}
              />
            ) : null}
          </div>
        </div>
      ) : status === "loading" ? (
        <p className="user-profile-loading">Loading...</p>
      ) : (
        <Link href="/api/auth/signin">
          <button className="user-profile-login-button">Sign in!</button>
        </Link>
      )}
    </div>
  );
}
