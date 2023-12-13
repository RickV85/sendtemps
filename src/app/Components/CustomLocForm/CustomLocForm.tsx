import { GoogleMapPoint } from "@/app/Interfaces/interfaces";

interface Props {
  userCustomLocation: {
    lat: number;
    lng: number;
  };
}

export default function CustomLocForm({ userCustomLocation }: Props) {
  return (
    <form className="custom-loc-form">
      <div className="custom-loc-form-coords">
        <p>Lat: {userCustomLocation.lat}</p>
        <p>Long: {userCustomLocation.lng}</p>
      </div>
      <input id="customLocNameInput" className="custom-loc-form-input" type="text" placeholder="Name your new location" aria-label="Enter the name of your new custom location" />
      <button className="custom-loc-form-input">Add location</button>
      <button className="custom-loc-form-input">Discard location</button>
    </form>
  );
}
