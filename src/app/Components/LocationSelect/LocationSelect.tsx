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
import {
  getAllDefaultLocations,
  getAllUserLocations,
} from "@/app/Util/APICalls";
import { filterAndSortLocationsAlphaByName } from "@/app/Util/utils";

export default function LocationSelect({
  setSelectedLocCoords,
  selectedLocType,
  setForecastData,
  userInfo,
  setError,
}: LocationSelectProps) {
  const [selection, setSelection] = useState("");
  const [allLocationOptions, setAllLocationOptions] = useState<
    LocationObject[] | []
  >([]);
  const [displayOptions, setDisplayOptions] = useState<ReactNode>();

  useEffect(() => {
    setSelection("");
  }, [selectedLocType]);

  // REFACTOR - combine with user location request with promise all
  useEffect(() => {
    getAllDefaultLocations().then((locs) => {
      if (locs.length) {
        setAllLocationOptions([...allLocationOptions, ...locs]);
      } else {
        setError("An error occurred while fetching default locations.");
      }
    });
    // eslint-disable-next-line
  }, []);

  // REFACTOR - combine with user location request with promise all
  useEffect(() => {
    if (userInfo?.id) {
      getAllUserLocations(userInfo.id).then((locs) => {
        if (locs.length) {
          setAllLocationOptions([...allLocationOptions, ...locs]);
        } else {
          setError("An error occurred while fetching your custom locations.");
        }
      });
    }
    // eslint-disable-next-line
  }, [userInfo]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForecastData(undefined);
    setSelection(e.target.value);
    setSelectedLocCoords(e.target.value);
  };

  const handleClick = () => {
    if (selectedLocType === "Select Sport") {
      alert("Please choose a sport/location type before selecting location.");
    }
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

  return (
    <select
      className="location-select"
      value={selection}
      onChange={(e) => handleSelect(e)}
      onClick={() => handleClick()}
      aria-label="Select location you would like a forecast for"
    >
      <option value="" disabled>
        Select location
      </option>
      {displayOptions}
    </select>
  );
}
