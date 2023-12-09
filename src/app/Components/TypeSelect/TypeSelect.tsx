"use client";

import { TypeSelectProps } from "../../Interfaces/interfaces";

const TypeSelect: React.FC<TypeSelectProps> = ({
  setSelectedLocType,
  currentGPSCoords,
  setForecastData
}) => {
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
        onChange={(e) => {
          setForecastData(undefined);
          setSelectedLocType(e.target.value);
        }}
        defaultValue={currentGPSCoords ? "Current Location" : "Select sport"}
      >
        {currentGPSCoords ? (
          <>
            <option selected value="Current Location">Current Location</option>
            {poiTypeOptions}
          </>
        ) : (
          <>
            <option disabled value="Select sport">Select sport</option>
            {poiTypeOptions}
          </>
        )}
      </select>
    </div>
  );
};

export default TypeSelect;
