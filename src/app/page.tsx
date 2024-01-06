"use client";

import "./home.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useContext, useRef } from "react";
import {
  fetchDailyForecastWithRetry,
  fetchNoaaGridLocationWithRetry,
} from "./Util/APICalls";
import { Coords, ForecastData, LocationDetails } from "./Interfaces/interfaces";
import LocationSelect from "./Components/LocationSelect/LocationSelect";
import DetailedDayForecast from "./Components/DetailedDayForecast/DetailedDayForecast";
import TypeSelect from "./Components/TypeSelect/TypeSelect";
import { SessionProvider } from "next-auth/react";
import Session from "./Components/Session/Session";
import { UserContext } from "../app/Contexts/UserContext";
import ReloadBtn from "./Components/ReloadBtn/ReloadBtn";
import { WelcomeHomeMsg } from "./Components/WelcomeHomeMsg/WelcomeHomeMsg";

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
  const { userInfo } = useContext(UserContext);
  const homeControlSection = useRef<HTMLDivElement | null>(null);
  const homeForecastSelectDiv = useRef<HTMLDivElement | null>(null);
  const homeAddEditLocDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
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
    // Change control section styling to fit 4 buttons
    if (userInfo) {
      const elements = [
        homeControlSection,
        homeForecastSelectDiv,
        homeAddEditLocDiv,
      ];
      elements.forEach((e) => {
        e.current?.classList.add("logged-in");
      });
    }
  }, [userInfo]);

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
      <header className="home-header">
        <div className="hero-img-div">
          <h1 className="site-title">SendTemps</h1>
          <Image
            src={"/images/sendtemps_header_2.webp"}
            alt="Boulder Flatirons background with rock climber silhouette in foreground"
            fill={true}
            priority={true}
            quality={100}
            sizes="100vw"
            className="header-bkgd-img"
          />
          <SessionProvider>
            <Session />
          </SessionProvider>
        </div>
      </header>
      <section className="home-main-section">
        <section className="home-control-section" ref={homeControlSection}>
          <div className="home-forecast-select-div" ref={homeForecastSelectDiv}>
            <TypeSelect
              setSelectedLocType={setSelectedLocType}
              setForecastData={setForecastData}
            />
            <SessionProvider>
              <LocationSelect
                selectedLocType={selectedLocType}
                setSelectedLocCoords={setSelectedLocCoords}
                setForecastData={setForecastData}
                setError={setError}
              />
            </SessionProvider>
          </div>
          <div className="home-add-edit-loc-div" ref={homeAddEditLocDiv}>
            {userInfo ? (
              <>
                <Link href={"/add-location"}>
                  <button className="add-edit-location-btn">
                    Create New Location
                  </button>
                </Link>
                <Link href={"/edit-locations"}>
                  <button className="add-edit-location-btn">
                    Edit Locations
                  </button>
                </Link>
              </>
            ) : null}
          </div>
        </section>
        <section className="forecast-section">
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
