"use client";
import "./custom-locations.css";
import Map from "../Components/Map/Map";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { getAllDefaultLocations, getAllUserLocations } from "../Util/APICalls";
import CustomLocForm from "../Components/CustomLocForm/CustomLocForm";
import { GoogleMapPoint } from "../Interfaces/interfaces";
import ReturnToLogin from "../Components/ReturnToLogin/ReturnToLogin";
import { createGoogleMapPoints } from "../Util/utils";
import { UserContext } from "../Contexts/UserContext";

export default function CustomLocations() {
  const [userLocations, setUserLocations] = useState([]);
  const [mapLocations, setMapLocations] = useState<GoogleMapPoint[] | []>([]);
  const [newUserLocCoords, setNewUserLocCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [newUserLocMarker, setNewUserLocMarker] =
    useState<google.maps.Marker | null>(null);
  const [showReturnToLogin, setShowReturnToLogin] = useState(false);
  const [error, setError] = useState("");
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    if (!userInfo) {
      setTimeout(() => setShowReturnToLogin(true), 3000);
    } else {
      setShowReturnToLogin(false);
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
          const allLocs = [
            ...defaultLocs,
            ...(userLocs.length ? userLocs : []),
          ];
          const mapMarkers = createGoogleMapPoints(allLocs);
          setMapLocations(mapMarkers);
        } catch (error) {
          console.error(error);
          setError(
            "Oh, no! An error occurred while fetching locations. Please reload the page and try again."
          );
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
        {error ? (
          <p id="errorMessage">{error}</p>
        ) : (
          <>
            {/* Add current user custom location display here?
            Or create new page?
            Give user ability to PATCH and DELETE */}
            <section className="create-custom-loc-section">
              <h2>Add a new location!</h2>
              {newUserLocCoords ? (
                <CustomLocForm
                  newUserLocCoords={newUserLocCoords}
                  setNewUserLocCoords={setNewUserLocCoords}
                  newUserLocMarker={newUserLocMarker}
                  setNewUserLocMarker={setNewUserLocMarker}
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
                  newUserLocMarker={newUserLocMarker}
                  setNewUserLocMarker={setNewUserLocMarker}
                />
              ) : null}
            </div>
          </>
        )}
      </main>
    );
  } else if (showReturnToLogin) {
    return <ReturnToLogin />;
  }
}
