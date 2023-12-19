import { FetchedUserLoc } from "@/app/Interfaces/interfaces";

interface Props {
  userLocModalRef: React.Ref<HTMLDialogElement>;
  handleModalBackdropClick: Function;
  userLocEditTrigger: string;
  userLocations: FetchedUserLoc[] | null,
  selectedUserLoc: string
}

export default function EditUserLocModal({
  userLocModalRef,
  handleModalBackdropClick,
  userLocEditTrigger,
  userLocations,
  selectedUserLoc
}: Props) {
  const createUserLocModalContent = (triggerId: string) => {
    // Refactor these to a component with props
    // to dictate the content
    const curLoc = userLocations?.find(
      (loc) => loc.id.toString() === selectedUserLoc
    );
    switch (triggerId) {
      case "userLocRenameBtn":
        return (
          <div className="modal-content">
            <h3>{`Rename ${curLoc?.name}?`}</h3>
            <input type="text" placeholder="New name" />
            <div className="modal-btn-div">
              <button>Cancel</button>
              <button>Confirm</button>
            </div>
          </div>
        );
      case "userLocTypeBtn":
        return (
          <div className="modal-content">
            <h3>{`Change ${curLoc?.name} sport type?`}</h3>
            <select>
              <option disabled>Change sport type</option>
            </select>
            <div className="modal-btn-div">
              <button>Cancel</button>
              <button>Confirm</button>
            </div>
          </div>
        );
      case "userLocDeleteBtn":
        return (
          <div className="modal-content">
            <h3>{`Delete ${curLoc?.name}?`}</h3>
            <div className="modal-btn-div">
              <button>Cancel</button>
              <button>Confirm</button>
            </div>
          </div>
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
      {createUserLocModalContent(userLocEditTrigger)}
    </dialog>
  );
}
