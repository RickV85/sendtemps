"use client";
import { useContext } from "react";
import { HomeContext } from "@/app/Contexts/HomeContext";
import { UserContext } from "@/app/Contexts/UserContext";

export default function TypeSelect() {
  const {
    setSelectedLocCoords,
    selectedLocType,
    setSelectedLocType,
    setLocationDetails,
    setForecastData,
    setHourlyForecastData,
    setHourlyForecastParams,
  } = useContext(HomeContext);
  const { userInfo } = useContext(UserContext);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Reset all location info, forecast data, removes all from DOM,
    // then set the locationType
    setSelectedLocCoords("");
    setLocationDetails(undefined);
    setForecastData(undefined);
    setHourlyForecastData(undefined);
    setHourlyForecastParams(undefined);
    setSelectedLocType(e.target.value);
  };

  return (
    <select
      className="type-select"
      value={selectedLocType}
      onChange={handleSelect}
      aria-label="Select location type or current location forecast"
    >
      <option disabled value="Select Location Type">
        Select Location Type
      </option>
      <option value="climb">Climbing</option>
      <option value="mtb">Mountain Biking</option>
      <option value="ski">Skiing/Snowboarding</option>
      {userInfo ? <option value="other">Other</option> : null}
      <option value="Current Location">Current Location</option>
    </select>
  );
}
