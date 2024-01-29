"use client";
import "./home.css";
import { useEffect, useRef, useContext, useCallback } from "react";
import {
  fetchDailyForecastWithRetry,
  fetchNoaaGridLocationWithRetry,
} from "./Util/APICalls";
import DetailedDayForecast from "./Components/DetailedDayForecast/DetailedDayForecast";
import { SessionProvider } from "next-auth/react";
import ReloadBtn from "./Components/ReloadBtn/ReloadBtn";
import { WelcomeHomeMsg } from "./Components/WelcomeHomeMsg/WelcomeHomeMsg";
import HomeHeader from "./Components/HomeHeader/HomeHeader";
import { HomeContext } from "./Contexts/HomeContext";
import HomeControl from "./Components/HomeControl/HomeControl";
import { throttle } from "lodash";

export default function Home() {
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
    screenWidth,
    setScreenWidth,
    isLoading,
    setIsLoading,
    setPageLoaded,
    error,
    setError,
  } = useContext(HomeContext);
  const forecastSection = useRef<null | HTMLElement>(null);

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
    const setWindowWidthState = throttle(() => {
      setScreenWidth(window.innerWidth);
    }, 100);

    setWindowWidthState();
    window.addEventListener("resize", setWindowWidthState);

    return () => window.removeEventListener("resize", setWindowWidthState);
  }, [setScreenWidth]);

  useEffect(() => {
    if (document.readyState === "complete") {
      setPageLoaded(true);
    } else {
      window.addEventListener("load", () => setPageLoaded(true));
    }

    return () => {
      window.removeEventListener("load", () => setPageLoaded(true));
    };
  }, [setPageLoaded]);

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
  }, [
    selectedLocType,
    setIsLoading,
    locationFetchSuccess,
    locationFetchFailure,
  ]);

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
  }, [locationDetails, setError, setIsLoading, setForecastData]);

  useEffect(() => {
    if (!forecastData && selectedLocCoords) {
      forecastSection.current?.classList.add("loading");
    } else {
      forecastSection.current?.classList.remove("loading");
    }
  }, [forecastData, selectedLocCoords]);

  return (
    <main className="home-main">
      <HomeHeader />
      <section className="home-main-section">
        {screenWidth <= 768 ? <HomeControl /> : null}
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
