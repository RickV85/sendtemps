"use client";
import "./edit-locations.css";
import Link from "next/link";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../Contexts/UserContext";
import { getAllUserLocations } from "../Util/APICalls";
import UserLocTile from "../Components/UserLocTile/UserLocTile";
import EditUserLocModal from "../Components/EditUserLocModal/EditUserLocModal";
import ReturnToLogin from "../Components/ReturnToLogin/ReturnToLogin";
import BackBtn from "../Components/BackBtn/BackBtn";
import { checkError } from "../Util/utils";
import ReloadBtn from "../Components/ReloadBtn/ReloadBtn";
import AddLocation from "../Components/AddLocation/AddLocation";

export default function EditLocations() {
  const [selectedUserLoc, setSelectedUserLoc] = useState("default");
  const { userInfo, userLocations, setUserLocations } = useContext(UserContext);
  const userLocModalRef = useRef<HTMLDialogElement>(null);
  const [userLocEditTrigger, setUserLocEditTrigger] = useState("");
  const [editUserLocError, setEditUserLocError] = useState("");
  const [editLocOptionsStale, setEditLocOptionsStale] = useState(true);

  useEffect(() => {
    if (userInfo && userLocations) {
      try {
        checkError(userLocations);
      } catch {
        setEditUserLocError(
          "An error occurred while fetching locations. Please reload the page and try again."
        );
      }
    }
  }, [userLocations, userInfo]);

  useEffect(() => {
    if (editLocOptionsStale && userInfo?.id && !editUserLocError) {
      const refetchUserLocations = async () => {
        try {
          const newUserLocs = await getAllUserLocations(userInfo.id);
          checkError(newUserLocs);
          setUserLocations(newUserLocs);
          setEditLocOptionsStale(false);
        } catch {
          setEditUserLocError(
            "An error occurred while fetching locations. Please reload the page and try again."
          );
        }
      };
      refetchUserLocations();
    }
  }, [editLocOptionsStale, userInfo, editUserLocError, setUserLocations]);

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
          <h1 className="edit-loc-site-title">SendTemps</h1>
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
              {userLocations && !userLocations.length && !editUserLocError ? (
                <p id="linkToAddLoc">
                  No locations created yet.
                  <br />
                  Add your own custom location below!
                </p>
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
                selectedUserLoc={selectedUserLoc}
                setSelectedUserLoc={setSelectedUserLoc}
              />
            </div>
          </section>
        </section>
        {userLocations && !editUserLocError ? (
          <AddLocation
            setEditLocOptionsStale={setEditLocOptionsStale}
            setUserLocEditTrigger={setUserLocEditTrigger}
            userLocModalRef={userLocModalRef}
          />
        ) : null}
      </main>
    );
  } else if (userInfo === null) {
    return <ReturnToLogin />;
  }
}
