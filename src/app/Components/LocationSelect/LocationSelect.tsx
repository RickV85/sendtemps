"use client";
import {
  LocationSelectProps,
  LocationObject,
} from "../../Interfaces/interfaces";
import { useState, useEffect, ReactNode, useCallback } from "react";
import { getAllDefaultLocations } from "@/app/Util/APICalls";
import { filterAndSortLocationsAlphaByName } from "@/app/Util/utils";

export default function LocationSelect({
  setSelectedLocCoords,
  selectedLocType,
}: LocationSelectProps) {
  const [selection, setSelection] = useState("");
  const [allLocationOptions, setAllLocationOptions] = useState([]);
  const [displayOptions, setDisplayOptions] = useState<ReactNode>();

  useEffect(() => {
    setSelection("");
  }, [selectedLocType]);

  useEffect(() => {
    getAllDefaultLocations()
      .then((response) => {
        if (response) {
          setAllLocationOptions(response);
        }
      })
      .catch((error) => {
        // need to pass setError
        console.error(error);
      });
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelection(e.target.value);
    setSelectedLocCoords(e.target.value);
  };

  const mapLocationOptions = useCallback((locArr: Array<LocationObject>) => {
    const mappedOptions = locArr.map((loc: LocationObject) => {
      return (
        <option
          value={`${loc.latitude},${loc.longitude}`}
          key={`locId-${loc.id}`}
        >
          {loc.name}
        </option>
      );
    });
    return mappedOptions;
  }, []);

  const createDisplayOptions = useCallback(
    (locType: string) => {
      if (allLocationOptions.length <= 0) return;
      let options;
      switch (locType) {
        case "climb":
          const rockClimbingOptions = filterAndSortLocationsAlphaByName(
            allLocationOptions,
            "climb"
          );
          options = mapLocationOptions(rockClimbingOptions);
          break;
        case "mtb":
          options = (
            <>
              <option value={`39.81203821942002,-105.50553715534731`}>
                Maryland Mountain
              </option>
            </>
          );
          break;
        case "ski":
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
    },
    [allLocationOptions, mapLocationOptions]
  );

  useEffect(() => {
    const options = createDisplayOptions(selectedLocType);
    setDisplayOptions(options);
  }, [selectedLocType, createDisplayOptions]);

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
            Select location
          </option>
          {displayOptions}
        </select>
      </div>
    );
  } else {
    return null;
  }
}
