"use client";
import Map from "../Map/Map";
import { useEffect, useState, useContext, useRef } from "react";
import { getAllDefaultLocations } from "../../Util/APICalls";
import AddLocForm from "../AddLocForm/AddLocForm";
import { GoogleMapPoint } from "../../Interfaces/interfaces";
import { createGoogleMapPoints } from "../../Util/utils";
import { UserContext } from "../../Contexts/UserContext";
import ReloadBtn from "../ReloadBtn/ReloadBtn";

interface Props {
  setEditLocOptionsStale: React.Dispatch<React.SetStateAction<boolean>>;
  isMapInView: boolean;
  setIsMapInView: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddLocation({
  setEditLocOptionsStale,
  isMapInView,
  setIsMapInView,
}: Props) {
  const [mapLocations, setMapLocations] = useState<GoogleMapPoint[] | []>([]);
  const [newUserLocCoords, setNewUserLocCoords] = useState<{
    lat: string;
    lng: string;
  } | null>(null);
  const [newUserLocMarker, setNewUserLocMarker] =
    useState<google.maps.Marker | null>(null);
  const [error, setError] = useState("");
  const { userInfo, userLocations } = useContext(UserContext);
  const mapContainerRef = useRef(null);

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

  useEffect(() => {
    // Checks to make use map is in full view
    // This prevents issues with marker being placed
    // incorrectly by Google Maps causing scroll event
    // prior to click position being captured
    if (mapContainerRef) {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          setIsMapInView(entry.isIntersecting);
        },
        {
          root: null,
          threshold: 1,
        }
      );

      let map: React.RefObject<Element> | null;
      if (mapContainerRef.current) {
        map = mapContainerRef.current;
        observer.observe(map);
      }

      return () => {
        if (map instanceof Element) {
          observer.unobserve(map);
        }
      };
    }
  }, [mapContainerRef, setIsMapInView]);

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
              ) : (
                <p>Pick a point on the map below to create a new location</p>
              )}
            </section>
            <div className="map-container" ref={mapContainerRef}>
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
