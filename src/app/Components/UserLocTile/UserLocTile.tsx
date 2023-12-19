import { UserLocation } from "@/app/Classes/UserLocation";
import styles from "./user-loc-tile.module.css";
import { FetchedUserLoc } from "@/app/Interfaces/interfaces";

interface Props {
  userLoc: FetchedUserLoc | undefined;
}

export default function UserLocTile({ userLoc }: Props) {
  const formatPOI = (poi: string): string => {
    switch (poi) {
      case "climb":
        return "Climbing";
      case "mtb":
        return "Mountain Biking";
      case "ski":
        return "Skiing";
      default:
        return "Unknown";
    }
  };

  if (userLoc) {
    return (
      <article className={styles["tile-div"]}>
        <div className={styles["tile-main"]}>
          <dl className={styles["detail-list"]}>
            <div className={styles["detail-group"]}>
              <dt className={styles["dt"]}>Lat: </dt>
              <dd>{userLoc.latitude}</dd>
            </div>
            <div className={styles["detail-group"]}>
              <dt className={styles["dt"]}>Long: </dt>
              <dd>{userLoc.longitude}</dd>
            </div>
            <div className={styles["detail-group"]}>
              <dt className={styles["dt"]}>Type: </dt>
              <dd>{formatPOI(userLoc.poi_type)}</dd>
            </div>
            <div className={styles["detail-group"]}>
              <dt className={styles["dt"]}>Created: </dt>
              <dd>{new Date(userLoc.date_created).toLocaleDateString()}</dd>
            </div>
          </dl>
          <div className={styles["button-div"]}>
            <button className={styles["button"]}>Rename</button>
            <button className={styles["button"]}>Change Type</button>
            <button className={styles["button"]}>Delete</button>
          </div>
        </div>
      </article>
    );
  } else {
    return null;
  }
}
