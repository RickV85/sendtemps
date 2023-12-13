"use client";
import "./custom-locations.css";

export default function CustomLocations() {
  // Will need to fetch user locations from
  // new user_locations table by userId
  // State for changes being made
  // button at bottom to send back to DB
  // to update

  const mockUserLocations = [
    {
      id: "1",
      name: "",
      latitude: "",
      longitude: "",
      userId: "",
      date_created: "",
    },
    {
      id: "2",
      name: "",
      latitude: "",
      longitude: "",
      userId: "",
      date_created: "",
    },
    {
      id: "3",
      name: "",
      latitude: "",
      longitude: "",
      userId: "",
      date_created: "",
    },
    {
      id: "4",
      name: "",
      latitude: "",
      longitude: "",
      userId: "",
      date_created: "",
    },
    {
      id: "5",
      name: "",
      latitude: "",
      longitude: "",
      userId: "",
      date_created: "",
    },
  ];

  return (
    <main className="custom-loc-main">
      <h1 className="site-title">SendTemps</h1>
      <h2>Your Custom Locations</h2>
    </main>
  );
}
