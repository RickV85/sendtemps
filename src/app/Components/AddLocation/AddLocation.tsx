"use client";
import "./add-location.css";
import Map from "../Map/Map";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { getAllDefaultLocations, getAllUserLocations } from "../../Util/APICalls";
import AddLocForm from "../AddLocForm/AddLocForm";
import { GoogleMapPoint } from "../../Interfaces/interfaces";
import ReturnToLogin from "../ReturnToLogin/ReturnToLogin";
import { createGoogleMapPoints } from "../../Util/utils";
import { UserContext } from "../../Contexts/UserContext";
import BackBtn from "../BackBtn/BackBtn";
import ReloadBtn from "../ReloadBtn/ReloadBtn";

export default function AddLocation() {
  const [userLocations, setUserLocations] = useState([]);
  const [mapLocations, setMapLocations] = useState<GoogleMapPoint[] | []>([]);
  const [newUserLocCoords, setNewUserLocCoords] = useState<{
    lat: string;
    lng: string;
  } | null>(null);
  const [newUserLocMarker, setNewUserLocMarker] =
    useState<google.maps.Marker | null>(null);
  const [error, setError] = useState("");
  const { userInfo } = useContext(UserContext);

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
      <main className="add-loc-main">
        {error ? (
          <>
            <p id="errorMessage">{error}</p>
            <ReloadBtn />
          </>
        ) : (
          <>
            <section className="add-loc-section">
              <h2>Add a new location!</h2>
              {newUserLocCoords ? (
                <AddLocForm
                  newUserLocCoords={newUserLocCoords}
                  setNewUserLocCoords={setNewUserLocCoords}
                  newUserLocMarker={newUserLocMarker}
                  setNewUserLocMarker={setNewUserLocMarker}
                  userInfo={userInfo}
                  setMapLocations={setMapLocations}
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
  }
}
