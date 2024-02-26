import { useContext, useEffect, useCallback } from "react";
import { HomeContext } from "@/app/Contexts/HomeContext";
import TypeSelect from "../TypeSelect/TypeSelect";
import LocationSelect from "../LocationSelect/LocationSelect";
import {
  fetchDailyForecastWithRetry,
  fetchNoaaGridLocationWithRetry,
} from "../../Util/NoaaApiCalls";

export default function HomeControl() {
  const {
    currentGPSCoords,
    setCurrentGPSCoords,
    selectedLocCoords,
    setSelectedLocCoords,
    selectedLocType,
    locationDetails,
    setLocationDetails,
    forecastData,
    setForecastData,
    setHourlyForecastData,
    setIsLoading,
    setError,
  } = useContext(HomeContext);

  const locationFetchSuccess = useCallback(
    (position: GeolocationPosition) => {
      setCurrentGPSCoords({
        latitude: `${position.coords.latitude}`,
        longitude: `${position.coords.longitude}`,
      });
      setSelectedLocCoords(
        `${position.coords.latitude},${position.coords.longitude}`
      );
    },
    [setCurrentGPSCoords, setSelectedLocCoords]
  );

  const locationFetchFailure = useCallback(() => {
    setIsLoading(false);
    alert(
      "Please allow this app to use your location if you would like a display of your current location's forecast."
    );
  }, [setIsLoading]);

  useEffect(() => {
    if (selectedLocType === "Current Location" && currentGPSCoords) {
      setSelectedLocCoords(
        `${currentGPSCoords.latitude},${currentGPSCoords.longitude}`
      );
    }
  }, [selectedLocType, currentGPSCoords, setSelectedLocCoords]);

  useEffect(() => {
    // Fetch grid point details from NOAA with 5 retries
    if (selectedLocCoords) {
      setIsLoading(true);
      fetchNoaaGridLocationWithRetry(selectedLocCoords)
        .then((result) => {
          setLocationDetails(result);
        })
        .catch((err) => {
          console.error(err);
          setError(`${err.message} Please reload the page and try again.`);
          setIsLoading(false);
        });
    }
  }, [selectedLocCoords, setError, setIsLoading, setLocationDetails]);

  useEffect(() => {
    // Fetch daily and hourly forecasts from NOAA with 5 retries
    if (locationDetails?.properties.forecast && !forecastData) {
      setIsLoading(true);
      const forecastUrl = locationDetails.properties.forecast;

      fetchDailyForecastWithRetry(forecastUrl)
        .then((res) => {
          setForecastData(res);
          setIsLoading(false);
        })
        .then(() => setError(""))
        .catch((err) => {
          console.error(err);
          setError(`${err.message} Please reload the page and try again.`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [
    locationDetails,
    setError,
    setIsLoading,
    setForecastData,
    setHourlyForecastData,
    forecastData,
  ]);

  useEffect(() => {
    if (selectedLocType === "Current Location") {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        locationFetchSuccess,
        locationFetchFailure
      );
    }
  }, [
    selectedLocType,
    setIsLoading,
    locationFetchSuccess,
    locationFetchFailure,
  ]);

  return (
    <section className="home-control-section">
      <div className="home-forecast-select-div">
        <TypeSelect />
        <LocationSelect />
      </div>
    </section>
  );
}
