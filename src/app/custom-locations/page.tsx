"use client";
import "./custom-locations.css";
import Map from "../Components/Map/Map";
import { GoogleMapPoint } from "@/app/Interfaces/interfaces";
import { useEffect, useState } from "react";

export default function CustomLocations() {
  const [defaultLocations, setDefaultLocations] = useState([]);
  const [userCustomLocation, setUserCustomLocation] = useState<{lat: number, lng: number}>();

  useEffect(() => {
    const fetchPredefinedLocations = async () => {
      const locations = await fetch("/api/default_locations");
      return locations;
    };

    fetchPredefinedLocations()
      .then((response) => {
        if (response.ok) {
          const locations = response.json();
          return locations;
        } else {
          throw new Error("Default locations did not load from API");
        }
      })
      .then((result) => {
        if (result) {
          const defaultMarkers = result.map((location: any) => {
            const coords = {
              lat: +location.latitude,
              lng: +location.longitude,
            };
            return { name: location.name, coords: coords };
          });
          setDefaultLocations(defaultMarkers);
        }
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  return (
    <main className="custom-loc-main">
      <h1 className="site-title">SendTemps</h1>
      <h2>Your Custom Locations</h2>
      <div className="map-container">
        {defaultLocations.length ? (
          <Map
            defaultLocations={defaultLocations}
            setUserCustomLocation={setUserCustomLocation}
          />
        ) : null}
      </div>
    </main>
  );
}
