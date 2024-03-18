import { useContext, useEffect, useCallback } from "react";
import { HomeContext } from "@/app/Contexts/HomeContext";
import TypeSelect from "../TypeSelect/TypeSelect";
import LocationSelect from "../LocationSelect/LocationSelect";
import {
  fetchNoaaGridLocationWithRetry,
  fetchDailyForecastWithRetry,
} from "@/app/Util/NoaaApiCalls";
import { Gridpoint } from "@/app/Classes/Gridpoint";
import { Forecast } from "@/app/Classes/Forecast";

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

  // If Current Location selected, user allows location sharing,
  // and the location fetch is successful, get NOAA grid location
  useEffect(() => {
    if (selectedLocType === "Current Location" && currentGPSCoords) {
      setIsLoading(true);
      fetchNoaaGridLocationWithRetry(selectedLocCoords)
        .then((result) => {
          setLocationDetails(new Gridpoint(result));
        })
        .catch((err) => {
          console.error(err);
          setError(`${err.message} Please reload the page and try again.`);
          setIsLoading(false);
        });
    }
  }, [
    selectedLocCoords,
    setError,
    setIsLoading,
    setLocationDetails,
    currentGPSCoords,
    setSelectedLocCoords,
    selectedLocType,
  ]);

  useEffect(() => {
    // Fetch daily and hourly forecasts from NOAA with 5 retries
    if (locationDetails?.forecastUrl && !forecastData) {
      setIsLoading(true);
      const forecastUrl = locationDetails.forecastUrl;

      fetchDailyForecastWithRetry(forecastUrl)
        .then((res) => {
          setForecastData(new Forecast(res));
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

  // Ask for user location if Current Location selected
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
