"use client";
import Map from "../Map/Map";
import { useEffect, useState, useContext } from "react";
import { getAllDefaultLocations } from "../../Util/APICalls";
import AddLocForm from "../AddLocForm/AddLocForm";
import { GoogleMapPoint } from "../../Interfaces/interfaces";
import { createGoogleMapPoints } from "../../Util/utils";
import { UserContext } from "../../Contexts/UserContext";
import ReloadBtn from "../ReloadBtn/ReloadBtn";

interface Props {
  setEditLocOptionsStale: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddLocation({
  setEditLocOptionsStale,
}: Props) {
  const [mapLocations, setMapLocations] = useState<GoogleMapPoint[] | []>([]);
  const [newUserLocCoords, setNewUserLocCoords] = useState<{
    lat: string;
    lng: string;
  } | null>(null);
  const [newUserLocMarker, setNewUserLocMarker] =
    useState<google.maps.Marker | null>(null);
  const [error, setError] = useState("");
  const { userInfo, userLocations} = useContext(UserContext);

  useEffect(() => {
    if (userInfo && userLocations) {
      const fetchAndCreateMapPoints = async () => {
        try {
          const defaultLocs = await getAllDefaultLocations();
          const allLocs = [
            ...defaultLocs,
            ...(userLocations.length ? userLocations : []),
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
      fetchAndCreateMapPoints();
    }
  }, [userInfo, userLocations]);

  if (userInfo) {
    return (
      <section className="add-loc-main">
        {error ? (
          <>
            <p id="errorMessage">{error}</p>
            <ReloadBtn />
          </>
        ) : (
          <>
            <section className="add-loc-section">
              <h2 id="addLocTitle">Add New Location</h2>
              {newUserLocCoords ? (
                <AddLocForm
                  newUserLocCoords={newUserLocCoords}
                  setNewUserLocCoords={setNewUserLocCoords}
                  newUserLocMarker={newUserLocMarker}
                  setNewUserLocMarker={setNewUserLocMarker}
                  userInfo={userInfo}
                  setMapLocations={setMapLocations}
                  setEditLocOptionsStale={setEditLocOptionsStale}
                />
              ) : <p>Pick a point on the map below to create a new location</p>}
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
      </section>
    );
  }
}
