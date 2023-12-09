"use client";
import {
  LocationSelectProps,
  LocationObject,
} from "../../Interfaces/interfaces";
import { useState, useEffect, ReactNode, useCallback, ReactElement } from "react";
import { getAllDefaultLocations } from "@/app/Util/APICalls";
import { filterAndSortLocationsAlphaByName } from "@/app/Util/utils";

export default function LocationSelect({
  setSelectedLocCoords,
  selectedLocType,
  setForecastData
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
    setForecastData(undefined);
    setSelection(e.target.value);
    setSelectedLocCoords(e.target.value);
  };

  const mapLocationOptions = useCallback((locArr: Array<LocationObject>): Array<ReactElement> => {
    const mappedOptions = locArr.map((loc: LocationObject) => {
      const optElement: ReactElement = (
        <option
          value={`${loc.latitude},${loc.longitude}`}
          key={`locId-${loc.id}`}
        >
          {loc.name}
        </option>
      );
      return optElement;
    });
    return mappedOptions;
  }, []);

  const createDisplayOptions = useCallback(
    (locType: string) => {
      if (allLocationOptions.length <= 0) return;
      const options = filterAndSortLocationsAlphaByName(
        allLocationOptions,
        locType
      );
      const optionElements = mapLocationOptions(options);
      return optionElements;
    },
    [allLocationOptions, mapLocationOptions]
  );

  useEffect(() => {
    const options = createDisplayOptions(selectedLocType);
    setDisplayOptions(options);
  }, [selectedLocType, createDisplayOptions]);

  if (selectedLocType !== "") {
    return (
      <div className="location-div">
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
