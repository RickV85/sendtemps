"use client";
import "./home.css";
import { useEffect, useRef, useContext, useCallback, useState } from "react";
import { HomeContext } from "./Contexts/HomeContext";
import { throttle } from "lodash";
import DetailedDayForecast from "./Components/DetailedDayForecast/DetailedDayForecast";
import HomeHeader from "./Components/HomeHeader/HomeHeader";
import HomeControl from "./Components/HomeControl/HomeControl";
import ReloadBtn from "./Components/ReloadBtn/ReloadBtn";
import { WelcomeHomeMsg } from "./Components/WelcomeHomeMsg/WelcomeHomeMsg";
import HourlyForecastContainer from "./Components/HourlyForecastContainer/HourlyForecastContainer";
import { HourlyForecastTimePeriod } from "./Interfaces/interfaces";

export default function Home() {
  const {
    selectedLocCoords,
    locationDetails,
    setLocationDetails,
    forecastData,
    screenWidth,
    setScreenWidth,
    isLoading,
    pageLoaded,
    setPageLoaded,
    error,
  } = useContext(HomeContext);
  const [hourlyForecastTimePeriod, setHourlyForecastTimePeriod] =
    useState<HourlyForecastTimePeriod>();
  const forecastSection = useRef<null | HTMLElement>(null);

  const createDetailedForecast = () => {
    const forecast = forecastData?.properties.periods.map((data, i) => {
      return (
        <DetailedDayForecast
          data={data}
          setHourlyForecastTimePeriod={setHourlyForecastTimePeriod}
          key={`forecastPeriod-${i}`}
        />
      );
    });
    return forecast;
  };

  const retryDailyForecastFetch = useCallback(() => {
    if (locationDetails) {
      const failedLocDetails = locationDetails;
      setLocationDetails(undefined);
      setTimeout(() => {
        setLocationDetails(failedLocDetails);
      }, 100);
    }
  }, [locationDetails, setLocationDetails]);

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
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
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
        {pageLoaded && screenWidth <= 768 ? <HomeControl /> : null}
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
          {!forecastData && !isLoading && !error ? <WelcomeHomeMsg /> : null}
          {hourlyForecastTimePeriod ? (
            <HourlyForecastContainer
              hourlyForecastTimePeriod={hourlyForecastTimePeriod}
              setHourlyForecastTimePeriod={setHourlyForecastTimePeriod}
            />
          ) : (
            createDetailedForecast()
          )}
        </section>
      </section>
    </main>
  );
}
