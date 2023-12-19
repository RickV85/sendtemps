import { FetchedUserLoc } from "@/app/Interfaces/interfaces";

interface Props {
  userLocModalRef: React.RefObject<HTMLDialogElement>;
  handleModalBackdropClick: Function;
  userLocEditTrigger: string;
  userLocations: FetchedUserLoc[] | null;
  selectedUserLoc: string;
}

export default function EditUserLocModal({
  userLocModalRef,
  handleModalBackdropClick,
  userLocEditTrigger,
  userLocations,
  selectedUserLoc,
}: Props) {
  const createUserLocModalContent = (triggerId: string) => {
    const curLoc = userLocations?.find(
      (loc) => loc.id.toString() === selectedUserLoc
    );
    switch (triggerId) {
      case "userLocRenameBtn":
        return (
          <>
            <h3 className="modal-heading">{`Rename ${curLoc?.name}?`}</h3>
            <input
              id="editUserLocNameInput"
              className="edit-loc-input"
              type="text"
              placeholder="New name"
              aria-label="Enter new name for your location"
            />
            <div className="modal-btn-div">
              <button className="edit-user-loc-button" onClick={() => userLocModalRef.current?.close()}>Cancel</button>
              <button className="edit-user-loc-button">Confirm</button>
            </div>
          </>
        );
      case "userLocTypeBtn":
        return (
          <>
            <h3>{`Change ${curLoc?.name} sport type?`}</h3>
            <select className="edit-loc-input">
              <option disabled>Change sport type</option>
            </select>
            <div className="modal-btn-div">
              <button className="edit-user-loc-button" onClick={() => userLocModalRef.current?.close()}>Cancel</button>
              <button className="edit-user-loc-button">Confirm</button>
            </div>
          </>
        );
      case "userLocDeleteBtn":
        return (
          <>
            <h3>{`Delete ${curLoc?.name}?`}</h3>
            <div className="modal-btn-div">
              <button className="edit-user-loc-button" onClick={() => userLocModalRef.current?.close()}>Cancel</button>
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
