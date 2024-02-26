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

export default function Home() {
  const {
    selectedLocCoords,
    forecastData,
    hourlyForecastData,
    hourlyForecastParams,
    screenWidth,
    setScreenWidth,
    isLoading,
    pageLoaded,
    setPageLoaded,
    error,
  } = useContext(HomeContext);
  const forecastSection = useRef<null | HTMLElement>(null);

  // Set pageLoaded using readyState listener
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

  // Register service worker in production
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

  // SetScreen width with throttling
  useEffect(() => {
    const setWindowWidthState = throttle(() => {
      setScreenWidth(window.innerWidth);
    }, 100);

    setWindowWidthState();
    window.addEventListener("resize", setWindowWidthState);

    return () => window.removeEventListener("resize", setWindowWidthState);
  }, [setScreenWidth]);

  // Toggle loading class on forecast section -
  // prevents layout shift while loading new daily forecast
  useEffect(() => {
    if (!forecastData && selectedLocCoords) {
      forecastSection.current?.classList.add("loading");
    } else {
      forecastSection.current?.classList.remove("loading");
    }
  }, [forecastData, selectedLocCoords]);

  // Toggle loading class on forecast section -
  // prevent layout shift during hourly forecast load
  useEffect(() => {
    if (selectedLocCoords && hourlyForecastParams) {
      forecastSection.current?.classList.add("loading");
    } else if (!selectedLocCoords || !hourlyForecastParams) {
      forecastSection.current?.classList.remove("loading");
    }
  }, [selectedLocCoords, hourlyForecastParams]);

  // Creates detailed daily forecast display
  const createDetailedForecast = () => {
    const forecast = forecastData?.properties.periods.map((data, i) => {
      return <DetailedDayForecast data={data} key={`forecastPeriod-${i}`} />;
    });
    return forecast;
  };

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
            <div className="error-msg-div">
              <p className="error-msg">{`Oh, no! ${error}`}</p>
              <ReloadBtn />
            </div>
          ) : null}
          {!forecastData && !isLoading && !error ? <WelcomeHomeMsg /> : null}
          {hourlyForecastParams ? (
            <HourlyForecastContainer />
          ) : (
            <div className="day-forecast-container">
              {createDetailedForecast()}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
