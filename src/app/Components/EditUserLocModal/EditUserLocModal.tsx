"use client";
import { UserLocation } from "@/app/Classes/UserLocation";
import { deleteUserLocation, patchUserLocation } from "@/app/Util/APICalls";
import { findLocByIdInUserLocs, resetErrorMsg } from "@/app/Util/utils";
import { error } from "console";
import { useState } from "react";

interface Props {
  userLocModalRef: React.RefObject<HTMLDialogElement>;
  handleModalBackdropClick: Function;
  userLocEditTrigger: string;
  userLocations: UserLocation[] | null;
  setUserLocations: React.Dispatch<React.SetStateAction<UserLocation[] | null>>;
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
  const [submitMsg, setSubmitMsg] = useState("");

  const modalSubmitMsg = <p className="edit-user-loc-modal-msg">{submitMsg}</p>;

  const handlePatchRequest = (
    patchType: string,
    userInput: string,
    userInputStateSet: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setSubmitMsg("Submitting changes...");
    const userLoc = findLocByIdInUserLocs(+selectedUserLoc, userLocations);
    if (userLoc) {
      patchUserLocation(userLoc, patchType, userInput).then((res) => {
        if (res.patchLoc.id && res.patchLoc.id === userLoc.id) {
          const newUserLocs = userLocations;
          const editLocIndex = newUserLocs?.indexOf(userLoc);
          console.log({ newUserLocs }, { editLocIndex });
          if (
            editLocIndex !== -1 &&
            editLocIndex !== undefined &&
            newUserLocs?.length
          ) {
            setSelectedUserLoc("default");
            userInputStateSet("");
            setSubmitMsg("");
            userLocModalRef?.current?.close();
            const updatedLoc = res.patchLoc;
            newUserLocs.splice(editLocIndex, 1, updatedLoc);
            setUserLocations(newUserLocs);
          }
        } else {
          console.error(res);
          setSubmitMsg(
            "An error occurred while modifying location. Please try again."
          );
          resetErrorMsg(setSubmitMsg);
        }
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
      resetErrorMsg(setSubmitMsg);
      return;
    } else if (newName.toLowerCase().includes("script")) {
      setSubmitMsg("NO XSS");
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
      deleteUserLocation(+userLoc.id, userLoc.user_id).then((res) => {
        if (typeof res === "string" && res.startsWith("Success")) {
          setSelectedUserLoc("default");
          userLocModalRef?.current?.close();
          setSubmitMsg("");
          setUserLocations((prevState) => {
            const newState = prevState?.filter((loc) => loc.id !== userLoc.id);
            return newState ? newState : null;
          });
        } else {
          console.error(res);
          setSubmitMsg(
            "An error occurred while deleting location. Please try again."
          );
          resetErrorMsg(setSubmitMsg);
        }
      });
    }
  };

  const createUserLocModalContent = (triggerId: string) => {
    const curLoc = userLocations?.find(
      (loc) => loc?.id?.toString() === selectedUserLoc
    );
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
              <h3 className="modal-heading">{`Change "${curLoc?.name}" sport type?`}</h3>
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
