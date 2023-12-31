"use client";
import { useEffect, useState } from "react";
import { TypeSelectProps } from "../../Interfaces/interfaces";

const TypeSelect: React.FC<TypeSelectProps> = ({
  setSelectedLocType,
  setForecastData,
}) => {
  const [selection, setSelection] = useState("Select Sport");

  useEffect(() => {
    setSelectedLocType(selection);
  }, [selection, setSelectedLocType]);

  return (
    <select
      className="type-select"
      value={selection}
      onChange={(e) => {
        setForecastData(undefined);
        setSelection(e.target.value);
      }}
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
};

export default TypeSelect;
