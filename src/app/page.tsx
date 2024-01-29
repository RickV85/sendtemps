"use client";

import "./home.css";
import { useEffect, useState, useRef } from "react";
import {
  fetchDailyForecastWithRetry,
  fetchNoaaGridLocationWithRetry,
} from "./Util/APICalls";
import { Coords, ForecastData, LocationDetails } from "./Interfaces/interfaces";
import LocationSelect from "./Components/LocationSelect/LocationSelect";
import DetailedDayForecast from "./Components/DetailedDayForecast/DetailedDayForecast";
import TypeSelect from "./Components/TypeSelect/TypeSelect";
import { SessionProvider } from "next-auth/react";
import ReloadBtn from "./Components/ReloadBtn/ReloadBtn";
import { WelcomeHomeMsg } from "./Components/WelcomeHomeMsg/WelcomeHomeMsg";
import HomeHeader from "./Components/HomeHeader/HomeHeader";

export default function Home() {
  const [currentGPSCoords, setCurrentGPSCoords] = useState<Coords>();
  const [selectedLocCoords, setSelectedLocCoords] = useState<
    string | undefined
  >();
  const [selectedLocType, setSelectedLocType] =
    useState<string>("Select Sport");
  const [locationDetails, setLocationDetails] = useState<LocationDetails>();
  const [forecastData, setForecastData] = useState<ForecastData>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialScreenWidth, setInitialScreenWidth] = useState<null | number>(
    null
  );
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const forecastSection = useRef<null | HTMLElement>(null);

  useEffect(() => {
    if (window.innerWidth) {
      setInitialScreenWidth(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    if (document.readyState === "complete") {
      setPageLoaded(true);
    } else {
      window.addEventListener("load", () => setPageLoaded(true));
    }

    return () => {
      window.removeEventListener("load", () => setPageLoaded(true));
    };
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/serviceWorker.js")
          .then((registration) => {
            console.log(
              "Service Worker registered with scope:",
              registration.scope
            );
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }
  }, []);

  useEffect(() => {
    if (selectedLocType === "Current Location") {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        locationFetchSuccess,
        locationFetchFailure
      );
    }
  }, [selectedLocType]);

  useEffect(() => {
    if (selectedLocType === "Current Location" && currentGPSCoords) {
      setSelectedLocCoords(
        `${currentGPSCoords.latitude},${currentGPSCoords.longitude}`
      );
    }
  }, [selectedLocType, currentGPSCoords]);

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
  }, [selectedLocCoords]);

  useEffect(() => {
    // Fetch forecast from NOAA with 5 retries
    if (locationDetails?.properties.forecast) {
      setIsLoading(true);
      fetchDailyForecastWithRetry(locationDetails.properties.forecast)
        .then((result) => {
          setForecastData(result);
          setIsLoading(false);
          setError("");
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [locationDetails]);

  useEffect(() => {
    if (!forecastData && selectedLocCoords) {
      forecastSection.current?.classList.add("loading");
    } else {
      forecastSection.current?.classList.remove("loading");
    }
  }, [forecastData, selectedLocCoords]);

  const createDetailedForecast = () => {
    const forecast = forecastData?.properties.periods.map((data, i) => {
      return <DetailedDayForecast data={data} key={`forecastPeriod-${i}`} />;
    });
    return forecast;
  };

  const retryDailyForecastFetch = () => {
    if (locationDetails) {
      const failedLocDetails = locationDetails;
      setLocationDetails(undefined);
      setTimeout(() => {
        setLocationDetails(failedLocDetails);
      }, 100);
    }
  };

  const locationFetchSuccess = (position: GeolocationPosition) => {
    setCurrentGPSCoords({
      latitude: `${position.coords.latitude}`,
      longitude: `${position.coords.longitude}`,
    });
    setSelectedLocCoords(
      `${position.coords.latitude},${position.coords.longitude}`
    );
  };

  const locationFetchFailure = () => {
    setIsLoading(false);
    alert(
      "Please allow this app to use your location if you would like a display of your current location's forecast."
    );
  };

  return (
    <main className="home-main">
      <HomeHeader initialScreenWidth={initialScreenWidth} />
      <section className="home-main-section">
        <section className="home-control-section">
          <div className="home-forecast-select-div">
            {pageLoaded ? (
              <>
                <TypeSelect
                  setSelectedLocType={setSelectedLocType}
                  setForecastData={setForecastData}
                />
                <LocationSelect
                  selectedLocType={selectedLocType}
                  setSelectedLocCoords={setSelectedLocCoords}
                  setForecastData={setForecastData}
                  setError={setError}
                />
              </>
            ) : (
              <div className="home-loading-msg">
                <p>Please wait, loading...</p>
              </div>
            )}
          </div>
        </section>
        <section className="forecast-section" ref={forecastSection}>
          {isLoading ? (
            <p className="loading-msg">Loading forecast...</p>
          ) : null}
          {error && !isLoading ? (
            <>
              <p className="error-msg">{`Oh, no! ${error}`}</p>
              {error === "All fetch Daily Forecast attempts failed." ? (
                <button
                  className="retry-fetch-btn"
                  onClick={() => retryDailyForecastFetch()}
                >
                  Retry
                </button>
              ) : (
                <ReloadBtn />
              )}
            </>
          ) : null}
          {!forecastData && !isLoading && !error ? (
            <SessionProvider>
              <WelcomeHomeMsg />
            </SessionProvider>
          ) : null}
          {createDetailedForecast()}
        </section>
      </section>
    </main>
  );
}
