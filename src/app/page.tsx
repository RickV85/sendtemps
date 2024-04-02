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
    forecastData,
    hourlyForecastParams,
    forecastSendScores,
    screenWidth,
    setScreenWidth,
    isLoading,
    pageLoaded,
    setPageLoaded,
    error,
  } = useContext(HomeContext);
  const forecastSection = useRef<null | HTMLElement>(null);
  const [hasSeenHourlyForecast, setHasSeenHourlyForecast] = useState<boolean>();

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

  // Unregister service worker in production, no longer used.
  // Was causing issues with caching network requests
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .getRegistrations()
          .then((registrations) => {
            for (let registration of registrations) {
              registration.unregister().then((res) => {
                if (res === true) {
                  console.log("Service Worker unregistered successfully");
                }
              });
            }
          })
          .catch((error) => {
            console.error("Service Worker unregistration failed:", error);
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
    if (isLoading) {
      forecastSection.current?.classList.add("loading");
    } else {
      forecastSection.current?.classList.remove("loading");
    }
  }, [isLoading]);

  // Get sessionStorage item and set state indicating if user
  // has seen the new hourly forecast feature
  useEffect(() => {
    const hasSeenHourly = window.sessionStorage.getItem("hasSeenHourly");
    if (!hasSeenHourly || hasSeenHourly === "false") {
      setHasSeenHourlyForecast(false);
    } else if (hasSeenHourly === "true") {
      setHasSeenHourlyForecast(true);
    }
  }, []);

  // Set state and session storage if user views hourly forecast
  useEffect(() => {
    if (hourlyForecastParams && !hasSeenHourlyForecast) {
      setHasSeenHourlyForecast(true);
      window.sessionStorage.setItem("hasSeenHourly", "true");
    }
  }, [hourlyForecastParams, hasSeenHourlyForecast]);

  // Creates detailed daily forecast display
  const createDetailedForecast = () => {
    if (forecastData) {
      const forecast = forecastData?.periods.map((period, i) => {
        return (
          <DetailedDayForecast period={period} key={`forecastPeriod-${i}`} />
        );
      });
      return forecast;
    }
  };

  return (
    <main className="home-main">
      <HomeHeader />
      <section className="home-main-section">
        {pageLoaded && screenWidth <= 768 ? <HomeControl /> : null}
        <section className="forecast-section" ref={forecastSection}>
          {isLoading ? (
            <div className="loading-msg-div">
              <p className="loading-msg">Loading forecast...</p>
            </div>
          ) : null}
          {error && !isLoading ? (
            <div className="loading-msg-div">
              <p className="error-msg">{`Oh, no! ${error}`}</p>
              <ReloadBtn />
            </div>
          ) : null}
          {!forecastData && !isLoading && !error ? <WelcomeHomeMsg /> : null}
          {hourlyForecastParams && <HourlyForecastContainer />}
          {forecastData && !hourlyForecastParams ? (
            <>
              {forecastSendScores?.summary}
              {!hasSeenHourlyForecast && (
                <p className="hour-forecast-tip">
                  Click on a day for an hourly forecast!
                </p>
              )}
              <div className="day-forecast-container">
                {createDetailedForecast()}
              </div>
            </>
          ) : null}
        </section>
      </section>
    </main>
  );
}
