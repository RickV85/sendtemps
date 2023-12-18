import { UserLocation } from "@/app/Classes/UserLocation";
import styles from "./user-loc-tile.module.css";
import { FetchedUserLoc } from "@/app/Interfaces/interfaces";

interface Props {
  userLoc: FetchedUserLoc
}

export default function UserLocTile({ userLoc }: Props) {

  const formatPOI = (poi: string): string => {
    switch (poi) {
      case "climb" : return "Climbing";
      case "mtb" : return "Mountain Biking";
      case "ski" : return "Skiing";
      default : return "Unknown";
    }
  }

  return (
    <div className={styles["tile-div"]}>
      <h3>{userLoc.name}</h3>
      <p>Lat: {userLoc.latitude}</p>
      <p>Lng: {userLoc.longitude}</p>
      <p>POI Type: {formatPOI(userLoc.poi_type)}</p>
      <p>Date created: {new Date(userLoc.date_created).toLocaleDateString()}</p>
      <button>Rename</button>
      <button>Delete</button>
    </div>
  );
}
