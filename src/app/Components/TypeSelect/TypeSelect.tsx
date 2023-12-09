"use client";
import { useEffect, useState } from "react";
import { TypeSelectProps } from "../../Interfaces/interfaces";

const TypeSelect: React.FC<TypeSelectProps> = ({
  setSelectedLocType,
  currentGPSCoords,
  setForecastData
}) => {
  const [selection, setSelection] = useState("Select Sport");

  useEffect(() => {
    setSelectedLocType(selection);
  }, [selection, setSelectedLocType])

  const poiTypeOptions = (
    <>
      <option value="climb">Climbing</option>
      <option value="mtb">Mountain Biking</option>
      <option value="ski">Skiing / Snowboarding</option>
      {/* Disabled "Other Favorites" - reenable once functionality
      for user created locations is created */}
      {/* <option value="Other Favorites">Other Favorites</option> */}
    </>
  );

  return (
    <div className="type-select-div">
      <select
        className="type-select"
        value={selection}
        onChange={(e) => {
          setForecastData(undefined);
          setSelection(e.target.value);
        }}
      >
        {currentGPSCoords ? (
          <>
            <option selected value="Current Location">Current Location</option>
            {poiTypeOptions}
          </>
        ) : (
          <>
            <option disabled value="Select Sport">Select Sport</option>
            {poiTypeOptions}
          </>
        )}
      </select>
    </div>
  );
};

export default TypeSelect;
