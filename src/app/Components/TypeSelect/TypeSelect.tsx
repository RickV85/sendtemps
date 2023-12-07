"use client";
import { useEffect } from "react";
import { TypeSelectProps } from "../../Interfaces/interfaces";

const TypeSelect: React.FC<TypeSelectProps> = ({
  setSelectedLocType,
  currentGPSCoords,
}) => {
  const poiTypeOptions = (
    <>
      <option value="climb">Climbing</option>
      <option value="mtb">Mountain Biking</option>
      <option value="ski">Skiing / Snowboarding</option>
      <option value="Other Favorites">Other Favorites</option>
    </>
  );

  return (
    <div className="type-select-div">
      <h3>Select location type:</h3>
      <select
        className="type-select"
        onChange={(e) => {
          setSelectedLocType(e.target.value);
        }}
        defaultValue={"Current Location"}
      >
        {currentGPSCoords ? (
          <>
            <option selected value="Current Location">Current Location</option>
            {poiTypeOptions}
          </>
        ) : (
          <>
            <option disabled value="Current Location">Current Location</option>
            {poiTypeOptions}
          </>
        )}
      </select>
    </div>
  );
};

export default TypeSelect;
