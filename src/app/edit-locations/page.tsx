"use client";
import "./edit-locations.css";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../Contexts/UserContext";
import { getAllUserLocations } from "../Util/APICalls";
import UserLocTile from "../Components/UserLocTile/UserLocTile";
import { FetchedUserLoc } from "../Interfaces/interfaces";

export default function EditLocations() {
  const [userLocations, setUserLocations] = useState<FetchedUserLoc[] | null>(
    null
  );
  const [selectedUserLoc, setSelectedUserLoc] = useState("default");
  const { userInfo } = useContext(UserContext);
  const userLocModalRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (userInfo?.id) {
      getAllUserLocations(userInfo.id)
        .then((response) => {
          if (response) {
            setUserLocations(response);
          }
        })
        .catch((error: Error) => {
          console.error(error);
        });
    }
  }, [userInfo]);

  const toggleUserLocModal = () => {
    if (userLocModalRef.current?.open) {
      userLocModalRef.current.close();
    } else {
      userLocModalRef.current?.showModal();
    }
  }

  return (
    <main className="edit-loc-main">
      <Link href={"/"}>
        <h1 className="site-title">SendTemps</h1>
      </Link>
      <section className="edit-loc-section">
        <h2 className="edit-user-loc-heading">Custom Locations</h2>
        {userLocations ? (
          <select
            value={selectedUserLoc}
            onChange={(e) => setSelectedUserLoc(e.target.value)}
            className="edit-user-loc-select"
          >
            <option value="default" disabled>
              Choose location
            </option>
            {userLocations.length
              ? userLocations.map((loc) => {
                  return (
                    <option value={loc.id} key={loc.id}>
                      {loc.name}
                    </option>
                  );
                })
              : null}
          </select>
        ) : null}
        <div className="edit-user-loc">
          {userLocations ? null : <p>Loading your locations...</p>}
          {userLocations && !userLocations.length ? (
            <p>No locations created yet. Add some at LINK TO ADDLOCATIONS</p>
          ) : null}
          {selectedUserLoc !== "default" ? (
            <UserLocTile
              userLoc={userLocations?.find(
                (loc) => loc.id.toString() === selectedUserLoc
              )}
              toggleUserLocModal={toggleUserLocModal}
            />
          ) : null}
          <dialog ref={userLocModalRef} className="edit-user-loc-modal">
            <p>Hi</p>
          </dialog>
        </div>
      </section>
      {/* <section className="edit-loc-section">
        <h2>Default Locations</h2>
        <div className="edit-default-loc">

        </div>
      </section> */}
    </main>
  );
}
