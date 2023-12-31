"use client";
import "./edit-locations.css";
import Link from "next/link";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../Contexts/UserContext";
import { getAllUserLocations } from "../Util/APICalls";
import UserLocTile from "../Components/UserLocTile/UserLocTile";
import { UserLocation } from "../Classes/UserLocation";
import EditUserLocModal from "../Components/EditUserLocModal/EditUserLocModal";
import ReturnToLogin from "../Components/ReturnToLogin/ReturnToLogin";
import BackBtn from "../Components/BackBtn/BackBtn";
import { checkError } from "../Util/utils";
import ReloadBtn from "../Components/ReloadBtn/ReloadBtn";

export default function EditLocations() {
  const [userLocations, setUserLocations] = useState<UserLocation[] | null>(
    null
  );
  const [selectedUserLoc, setSelectedUserLoc] = useState("default");
  const { userInfo } = useContext(UserContext);
  const userLocModalRef = useRef<HTMLDialogElement>(null);
  const [userLocEditTrigger, setUserLocEditTrigger] = useState("");
  const [editUserLocError, setEditUserLocError] = useState("");
  const [showReturnToLogin, setShowReturnToLogin] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      setTimeout(() => setShowReturnToLogin(true), 3000);
    } else {
      setShowReturnToLogin(false);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo?.id) {
      getAllUserLocations(userInfo.id)
        .then((response) => {
          checkError(response);
          if (response) {
            setUserLocations(response);
          }
        })
        .catch((error: Error) => {
          console.error(error);
          setEditUserLocError(
            "An error occurred while fetching your locations. Please reload the page."
          );
        });
    }
  }, [userInfo]);

  const toggleUserLocModal = (e: MouseEvent) => {
    if (userLocModalRef.current?.open) {
      userLocModalRef.current.close();
    } else {
      userLocModalRef.current?.showModal();
    }
    if (selectedUserLoc !== "default") {
      setUserLocEditTrigger(e.currentTarget?.id);
    } else {
      setUserLocEditTrigger("default");
    }
  };

  const handleModalBackdropClick = (event: MouseEvent) => {
    if (event.currentTarget === event.target && userLocModalRef.current?.open) {
      userLocModalRef.current?.close();
      setUserLocEditTrigger("");
    }
  };

  if (userInfo) {
    return (
      <main className="edit-loc-main">
        <BackBtn id="editLocBackBtn" />
        <Link href={"/"}>
          <h1 className="site-title">SendTemps</h1>
        </Link>
        <section className="edit-loc-section">
          <section className="edit-user-loc-section">
            <h2 className="edit-user-loc-heading">Edit Custom Locations</h2>
            {userLocations?.length ? (
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
              {editUserLocError ? (
                <>
                  <p className="edit-user-loc-error">{editUserLocError}</p>
                  <ReloadBtn />
                </>
              ) : null}
              {!userLocations && !editUserLocError ? (
                <p className="edit-user-loc-loading">
                  Loading your locations...
                </p>
              ) : null}
              {userLocations && !userLocations.length ? (
                <Link href={"/add-location"}>
                  <p id="linkToAddLoc">
                    No locations created yet.
                    <br />
                    Click here to add some!
                  </p>
                </Link>
              ) : null}
              {userLocations && userLocations.length ? (
                <UserLocTile
                  userLoc={userLocations.find(
                    (loc) => loc?.id?.toString() === selectedUserLoc
                  )}
                  toggleUserLocModal={toggleUserLocModal}
                />
              ) : null}
              <EditUserLocModal
                userLocModalRef={userLocModalRef}
                handleModalBackdropClick={handleModalBackdropClick}
                userLocEditTrigger={userLocEditTrigger}
                userLocations={userLocations}
                setUserLocations={setUserLocations}
                selectedUserLoc={selectedUserLoc}
                setSelectedUserLoc={setSelectedUserLoc}
              />
            </div>
          </section>
        </section>
      </main>
    );
  } else if (showReturnToLogin) {
    return <ReturnToLogin />;
  }
}
