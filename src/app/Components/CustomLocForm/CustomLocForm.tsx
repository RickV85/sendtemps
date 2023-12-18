"use client";

import { UserSessionInfo } from "@/app/Interfaces/interfaces";
import { postNewUserLocation } from "@/app/Util/APICalls";
import { NextResponse } from "next/server";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  newUserLocCoords: {
    lat: number;
    lng: number;
  };
  setNewUserLocCoords: Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;
  newUserLocMarker: google.maps.Marker | null;
  setNewUserLocMarker: Dispatch<
    React.SetStateAction<google.maps.Marker | null>
  >;
  userInfo: UserSessionInfo;
}

export default function CustomLocForm({
  newUserLocCoords,
  setNewUserLocCoords,
  newUserLocMarker,
  setNewUserLocMarker,
  userInfo,
}: Props) {
  const [locName, setLocName] = useState("");
  const [locType, setLocType] = useState("Select Sport");
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmitError = (errMsg: string) => {
    setSubmitMessage(errMsg);
    setTimeout(() => {
      setSubmitMessage("");
    }, 2500);
  };

  const resetNewUserCoordsAndMarker = () => {
    if (newUserLocMarker && newUserLocCoords) {
      newUserLocMarker.setMap(null);
      setNewUserLocCoords(null);
      setNewUserLocMarker(null);
    }
  };

  const handleSubmit = async () => {
    if (!locName) {
      handleSubmitError("Please enter a name for your new location.");
      return;
    } else if (locName.length > 50) {
      handleSubmitError("Location names cannot be longer than 50 characters.");
      return;
    } else if (locType === "Select Sport") {
      handleSubmitError("Please choose a sport for this location.");
      return;
    } else if (locName.toLowerCase().includes("script")) {
      handleSubmitError("NO XSS");
      return;
    }
    const newUserLoc = {
      name: locName,
      latitude: newUserLocCoords.lat.toString(),
      longitude: newUserLocCoords.lng.toString(),
      user_id: userInfo.id,
      poi_type: locType,
    };
    postNewUserLocation(newUserLoc)
      .then((response: string) => {
        console.log(response);
        if (response.startsWith("Success")) {
          setSubmitMessage("New location saved!");
          setTimeout(() => {
            setLocName("");
            setLocType("Select Sport");
            setSubmitMessage("");
            resetNewUserCoordsAndMarker();
            // window.location.reload();
          }, 2000);
        }
      })
      .catch((error: Error) => {
        setSubmitMessage("Error saving location. Please try again.");
        console.error(error);
        setTimeout(() => {
          setSubmitMessage("");
        }, 2000);
      });
  };

  return (
    <form className="custom-loc-form">
      <div className="custom-loc-form-coords">
        {submitMessage ? (
          <p id="submitMessage">{submitMessage}</p>
        ) : (
          <>
            <p>Lat: {newUserLocCoords.lat}</p>
            <p>Long: {newUserLocCoords.lng}</p>
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
      <div className="custom-loc-btn-div">
        <button
          className="custom-loc-form-input"
          onClick={(e) => {
            e.preventDefault();
            resetNewUserCoordsAndMarker();
          }}
        >
          Delete
        </button>
        <button
          className="custom-loc-form-input"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          Save
        </button>
      </div>
    </form>
  );
}
