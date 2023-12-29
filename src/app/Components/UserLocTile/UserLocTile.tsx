import { UserLocation } from "@/app/Classes/UserLocation";
import styles from "./user-loc-tile.module.css";
import { formatPOIDataForDisplay } from "@/app/Util/utils";

interface Props {
  userLoc: UserLocation | undefined;
  toggleUserLocModal: Function;
}

export default function UserLocTile({ userLoc, toggleUserLocModal }: Props) {
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
              <dd>{formatPOIDataForDisplay(userLoc.poi_type)}</dd>
            </div>
            <div className={styles["detail-group"]}>
              <dt className={styles["dt"]}>Created: </dt>
              <dd>
                {new Date(userLoc.date_created).toLocaleDateString("en-US", {
                  dateStyle: "short",
                })}
              </dd>
            </div>
            <div className={styles["detail-group"]}>
              <dt className={styles["dt"]}>Modified: </dt>
              <dd>
                {new Date(userLoc.last_modified).toLocaleString("en-US", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </dd>
            </div>
          </dl>
          <div className={styles["button-div"]}>
            <button
              id="userLocRenameBtn"
              className={styles["button"]}
              onClick={(e) => toggleUserLocModal(e)}
            >
              Rename
            </button>
            <button
              id="userLocTypeBtn"
              className={styles["button"]}
              onClick={(e) => toggleUserLocModal(e)}
            >
              Change Type
            </button>
            <button
              id="userLocDeleteBtn"
              className={styles["button"]}
              onClick={(e) => toggleUserLocModal(e)}
            >
              Delete
            </button>
          </div>
        </div>
      </article>
    );
  } else {
    return null;
  }
}
