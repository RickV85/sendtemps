import { UserLocation } from "@/app/Classes/UserLocation";
import styles from "./user-loc-tile.module.css";
import { formatPOIDataForDisplay } from "@/app/Util/utils";

interface Props {
  userLoc: UserLocation | undefined;
  toggleUserLocModal: Function;
}

export default function UserLocTile({ userLoc, toggleUserLocModal }: Props) {
  return (
    <article className={styles["tile-div"]}>
      <div className={styles["tile-main"]}>
        <dl className={styles["detail-list"]}>
          <div className={styles["detail-group"]}>
            <dt className={styles["dt"]}>Lat: </dt>
            <dd>{userLoc ? userLoc?.latitude : "N/A"}</dd>
          </div>
          <div className={styles["detail-group"]}>
            <dt className={styles["dt"]}>Long: </dt>
            <dd>{userLoc ? userLoc.longitude : "N/A"}</dd>
          </div>
          <div className={styles["detail-group"]}>
            <dt className={styles["dt"]}>Type: </dt>
            <dd>{userLoc ? formatPOIDataForDisplay(userLoc.poi_type) : "N/A"}</dd>
          </div>
          <div className={styles["detail-group"]}>
            <dt className={styles["dt"]}>Created: </dt>
            <dd>
              {userLoc
                ? new Date(userLoc.date_created).toLocaleDateString("en-US", {
                    dateStyle: "short",
                  })
                : "N/A"}
            </dd>
          </div>
          <div className={styles["detail-group"]}>
            <dt className={styles["dt"]}>Modified: </dt>
            <dd>
              {userLoc
                ? new Date(userLoc.last_modified).toLocaleString("en-US", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })
                : "N/A"}
            </dd>
          </div>
        </dl>
        <div className={styles["button-div"]}>
          <button
            id="userLocDeleteBtn"
            className={styles["button"]}
            onClick={(e) => toggleUserLocModal(e)}
          >
            Delete
          </button>
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
        </div>
      </div>
    </article>
  );
}
