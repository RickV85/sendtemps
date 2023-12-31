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
import {
  checkError,
  filterAndSortLocationsAlphaByName,
} from "@/app/Util/utils";
import { useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();

  useEffect(() => {
    setSelection("");
  }, [selectedLocType]);

  const fetchAndCheckDefaultLocations = async () => {
    const defaultLocs = await getAllDefaultLocations();
    checkError(defaultLocs);
    return defaultLocs;
  };

  useEffect(() => {
    console.log(session);
    if (status !== "loading") {
      const fetchLocations = async () => {
        try {
          let allLocs;
          if (status === "authenticated" && session.user.id) {
            const userLocs = await getAllUserLocations(session.user.id);
            checkError(userLocs);
            const defaultLocs = await fetchAndCheckDefaultLocations();
            allLocs = [...userLocs, ...defaultLocs];
          } else if (status === "unauthenticated") {
            allLocs = await fetchAndCheckDefaultLocations();
          }

          setAllLocationOptions(allLocs);
        } catch (err) {
          console.error(err);
          setError(
            "An error occurred while fetching locations. Please reload the page and try again."
          );
        }
      };

      fetchLocations();
    }
  }, [session, status, setError]);

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
            key={`${loc.name}-${loc.id}`}
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
