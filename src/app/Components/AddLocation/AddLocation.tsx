"use client";
import Map from "../Map/Map";
import { useEffect, useState, useContext, useRef } from "react";
import { getAllDefaultLocations } from "../../Util/DatabaseApiCalls";
import AddLocForm from "../AddLocForm/AddLocForm";
import { GoogleMapPoint } from "../../Interfaces/interfaces";
import { createGoogleMapPoints } from "../../Util/utils";
import { UserContext } from "../../Contexts/UserContext";
import ReloadBtn from "../ReloadBtn/ReloadBtn";

interface Props {
  setEditLocOptionsStale: React.Dispatch<React.SetStateAction<boolean>>;
  setUserLocEditTrigger: React.Dispatch<React.SetStateAction<string>>;
  userLocModalRef: React.RefObject<HTMLDialogElement> | null;
}

export default function AddLocation({
  setEditLocOptionsStale,
  setUserLocEditTrigger,
  userLocModalRef,
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
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [isMapInView, setIsMapInView] = useState(false);

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
    // Checks to make use map is in full view.
    // Prevents issues with marker being placed
    // incorrectly by Google Maps causing scroll event
    // prior to click position being captured. This
    // did not happen with a touch event for some reason.
    if (mapContainerRef.current) {
      const mapContainer = mapContainerRef.current;
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          setIsMapInView(entry.isIntersecting);
        },
        {
          // .99 accounts for 2px border and
          // default scroll that Google Map fires
          threshold: 0.99,
        }
      );
      if (mapContainer) {
        observer.observe(mapContainer);
      }

      return () => {
        if (mapContainer) {
          observer.unobserve(mapContainer);
        }
      };
    }
  }, [mapContainerRef, setIsMapInView]);

  useEffect(() => {
    // Creates an event listener for a click on the map.
    // Checks to make sure the full map is in view,
    // if not opens a modal to tell user to scroll down
    // else allows normal click behavior and event propagation.
    if (mapContainerRef.current && userLocModalRef?.current) {
      const mapContainer = mapContainerRef.current;

      const handleMapClick = (e: Event) => {
        if (!isMapInView && !newUserLocMarker) {
          e.preventDefault();
          e.stopPropagation();
          setUserLocEditTrigger("mapNotInView");
          userLocModalRef.current?.showModal();
        }
      };
      // True in options sets listener to capturing phase
      mapContainer.addEventListener("click", handleMapClick, true);

      return () => {
        mapContainer.removeEventListener("click", handleMapClick, true);
      };
    }
  }, [
    mapContainerRef,
    isMapInView,
    setUserLocEditTrigger,
    userLocModalRef,
    newUserLocMarker,
  ]);

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
                <p>
                  Scroll down to view entire map below, then click on the map
                  where you would like to create a new location.
                </p>
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
