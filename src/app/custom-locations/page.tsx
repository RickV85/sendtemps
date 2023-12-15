"use client";
import "./custom-locations.css";
import Map from "../Components/Map/Map";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllDefaultLocations, getAllUserLocations } from "../Util/APICalls";
import CustomLocForm from "../Components/CustomLocForm/CustomLocForm";
import {
  UserSessionInfo,
  GoogleMapPoint,
} from "../Interfaces/interfaces";
import ReturnToLogin from "../Components/ReturnToLogin/ReturnToLogin";
import { createGoogleMapPoints } from "../Util/utils";

export default function CustomLocations() {
  const [userLocations, setUserLocations] = useState([]);
  const [mapLocations, setMapLocations] = useState<GoogleMapPoint[] | []>([]);
  const [newUserLocCoords, setNewUserLocCoords] = useState<{
    lat: number;
    lng: number;
  }>();
  const [userInfo, setUserInfo] = useState<UserSessionInfo | undefined>();
  const [showReturnToLogin, setShowReturnToLogin] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      const sesUserInfo = sessionStorage.getItem("userInfo");
      if (sesUserInfo) {
        setUserInfo(JSON.parse(sesUserInfo));
      } else {
        const timer = setTimeout(() => {
          setShowReturnToLogin(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      const fetchLocations = async () => {
        try {
          const [defaultLocs, userLocs] = await Promise.all([
            getAllDefaultLocations(),
            getAllUserLocations(userInfo.id),
          ]);
          if (userLocs) setUserLocations(userLocs);
          const allLocs = [...(defaultLocs || []), ...(userLocs || [])];
          const mapMarkers = createGoogleMapPoints(allLocs);
          setMapLocations(mapMarkers);
        } catch (error) {
          console.error("Error fetching locations:", error);
          // User Error message display
        }
      };
      fetchLocations();
    }
  }, [userInfo]);

  if (userInfo) {
    return (
      <main className="custom-loc-main">
        <Link href={"/"}>
          <h1 className="site-title">SendTemps</h1>
        </Link>
        {/* Here is where I'll load from the user's already created locations */}
        {/* <section className="user-custom-loc-section">
        <h2>Your Custom Locations</h2>
      </section> */}
        {/* CREATE NEW LOCATION SECTION */}
        <section className="create-custom-loc-section">
          <h2>Add a new location!</h2>
          {newUserLocCoords ? (
            <CustomLocForm
              newUserLocCoords={newUserLocCoords}
              userInfo={userInfo}
            />
          ) : null}
          {newUserLocCoords ? null : (
            <p>Pick a point on the map below to create a new location</p>
          )}
        </section>
        <div className="map-container">
          {mapLocations.length ? (
            <Map
              mapLocations={mapLocations}
              setNewUserLocCoords={setNewUserLocCoords}
            />
          ) : null}
        </div>
      </main>
    );
  } else if (showReturnToLogin) {
    return <ReturnToLogin />;
  }
}
