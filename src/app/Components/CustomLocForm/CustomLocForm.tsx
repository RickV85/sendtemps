"use client";

import { useState } from "react";

interface Props {
  userCustomLocation: {
    lat: number;
    lng: number;
  };
}

export default function CustomLocForm({ userCustomLocation }: Props) {
  const [locName, setLocName] = useState("");
  const [locType, setLocType] = useState("Select Sport");
  const [submitError, setSubmitError] = useState("");

  const handleSubmitError = (errMsg: string) => {
    setSubmitError(errMsg);
    setTimeout(() => {
      setSubmitError("");
    }, 2500);
  };

  const handleSubmit = async () => {
    if (!locName) {
      handleSubmitError("Please enter a name for your new location.");
      return;
    } else if (locName.length > 100) {
      handleSubmitError("Location names cannot be longer than 100 characters.");
      return;
    } else if (locName.toLowerCase().includes("script")) {
      handleSubmitError("NO XSS");
      return;
    } else if (locType === "Select Sport") {
      handleSubmitError("Please choose a sport for this location.");
      return;
    }

    // Send API req
  };

  return (
    <form className="custom-loc-form">
      <div className="custom-loc-form-coords">
        {submitError ? (
          <p>{submitError}</p>
        ) : (
          <>
            <p>Lat: {userCustomLocation.lat}</p>
            <p>Long: {userCustomLocation.lng}</p>
          </>
        )}
      </div>
      <input
        id="customLocNameInput"
        className="custom-loc-form-input"
        type="text"
        placeholder="Name your new location"
        aria-label="Enter the name of your new custom location"
        value={locName}
        onChange={(e) => setLocName(e.target.value)}
      />
      <select
        className="custom-loc-form-input"
        value={locType}
        onChange={(e) => setLocType(e.target.value)}
        aria-label="Select sport type for your new custom location"
      >
        <option disabled value="Select Sport">
          Select Sport
        </option>
        <option value="climb">Climbing</option>
        <option value="mtb">Mountain Biking</option>
        <option value="ski">Skiing / Snowboarding</option>
      </select>
      <button
        className="custom-loc-form-input"
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        Add location
      </button>
      <button
        className="custom-loc-form-input"
        onClick={() => window.location.reload()}
      >
        Discard location
      </button>
    </form>
  );
}
