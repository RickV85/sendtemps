"use client";
import { useContext } from "react";
import { HomeContext } from "@/app/Contexts/HomeContext";

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
      aria-label="Select sport for locations or current location forecast"
    >
      <option disabled value="Select Sport">
        Select Sport
      </option>
      <option value="climb">Climbing</option>
      <option value="mtb">Mountain Biking</option>
      <option value="ski">Skiing/Snowboarding</option>
      <option value="Current Location">Current Location</option>
    </select>
  );
}
