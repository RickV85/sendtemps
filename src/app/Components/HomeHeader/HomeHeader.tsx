import Image from "next/image";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import Session from "../Session/Session";
import { UserContext } from "@/app/Contexts/UserContext";
import { HomeContext } from "@/app/Contexts/HomeContext";
import { useContext } from "react";
import HomeControl from "../HomeControl/HomeControl";

export default function HomeHeader() {
  const { userInfo } = useContext(UserContext);
  const { screenWidth } = useContext(HomeContext);

  return (
    <header className="home-header">
      <div className="hero-img-div">
        <nav className="home-nav">
          <div className="nav-edit-locations">
            {userInfo ? (
              <Link href={"/edit-locations"}>
                <button id="navLocationBtn">Edit Locations</button>
              </Link>
            ) : null}
          </div>
          <SessionProvider>
            <Session />
          </SessionProvider>
        </nav>
        {screenWidth > 768 ? (
          <div className="desktop-title-controls">
            <h1 className="site-title">SendTemps</h1>
            <HomeControl />
          </div>
        ) : (
          <div className="desktop-title-controls">
            <h1 className="site-title">SendTemps</h1>
          </div>
        )}
        <Image
          src={"/images/sendtemps_header_2.webp"}
          alt="Boulder Flatirons background with rock climber silhouette in foreground"
          fill={true}
          priority={true}
          quality={screenWidth && screenWidth > 768 ? 100 : 60}
          sizes="100vw"
          className="header-bkgd-img"
        />
      </div>
    </header>
  );
}
