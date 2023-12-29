"use client";
import { FetchedUserLoc } from "@/app/Interfaces/interfaces";
import { patchUserLocation } from "@/app/Util/APICalls";
import { useState } from "react";

interface Props {
  userLocModalRef: React.RefObject<HTMLDialogElement>;
  handleModalBackdropClick: Function;
  userLocEditTrigger: string;
  userLocations: FetchedUserLoc[] | null;
  setUserLocations: React.Dispatch<
    React.SetStateAction<FetchedUserLoc[] | null>
  >;
  selectedUserLoc: string;
  setSelectedUserLoc: React.Dispatch<React.SetStateAction<string>>;
}

export default function EditUserLocModal({
  userLocModalRef,
  handleModalBackdropClick,
  userLocEditTrigger,
  userLocations,
  setUserLocations,
  selectedUserLoc,
  setSelectedUserLoc,
}: Props) {
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");
  const [error, setError] = useState("");

  const resetError = () => {
    setTimeout(() => {
      setError("");
    }, 1500);
  };

  const errorMsg = <p className="edit-user-loc-modal-error">{error}</p>;

  const handleNameSubmit = async () => {
    if (!newName) {
      setError("Please enter a name");
      resetError();
      return;
    } else if (newName.length > 50) {
      setError("Name cannot be longer than 50 characters");
      resetError();
      return;
    } else if (newName.toLowerCase().includes("script")) {
      setError("NO XSS");
      resetError();
      return;
    }

    const userLoc = userLocations?.find((loc) => loc.id === +selectedUserLoc);
    if (userLoc) {
      try {
        patchUserLocation(userLoc, "name", newName).then((res) => {
          if (res) {
            const newUserLocs = userLocations;
            const editLocIndex = newUserLocs?.indexOf(userLoc);
            if (editLocIndex && newUserLocs) {
              const updatedLoc = res.patchLoc;
              newUserLocs.splice(editLocIndex, 1, updatedLoc);
              setUserLocations(newUserLocs);
              setSelectedUserLoc("default");
              setNewName("");
              userLocModalRef?.current?.close();
            } else {
              throw new Error("An error occurred while accessing locations.");
            }
          }
        });
      } catch (error) {
        console.error(error);
        if (typeof error === "string") {
          setError(error);
        }
      }
    }
  };

  const handleTypeSubmit = () => {
    if (!newType) {
      setError("Please choose a type");
      resetError();
      return;
    }
    // Create new UserLoc instance
    // Patch request for location
    // if success, close modal, show msg
    // if failure, setError
  };

  const createUserLocModalContent = (triggerId: string) => {
    const curLoc = userLocations?.find(
      (loc) => loc.id.toString() === selectedUserLoc
    );
    switch (triggerId) {
      case "userLocRenameBtn":
        return (
          <>
            {error ? (
              errorMsg
            ) : (
              <h3 className="modal-heading">{`Rename ${curLoc?.name}?`}</h3>
            )}
            <input
              id="editUserLocNameInput"
              className="edit-loc-input"
              type="text"
              placeholder="New name"
              aria-label="Enter new name for your location"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="modal-btn-div">
              <button
                className="edit-user-loc-button"
                onClick={() => {
                  setNewName("");
                  userLocModalRef.current?.close();
                }}
              >
                Cancel
              </button>
              <button
                className="edit-user-loc-button"
                onClick={() => handleNameSubmit()}
              >
                Confirm
              </button>
            </div>
          </>
        );
      case "userLocTypeBtn":
        return (
          <>
            {error ? (
              errorMsg
            ) : (
              <h3 className="modal-heading">{`Change ${curLoc?.name} sport type?`}</h3>
            )}
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="edit-loc-input"
            >
              <option value={""} disabled>
                Change sport type
              </option>
              <option value={"climb"}>Climbing</option>
              <option value={"mtb"}>Mountain Biking</option>
              <option value={"ski"}>Skiing</option>
            </select>
            <div className="modal-btn-div">
              <button
                className="edit-user-loc-button"
                onClick={() => {
                  setNewType("");
                  userLocModalRef.current?.close();
                }}
              >
                Cancel
              </button>
              <button
                className="edit-user-loc-button"
                onClick={() => handleTypeSubmit()}
              >
                Confirm
              </button>
            </div>
          </>
        );
      case "userLocDeleteBtn":
        return (
          <>
            <h3 className="modal-heading">{`Delete ${curLoc?.name}?`}</h3>
            <div className="modal-btn-div">
              <button
                className="edit-user-loc-button"
                onClick={() => userLocModalRef.current?.close()}
              >
                Cancel
              </button>
              <button className="edit-user-loc-button">Confirm</button>
            </div>
          </>
        );
    }
  };

  return (
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
  );
}
