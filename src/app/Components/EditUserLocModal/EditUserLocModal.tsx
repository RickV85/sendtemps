"use client";
import { UserContext } from "@/app/Contexts/UserContext";
import {
  deleteUserLocation,
  patchUserLocation,
} from "@/app/Util/DatabaseApiCalls";
import { findLocByIdInUserLocs, resetErrorMsg } from "@/app/Util/utils";
import { useContext, useState } from "react";

interface Props {
  userLocModalRef: React.RefObject<HTMLDialogElement>;
  handleModalBackdropClick: Function;
  userLocEditTrigger: string;
  selectedUserLoc: string;
  setSelectedUserLoc: React.Dispatch<React.SetStateAction<string>>;
}

export default function EditUserLocModal({
  userLocModalRef,
  handleModalBackdropClick,
  userLocEditTrigger,
  selectedUserLoc,
  setSelectedUserLoc,
}: Props) {
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");
  const [submitMsg, setSubmitMsg] = useState("");
  const { userLocations, setUserLocations } = useContext(UserContext);

  const modalSubmitMsg = <p className="edit-user-loc-modal-msg">{submitMsg}</p>;

  const handlePatchRequest = (
    patchType: string,
    userInput: string,
    userInputStateSet: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setSubmitMsg("Submitting changes...");
    const userLoc = findLocByIdInUserLocs(+selectedUserLoc, userLocations);
    if (userLoc) {
      patchUserLocation(userLoc, patchType, userInput)
        .then((res) => {
          if (
            res.patchLoc.id &&
            res.patchLoc.id === userLoc.id &&
            userLocations
          ) {
            const newUserLocs = [...userLocations];
            const editLocIndex = newUserLocs?.indexOf(userLoc);
            if (editLocIndex !== -1) {
              setSelectedUserLoc("default");
              userInputStateSet("");
              setSubmitMsg("");
              userLocModalRef?.current?.close();
              const updatedLoc = res.patchLoc;
              newUserLocs.splice(editLocIndex, 1, updatedLoc);
              setUserLocations(newUserLocs);
            }
          }
        })
        .catch((error) => {
          console.error(error);
          setSubmitMsg(
            "An error occurred while modifying location. Please try again."
          );
          resetErrorMsg(setSubmitMsg);
        });
    }
  };

  const handleNameSubmit = () => {
    if (!newName) {
      setSubmitMsg("Please enter a name");
      resetErrorMsg(setSubmitMsg);
      return;
    } else if (newName.length > 50) {
      setSubmitMsg("Name cannot be longer than 50 characters");
      setNewName("");
      resetErrorMsg(setSubmitMsg);
      return;
    } else if (newName.toLowerCase().includes("<script>")) {
      setSubmitMsg("NO XSS");
      setNewName("");
      resetErrorMsg(setSubmitMsg);
      return;
    }
    handlePatchRequest("name", newName, setNewName);
  };

  const handleTypeSubmit = () => {
    if (!newType) {
      setSubmitMsg("Please choose a type");
      resetErrorMsg(setSubmitMsg);
      return;
    }
    handlePatchRequest("poi_type", newType, setNewType);
  };

  const handleDeleteSubmit = () => {
    setSubmitMsg("Deleting location...");
    const userLoc = findLocByIdInUserLocs(+selectedUserLoc, userLocations);
    if (userLoc && userLoc.id) {
      deleteUserLocation(+userLoc.id, userLoc.user_id)
        .then((res) => {
          if (typeof res === "string" && res.startsWith("Success")) {
            setSelectedUserLoc("default");
            userLocModalRef?.current?.close();
            setSubmitMsg("");
            setUserLocations((prevState) => {
              const newState = prevState?.filter(
                (loc) => loc.id !== userLoc.id
              );
              return newState ? newState : null;
            });
          }
        })
        .catch((error) => {
          console.error(error);
          setSubmitMsg(
            "An error occurred while deleting location. Please try again."
          );
          resetErrorMsg(setSubmitMsg);
        });
    }
  };

  const createUserLocModalContent = (triggerId: string) => {
    let curLoc;
    if (userLocations && userLocations.length) {
      curLoc = userLocations?.find(
        (loc) => loc?.id?.toString() === selectedUserLoc
      );
    }
    switch (triggerId) {
      case "userLocRenameBtn":
        return (
          <>
            {submitMsg ? (
              modalSubmitMsg
            ) : (
              <h3 className="modal-heading">{`Rename "${curLoc?.name}"?`}</h3>
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
            {submitMsg ? (
              modalSubmitMsg
            ) : (
              <h3 className="modal-heading">{`Change "${curLoc?.name}" location type?`}</h3>
            )}
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="edit-loc-input"
            >
              <option value={""} disabled>
                Select type
              </option>
              <option value={"climb"}>Climbing</option>
              <option value={"mtb"}>Mountain Biking</option>
              <option value={"ski"}>Skiing</option>
              <option value={"other"}>Other</option>
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
            {submitMsg ? (
              modalSubmitMsg
            ) : (
              <h3 className="modal-heading">{`Are you sure you want to delete "${curLoc?.name}"?`}</h3>
            )}
            <div className="modal-btn-div">
              <button
                className="edit-user-loc-button"
                onClick={() => userLocModalRef.current?.close()}
              >
                Cancel
              </button>
              <button
                className="edit-user-loc-button"
                onClick={() => handleDeleteSubmit()}
              >
                Confirm
              </button>
            </div>
          </>
        );
      case "mapNotInView":
        return (
          <>
            <h3 className="modal-heading">
              Please scroll down to view entire map before adding a new
              location.
            </h3>
            <div className="modal-btn-div">
              <button
                className="edit-user-loc-button"
                onClick={() => userLocModalRef.current?.close()}
              >
                Back
              </button>
            </div>
          </>
        );
      default:
        return (
          <>
            <h3 className="modal-heading">
              Please select a location before editing.
            </h3>
            <div className="modal-btn-div">
              <button
                className="edit-user-loc-button"
                onClick={() => userLocModalRef.current?.close()}
              >
                Back
              </button>
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
