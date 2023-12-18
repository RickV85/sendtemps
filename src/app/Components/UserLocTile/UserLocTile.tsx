import { UserLocation } from "@/app/Classes/UserLocation";
import styles from "./user-loc-tile.module.css";
import { FetchedUserLoc } from "@/app/Interfaces/interfaces";

interface Props {
  userLoc: FetchedUserLoc
}

export default function UserLocTile({ userLoc }: Props) {
  return (
    <div className={styles["tile-div"]}>
      <h3>{userLoc.name}</h3>
      <p>{userLoc.latitude}</p>
      <p>{userLoc.longitude}</p>
      <p>{userLoc.poi_type}</p>
      <p>{new Date(userLoc.last_modified).toLocaleString()}</p>
      <p>{new Date(userLoc.date_created).toLocaleDateString()}</p>
    </div>
  );
}
