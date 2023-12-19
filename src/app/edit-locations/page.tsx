"use client";
import "./edit-locations.css";
import Link from "next/link";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
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
  const userLocModalRef = useRef<HTMLDialogElement>(null);
  const [userLocEditTrigger, setUserLocEditTrigger] = useState("");

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

  const toggleUserLocModal = (e: MouseEvent) => {
    if (userLocModalRef.current?.open) {
      userLocModalRef.current.close();
    } else {
      userLocModalRef.current?.showModal();
    }
    setUserLocEditTrigger(e.currentTarget?.id);
  };

  const handleModalBackdropClick = (event: MouseEvent) => {
    if (event.currentTarget === event.target && userLocModalRef.current?.open) {
      userLocModalRef.current?.close();
      setUserLocEditTrigger("");
    }
  };

  const createUserLocModalContent = (triggerId: string) => {
    // Refactor these to a component with props
    // to dictate the content
    const curLoc = userLocations?.find(
      (loc) => loc.id.toString() === selectedUserLoc
    );
    switch (triggerId) {
      case "userLocRenameBtn":
        return (
          <>
            <h3>{`Rename ${curLoc?.name}?`}</h3>
            <input
              type="text"
              placeholder="What would you like to rename to?"
            />
            <div className="modal-btn-div">
              <button>Cancel</button>
              <button>Confirm</button>
            </div>
          </>
        );
      case "userLocTypeBtn":
        return (
          <>
            <h3>{`Change ${curLoc?.name} sport type?`}</h3>
            <select>
              <option disabled>Change sport type</option>
            </select>
            <div className="modal-btn-div">
              <button>Cancel</button>
              <button>Confirm</button>
            </div>
          </>
        );
      case "userLocDeleteBtn":
        return (
          <>
            <h3>{`Delete ${curLoc?.name}?`}</h3>
            <div className="modal-btn-div">
              <button>Cancel</button>
              <button>Confirm</button>
            </div>
          </>
        );
    }
  };

  return (
    <main className="edit-loc-main">
      <Link href={"/"}>
        <h1 className="site-title">SendTemps</h1>
      </Link>
      <section className="edit-loc-section">
        <h2 className="edit-user-loc-heading">Custom Locations</h2>
        {userLocations ? (
          <select
            id="editUserLocSelect"
            value={selectedUserLoc}
            onChange={(e) => setSelectedUserLoc(e.target.value)}
            className="edit-user-loc-select"
            aria-label="Choose a custom location to edit"
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
          <dialog
            id="userLocModal"
            ref={userLocModalRef}
            className="edit-user-loc-modal"
            onClick={(e) => handleModalBackdropClick(e)}
          >
            <div className="modal-content">
              {createUserLocModalContent(userLocEditTrigger)}
            </div>
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
