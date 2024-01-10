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
  useContext,
  useRef,
} from "react";
import { getAllDefaultLocations } from "@/app/Util/APICalls";
import {
  checkError,
  filterAndSortLocationsAlphaByName,
} from "@/app/Util/utils";
import { useSession } from "next-auth/react";
import { UserContext } from "@/app/Contexts/UserContext";

export default function LocationSelect({
  setSelectedLocCoords,
  selectedLocType,
  setForecastData,
  setError,
}: LocationSelectProps) {
  const [selection, setSelection] = useState("");
  const [allLocationOptions, setAllLocationOptions] = useState<
    LocationObject[] | []
  >([]);
  const [displayOptions, setDisplayOptions] = useState<ReactNode>();
  const { userLocations } = useContext(UserContext);

  useEffect(() => {
    setSelection("");
  }, [selectedLocType]);

  const fetchAndCheckDefaultLocations = async () => {
    const defaultLocs = await getAllDefaultLocations();
    checkError(defaultLocs);
    return defaultLocs;
  };

  useEffect(() => {
    // Waits for userInfo to be defined before fetching 
    // default locations to prevent multiple calls
    if (!allLocationOptions.length && userLocations) {
      const fetchLocations = async () => {
        try {
          let allLocs;
          const defaultLocs = await fetchAndCheckDefaultLocations();
          if (defaultLocs.length) {
            if (userLocations.length) {
              allLocs = [...userLocations, ...defaultLocs];
            } else {
              allLocs = defaultLocs;
            }
            setAllLocationOptions(allLocs);
          }
        } catch (err) {
          console.error(err);
          setError(
            "An error occurred while fetching locations. Please reload the page and try again."
          );
        }
      };

      fetchLocations();
    }
  }, [setError, userLocations, allLocationOptions]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForecastData(undefined);
    setSelection(e.target.value);
    setSelectedLocCoords(e.target.value);
  };

  // Creates option elements
  const mapLocationOptions = useCallback(
    (locArr: Array<LocationObject>): Array<ReactElement> => {
      const mappedOptions = locArr.map((loc: LocationObject) => {
        const optionElement: ReactElement = (
          <option
            value={`${loc.latitude},${loc.longitude}`}
            key={`${loc.name}-${loc.id}`}
          >
            {loc.name}
          </option>
        );
        return optionElement;
      });
      return mappedOptions;
    },
    []
  );

  // Filters allLocations by poi_type selected in TypeSelect,
  // sorts them A-Z and returns them as option elements
  const createDisplayOptions = useCallback(
    (locType: string) => {
      if (allLocationOptions.length) {
        const options = filterAndSortLocationsAlphaByName(
          allLocationOptions,
          locType
        );
        const optionElements = mapLocationOptions(options);
        return optionElements;
      }
    },
    [allLocationOptions, mapLocationOptions]
  );

  useEffect(() => {
    const options = createDisplayOptions(selectedLocType);
    setDisplayOptions(options);
  }, [selectedLocType, createDisplayOptions]);

  if (selectedLocType !== "Select Sport") {
    return (
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
    );
  } else {
    return null;
  }
}
