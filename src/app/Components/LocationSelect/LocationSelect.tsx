'use client';
import { LocationObject } from '../../Interfaces/interfaces';
import { useState, useEffect, ReactNode, useCallback, ReactElement, useContext } from 'react';
import { getAllDefaultLocations } from '@/app/Util/DatabaseApiCalls';
import { filterAndSortLocationsAlphaByName } from '@/app/Util/utils';
import { fetchNoaaGridLocationWithRetry } from '../../Util/NoaaApiCalls';
import { UserContext } from '@/app/Contexts/UserContext';
import { HomeContext } from '@/app/Contexts/HomeContext';
import { Gridpoint } from '@/app/Classes/Gridpoint';

export default function LocationSelect() {
  const [allLocationOptions, setAllLocationOptions] = useState<LocationObject[] | []>([]);
  const [displayOptions, setDisplayOptions] = useState<ReactNode>(null);
  const { userLocations, userLocationsError } = useContext(UserContext);
  const {
    selectedLocCoords,
    setSelectedLocCoords,
    selectedLocType,
    setLocationDetails,
    setForecastData,
    setHourlyForecastData,
    setHourlyForecastParams,
    setForecastSendScores,
    setIsLoading,
    setError,
  } = useContext(HomeContext);

  const fetchAndCheckDefaultLocations = async () => {
    return await getAllDefaultLocations();
  };

  useEffect(() => {
    if (userLocationsError) {
      setError('An error occurred while fetching locations. Please reload the page and try again.');
      return;
    }

    // Waits for userLocations to be defined before fetching
    // default locations to prevent multiple calls
    if (!allLocationOptions.length && userLocations) {
      const fetchLocations = async () => {
        try {
          const defaultLocs = await fetchAndCheckDefaultLocations();
          if (defaultLocs.length) {
            const allLocs = [...defaultLocs, ...userLocations];
            setAllLocationOptions(allLocs);
          }
        } catch (err) {
          console.error(err);
          setError(
            'An error occurred while fetching locations. Please reload the page and try again.',
          );
        }
      };

      fetchLocations();
    }
  }, [allLocationOptions, setError, userLocations, userLocationsError]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Reset all location info, forecast data, removes all from DOM,
    // then set the locationCoords
    setLocationDetails(undefined);
    setForecastData(undefined);
    setHourlyForecastData(undefined);
    setHourlyForecastParams(undefined);
    setForecastSendScores(undefined);
    setSelectedLocCoords(e.target.value);

    // If coordinates for new selection, fetch location details
    if (e.target.value) {
      setIsLoading(true);
      fetchNoaaGridLocationWithRetry(e.target.value)
        .then((result) => {
          setLocationDetails(new Gridpoint(result));
        })
        .catch((err) => {
          console.error(err);
          setError(`${err.message} Please reload the page and try again.`);
          setIsLoading(false);
        });
    }
  };

  // Creates option elements
  const mapLocationOptions = useCallback((locArr: Array<LocationObject>): Array<ReactElement> => {
    const mappedOptions = locArr.map((loc: LocationObject) => {
      const optionElement: ReactElement = (
        <option value={`${loc.latitude},${loc.longitude}`} key={`${loc.name}-${loc.id}`}>
          {loc.name}
        </option>
      );
      return optionElement;
    });
    return mappedOptions;
  }, []);

  // Filters allLocations by poi_type selected in TypeSelect,
  // sorts them A-Z and returns them as option elements
  const createDisplayOptions = useCallback(
    (locType: string) => {
      if (allLocationOptions.length) {
        const options = filterAndSortLocationsAlphaByName(allLocationOptions, locType);
        const optionElements = mapLocationOptions(options);
        return optionElements;
      }
    },
    [allLocationOptions, mapLocationOptions],
  );

  useEffect(() => {
    const options = createDisplayOptions(selectedLocType);
    setDisplayOptions(options);
  }, [selectedLocType, createDisplayOptions]);

  if (displayOptions && selectedLocType !== '' && selectedLocType !== 'Current Location') {
    return (
      <select
        className='location-select'
        value={selectedLocCoords}
        onChange={(e) => handleSelect(e)}
        aria-label='Select location you would like a forecast for'
      >
        <option value='' disabled>
          Select location
        </option>
        {displayOptions}
      </select>
    );
  } else {
    return null;
  }
}
