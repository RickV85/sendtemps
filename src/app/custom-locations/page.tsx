"use client";
import "./custom-locations.css";
import Map from "../Components/Map/Map";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllDefaultLocations } from "../Util/APICalls";
import CustomLocForm from "../Components/CustomLocForm/CustomLocForm";

export default function CustomLocations() {
  const [defaultLocations, setDefaultLocations] = useState([]);
  const [userCustomLocation, setUserCustomLocation] = useState<{
    lat: number;
    lng: number;
  }>();

  useEffect(() => {
    getAllDefaultLocations()
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
        {userCustomLocation ? (
          <CustomLocForm userCustomLocation={userCustomLocation} />
        ) : null}
        {userCustomLocation ? null : (
          <p>Pick a point on the map below to create a new location</p>
        )}
      </section>
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
