"use client";
import {
  LocationSelectProps,
  LocationObject,
} from "../../Interfaces/interfaces";
import {
  useState,
  useEffect,
  ReactNode,
  useCallback,
  ReactElement,
} from "react";
import { getAllDefaultLocations, getAllUserLocations } from "@/app/Util/APICalls";
import { filterAndSortLocationsAlphaByName } from "@/app/Util/utils";

export default function LocationSelect({
  setSelectedLocCoords,
  selectedLocType,
  setForecastData,
  userInfo
}: LocationSelectProps) {
  const [selection, setSelection] = useState("");
  const [allLocationOptions, setAllLocationOptions] = useState<LocationObject[] | []>([]);
  const [displayOptions, setDisplayOptions] = useState<ReactNode>();

  useEffect(() => {
    setSelection("");
  }, [selectedLocType]);

  useEffect(() => {
    getAllDefaultLocations()
      .then((locs) => {
        if (locs) {
          setAllLocationOptions(locs);
        }
      })
      .catch((error) => {
        // need to pass setError
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (userInfo?.id) {
      getAllUserLocations(userInfo.id)
      .then((locs) => {
        if (locs) {
          setAllLocationOptions([...allLocationOptions, ...locs]);
        }
      })
      .catch((error) => {
        // need to pass setError
        console.error(error);
      });
    }
    // eslint-disable-next-line
  }, [userInfo])

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForecastData(undefined);
    setSelection(e.target.value);
    setSelectedLocCoords(e.target.value);
  };

  const mapLocationOptions = useCallback(
    (locArr: Array<LocationObject>): Array<ReactElement> => {
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
    },
    []
  );

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

  const noDisplayLocTypes = ["Select Sport", "Current Location"];

  return (
    <div className={`location-div ${noDisplayLocTypes.includes(selectedLocType) ? "hidden" : ""}`}>
      <select
        className="location-select"
        value={selection}
        onChange={(e) => handleSelect(e)}
        aria-label="Select location you would like a forecast for"
      >
        <option value="" disabled>
          Select location
        </option>
        {displayOptions}
      </select>
    </div>
  );
}
