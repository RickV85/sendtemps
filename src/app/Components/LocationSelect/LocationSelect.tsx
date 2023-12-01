"use client"
import { LocationSelectProps } from "../../Interfaces/interfaces";
import { useState, useEffect } from "react";

export default function LocationSelect({
  setSelectedLocCoords,
  selectedLocType,
}: LocationSelectProps) {
  const [selection, setSelection] = useState("");

  useEffect(() => {
    setSelection("");
  }, [selectedLocType]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelection(e.target.value);
    setSelectedLocCoords(e.target.value);
  };

  {
    /* ADD THESE TO A DATA FILE AND MAP THEM TO CREATE */
  }
  const createDisplayOptions = () => {
    let options;
    switch (selectedLocType) {
      case "Climbing":
        options = (
          <>
            <option value={`40.00448179512719,-105.35580040554191`}>
              Lower BoCan
            </option>
            <option value={`40.00593496131527,-105.40944467300872`}>
              Middle BoCan
            </option>
            <option value={`39.977033107953744,-105.45843127551137`}>
              Upper BoCan
            </option>
            <option value={`40.002601,-105.297147`}>Flagstaff</option>
            <option value={`39.98831961133335,-105.29584913855683`}>
              North Flatirons
            </option>
            <option value={`39.975220034304584,-105.28993821568915`}>
              Middle Flatirons
            </option>
            <option value={`39.95465211561836,-105.28848226770084`}>
              South Flatirons
            </option>
            <option value={`39.933209521423514,-105.28935940451142`}>
              Eldorado Canyon
            </option>
            <option value={`39.73754560925745,-105.31547452836261`}>
              Lower CCC
            </option>
            <option value={`39.74535727604811,-105.4051450280658`}>
              Upper CCC
            </option>
          </>
        );
        break;
      case "Mountain Biking":
        options = (
          <>
            <option value={`39.81203821942002,-105.50553715534731`}>
              Maryland Mountain
            </option>
          </>
        );
        break;
      case "Snowboarding":
        options = (
          <>
            <option value={`40.157534026830845,-105.56773211156882`}>
              Ski Road
            </option>
          </>
        );
        break;
      case "Other Favorites":
        options = (
          <>
            <option value={"40.017122873300956,-105.08883257979652"}>
              Home
            </option>
          </>
        );
        break;
    }

    return options;
  };

  if (selectedLocType !== "Current Location") {
    return (
      <div className="location-div">
        <h3>Location:</h3>
        <select
          className="location-select"
          value={selection}
          onChange={(e) => handleSelect(e)}
        >
          <option value="" disabled>
            Select location type
          </option>
          {createDisplayOptions()}
        </select>
      </div>
    );
  } else {
    return null;
  }
}
