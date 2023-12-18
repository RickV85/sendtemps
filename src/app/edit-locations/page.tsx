"use client";
import "./edit-locations.css";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Contexts/UserContext";
import { getAllUserLocations } from "../Util/APICalls";
import UserLocTile from "../Components/UserLocTile/UserLocTile";
import { UserLocation } from "../Classes/UserLocation";
import { FetchedUserLoc } from "../Interfaces/interfaces";

export default function EditLocations() {
  const [userLocations, setUserLocations] = useState<FetchedUserLoc[] | null>(null);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    if (userInfo?.id) {
      getAllUserLocations(userInfo.id)
        .then((response) => {
          if (response) {
            setUserLocations(response);
            console.log(response);
          }
        })
        .catch((error: Error) => {
          console.error(error);
        });
    }
  }, [userInfo]);

  return (
    <main className="edit-loc-main">
      <Link href={"/"}>
        <h1 className="site-title">SendTemps</h1>
      </Link>
      <section className="edit-user-loc-section">
        <h2>Your Custom Locations</h2>
        <div className="custom-loc-container">
          {userLocations ? userLocations.map((loc: any) => <UserLocTile userLoc={loc} key={loc.id} />) : <p>Loading your locations...</p>}
          {userLocations && !userLocations.length ? <p>No locations created yet. Add some at LINK TO ADDLOCATIONS</p> : null}
        </div>
      </section>
    </main>
  );
}
